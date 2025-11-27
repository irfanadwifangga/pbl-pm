const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Clear data
  console.log("🗑️ Clearing data...");
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.memo.deleteMany().catch(() => {});
  await prisma.booking.deleteMany().catch(() => {});
  await prisma.room.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});
  console.log("✓ Data cleared");

  // Create users
  console.log("👥 Creating users...");
  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Bagian Umum",
      email: "admin@kampus.ac.id",
      password: hashedPassword,
      role: "ADMIN",
      phone: "081234567800",
    },
  });
  console.log("  ✓ Admin created");

  const wadir = await prisma.user.create({
    data: {
      fullName: "Dr. Bambang Wijaya, M.Si.",
      email: "wadir3@kampus.ac.id",
      password: hashedPassword,
      role: "WADIR3",
      phone: "081234567899",
    },
  });
  console.log("  ✓ Wadir created");

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

  console.log("  Creating 20 students...");
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
    if ((i + 1) % 5 === 0) {
      console.log(`    ${i + 1}/20 students created...`);
    }
  }
  console.log("  ✓ All 20 students created");

  // Create rooms
  console.log("🏢 Creating rooms...");
  const buildings = [
    { name: "Gedung Utama", code: "A" },
    { name: "Gedung Teknik", code: "B" },
    { name: "Gedung Sains", code: "C" },
    { name: "Gedung Ekonomi", code: "D" },
    { name: "Gedung Sosial", code: "E" },
  ];

  const roomTypes = [
    { name: "Ruang Kuliah", capacity: 50 },
    { name: "Ruang Seminar", capacity: 80 },
    { name: "Lab Komputer", capacity: 40 },
    { name: "Ruang Rapat", capacity: 30 },
    { name: "Aula", capacity: 200 },
  ];

  const rooms = [];
  for (const building of buildings) {
    for (let j = 0; j < 5; j++) {
      const room = await prisma.room.create({
        data: {
          name: `${roomTypes[j].name} ${building.code}.${j + 1}`,
          building: building.name,
          floor: Math.floor(j / 2) + 1,
          capacity: roomTypes[j].capacity,
          facilities: ["Proyektor", "AC", "Whiteboard", "Wifi"],
          isAvailable: true,
        },
      });
      rooms.push(room);
    }
    console.log(`  ✓ ${building.name} (5 rooms)`);
  }

  console.log("\n✅ Seed completed successfully!");
  console.log(`  - Users: ${students.length + 2}`);
  console.log(`  - Rooms: ${rooms.length}`);
  console.log("\n🔑 Login credentials:");
  console.log("  mahasiswa1-20@kampus.ac.id / password123");
  console.log("  admin@kampus.ac.id / password123");
  console.log("  wadir3@kampus.ac.id / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
