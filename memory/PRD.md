# PRD — MilkyWay Landing Page & Admin Panel

## Problem Statement (asli)
Landing page produk susu MilkyWay (susu sapi pasteurisasi 350ml) dengan 10 varian rasa (Plain zero sugar, sweet plain, vanilla, melon, strawberry, taro, bubblegum, hazelnut, matcha, chocolate). CTA utama: form pemesanan/kontak tersimpan di database + WhatsApp 081227646940. Gaya: segar & natural, modern & minimalis. Panel admin: dashboard overview, pengunjung, traffic, kelola status pesanan, edit konten landing (foto produk, nama, tambah varian, edit gambar per varian). Pesan campur rasa seperti keranjang belanja.

## Keputusan Pengguna
- Login admin: email & password (JWT)
- Chat: tidak ada live chat, cukup tombol WhatsApp
- Bahasa: Indonesia
- Statistik: sederhana (total kunjungan + grafik harian)
- Harga ditampilkan: Rp 15.000/350ml
- Mobile-first; TANPA klaim medis/kesehatan
- Info produk: komposisi (susu murni, gula, syrup/bubuk perisa), simpan 2–4°C, masa simpan 1,5 minggu, tahan 6 jam suhu ruang, tanpa pengawet & pemanis buatan, sertifikat halal ID34110080995230926
- Logo resmi dari pengguna (biru #0196FF), background putih dihapus

## Arsitektur
- Backend: FastAPI + Motor (MongoDB), JWT httpOnly cookie (access 15m + refresh 7d), bcrypt, brute-force lockout
- Frontend: React (CRA/craco), Tailwind, framer-motion, lenis smooth scroll, recharts, sonner
- Koleksi DB: users, site_content, flavors, orders, visits, login_attempts

## User Personas
- Pembeli (mobile): lihat varian, campur rasa di keranjang, pesan via form + konfirmasi WA
- Admin (pemilik usaha): pantau pesanan & traffic, ubah status pesanan, edit konten & varian

## Yang Sudah Diimplementasikan (10 Okt 2026)
- Landing: hero kinetic masked reveal + parallax, marquee editorial, 10 kartu varian (warna unik per rasa), keranjang campur rasa dengan stepper qty, form pemesanan → DB → tombol konfirmasi WhatsApp terformat, bento kualitas, seksi Info Produk (komposisi/penyimpanan/masa simpan/halal), footer + WA float, logo resmi + favicon
- Admin: login JWT, Ringkasan (5 kartu stat, grafik traffic 14 hari, varian terlaris), Pesanan (filter status, ubah status Baru/Diproses/Dikirim/Selesai/Dibatalkan, tombol chat WA pembeli), Konten (edit nama produk, tagline, hero, foto produk, marquee, WA, label harga; CRUD varian lengkap dengan warna & gambar)
- API: /api/content, /api/track, /api/orders (POST/GET/PATCH), /api/flavors (GET/POST/PUT/DELETE), /api/stats/overview, /api/stats/traffic, /api/auth/*

## Iterasi 2 (10 Okt 2026)
- Upload foto dari HP/admin: Emergent Object Storage, POST /api/upload (admin-only, maks 5MB, JPG/PNG/WebP/GIF), file publik via GET /api/files/{path}; tombol "Unggah" di foto produk hero & foto varian, URL manual tetap bisa
- Info Produk editable di CMS: facts (icon/judul/teks) tersimpan di site_content, bisa tambah/hapus baris; landing render dari DB
- Testimoni pelanggan: koleksi testimonials, CRUD admin (rating bintang, sembunyikan/tampilkan), seksi Testimoni di landing
- API baru: /api/upload, /api/files/{path}, /api/testimonials (GET/POST/PUT/DELETE)

## Iterasi 3 (10 Okt 2026) — Rombak total desain landing
- Meniru desain referensi susu-botol.preview.emergentagent.com: palet krim + hijau pasture (#0C4A34) + aksen emas (#E5A823), Fraunces + DM Sans + IBM Plex Mono
- Struktur baru: header pill mengambang → hero (masked reveal, aksen italic hijau, kartu botol 3D tilt + badge kaca, chips varian) → marquee editorial → showcase varian model tab → manifesto 01–04 → seksi Proses hijau gelap (Pagi/Presisi/2–4°C/350ml) → marquee hijau → Info Produk (DB) → Testimoni (DB) → FAQ akordeon → seksi Pesan (ringkasan keranjang kaca + daftar stepper semua varian + form → WA) → footer hijau tua
- CartDrawer & BentoSection dihapus; keranjang kini inline di seksi #pesan (state tetap CartContext + localStorage)
- Panel admin tidak berubah (tetap palet biru brand)

## Backlog
- P0: (kosong — semua permintaan awal terpenuhi)
- P1: upload gambar langsung (object storage) alih-alih URL; notifikasi email pesanan baru; edit konten Info Produk via CMS
- P2: testimoni pelanggan dikelola admin; kode voucher/diskon; ekspor pesanan CSV; multi-admin

## Next Tasks
1. Verifikasi deploy & domain produksi
2. Upload foto produk asli (bukan stok Unsplash) via object storage
3. Notifikasi pesanan baru (email/WhatsApp otomatis)
