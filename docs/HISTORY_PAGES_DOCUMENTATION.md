# Halaman Riwayat - Dokumentasi

## Overview

Halaman Riwayat menampilkan history peminjaman ruangan untuk setiap role dengan fitur filter, search, dan detail view.

---

## 1. 🎓 Mahasiswa - Riwayat Peminjaman

**Path:** `/dashboard/mahasiswa/riwayat`

### Fitur:

- **Statistik Cards**: Total, Pending, Validated, Approved, Rejected
- **Search**: Cari berdasarkan nama acara, ruangan, atau tujuan
- **Filter Status**: ALL, PENDING, VALIDATED, APPROVED, REJECTED
- **List View**: Kartu peminjaman dengan info ringkas
- **Detail Panel**: Panel detail lengkap yang muncul saat klik peminjaman
- **Timeline**: Visualisasi timeline status peminjaman
- **Catatan**: Menampilkan catatan dari Admin dan Wadir

### Data yang Ditampilkan:

- Semua peminjaman yang pernah diajukan oleh mahasiswa
- Status terkini dari setiap peminjaman
- Tanggal pengajuan, validasi, dan approval
- Catatan penolakan (jika ada)

### Components:

- Server: `app/dashboard/mahasiswa/riwayat/page.tsx`
- Client: `components/mahasiswa/HistoryPageClient.tsx`

---

## 2. 👨‍💼 Admin - Riwayat Validasi

**Path:** `/dashboard/admin/riwayat`

### Fitur:

- **Statistik Cards**: Total Diproses, Divalidasi, Disetujui Wadir, Ditolak
- **Search**: Cari berdasarkan acara, ruangan, atau peminjam
- **Filter Status**: ALL, VALIDATED, APPROVED, REJECTED
- **List View**: Kartu peminjaman dengan info peminjam
- **Detail Panel**: Detail lengkap termasuk info peminjam
- **Timeline**: Timeline proses dari pengajuan hingga keputusan akhir
- **Catatan**: Catatan validasi Admin dan catatan Wadir

### Data yang Ditampilkan:

- Peminjaman yang sudah divalidasi (VALIDATED)
- Peminjaman yang ditolak oleh Admin (REJECTED)
- Peminjaman yang sudah disetujui/ditolak Wadir (APPROVED/REJECTED)
- Info lengkap peminjam (nama, email, NIM)
- Timestamp validasi dan approval

### Components:

- Server: `app/dashboard/admin/riwayat/page.tsx`
- Client: `components/admin/AdminHistoryClient.tsx`

---

## 3. 👔 Wadir - Riwayat Persetujuan

**Path:** `/dashboard/wadir/riwayat`

### Fitur:

- **Statistik Cards**: Total Diproses, Disetujui, Ditolak
- **Search**: Cari berdasarkan acara, ruangan, atau peminjam
- **Filter Status**: ALL, APPROVED, REJECTED
- **List View**: Kartu peminjaman dengan status approval
- **Detail Panel**: Detail lengkap dengan info peminjam
- **Timeline**: Timeline lengkap dari pengajuan → validasi → approval
- **Catatan**: Catatan dari Admin dan Wadir

### Data yang Ditampilkan:

- Peminjaman yang sudah disetujui (APPROVED)
- Peminjaman yang ditolak oleh Wadir (REJECTED)
- Info lengkap peminjam dan acara
- Timestamp semua tahap proses
- Catatan validasi dari Admin

### Components:

- Server: `app/dashboard/wadir/riwayat/page.tsx`
- Client: `components/wadir/WadirHistoryClient.tsx`

---

## Arsitektur Pattern

Semua halaman riwayat mengikuti pattern yang sama:

```
┌──────────────────────────────┐
│   Server Component (page)    │
│   • Auth check (role-based)  │
│   • Fetch booking history    │
│   • Filter by role logic     │
└──────────┬───────────────────┘
           │ Props
           ↓
┌──────────────────────────────┐
│   Client Component (*Client) │
│   • Statistics calculation   │
│   • Search & filter UI       │
│   • List view                │
│   • Detail panel             │
│   • Timeline visualization   │
└──────────────────────────────┘
```

---

## UI Components

### Statistics Cards

```tsx
<Card>
  <CardContent>
    <div className="text-2xl font-bold">{count}</div>
    <p className="text-xs text-muted-foreground">{label}</p>
  </CardContent>
</Card>
```

### Search & Filter

- Search input dengan icon
- Status dropdown select
- Clear filters button (muncul saat ada filter aktif)

### List View

- Card layout untuk setiap booking
- Highlight saat selected (ring-2 ring-primary)
- Hover effect (shadow-md)
- Info ringkas: nama, ruangan, tanggal, status

### Detail Panel

- Sticky positioning (top-6)
- Sections:
  1. Status badge
  2. Informasi Peminjam (khusus Admin & Wadir)
  3. Informasi Acara
  4. Ruangan & Waktu
  5. Timeline visual
  6. Catatan (Admin & Wadir)

### Timeline Visualization

```
● Diajukan (createdAt)
│
● Divalidasi (validatedAt)
│
● Disetujui/Ditolak (approvedAt)
```

---

## Filter Logic

### Mahasiswa

- Menampilkan semua booking milik user
- Filter: ALL, PENDING, VALIDATED, APPROVED, REJECTED

### Admin

- Menampilkan booking yang sudah diproses Admin
- Status: VALIDATED, APPROVED, REJECTED
- Tidak menampilkan PENDING

### Wadir

- Menampilkan booking yang sudah diproses Wadir
- Status: APPROVED, REJECTED
- Tidak menampilkan PENDING atau VALIDATED

---

## Status Colors

- **PENDING**: Yellow (bg-yellow-100 text-yellow-800)
- **VALIDATED**: Blue (bg-blue-100 text-blue-800)
- **APPROVED**: Green (bg-green-100 text-green-800)
- **REJECTED**: Red (bg-red-100 text-red-800)

---

## Date Formatting

Menggunakan `date-fns` dengan locale Indonesia:

- **Long format**: `dd MMMM yyyy` (contoh: 11 November 2025)
- **Short format**: `dd MMM yyyy, HH:mm` (contoh: 11 Nov 2025, 14:30)
- **Time only**: `HH:mm` (contoh: 14:30)

---

## Responsive Design

### Desktop (lg+)

```
┌─────────────────┬──────────┐
│                 │          │
│   List View     │  Detail  │
│   (2 cols)      │  Panel   │
│                 │  (1 col) │
└─────────────────┴──────────┘
```

### Mobile

```
┌─────────────────┐
│   Statistics    │
├─────────────────┤
│   List View     │
├─────────────────┤
│   Detail Panel  │
└─────────────────┘
```

---

## State Management

```tsx
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
const [selectedBooking, setSelectedBooking] = useState(null);
```

### Computed State

```tsx
const filteredBookings = useMemo(() => {
  // Filter by search and status
}, [bookings, searchTerm, statusFilter]);

const stats = useMemo(() => {
  // Calculate statistics
}, [bookings]);
```

---

## Performance Considerations

1. **useMemo**: Filter dan stats calculation di-memoize
2. **Sticky Panel**: Detail panel sticky untuk UX lebih baik
3. **Conditional Rendering**: Timeline items hanya render jika timestamp ada
4. **Search Optimization**: Case-insensitive search dengan toLowerCase()

---

## Future Enhancements

1. **Pagination**: Untuk handling data besar
2. **Date Range Filter**: Filter berdasarkan rentang tanggal
3. **Export**: Export ke PDF/Excel
4. **Sort**: Sort by date, status, room
5. **Bulk View**: Lihat multiple bookings sekaligus
6. **Print View**: View khusus untuk print
7. **Email Details**: Kirim detail booking via email

---

## Testing Checklist

- [ ] Mahasiswa dapat melihat semua history peminjaman
- [ ] Admin dapat melihat riwayat validasi
- [ ] Wadir dapat melihat riwayat approval
- [ ] Search berfungsi dengan benar
- [ ] Filter status bekerja
- [ ] Detail panel menampilkan info lengkap
- [ ] Timeline menampilkan kronologi dengan benar
- [ ] Catatan Admin/Wadir tampil jika ada
- [ ] Responsive di mobile dan desktop
- [ ] Statistics calculation akurat
- [ ] Empty state menampilkan pesan yang tepat
