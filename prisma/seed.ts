import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive seed...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.memo.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑️  Cleared existing data");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create 20 students with Indonesian names
  console.log("👥 Creating 20 students with unique names...");
  const studentNames = [
    "Ahmad Fadli Rahman",
    "Siti Nurhaliza",
    "Budi Santoso",
    "Dewi Lestari",
    "Eko Prasetyo",
    "Fitri Handayani",
    "Galih Wicaksono",
    "Hana Pratiwi",
    "Irfan Maulana",
    "Joko Widodo",
    "Kartika Sari",
    "Lukman Hakim",
    "Maya Angelina",
    "Nanda Pratama",
    "Oktavia Putri",
    "Putra Mahardika",
    "Qori Syarifah",
    "Reza Pahlevi",
    "Sari Indah",
    "Taufik Hidayat",
  ];

  const students = [];
  for (let i = 0; i < 20; i++) {
    const student = await prisma.user.create({
      data: {
        fullName: studentNames[i],
        email: `mahasiswa${i + 1}@kampus.ac.id`,
        password: hashedPassword,
        role: "STUDENT",
        studentId: `2021${String(i + 1).padStart(3, "0")}`,
        phone: `0812345678${String(i + 1).padStart(2, "0")}`,
      },
    });
    students.push(student);
  }
  console.log("✅ 20 Students created with unique names");

  // Create admin and wadir
  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Bagian Umum",
      email: "admin@kampus.ac.id",
      password: hashedPassword,
      role: "ADMIN",
      phone: "081234567800",
    },
  });

  const wadir = await prisma.user.create({
    data: {
      fullName: "Dr. Bambang Wijaya, M.Si.",
      email: "wadir3@kampus.ac.id",
      password: hashedPassword,
      role: "WADIR3",
      phone: "081234567899",
    },
  });
  console.log("✅ Admin and Wadir III created");

  // Create 5 buildings with 5 rooms each (25 rooms total)
  console.log("🏢 Creating 5 buildings with 5 rooms each...");
  const buildings = [
    { name: "Gedung Utama", code: "A" },
    { name: "Gedung Teknik", code: "B" },
    { name: "Gedung Sains", code: "C" },
    { name: "Gedung Ekonomi", code: "D" },
    { name: "Gedung Sosial", code: "E" },
  ];

  const roomTypes = [
    {
      name: "Ruang Kuliah",
      capacity: 50,
      facilities: ["Proyektor", "AC", "Whiteboard", "Wifi", "Sound System"],
    },
    {
      name: "Ruang Seminar",
      capacity: 80,
      facilities: ["Proyektor", "AC", "Whiteboard", "Wifi", "Sound System", "Podium"],
    },
    {
      name: "Laboratorium Komputer",
      capacity: 40,
      facilities: ["Komputer", "AC", "Whiteboard", "Wifi", "Printer"],
    },
    {
      name: "Ruang Rapat",
      capacity: 30,
      facilities: ["Proyektor", "AC", "Whiteboard", "Wifi", "Meja Bundar"],
    },
    {
      name: "Aula",
      capacity: 200,
      facilities: ["Sound System", "AC", "Panggung", "Wifi", "Proyektor", "Kursi Theater"],
    },
  ];

  const allRooms = [];

  for (const building of buildings) {
    for (let j = 0; j < 5; j++) {
      const roomType = roomTypes[j];
      const room = await prisma.room.create({
        data: {
          name: `${roomType.name} ${building.code}.${j + 1}`,
          building: building.name,
          floor: Math.floor(j / 2) + 1, // Floor 1-3
          capacity: roomType.capacity,
          facilities: roomType.facilities,
          isAvailable: true,
        },
      });
      allRooms.push(room);
    }
  }
  console.log("✅ 25 Rooms created (5 buildings × 5 rooms)");

  // Create bookings with various statuses for testing
  console.log("📅 Creating test bookings...");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // APPROVED bookings
  await prisma.booking.create({
    data: {
      userId: students[0].id,
      roomId: allRooms[0].id,
      startTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
      eventName: "Workshop Pemrograman Web",
      purpose: "Pelatihan teknis untuk mahasiswa semester 5",
      participantCount: 45,
      status: "APPROVED",
      validatedById: admin.id,
      validatedAt: new Date(),
      approvedById: wadir.id,
      approvedAt: new Date(),
    },
  });

  await prisma.booking.create({
    data: {
      userId: students[1].id,
      roomId: allRooms[6].id,
      startTime: new Date(tomorrow.setHours(13, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(16, 0, 0, 0)),
      eventName: "Seminar Nasional Teknologi",
      purpose: "Presentasi penelitian dosen dan mahasiswa",
      participantCount: 75,
      status: "APPROVED",
      validatedById: admin.id,
      validatedAt: new Date(),
      approvedById: wadir.id,
      approvedAt: new Date(),
    },
  });

  await prisma.booking.create({
    data: {
      userId: students[2].id,
      roomId: allRooms[12].id,
      startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
      eventName: "Praktikum Jaringan Komputer",
      purpose: "Praktik konfigurasi router dan switch",
      participantCount: 35,
      status: "APPROVED",
      validatedById: admin.id,
      validatedAt: new Date(),
      approvedById: wadir.id,
      approvedAt: new Date(),
    },
  });

  // VALIDATED bookings (waiting for wadir approval)
  await prisma.booking.create({
    data: {
      userId: students[3].id,
      roomId: allRooms[5].id,
      startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(17, 0, 0, 0)),
      eventName: "Rapat Koordinasi BEM",
      purpose: "Pembahasan agenda kegiatan bulan depan",
      participantCount: 28,
      status: "VALIDATED",
      validatedById: admin.id,
      validatedAt: new Date(),
      adminNotes: "Sudah divalidasi, menunggu approval Wadir",
    },
  });

  await prisma.booking.create({
    data: {
      userId: students[4].id,
      roomId: allRooms[10].id,
      startTime: new Date(nextWeek.setHours(10, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(12, 0, 0, 0)),
      eventName: "Training Leadership",
      purpose: "Pelatihan kepemimpinan untuk ketua organisasi",
      participantCount: 50,
      status: "VALIDATED",
      validatedById: admin.id,
      validatedAt: new Date(),
      adminNotes: "Proposal lengkap, menunggu approval",
    },
  });

  // PENDING bookings (for admin to validate)
  await prisma.booking.create({
    data: {
      userId: students[5].id,
      roomId: allRooms[15].id,
      startTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      eventName: "Diskusi Kelompok Tugas Akhir",
      purpose: "Diskusi progress penelitian kelompok",
      participantCount: 20,
      status: "PENDING",
    },
  });

  await prisma.booking.create({
    data: {
      userId: students[6].id,
      roomId: allRooms[20].id,
      startTime: new Date(nextWeek.setHours(13, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(15, 0, 0, 0)),
      eventName: "Lomba Debat Bahasa Inggris",
      purpose: "Kompetisi debat tingkat fakultas",
      participantCount: 40,
      status: "PENDING",
    },
  });

  await prisma.booking.create({
    data: {
      userId: students[7].id,
      roomId: allRooms[24].id,
      startTime: new Date(nextWeek.setHours(8, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(12, 0, 0, 0)),
      eventName: "Pentas Seni Mahasiswa",
      purpose: "Pertunjukan seni dan budaya",
      participantCount: 180,
      status: "PENDING",
    },
  });

  // REJECTED booking
  await prisma.booking.create({
    data: {
      userId: students[8].id,
      roomId: allRooms[0].id,
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
      eventName: "Workshop AI",
      purpose: "Belajar machine learning",
      participantCount: 45,
      status: "REJECTED",
      validatedById: admin.id,
      validatedAt: new Date(),
      adminNotes: "Ruangan sudah dipakai pada waktu tersebut",
      alternativeRoomId: allRooms[1].id,
    },
  });

  console.log("✅ Test bookings created:");
  console.log("   - 3 APPROVED bookings");
  console.log("   - 2 VALIDATED bookings (waiting for wadir)");
  console.log("   - 3 PENDING bookings (for admin to validate)");
  console.log("   - 1 REJECTED booking (with alternative)");

  console.log("\n🎉 Comprehensive seed completed!");
  console.log("\n📋 Summary:");
  console.log(`   - Users: 22 (20 students + 1 admin + 1 wadir)`);
  console.log(`   - Buildings: 5 (Gedung Utama, Teknik, Sains, Ekonomi, Sosial)`);
  console.log(`   - Rooms: 25 (5 types × 5 buildings)`);
  console.log(`   - Bookings: 9 (various statuses for testing)`);
  console.log("\n🔑 Login credentials:");
  console.log("   - Students: mahasiswa1@kampus.ac.id - mahasiswa20@kampus.ac.id");
  console.log("   - Admin: admin@kampus.ac.id");
  console.log("   - Wadir III: wadir3@kampus.ac.id");
  console.log("   - Password (all): password123");
  console.log("\n👥 Student names:");
  studentNames.forEach((name, i) => {
    console.log(`   ${i + 1}. ${name}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
