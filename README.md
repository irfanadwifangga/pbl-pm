# 🏢 Sistem Peminjaman Ruangan Kampus

Website manajemen peminjaman ruangan gedung kampus dengan sistem validasi bertingkat (Mahasiswa → Admin → Wadir III). Dibangun menggunakan **Next.js 15**, **TypeScript**, **Prisma**, **NextAuth.js**, dan **PostgreSQL**.

## ✨ Fitur Utama

### 🎭 Multi Role System
- **Mahasiswa**: Mengajukan peminjaman ruangan
- **Admin**: Memverifikasi dan mengirim memo  
- **Wadir III**: Memberikan keputusan akhir (ACC/Tolak)

### 📊 Dashboard Interaktif
- Dashboard khusus untuk setiap role
- Statistik real-time peminjaman
- Notifikasi status peminjaman

### 🔄 Workflow Status
- `PENDING` → Menunggu Validasi Admin
- `VALIDATED` → Menunggu Approval Wadir III
- `APPROVED` → Disetujui
- `REJECTED` → Ditolak

### 🎨 UI/UX Modern
- Design minimalis dan profesional
- Fully responsive (Mobile, Tablet, Desktop)
- Komponen UI dengan Shadcn UI
- Dark mode ready (opsional)

## 🛠️ Tech Stack

| Area | Teknologi |
|------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | NextAuth.js v5 |
| **Form** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- Node.js 18+ 
- PostgreSQL (atau gunakan database cloud seperti Supabase/Neon)
- npm atau yarn

## 🚀 Instalasi dan Setup

### 1. Clone atau Download Project

```bash
cd pbl-pm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

#### Opsi A: PostgreSQL Lokal

```bash
# Install PostgreSQL di sistem Anda
# Buat database baru
createdb peminjaman_ruangan
```

#### Opsi B: Supabase (Recommended untuk Development)

1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Copy connection string dari Settings → Database

#### Opsi C: Neon Database

1. Buat akun di [neon.tech](https://neon.tech)
2. Buat project baru
3. Copy connection string

### 4. Konfigurasi Environment Variables

Buat file `.env` di root project:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/peminjaman_ruangan"

# NextAuth
NEXTAUTH_SECRET="generate-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Supabase
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Setup Prisma dan Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Jalankan migrasi database
npm run prisma:migrate

# Seed database dengan data awal
npm run seed
```

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

## 👤 Demo Akun

Setelah menjalankan seed, gunakan akun berikut untuk login:

| Role | Email | Password |
|------|-------|----------|
| **Mahasiswa** | mahasiswa@kampus.ac.id | password123 |
| **Admin** | admin@kampus.ac.id | password123 |
| **Wadir III** | wadir3@kampus.ac.id | password123 |

## 📁 Struktur Folder

```
pbl-pm/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth routes
│   │   ├── booking/             # Booking CRUD
│   │   └── rooms/               # Room data
│   ├── dashboard/
│   │   ├── mahasiswa/           # Student dashboard
│   │   ├── admin/               # Admin dashboard
│   │   └── wadir/               # Wadir dashboard
│   ├── login/                   # Login page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home redirect
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Shadcn UI components
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── BookingForm.tsx          # Booking form
│   ├── RoomCard.tsx             # Room card
│   └── StatusBadge.tsx          # Status badge
├── lib/
│   ├── auth.ts                  # NextAuth config
│   ├── prisma.ts                # Prisma client
│   └── utils.ts                 # Utility functions
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
├── middleware.ts                # Auth middleware
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Run migrations
npm run prisma:studio          # Open Prisma Studio
npm run seed                   # Seed database

# Code Quality
npm run lint                   # Run ESLint
```

## 📖 Alur Kerja Sistem

### Mahasiswa
1. Login ke sistem
2. Lihat ruangan tersedia di dashboard
3. Ajukan peminjaman dengan mengisi form
4. Tunggu validasi dari Admin
5. Setelah divalidasi, tunggu approval dari Wadir III
6. Terima notifikasi hasil (Disetujui/Ditolak)

### Admin
1. Login ke sistem admin
2. Lihat daftar peminjaman pending
3. Review detail peminjaman
4. Validasi atau tolak peminjaman
5. Kirim memo ke Wadir III (otomatis)

### Wadir III
1. Login ke sistem
2. Lihat daftar peminjaman yang sudah divalidasi admin
3. Review detail peminjaman dan memo
4. Approve atau reject peminjaman
5. Notifikasi dikirim ke mahasiswa (otomatis)

## 🔐 Role-Based Access Control

Middleware melindungi routes berdasarkan role:

- `/dashboard/mahasiswa/*` → Hanya STUDENT
- `/dashboard/admin/*` → Hanya ADMIN  
- `/dashboard/wadir/*` → Hanya WADIR3

## 🎨 Customization

### Menambah Ruangan Baru

Edit `prisma/seed.ts` dan tambahkan ruangan:

```typescript
{
  name: "Lab Baru",
  building: "Gedung E",
  floor: 3,
  capacity: 60,
  facilities: ["Proyektor", "AC", "Wifi"]
}
```

Lalu jalankan: `npm run seed`

### Mengubah Warna Theme

Edit `app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Ubah nilai ini */
}
```

## 🐛 Troubleshooting

### Error: Cannot connect to database

**Solusi:**
1. Pastikan PostgreSQL sudah running
2. Cek DATABASE_URL di `.env`
3. Test koneksi: `npx prisma db pull`

### Error: NextAuth session undefined

**Solusi:**
1. Pastikan NEXTAUTH_SECRET sudah di-set
2. Clear browser cookies
3. Restart dev server

### Error: Prisma Client not generated

**Solusi:**
```bash
npm run prisma:generate
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan Environment Variables
4. Deploy!

### Database Production

Gunakan PostgreSQL managed service:
- Supabase (Free tier tersedia)
- Neon (Free tier tersedia)
- Railway
- PlanetScale

## 📝 TODO / Future Improvements

- [ ] Email notifications dengan Resend
- [ ] Export data ke PDF/Excel
- [ ] Upload dokumen pendukung (surat)
- [ ] Calendar view untuk booking
- [ ] Analytics dashboard untuk admin
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Mobile app dengan React Native

## 📄 License

MIT License - Feel free to use this project for learning

## 👨‍💻 Developer

Dibuat untuk Project-Based Learning (PBL) - Sistem Informasi Kampus

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**⭐ Jika project ini membantu, berikan star di repository!**
