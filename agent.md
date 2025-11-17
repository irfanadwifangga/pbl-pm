Berikut versi **prompt advance final dalam format Markdown**, siap kamu **copy-paste** ke AI code generator\*\* seperti v0.dev, Bolt.new, atau GPT-coder untuk membangun proyek Next.js 15 lengkap:

---

# 🏢 Website Peminjaman Ruangan Gedung Kampus (Multi Role System)

---

## ⚙️ **Tujuan Proyek**

Bangun sistem **manajemen peminjaman ruangan kampus** dengan alur validasi bertingkat (**Mahasiswa → Admin → Wadir III**). Website ini harus **modern, aman, role-based**, dan memiliki dashboard interaktif dengan notifikasi otomatis.

---

## 🧩 **Fitur Utama**

1. **Multi Role System**

    - **Mahasiswa**: mengajukan peminjaman ruangan.
    - **Admin**: memverifikasi dan mengirim memo.
    - **Wadir III**: memberikan keputusan akhir (ACC/Tolak).

2. **Workflow Status**

    - Status: `Menunggu Validasi` → `Validasi Admin` → `Disetujui` / `Ditolak`.
    - Setiap perubahan status memicu **notifikasi otomatis** (email/toast).

3. **Riwayat & Laporan**

    - Setiap pengguna memiliki halaman riwayat.
    - Data dapat **diexport ke PDF atau Excel**.
    - Tampilkan **analitik pemakaian ruangan** menggunakan Recharts.

4. **Form & Validasi**

    - Gunakan **React Hook Form** + **Zod** untuk validasi.
    - Dukungan upload file (surat, memo, bukti) ke **Vercel Blob**, **Supabase Storage**, atau **Cloudinary**.

---

## 🎨 **Desain & UI**

Gunakan gaya **profesional dan minimalis** dengan:

-   Warna utama: **biru tua**, **putih**, **abu lembut**.
-   Komponen UI dari **Shadcn UI**:

    -   `Card`, `Dialog`, `DataTable`, `Button`, `Badge`, `Toast`.

-   Ikon dari **Lucide Icons**.
-   Layout dashboard:

    -   **Sidebar navigasi** berbasis role.
    -   **Konten utama** berisi DataTable dan Form.

-   Responsif untuk semua ukuran layar.

---

## 🔒 **Autentikasi & Role-Based Access**

-   Gunakan **NextAuth.js v5 (Auth.js)** dengan session **JWT**.
-   Middleware proteksi rute:

    -   `/dashboard/mahasiswa` → hanya Mahasiswa
    -   `/dashboard/admin` → hanya Admin
    -   `/dashboard/wadir` → hanya Wadir III

-   Kolom `role` dalam tabel `User` menentukan hak akses.

---

## 🧱 **Struktur Database**

Gunakan **Prisma ORM** dengan relasi berikut:

**Entity dan Relasi:**

-   **User** → (1:N) → **Booking**
-   **Room** → (1:N) → **Booking**
-   **Booking** → (1:1) → **Memo**

**Kolom Penting:**

-   **User**: `id`, `name`, `email`, `role`
-   **Room**: `id`, `name`, `capacity`, `location`
-   **Booking**: `id`, `userId`, `roomId`, `date`, `status`
-   **Memo**: `id`, `bookingId`, `message`, `adminId`, `date`

Tambahkan file `prisma/seed.ts` untuk mengisi data awal ruangan (contoh: nama ruangan, kapasitas, lokasi).

---

## 💡 **Teknologi & Framework**

| Area                     | Teknologi                                       |
| ------------------------ | ----------------------------------------------- |
| **Frontend Framework**   | Next.js 15 (App Router)                         |
| **Bahasa**               | TypeScript                                      |
| **Styling**              | Tailwind CSS + Shadcn UI                        |
| **Autentikasi**          | NextAuth.js v5 (Auth.js)                        |
| **ORM & Database**       | Prisma + PostgreSQL (Supabase/Neon/PlanetScale) |
| **Deployment**           | Vercel                                          |
| **Form Management**      | React Hook Form + Zod                           |
| **Notifikasi UI**        | React Hot Toast / Shadcn Toast                  |
| **Upload File**          | Vercel Blob / Supabase Storage / Cloudinary     |
| **Visualisasi Data**     | Recharts                                        |
| **Email Notification**   | Resend / Nodemailer                             |
| **Export Data**          | jsPDF / SheetJS (xlsx)                          |
| **Version Control**      | Git + GitHub                                    |
| **Linting & Formatting** | ESLint + Prettier                               |
| **CI/CD (opsional)**     | GitHub Actions                                  |

---

## 📈 **Alur Sistem**

1. Mahasiswa login → membuat peminjaman → status awal **Menunggu Validasi**.
2. Admin login → memverifikasi → ubah status ke **Validasi Admin** dan kirim memo.
3. Wadir III login → memberikan keputusan → ubah status ke **Disetujui** atau **Ditolak**.
4. Sistem mengirim **notifikasi otomatis** ke Mahasiswa dan Admin.
5. Semua aktivitas tercatat di **riwayat dashboard** tiap role.

---

## 🧠 **Output yang Diharapkan**

Website yang **modern, fungsional, dan responsif** dengan integrasi penuh antar role:

> **Mahasiswa → Admin → Wadir III → Notifikasi → Riwayat**

Tampilan bersih, navigasi mudah, dan workflow jelas untuk semua pengguna.

---

## 🔧 **Catatan Teknis**

-   Gunakan **server actions** untuk handle logic (Next.js 15).
-   Validasi setiap request berdasarkan role melalui middleware.
-   Buat komponen UI reusable: `RoomCard`, `BookingForm`, `ApprovalDialog`, `StatusBadge`.
-   Gunakan struktur folder modular:

    ```
    /app
      /dashboard
        /mahasiswa
        /admin
        /wadir
      /api
        /booking
        /auth
    /components
    /lib
    /prisma
    /styles
    ```

-   Integrasikan **Supabase Auth** jika ingin alternatif selain NextAuth.

---

## 📊 **Bonus (Opsional)**

-   Tambahkan **Dark Mode**.
-   Fitur **filter dan pencarian ruangan** (berdasarkan kapasitas/lokasi).
-   Tampilan analitik di dashboard admin menggunakan **Recharts**.
-   Email otomatis setiap ada perubahan status booking.

---

## 🧭 **Tujuan Akhir**

Bangun sistem peminjaman ruangan kampus yang **efisien, aman, dan skalabel** dengan teknologi modern dan desain profesional. Seluruh alur kerja dari pendaftaran, validasi, hingga laporan terotomatisasi dan mudah digunakan.

---

# 📁 Struktur folder (direkomendasikan)

```
itsme-ruangan/
├─ .env.example
├─ package.json
├─ next.config.js
├─ prisma/
│  ├─ schema.prisma
│  ├─ seed.ts
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ dashboard/
│  │  ├─ mahasiswa/
│  │  │  └─ page.tsx
│  │  ├─ admin/
│  │  │  └─ page.tsx
│  │  └─ wadir/
│  │     └─ page.tsx
│  ├─ api/
│  │  ├─ auth/
│  │  │  └─ route.ts
│  │  └─ booking/
│  │     ├─ route.ts
│  │     └─ availability.ts
├─ lib/
│  ├─ prisma.ts
│  ├─ auth/
│  │  ├─ authOptions.ts
│  │  └─ getServerUser.ts
├─ middleware.ts
├─ components/
│  ├─ ui/
│  │  ├─ Sidebar.tsx
│  │  ├─ BookingForm.tsx
│  │  ├─ RoomCard.tsx
│  │  └─ StatusBadge.tsx
├─ styles/
│  └─ globals.css
├─ prisma/
│  └─ seed.ts
└─ tsconfig.json
```

---

# 🔧 `package.json` (ringkasan)

```json
{
    "name": "itsme-ruangan",
    "private": true,
    "version": "0.1.0",
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "prisma:generate": "prisma generate",
        "prisma:migrate": "prisma migrate dev",
        "seed": "ts-node --esm prisma/seed.ts"
    },
    "dependencies": {
        "next": "15.0.0",
        "react": "18.2.0",
        "react-dom": "18.2.0",
        "typescript": "^5.0.0",
        "prisma": "^5.0.0",
        "@prisma/client": "^5.0.0",
        "zod": "^3.21.4",
        "react-hook-form": "^7.0.0",
        "tailwindcss": "^4.0.0",
        "shadcn/ui": "latest",
        "lucide-react": "latest",
        "authjs": "^5.0.0", // NextAuth v5 (Auth.js)
        "bcrypt": "^5.0.1",
        "react-hot-toast": "^2.0.0"
    },
    "devDependencies": {
        "ts-node": "^10.0.0",
        "eslint": "^8.0.0",
        "prettier": "^2.0.0"
    }
}
```

> Sesuaikan versi bila perlu.

---

# 🔐 `.env.example`

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_SECRET="change_this_to_a_secure_secret"
NEXTAUTH_URL="http://localhost:3000"
# Jika pakai Supabase
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

---

# 🧱 `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  fullName      String
  email         String    @unique
  role          UserRole  @default(STUDENT)
  studentId     String?
  phone         String?
  bookings      Booking[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("profiles")
}

model Room {
  id         String   @id @default(uuid())
  name       String   @unique
  building   String
  floor      Int
  capacity   Int
  facilities String[] @default([])
  isAvailable Boolean @default(true)
  bookings   Booking[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Booking {
  id               String       @id @default(uuid())
  user             User         @relation(fields: [userId], references: [id])
  userId           String
  room             Room         @relation(fields: [roomId], references: [id])
  roomId           String
  startTime        DateTime
  endTime          DateTime
  purpose          String
  eventName        String
  participantCount Int
  letterFileUrl    String?
  status           BookingStatus @default(PENDING)
  adminNotes       String?
  wadirNotes       String?
  validatedById    String?
  validatedBy      User?        @relation("validatedBy", fields: [validatedById], references: [id])
  validatedAt      DateTime?
  approvedById     String?
  approvedBy       User?        @relation("approvedBy", fields: [approvedById], references: [id])
  approvedAt       DateTime?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@index([userId])
  @@index([roomId])
  @@index([status])
}

model Memo {
  id         String   @id @default(uuid())
  booking    Booking  @relation(fields: [bookingId], references: [id])
  bookingId  String
  sender     User     @relation(fields: [senderId], references: [id])
  senderId   String
  receiverRole UserRole
  message    String
  isRead     Boolean  @default(false)
  createdAt  DateTime @default(now())
}

enum UserRole {
  STUDENT
  ADMIN
  WADIR3
}

enum BookingStatus {
  PENDING
  VALIDATED
  APPROVED
  REJECTED
}
```

> Catatan: Prisma model `User` dipetakan ke table `profiles` agar konsisten dengan skema yang kamu rancang.

---

# 🧰 `lib/prisma.ts`

```ts
import { PrismaClient } from "@prisma/client";

declare global {
    // allow global prisma during dev to prevent multiple instances
    // @ts-ignore
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
```

---

# 🔐 `lib/auth/authOptions.ts` (Auth.js v5 contoh minimal)

> Konsep: gunakan NextAuth (Auth.js) dengan adapter Prisma atau custom callbacks untuk menaruh role di DB. Di bawah contoh minimal sign-in callback untuk sinkronisasi user ke `profiles`.

```ts
import { AuthOptions } from "authjs"; // nama package bisa 'next-auth' tergantung instalasi
import { prisma } from "../prisma";

export const authOptions: AuthOptions = {
    // providers: [...GoogleProvider({ ... })], // tambahkan provider sesuai kebutuhan
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            // Sync user ke DB: kalau belum ada, buat record di profiles
            const existing = await prisma.user.findUnique({ where: { email: user.email! } });
            if (!existing) {
                await prisma.user.create({
                    data: {
                        id: user.id,
                        fullName: user.name ?? user.email ?? "Tanpa Nama",
                        email: user.email!,
                        role: "STUDENT" // default role
                    }
                });
            }
            return true;
        },
        async session({ session, token }) {
            // Attach role & id ke session.user
            if (session.user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email }
                });
                if (dbUser) {
                    // @ts-ignore
                    session.user.id = dbUser.id;
                    // @ts-ignore
                    session.user.role = dbUser.role;
                }
            }
            return session;
        }
    }
};
```

> Sesuaikan provider (Google, Email, Credentials) dan integrasi adapter kalau perlu.

---

# 🧭 `middleware.ts` (proteksi rute berdasarkan role)

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; // atau metode auth.js yang relevan

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Hanya proteksi path /dashboard/*
    if (!pathname.startsWith("/dashboard")) return NextResponse.next();

    // Ambil token/session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        // redirect ke login jika belum login
        const url = req.nextUrl.clone();
        url.pathname = "/api/auth/signin";
        return NextResponse.redirect(url);
    }

    const role = token.role || token?.user?.role;

    // Role-based routing
    if (pathname.startsWith("/dashboard/mahasiswa") && role !== "STUDENT") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (pathname.startsWith("/dashboard/wadir") && role !== "WADIR3") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"]
};
```

> Sesuaikan mekanisme pengambilan role jika menggunakan Supabase session.

---

# 🔁 `app/api/booking/route.ts` — contoh route CRUD (server)

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; // atau authjs
import { authOptions } from "@/lib/auth/authOptions";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    // validasi minimal (gunakan zod di implementasi sesungguhnya)
    const { roomId, startTime, endTime, purpose, eventName, participantCount } = body;

    // Cek konflik jadwal
    const conflict = await prisma.booking.findFirst({
        where: {
            roomId,
            OR: [
                {
                    AND: [
                        { startTime: { lte: new Date(startTime) } },
                        { endTime: { gte: new Date(startTime) } }
                    ]
                },
                {
                    AND: [
                        { startTime: { lte: new Date(endTime) } },
                        { endTime: { gte: new Date(endTime) } }
                    ]
                }
            ],
            status: { not: "REJECTED" }
        }
    });
    if (conflict) return NextResponse.json({ error: "Waktu bentrok" }, { status: 400 });

    const booking = await prisma.booking.create({
        data: {
            userId: session.user.id,
            roomId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            purpose,
            eventName,
            participantCount,
            status: "PENDING"
        }
    });

    return NextResponse.json(booking);
}
```

---

# 🧾 `prisma/seed.ts` (contoh seed sederhana)

```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const rooms = [
        {
            name: "Ruang Seminar A",
            building: "Gedung A",
            floor: 1,
            capacity: 100,
            facilities: ["Proyektor", "AC", "Sound System", "Wifi"]
        },
        {
            name: "Ruang Rapat 1",
            building: "Gedung B",
            floor: 1,
            capacity: 30,
            facilities: ["Proyektor", "AC", "Whiteboard", "Wifi"]
        },
        {
            name: "Aula Utama",
            building: "Gedung C",
            floor: 1,
            capacity: 500,
            facilities: ["Sound System", "AC", "Stage", "Lighting", "Wifi"]
        }
    ];

    for (const r of rooms) {
        await prisma.room.upsert({
            where: { name: r.name },
            update: {},
            create: {
                name: r.name,
                building: r.building,
                floor: r.floor,
                capacity: r.capacity,
                facilities: r.facilities
            }
        });
    }

    console.log("Seed selesai");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
```

---

# 🔎 Komponen UI contoh (`components/ui/BookingForm.tsx`)

```tsx
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const schema = z.object({
    roomId: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    eventName: z.string().min(3),
    participantCount: z.number().min(1),
    purpose: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export default function BookingForm({ rooms }: { rooms: any[] }) {
    const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        const res = await fetch("/api/booking", { method: "POST", body: JSON.stringify(data) });
        const json = await res.json();
        if (!res.ok) return toast.error(json.error || "Error membuat booking");
        toast.success("Booking dibuat. Menunggu validasi");
        // redirect atau reset form
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <select {...register("roomId")} className="input">
                {rooms.map((r) => (
                    <option value={r.id} key={r.id}>
                        {r.name} — {r.building}
                    </option>
                ))}
            </select>
            <input {...register("startTime")} type="datetime-local" className="input" />
            <input {...register("endTime")} type="datetime-local" className="input" />
            <input {...register("eventName")} placeholder="Nama acara" className="input" />
            <input
                {...register("participantCount", { valueAsNumber: true })}
                type="number"
                className="input"
            />
            <textarea {...register("purpose")} placeholder="Keperluan" className="input" />
            <button type="submit" className="btn">
                Ajukan Peminjaman
            </button>
        </form>
    );
}
```

---

# 🧾 RLS & Supabase — catatan penting

-   Jika kamu menggunakan **Supabase** sebagai DB (dengan auth), aktifkan RLS hanya setelah membuat policies yang tepat.
-   Buat policy untuk `profiles` agar user yang baru bisa `INSERT` baris dengan `id = auth.uid()` atau gunakan trigger pada `auth.users` untuk otomatis menambahkan `profiles`.
-   Jika menggunakan Prisma + NextAuth (own DB), RLS di DB tidak wajib; kontrol akses dilakukan di server (middleware & policies).

---

# ✅ Langkah-langkah awal untuk menjalankan

1. Buat repo, paste file di atas.
2. Isi `.env` sesuai `DATABASE_URL` dan `NEXTAUTH_SECRET`.
3. `npm install`
4. `npx prisma migrate dev --name init`
5. `npm run prisma:generate`
6. `npm run seed`
7. `npm run dev`

---
