import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive seed...");

  // Clear existing data
  await prisma.memo.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑️  Cleared existing data");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create 20 students
  console.log("👥 Creating 20 students...");
  const students = [];
  for (let i = 1; i <= 20; i++) {
    const student = await prisma.user.create({
      data: {
        fullName: `Mahasiswa ${i}`,
        email: `mahasiswa${i}@kampus.ac.id`,
        password: hashedPassword,
        role: "STUDENT",
        studentId: `2021${String(i).padStart(3, "0")}`,
        phone: `0812345678${String(i).padStart(2, "0")}`,
      },
    });
    students.push(student);
  }
  console.log("✅ 20 Students created");

  // Create admin and wadir
  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Fakultas",
      email: "admin@kampus.ac.id",
      password: hashedPassword,
      role: "ADMIN",
      phone: "081234567891",
    },
  });

  const wadir = await prisma.user.create({
    data: {
      fullName: "Dr. Wadir III",
      email: "wadir3@kampus.ac.id",
      password: hashedPassword,
      role: "WADIR3",
      phone: "081234567892",
    },
  });
  console.log("✅ Admin and Wadir created");

  // Create 5 buildings with 3 rooms each (15 rooms total)
  console.log("🏢 Creating 5 buildings with 3 rooms each...");
  const buildings = ["Gedung A", "Gedung B", "Gedung C", "Gedung D", "Gedung E"];
  const roomTypes = ["Ruang Seminar", "Ruang Kuliah", "Laboratorium"];
  const allRooms = [];

  for (let i = 0; i < buildings.length; i++) {
    const building = buildings[i];
    for (let j = 0; j < 3; j++) {
      const room = await prisma.room.create({
        data: {
          name: `${roomTypes[j]} ${building} ${j + 1}`,
          building: building,
          floor: (j % 3) + 1,
          capacity: [50, 40, 30][j],
          facilities: ["Proyektor", "AC", "Whiteboard", "Wifi"],
          isAvailable: true,
        },
      });
      allRooms.push(room);
    }
  }
  console.log("✅ 15 Rooms created (5 buildings × 3 rooms)");

  // Create bookings with various statuses for testing
  console.log("📅 Creating test bookings...");
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // VALIDATED and APPROVED bookings (rooms in use) - Same date as test scenario
  // Booking 1: Room occupied in morning
  await prisma.booking.create({
    data: {
      userId: students[0].id,
      roomId: allRooms[0].id, // Ruang Seminar Gedung A 1
      startTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
      eventName: "Workshop Pemrograman Web",
      purpose: "Pelatihan teknis",
      participantCount: 45,
      status: "APPROVED",
    },
  });

  // Booking 2: Room occupied in afternoon
  await prisma.booking.create({
    data: {
      userId: students[1].id,
      roomId: allRooms[1].id, // Ruang Kuliah Gedung A 2
      startTime: new Date(tomorrow.setHours(13, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(16, 0, 0, 0)),
      eventName: "Seminar Nasional",
      purpose: "Presentasi penelitian",
      participantCount: 38,
      status: "APPROVED",
    },
  });

  // Booking 3: Room validated (waiting for wadir approval)
  await prisma.booking.create({
    data: {
      userId: students[2].id,
      roomId: allRooms[2].id, // Laboratorium Gedung A 3
      startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
      eventName: "Praktikum Jaringan",
      purpose: "Praktik lab",
      participantCount: 28,
      status: "VALIDATED",
    },
  });

  // Booking 4: Another occupied room (Gedung B)
  await prisma.booking.create({
    data: {
      userId: students[3].id,
      roomId: allRooms[3].id, // Ruang Seminar Gedung B 1
      startTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      eventName: "Rapat Organisasi",
      purpose: "Koordinasi kegiatan",
      participantCount: 25,
      status: "APPROVED",
    },
  });

  // Booking 5: Occupied room in Gedung C
  await prisma.booking.create({
    data: {
      userId: students[4].id,
      roomId: allRooms[6].id, // Ruang Seminar Gedung C 1
      startTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
      eventName: "Training Leadership",
      purpose: "Pengembangan soft skill",
      participantCount: 48,
      status: "APPROVED",
    },
  });

  // PENDING bookings for admin to validate (with conflict scenarios)
  const tomorrowMorning = new Date(tomorrow);
  tomorrowMorning.setHours(9, 0, 0, 0);
  const tomorrowNoon = new Date(tomorrow);
  tomorrowNoon.setHours(12, 0, 0, 0);

  // Pending booking 1: Request for already occupied room (should suggest alternative)
  await prisma.booking.create({
    data: {
      userId: students[5].id,
      roomId: allRooms[0].id, // Same as approved booking (Gedung A)
      startTime: new Date(tomorrowMorning),
      endTime: new Date(tomorrowNoon),
      eventName: "Diskusi Kelompok Tugas Akhir",
      purpose: "Diskusi TA",
      participantCount: 40,
      status: "PENDING",
    },
  });

  // Pending booking 2: Request for another occupied room
  await prisma.booking.create({
    data: {
      userId: students[6].id,
      roomId: allRooms[1].id, // Occupied in afternoon
      startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(16, 0, 0, 0)),
      eventName: "Lomba Debat",
      purpose: "Kompetisi mahasiswa",
      participantCount: 35,
      status: "PENDING",
    },
  });

  // Pending booking 3: Free room (should be validated easily)
  await prisma.booking.create({
    data: {
      userId: students[7].id,
      roomId: allRooms[10].id, // Gedung D - should be free
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
      eventName: "Pertemuan Himpunan",
      purpose: "Rapat internal",
      participantCount: 30,
      status: "PENDING",
    },
  });

  // Pending booking 4: Another conflict
  await prisma.booking.create({
    data: {
      userId: students[8].id,
      roomId: allRooms[3].id, // Occupied by Rapat Organisasi
      startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
      eventName: "Kelas Tambahan",
      purpose: "Remedial",
      participantCount: 22,
      status: "PENDING",
    },
  });

  // Some REJECTED bookings with alternative suggestions
  await prisma.booking.create({
    data: {
      userId: students[9].id,
      roomId: allRooms[5].id,
      startTime: new Date(today.setHours(14, 0, 0, 0)),
      endTime: new Date(today.setHours(16, 0, 0, 0)),
      eventName: "Workshop AI",
      purpose: "Belajar machine learning",
      participantCount: 45,
      status: "REJECTED",
      adminNotes: "Ruangan sudah dipakai, silakan coba ruangan alternatif",
      alternativeRoomId: allRooms[11].id, // Suggest Gedung D room
    },
  });

  console.log("✅ Test bookings created:");
  console.log("   - 5 APPROVED bookings (rooms in use)");
  console.log("   - 1 VALIDATED booking (waiting for wadir)");
  console.log("   - 4 PENDING bookings (for admin to validate)");
  console.log("   - 1 REJECTED booking (with alternative suggestion)");

  console.log("\n🎉 Comprehensive seed completed!");
  console.log("\n📋 Summary:");
  console.log(`   - Users: 22 (20 students + 1 admin + 1 wadir)`);
  console.log(`   - Buildings: 5 (Gedung A-E)`);
  console.log(`   - Rooms: 15 (3 rooms per building)`);
  console.log(`   - Bookings: 11 (various statuses for testing)`);
  console.log("\n🔑 Login credentials:");
  console.log("   - Students: mahasiswa1@kampus.ac.id - mahasiswa20@kampus.ac.id");
  console.log("   - Admin: admin@kampus.ac.id");
  console.log("   - Wadir: wadir3@kampus.ac.id");
  console.log("   - Password (all): password123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
