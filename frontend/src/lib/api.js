import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const isAuthCall =
      original.url?.includes("/auth/login") || original.url?.includes("/auth/refresh");
    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(original);
      } catch (e) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export const formatApiError = (e) => {
  const detail = e?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d?.msg || "").filter(Boolean).join(" ");
  return "Terjadi kesalahan. Coba lagi.";
};

export const formatRupiah = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

export const waLink = (number, text) => {
  const intl = (number || "").replace(/\D/g, "").replace(/^0/, "62");
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
};

export default api;
