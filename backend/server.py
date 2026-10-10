from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import logging
import os
import re
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import Annotated, List, Optional

from bson import ObjectId
from fastapi import Depends, FastAPI, APIRouter, HTTPException, Request, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field
from starlette.middleware.cors import CORSMiddleware

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

PyObjectId = Annotated[str, BeforeValidator(str)]
JWT_ALGORITHM = "HS256"
ORDER_STATUSES = ["baru", "diproses", "dikirim", "selesai", "dibatalkan"]


# ---------- Base document ----------
class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        return self.model_dump(by_alias=True, exclude={"id"})

    @classmethod
    def from_mongo(cls, doc: dict):
        return cls(**doc)


def to_object_id(oid: str) -> ObjectId:
    if not ObjectId.is_valid(oid):
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return ObjectId(oid)


# ---------- Models ----------
class Flavor(BaseDocument):
    key: str
    name: str
    badge: str = ""
    bg_color: str = "#F0F9FF"
    border_color: str = "#BAE6FD"
    text_color: str = "#0C4A6E"
    image: str = ""
    price: int = 15000
    active: bool = True
    order: int = 0


class FlavorInput(BaseModel):
    name: str
    badge: str = ""
    bg_color: str = "#F0F9FF"
    border_color: str = "#BAE6FD"
    text_color: str = "#0C4A6E"
    image: str = ""
    price: int = 15000
    active: bool = True


class ContentModel(BaseDocument):
    key: str = "landing"
    product_name: str = "MilkyWay"
    tagline: str = "Susu Sapi Pasteurisasi"
    hero_title: str = ""
    hero_subtitle: str = ""
    hero_image: str = ""
    marquee_text: str = ""
    whatsapp_number: str = "081227646940"
    price_display: str = "Rp 15.000"
    unit_size: str = "350ml"


class ContentUpdate(BaseModel):
    product_name: Optional[str] = None
    tagline: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image: Optional[str] = None
    marquee_text: Optional[str] = None
    whatsapp_number: Optional[str] = None
    price_display: Optional[str] = None


class OrderItem(BaseModel):
    flavor_id: str
    name: str
    qty: int
    price: int


class Order(BaseDocument):
    customer_name: str
    whatsapp: str
    address: str
    note: str = ""
    items: List[OrderItem]
    total: int
    status: str = "baru"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderItemInput(BaseModel):
    flavor_id: str
    qty: int


class OrderInput(BaseModel):
    customer_name: str
    whatsapp: str
    address: str
    note: str = ""
    items: List[OrderItemInput]


class StatusUpdate(BaseModel):
    status: str


class LoginInput(BaseModel):
    email: str
    password: str


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(minutes=15)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh",
               "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie("access_token", create_access_token(user_id, email),
                        httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie("refresh_token", create_refresh_token(user_id),
                        httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"id": str(user["_id"]), "email": user["email"],
            "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


async def check_lockout(identifier: str):
    doc = await db.login_attempts.find_one({"identifier": identifier})
    if not doc:
        return
    locked_until = doc.get("locked_until")
    if locked_until:
        if datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Terlalu banyak percobaan. Coba lagi dalam 15 menit.")
        await db.login_attempts.delete_one({"identifier": identifier})


async def record_failed(identifier: str):
    now = datetime.now(timezone.utc)
    doc = await db.login_attempts.find_one({"identifier": identifier})
    count = (doc.get("count", 0) + 1) if doc else 1
    update = {"identifier": identifier, "count": count, "last_attempt": now.isoformat()}
    if count >= 5:
        update["locked_until"] = (now + timedelta(minutes=15)).isoformat()
    await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)


# ---------- Auth endpoints ----------
@api_router.post("/auth/login")
async def login(body: LoginInput, request: Request, response: Response):
    email = body.email.lower().strip()
    identifier = f"{request.client.host}:{email}"
    await check_lockout(identifier)
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await record_failed(identifier)
        raise HTTPException(status_code=401, detail="Email atau password salah")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, str(user["_id"]), email)
    return {"id": str(user["_id"]), "email": email,
            "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    set_auth_cookies(response, str(user["_id"]), user["email"])
    return {"ok": True}


# ---------- Public content ----------
@api_router.get("/")
async def root():
    return {"message": "MilkyWay API"}


@api_router.get("/content")
async def get_content():
    content = await db.site_content.find_one({"key": "landing"})
    flavors = await db.flavors.find({"active": True}).sort("order", 1).to_list(100)
    return {
        "content": (ContentModel.from_mongo(content) if content else ContentModel()).model_dump(),
        "flavors": [Flavor.from_mongo(f).model_dump() for f in flavors],
    }


@api_router.post("/track")
async def track_visit():
    now = datetime.now(timezone.utc)
    await db.visits.insert_one({"date": now.strftime("%Y-%m-%d"), "ts": now.isoformat()})
    return {"ok": True}


@api_router.post("/orders", response_model=Order, response_model_by_alias=False)
async def create_order(body: OrderInput):
    if not body.items:
        raise HTTPException(status_code=400, detail="Keranjang masih kosong")
    items, total = [], 0
    for it in body.items:
        fl = await db.flavors.find_one({"_id": to_object_id(it.flavor_id)})
        if not fl or not fl.get("active", True):
            raise HTTPException(status_code=400, detail="Ada varian yang tidak tersedia")
        qty = max(1, min(it.qty, 99))
        price = int(fl.get("price", 15000))
        items.append(OrderItem(flavor_id=str(fl["_id"]), name=fl["name"], qty=qty, price=price))
        total += price * qty
    order = Order(customer_name=body.customer_name.strip(), whatsapp=body.whatsapp.strip(),
                  address=body.address.strip(), note=body.note.strip(), items=items, total=total)
    result = await db.orders.insert_one(order.to_mongo())
    order.id = str(result.inserted_id)
    return order


# ---------- Admin: orders ----------
@api_router.get("/orders", response_model=List[Order], response_model_by_alias=False)
async def list_orders(user=Depends(get_current_user)):
    docs = await db.orders.find().sort("created_at", -1).to_list(500)
    return [Order.from_mongo(d) for d in docs]


@api_router.patch("/orders/{order_id}", response_model=Order, response_model_by_alias=False)
async def update_order_status(order_id: str, body: StatusUpdate, user=Depends(get_current_user)):
    if body.status not in ORDER_STATUSES:
        raise HTTPException(status_code=400, detail="Status tidak valid")
    result = await db.orders.update_one({"_id": to_object_id(order_id)}, {"$set": {"status": body.status}})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")
    doc = await db.orders.find_one({"_id": ObjectId(order_id)})
    return Order.from_mongo(doc)


# ---------- Admin: content & flavors ----------
@api_router.put("/content", response_model=ContentModel, response_model_by_alias=False)
async def update_content(body: ContentUpdate, user=Depends(get_current_user)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if updates:
        await db.site_content.update_one({"key": "landing"}, {"$set": updates}, upsert=True)
    doc = await db.site_content.find_one({"key": "landing"})
    return ContentModel.from_mongo(doc)


@api_router.get("/flavors", response_model=List[Flavor], response_model_by_alias=False)
async def list_flavors(user=Depends(get_current_user)):
    docs = await db.flavors.find().sort("order", 1).to_list(200)
    return [Flavor.from_mongo(d) for d in docs]


@api_router.post("/flavors", response_model=Flavor, response_model_by_alias=False)
async def create_flavor(body: FlavorInput, user=Depends(get_current_user)):
    count = await db.flavors.count_documents({})
    key = re.sub(r"[^a-z0-9]+", "-", body.name.lower()).strip("-") or f"varian-{count + 1}"
    flavor = Flavor(key=key, order=count, **body.model_dump())
    result = await db.flavors.insert_one(flavor.to_mongo())
    doc = await db.flavors.find_one({"_id": result.inserted_id})
    return Flavor.from_mongo(doc)


@api_router.put("/flavors/{flavor_id}", response_model=Flavor, response_model_by_alias=False)
async def update_flavor(flavor_id: str, body: FlavorInput, user=Depends(get_current_user)):
    oid = to_object_id(flavor_id)
    result = await db.flavors.update_one({"_id": oid}, {"$set": body.model_dump()})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Varian tidak ditemukan")
    doc = await db.flavors.find_one({"_id": oid})
    return Flavor.from_mongo(doc)


@api_router.delete("/flavors/{flavor_id}")
async def delete_flavor(flavor_id: str, user=Depends(get_current_user)):
    result = await db.flavors.delete_one({"_id": to_object_id(flavor_id)})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Varian tidak ditemukan")
    return {"ok": True}


# ---------- Admin: stats ----------
@api_router.get("/stats/overview")
async def stats_overview(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "baru"})
    visitors_today = await db.visits.count_documents({"date": today})
    total_visitors = await db.visits.count_documents({})
    rev = await db.orders.aggregate([
        {"$match": {"status": {"$ne": "dibatalkan"}}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}},
    ]).to_list(1)
    top = await db.orders.aggregate([
        {"$unwind": "$items"},
        {"$group": {"_id": "$items.name", "qty": {"$sum": "$items.qty"}}},
        {"$sort": {"qty": -1}},
        {"$limit": 5},
    ]).to_list(5)
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "visitors_today": visitors_today,
        "total_visitors": total_visitors,
        "total_revenue": rev[0]["total"] if rev else 0,
        "top_flavors": [{"name": t["_id"], "qty": t["qty"]} for t in top],
    }


@api_router.get("/stats/traffic")
async def stats_traffic(days: int = 14, user=Depends(get_current_user)):
    days = min(max(days, 1), 90)
    today = datetime.now(timezone.utc).date()
    start = today - timedelta(days=days - 1)
    visits_docs = await db.visits.aggregate([
        {"$match": {"date": {"$gte": start.isoformat()}}},
        {"$group": {"_id": "$date", "visits": {"$sum": 1}}},
    ]).to_list(days)
    visits = {d["_id"]: d["visits"] for d in visits_docs}
    orders_docs = await db.orders.aggregate([
        {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}}, "orders": {"$sum": 1}}},
    ]).to_list(1000)
    orders = {d["_id"]: d["orders"] for d in orders_docs}
    return [
        {"date": (start + timedelta(days=i)).isoformat(),
         "visits": visits.get((start + timedelta(days=i)).isoformat(), 0),
         "orders": orders.get((start + timedelta(days=i)).isoformat(), 0)}
        for i in range(days)
    ]


# ---------- Seeding ----------
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email, "password_hash": hash_password(admin_password),
            "name": "Admin MilkyWay", "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
        logger.info("Admin seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})


DEFAULT_CONTENT = {
    "key": "landing",
    "product_name": "MilkyWay",
    "tagline": "Susu Sapi Pasteurisasi",
    "hero_title": "Susu Sapi Segar, Dipasteurisasi Sempurna",
    "hero_subtitle": "Susu sapi pilihan dalam botol 350ml dengan 10 varian rasa yang creamy dan segar. Pesan campur rasa sesukamu, diantar dingin sampai depan pintu.",
    "hero_image": "https://images.unsplash.com/photo-1639151082235-406d8eb262b9?crop=entropy&cs=srgb&fm=jpg&q=85",
    "marquee_text": "100% Susu Sapi • Pasteurisasi Suhu Tepat • 10 Varian Rasa • Botol 350ml • Rp 15.000 per Botol • Bisa Campur Rasa",
    "whatsapp_number": "081227646940",
    "price_display": "Rp 15.000",
    "unit_size": "350ml",
}

DEFAULT_FLAVORS = [
    {"key": "plain-zero-sugar", "name": "Plain Zero Sugar", "badge": "0% Gula", "bg_color": "#F8FAFC", "border_color": "#CBD5E1", "text_color": "#334155", "image": "https://images.unsplash.com/photo-1639151082235-406d8eb262b9?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "sweet-plain", "name": "Sweet Plain", "badge": "Manis Alami", "bg_color": "#FEF3C7", "border_color": "#FDE68A", "text_color": "#92400E", "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "vanilla", "name": "Vanilla", "badge": "Aroma Pod Vanilla", "bg_color": "#FFFBEB", "border_color": "#FCD34D", "text_color": "#78350F", "image": "https://images.unsplash.com/photo-1634141510639-d691d86f47be?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "melon", "name": "Melon", "badge": "Melon Segar", "bg_color": "#DCFCE7", "border_color": "#86EFAC", "text_color": "#14532D", "image": "https://images.unsplash.com/photo-1745594574342-3aa4d735d01e?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "strawberry", "name": "Strawberry", "badge": "Stroberi Segar", "bg_color": "#FCE7F3", "border_color": "#FBCFE8", "text_color": "#831843", "image": "https://images.unsplash.com/photo-1751033390078-b605c8727fa4?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "taro", "name": "Taro", "badge": "Taro Creamy", "bg_color": "#F3E8FF", "border_color": "#E9D5FF", "text_color": "#581C87", "image": "https://images.unsplash.com/photo-1718210719889-75c2826ab482?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "bubblegum", "name": "Bubblegum", "badge": "Manis Retro", "bg_color": "#E0F2FE", "border_color": "#BAE6FD", "text_color": "#0C4A6E", "image": "https://images.unsplash.com/photo-1771405317905-44d78aa82d3e?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "hazelnut", "name": "Hazelnut", "badge": "Nutty & Smooth", "bg_color": "#FEF3C7", "border_color": "#FCD34D", "text_color": "#78350F", "image": "https://images.unsplash.com/photo-1634141510639-d691d86f47be?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "matcha", "name": "Matcha", "badge": "Matcha Premium", "bg_color": "#ECFDF5", "border_color": "#A7F3D0", "text_color": "#064E3B", "image": "https://images.unsplash.com/photo-1751033390078-b605c8727fa4?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"key": "chocolate", "name": "Chocolate", "badge": "Cokelat Belgian", "bg_color": "#FEF2F2", "border_color": "#FECACA", "text_color": "#7F1D1D", "image": "https://images.unsplash.com/photo-1718210719889-75c2826ab482?crop=entropy&cs=srgb&fm=jpg&q=85"},
]


async def seed_content():
    if not await db.site_content.find_one({"key": "landing"}):
        await db.site_content.insert_one(DEFAULT_CONTENT)
        logger.info("Default landing content seeded")
    if await db.flavors.count_documents({}) == 0:
        for i, f in enumerate(DEFAULT_FLAVORS):
            await db.flavors.insert_one(Flavor(order=i, price=15000, **f).to_mongo())
        logger.info("Default flavors seeded")


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.visits.create_index("date")
    await seed_admin()
    await seed_content()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
