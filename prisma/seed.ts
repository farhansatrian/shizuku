import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("☔ Seeding shizuku (雫) database...");

  // Enable SQLite WAL mode persistently on the database file
  await prisma.$queryRawUnsafe("PRAGMA journal_mode = WAL;");
  await prisma.$queryRawUnsafe("PRAGMA busy_timeout = 5000;");

  // 1. Ensure initial Admin user exists
  const adminUsername = (process.env.ADMIN_USERNAME || "farhan").trim();
  const adminEmail = (
    process.env.ADMIN_EMAIL || "farhansatria.07@gmail.com"
  ).trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "shizuku-admin-2026";

  const existingAdmin = await prisma.adminUser.findFirst();
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        passwordHash,
        displayName: "Farhan Satria Nugraha",
      },
    });
    console.log(`✓ Created initial admin user (${adminUsername})`);
  } else {
    console.log(`• Admin user already exists (${existingAdmin.username})`);
  }

  // 2. Seed SiteProfile if missing
  const existingProfile = await prisma.siteProfile.findUnique({
    where: { id: "main" },
  });

  if (!existingProfile) {
    await prisma.siteProfile.create({
      data: {
        id: "main",
        brandName: "shizuku",
        brandKanji: "雫",
        fullName: "Farhan Satria Nugraha",
        headlineEn:
          "Software Engineer, ODP IT at Bank Negara Indonesia (BNI), and creator of the shizuku web ecosystem.",
        headlineId:
          "Software Engineer, ODP IT di Bank Negara Indonesia (BNI), dan pembuat ekosistem web shizuku.",
        rolesJson: JSON.stringify({
          en: ["Software Engineer", "ODP IT · BNI"],
          id: ["Software Engineer", "ODP IT · BNI"],
        }),
        bioEn:
          "Software Engineer in the Officer Development Program (ODP IT) at PT Bank Negara Indonesia (Persero) Tbk. Applied Software Engineering graduate from Telkom University, focused on web engineering, banking systems, and building personal web apps.",
        bioId:
          "Software Engineer di Officer Development Program (ODP IT) PT Bank Negara Indonesia (Persero) Tbk. Lulusan Rekayasa Perangkat Lunak Aplikasi Telkom University yang fokus pada rekayasa web, sistem perbankan, dan pengembangan aplikasi web pribadi.",
        aboutStoryEn:
          "shizuku (雫) is a personal web hub and digital ecosystem by Farhan Satria Nugraha.\n\nBuilt around calm minimalism, shizuku brings together personal works, portfolio records, and a shared SHIZUKU ID across companion web apps like SHIKAS and SHIKOST.",
        aboutStoryId:
          "shizuku (雫) adalah ruang web pribadi dan ekosistem digital buatan Farhan Satria Nugraha.\n\nDibangun dengan gaya minimalis yang tenang, shizuku menyatukan karya ekosistem, catatan portofolio, dan satu SHIZUKU ID untuk aplikasi seperti SHIKAS dan SHIKOST.",
        location: "Jakarta, Indonesia",
        currentRoleEn: "Officer Development Program (ODP) — IT",
        currentRoleId: "Officer Development Program (ODP) — IT",
        currentOrg: "PT Bank Negara Indonesia (Persero) Tbk (BNI)",
        availabilityEn: "",
        availabilityId: "",
        currentlyEn: "",
        currentlyId: "",
        heroImage: "",
        heroImageMobile: "",
        avatarImage: "",
        email: "farhansatria.07@gmail.com",
        linkedinUrl: "https://www.linkedin.com/in/farhansatrian/",
        githubUrl: "https://github.com/farhansatrian",
        instagramUrl: "https://www.instagram.com/farhansatria_n/",
        youtubeUrl: "https://www.youtube.com/@ahansn",
        resumeUrl: "",
        statsJson: "[]",
        pillarsJson: "[]",
      },
    });
    console.log("✓ Seeded initial SiteProfile");
  }

  // 3. Seed factual Projects if empty
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          slug: "shizuku-hub",
          title: "shizuku (雫) — Personal Hub & Ecosystem ID",
          category: "WEB",
          year: "2026",
          status: "ACTIVE",
          roleEn: "Creator & Full-Stack Engineer",
          roleId: "Pembuat & Full-Stack Engineer",
          summaryEn:
            "Personal web portal, portfolio, custom CMS, and central SHIZUKU ID authentication hub.",
          summaryId:
            "Portal web pribadi, portofolio, CMS mandiri, dan pusat autentikasi SHIZUKU ID.",
          descriptionEn:
            "Central portal and identity hub for the SHIZUKU ecosystem, built with Next.js App Router, Prisma, SQLite, and containerized Docker deployment.",
          descriptionId:
            "Portal utama dan pusat identitas untuk ekosistem SHIZUKU, dibangun dengan Next.js App Router, Prisma, SQLite, dan deploy kontainer Docker.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify([
            "Next.js",
            "TypeScript",
            "Prisma",
            "SQLite",
            "Tailwind CSS",
            "Docker",
          ]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "https://github.com/farhansatrian/shizuku",
          featured: true,
          published: true,
          sortOrder: 1,
        },
        {
          slug: "shikas-cashflow",
          title: "SHIKAS — Personal Cashflow Web App",
          category: "FINANCE",
          year: "2026",
          status: "ACTIVE",
          roleEn: "Creator & Full-Stack Engineer",
          roleId: "Pembuat & Full-Stack Engineer",
          summaryEn:
            "Personal cashflow tracker with IDR/USD support and per-user cloud sync via SHIZUKU ID.",
          summaryId:
            "Pencatat arus kas pribadi dengan dukungan IDR/USD dan sinkronisasi cloud per pengguna via SHIZUKU ID.",
          descriptionEn:
            "Personal cashflow web app connected to the SHIZUKU ecosystem backend with isolated per-user storage and real-time currency conversion.",
          descriptionId:
            "Aplikasi web arus kas pribadi yang terhubung ke backend ekosistem SHIZUKU dengan penyimpanan terisolasi per pengguna dan konversi mata uang.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify([
            "React",
            "TypeScript",
            "Vite",
            "Tailwind CSS",
          ]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "https://github.com/farhansatrian/shikas",
          featured: true,
          published: true,
          sortOrder: 2,
        },
        {
          slug: "shikost-ledger",
          title: "SHIKOST (KostKas) — Shared Finance Management",
          category: "FULLSTACK",
          year: "2026",
          status: "PRODUCTION",
          roleEn: "Creator & Full-Stack Engineer",
          roleId: "Pembuat & Full-Stack Engineer",
          summaryEn:
            "Shared boarding-house finance ledger for monthly dues, expenses, and reimbursements.",
          summaryId:
            "Sistem pencatatan kas bersama untuk iuran bulanan, pengeluaran, dan reimbursement kost.",
          descriptionEn:
            "Full-stack shared finance ledger built with Next.js, Prisma, and PostgreSQL, containerized for low-memory Alpine Linux VMs.",
          descriptionId:
            "Aplikasi buku besar kas bersama full-stack dengan Next.js, Prisma, dan PostgreSQL yang dioptimalkan untuk Alpine Linux VM hemat RAM.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify([
            "Next.js",
            "TypeScript",
            "Prisma",
            "PostgreSQL",
            "Docker",
          ]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "https://github.com/farhansatrian/kostkas",
          featured: true,
          published: true,
          sortOrder: 3,
        },
        {
          slug: "yanbuul-ulum-admission",
          title: "Yanbuul Ulum Student Admission",
          category: "WEB",
          year: "2025",
          status: "COMPLETED",
          roleEn: "Web Developer",
          roleId: "Web Developer",
          summaryEn:
            "Web-based student admission and registration portal for Pesantren Yanbuul Ulum.",
          summaryId:
            "Website pendaftaran santri baru untuk Pesantren Yanbuul Ulum.",
          descriptionEn:
            "Online admission portal built in TypeScript to streamline student registration workflows.",
          descriptionId:
            "Portal pendaftaran online berbasis TypeScript untuk mempermudah alur registrasi santri baru.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify(["TypeScript", "Web"]),
          coverImage: "",
          liveUrl: "",
          repoUrl:
            "https://github.com/farhansatrian/yanbuul-ulum-student-admission",
          featured: false,
          published: true,
          sortOrder: 4,
        },
        {
          slug: "student-learning-process-mining",
          title: "Student Learning Process Analysis (Process Mining & ML)",
          category: "DATA",
          year: "2026",
          status: "RESEARCH",
          roleEn: "Researcher & Developer",
          roleId: "Peneliti & Pengembang",
          summaryEn:
            "Process mining (Inductive Miner, Process Tree, Petri Net) and machine learning study of student learning behavior.",
          summaryId:
            "Analisis proses belajar mahasiswa menggunakan Process Mining (Inductive Miner, Process Tree, Petri Net) dan Machine Learning.",
          descriptionEn:
            "Explores student learning event logs using Inductive Miner (Process Tree and Petri Net) combined with machine learning models in Jupyter Notebook.",
          descriptionId:
            "Eksplorasi log aktivitas belajar mahasiswa menggunakan Inductive Miner (Process Tree dan Petri Net) dikombinasikan dengan model machine learning di Jupyter Notebook.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify([
            "Python",
            "Jupyter Notebook",
            "Process Mining",
            "Machine Learning",
          ]),
          coverImage: "",
          liveUrl: "",
          repoUrl:
            "https://github.com/farhansatrian/Analisis-Proses-Belajar-Mahasiswa-Menggunakan-PM-dan-ML",
          featured: false,
          published: true,
          sortOrder: 5,
        },
      ],
    });
    console.log("✓ Seeded 5 factual Projects");
  }

  // 4. Seed factual Experiences if empty
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    await prisma.experience.createMany({
      data: [
        {
          kind: "WORK",
          organization: "PT Bank Negara Indonesia (Persero) Tbk (BNI)",
          roleEn: "Officer Development Program (ODP) — Information Technology",
          roleId: "Officer Development Program (ODP) — Information Technology",
          location: "Jakarta, Indonesia",
          periodEn: "Present",
          periodId: "Saat ini",
          isCurrent: true,
          summaryEn:
            "Banking technology track in BNI Officer Development Program (IT).",
          summaryId:
            "Jalur teknologi informasi dalam Officer Development Program (ODP IT) BNI.",
          bulletsJson: JSON.stringify({ en: [], id: [] }),
          tagsJson: JSON.stringify(["Banking IT", "Software Engineering"]),
          published: true,
          sortOrder: 1,
        },
        {
          kind: "WORK",
          organization: "PT Tabel Data Informatika",
          roleEn: "Software Developer Intern (Java & Frontend Bootcamp)",
          roleId: "Software Developer Intern (Bootcamp Java & Frontend)",
          location: "Bandung, Indonesia",
          periodEn: "2023",
          periodId: "2023",
          isCurrent: false,
          summaryEn:
            "Completed Java backend and Angular frontend internship training and application projects.",
          summaryId:
            "Mengikuti bootcamp dan proyek magang pengembangan backend Java serta frontend Angular.",
          bulletsJson: JSON.stringify({ en: [], id: [] }),
          tagsJson: JSON.stringify(["Java", "Angular", "Web Development"]),
          published: true,
          sortOrder: 2,
        },
        {
          kind: "EDUCATION",
          organization: "Telkom University",
          roleEn:
            "Applied Software Engineering (Rekayasa Perangkat Lunak Aplikasi)",
          roleId: "Rekayasa Perangkat Lunak Aplikasi",
          location: "Bandung, Indonesia",
          periodEn: "Graduated",
          periodId: "Lulus",
          isCurrent: false,
          summaryEn:
            "Focused on software engineering, web & mobile development, databases, and applied computing.",
          summaryId:
            "Berfokus pada rekayasa perangkat lunak, pengembangan web & mobile, basis data, dan komputasi terapan.",
          bulletsJson: JSON.stringify({ en: [], id: [] }),
          tagsJson: JSON.stringify([
            "Software Engineering",
            "Web",
            "Mobile",
            "Databases",
          ]),
          published: true,
          sortOrder: 3,
        },
      ],
    });
    console.log("✓ Seeded 3 factual Experiences");
  }

  // 5. Seed factual SkillGroups if empty (Certificates intentionally left empty for manual upload in /admin)
  const skillCount = await prisma.skillGroup.count();
  if (skillCount === 0) {
    await prisma.skillGroup.createMany({
      data: [
        {
          nameEn: "Languages & Web",
          nameId: "Bahasa & Web",
          itemsJson: JSON.stringify([
            "TypeScript",
            "Java",
            "Kotlin",
            "Python",
            "Next.js",
            "React",
            "Tailwind CSS",
          ]),
          sortOrder: 1,
        },
        {
          nameEn: "Data & Infrastructure",
          nameId: "Data & Infrastruktur",
          itemsJson: JSON.stringify([
            "PostgreSQL",
            "SQLite",
            "Prisma ORM",
            "Docker",
            "Linux",
            "GitHub Actions",
          ]),
          sortOrder: 2,
        },
        {
          nameEn: "Data & Analysis",
          nameId: "Data & Analisis",
          itemsJson: JSON.stringify([
            "Process Mining",
            "Machine Learning",
            "Jupyter Notebook",
          ]),
          sortOrder: 3,
        },
      ],
    });
    console.log("✓ Seeded 3 factual SkillGroups");
  }

  // 6. Seed SHIZUKU Ecosystem Works if empty
  const appCount = await prisma.workspaceApp.count();
  if (appCount === 0) {
    await prisma.workspaceApp.createMany({
      data: [
        {
          name: "SHIZUKU",
          category: "INTERNAL",
          descriptionEn: "Profile, portfolio, and shared ecosystem ID hub.",
          descriptionId: "Profil, portofolio, dan pusat akun tunggal ekosistem.",
          url: "/",
          icon: "globe",
          badge: "HUB",
          isExternal: false,
          published: true,
          sortOrder: 1,
        },
        {
          name: "SHIKAS",
          category: "APP",
          descriptionEn: "Personal cashflow tracker synced with SHIZUKU ID.",
          descriptionId:
            "Pencatat arus kas pribadi terhubung dengan SHIZUKU ID.",
          url: "http://localhost:5173",
          icon: "wallet",
          badge: "FINANCE",
          isExternal: true,
          published: true,
          sortOrder: 2,
        },
        {
          name: "SHIKOST",
          category: "APP",
          descriptionEn:
            "Shared boarding-house ledger & dues (formerly KostKas).",
          descriptionId: "Kas bersama & iuran kost (sebelumnya KostKas).",
          url: "https://github.com/farhansatrian/kostkas",
          icon: "folder",
          badge: "LEDGER",
          isExternal: true,
          published: true,
          sortOrder: 3,
        },
      ],
    });
    console.log("✓ Seeded 3 initial SHIZUKU Ecosystem works");
  }

  console.log("✨ shizuku (雫) seed complete!");
}

main()
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
