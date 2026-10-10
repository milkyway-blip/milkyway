# Auth Testing Playbook (MilkyWay)

## Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, index unik pada users.email, index pada login_attempts.identifier dan visits.date.

## Step 2: API Testing
```
curl -c cookies.txt -X POST $API/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@milkyway.id","password":"milkyway123"}'
cat cookies.txt
curl -b cookies.txt $API/api/auth/me
```
Login harus mengembalikan objek user + cookie access_token & refresh_token. /me mengembalikan user yang sama memakai cookie tersebut.

## Step 3: Protected endpoints
```
curl -b cookies.txt $API/api/orders
curl -b cookies.txt $API/api/stats/overview
curl -b cookies.txt $API/api/flavors
```
Semua harus 200 dengan cookie, 401 tanpa cookie.
