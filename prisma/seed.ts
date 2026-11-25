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
          "Software engineer with a background in Informatics and Application Software Engineering, focused on backend and full-stack development. Experienced across web, mobile, and data-driven projects, continuously learning and building clean, reliable, and sustainable software solutions.",
        bioId:
          "Software engineer dengan latar belakang Informatika dan Rekayasa Perangkat Lunak Aplikasi yang berfokus pada pengembangan backend dan full-stack. Berpengalaman membangun aplikasi web, mobile, serta proyek berbasis data yang bersih, andal, dan berkelanjutan.",
        aboutStoryEn:
          "shizuku (雫) is a personal web hub and digital ecosystem.\n\nBuilt around calm minimalism, shizuku brings together personal works, portfolio records, and a shared SHIZUKU ID across companion web apps like SHIKAS and SHIKOST.",
        aboutStoryId:
          "shizuku (雫) adalah ruang web personal dan ekosistem digital.\n\nDibangun dengan gaya minimalis yang tenang, shizuku menyatukan karya ekosistem, catatan portofolio, dan satu SHIZUKU ID untuk aplikasi seperti SHIKAS dan SHIKOST.",
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
          title: "SHIZUKU (雫) — Personal Hub & Ecosystem ID",
          category: "WEB",
          year: "2026",
          status: "ACTIVE",
          roleEn: "Creator & Full-Stack Engineer",
          roleId: "Pembuat & Full-Stack Engineer",
          summaryEn:
            "Personal web portal, portfolio, custom CMS studio, and shared SHIZUKU ID authentication hub built with Next.js, TypeScript, Prisma, and SQLite.",
          summaryId:
            "Portal web pribadi, portofolio, CMS studio, dan pusat autentikasi SHIZUKU ID dibangun dengan Next.js, TypeScript, Prisma, dan SQLite.",
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
            "Personal cashflow tracker with IDR/USD support and per-user cloud sync via SHIZUKU ID, built with React and TypeScript.",
          summaryId:
            "Pencatat arus kas pribadi dengan dukungan IDR/USD dan sinkronisasi cloud per pengguna via SHIZUKU ID, dibangun dengan React dan TypeScript.",
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
            "Shared boarding-house finance ledger for monthly dues, expenses, and reimbursements built with Next.js, Prisma, and PostgreSQL.",
          summaryId:
            "Sistem pencatatan kas bersama untuk iuran bulanan, pengeluaran, dan reimbursement kost dibangun dengan Next.js, Prisma, dan PostgreSQL.",
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
          slug: "process-mining-learning-behavior",
          title: "Process Mining — Student Learning Behavior",
          category: "DATA",
          year: "2026",
          status: "RESEARCH",
          roleEn: "Researcher & Developer",
          roleId: "Peneliti & Pengembang",
          summaryEn:
            "Analyzed student learning behavior patterns from LMS data using Directly-Follows Graphs and Process Trees with Inductive Miner.",
          summaryId:
            "Menganalisis pola perilaku belajar mahasiswa dari data LMS menggunakan Directly-Follows Graphs dan Process Trees dengan Inductive Miner.",
          descriptionEn:
            "Explores student learning event logs from LMS data using Directly-Follows Graphs, Process Trees, and Petri Nets via Inductive Miner in Python and Jupyter Notebook.",
          descriptionId:
            "Eksplorasi log aktivitas belajar mahasiswa dari data LMS menggunakan Directly-Follows Graphs, Process Trees, dan Petri Nets dengan Inductive Miner di Python dan Jupyter Notebook.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify([
            "Python",
            "Process Mining",
            "Inductive Miner",
            "Jupyter Notebook",
          ]),
          coverImage: "",
          liveUrl: "",
          repoUrl:
            "https://github.com/farhansatrian/Analisis-Proses-Belajar-Mahasiswa-Menggunakan-PM-dan-ML",
          featured: false,
          published: true,
          sortOrder: 4,
        },
        {
          slug: "machine-learning-academic-performance",
          title: "Machine Learning — Student Academic Performance",
          category: "DATA",
          year: "2025",
          status: "COMPLETED",
          roleEn: "Researcher & Developer",
          roleId: "Peneliti & Pengembang",
          summaryEn:
            "Classified student academic performance using Logistic Regression and Random Forest.",
          summaryId:
            "Klasifikasi performa akademik mahasiswa menggunakan Logistic Regression dan Random Forest.",
          descriptionEn:
            "Built and evaluated supervised classification models (Logistic Regression and Random Forest) in Python to predict student academic performance.",
          descriptionId:
            "Membangun dan mengevaluasi model klasifikasi terawasi (Logistic Regression dan Random Forest) dengan Python untuk memprediksi performa akademik mahasiswa.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify([
            "Python",
            "Machine Learning",
            "Logistic Regression",
            "Random Forest",
          ]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "",
          featured: false,
          published: true,
          sortOrder: 5,
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
          sortOrder: 6,
        },
        {
          slug: "hasjrat-website",
          title: "Hasjrat Website",
          category: "FULLSTACK",
          year: "2024",
          status: "COMPLETED",
          roleEn: "Full-Stack Developer Intern",
          roleId: "Full-Stack Developer Intern",
          summaryEn:
            "Developed using Java Spring Boot and Angular with TypeScript, Bootstrap, and PostgreSQL.",
          summaryId:
            "Dikembangkan menggunakan Java Spring Boot dan Angular dengan TypeScript, Bootstrap, dan PostgreSQL.",
          descriptionEn:
            "Full-stack enterprise web application built during internship at PT. Tabel Data Informatika using Java Spring Boot microservices, Angular, TypeScript, and PostgreSQL.",
          descriptionId:
            "Aplikasi web full-stack yang dibangun saat magang di PT. Tabel Data Informatika menggunakan microservices Java Spring Boot, Angular, TypeScript, dan PostgreSQL.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify([
            "Java",
            "Spring Boot",
            "Angular",
            "TypeScript",
            "Bootstrap",
            "PostgreSQL",
          ]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "",
          featured: false,
          published: true,
          sortOrder: 7,
        },
        {
          slug: "kostanku-mobile",
          title: "Kostanku Mobile Application",
          category: "MOBILE",
          year: "2023",
          status: "COMPLETED",
          roleEn: "Android Developer",
          roleId: "Android Developer",
          summaryEn: "Developed using Kotlin.",
          summaryId: "Dikembangkan menggunakan Kotlin.",
          descriptionEn:
            "Android mobile application built with Kotlin for boarding-house discovery and management.",
          descriptionId:
            "Aplikasi mobile Android dibangun menggunakan Kotlin untuk pencarian dan pengelolaan kost.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify(["Kotlin", "Android"]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "",
          featured: false,
          published: true,
          sortOrder: 8,
        },
        {
          slug: "lavar-website",
          title: "Lavar Website",
          category: "WEB",
          year: "2022",
          status: "COMPLETED",
          roleEn: "Web Developer",
          roleId: "Web Developer",
          summaryEn: "Developed using Laravel and Tailwind CSS.",
          summaryId: "Dikembangkan menggunakan Laravel dan Tailwind CSS.",
          descriptionEn:
            "Web application built with Laravel and Tailwind CSS.",
          descriptionId:
            "Aplikasi web dibangun menggunakan Laravel dan Tailwind CSS.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify(["Laravel", "Tailwind CSS"]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "",
          featured: false,
          published: true,
          sortOrder: 9,
        },
        {
          slug: "clinz-desktop",
          title: "Clinz Desktop Application",
          category: "DESKTOP",
          year: "2022",
          status: "COMPLETED",
          roleEn: "Java Developer",
          roleId: "Java Developer",
          summaryEn: "Developed using Java.",
          summaryId: "Dikembangkan menggunakan Java.",
          descriptionEn: "Desktop application built with Java.",
          descriptionId: "Aplikasi desktop dibangun menggunakan Java.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify(["Java"]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "",
          featured: false,
          published: true,
          sortOrder: 10,
        },
        {
          slug: "noyuapp-mobile",
          title: "NoyuApp Mobile Application",
          category: "MOBILE",
          year: "2021",
          status: "COMPLETED",
          roleEn: "Android Developer",
          roleId: "Android Developer",
          summaryEn: "Developed using Kotlin.",
          summaryId: "Dikembangkan menggunakan Kotlin.",
          descriptionEn:
            "Android mobile application developed using Kotlin with the Android Division at Chevalier LAB, Telkom University.",
          descriptionId:
            "Aplikasi mobile Android dikembangkan menggunakan Kotlin bersama Divisi Android Chevalier LAB, Telkom University.",
          highlightsJson: "[]",
          impactMetricEn: "",
          impactMetricId: "",
          techStackJson: JSON.stringify(["Kotlin", "Android"]),
          coverImage: "",
          liveUrl: "",
          repoUrl: "",
          featured: false,
          published: true,
          sortOrder: 11,
        },
      ],
    });
    console.log("✓ Seeded 11 factual Projects");
  }

  // 4. Seed CV-aligned Experiences (Education, Work, Organization) if empty
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    await prisma.experience.createMany({
      data: [
        // Education
        {
          kind: "EDUCATION",
          organization: "Telkom University",
          roleEn: "Diploma (D3) in Application Software Engineering",
          roleId: "Diploma (D3) Rekayasa Perangkat Lunak Aplikasi",
          location: "Bandung, Indonesia",
          periodEn: "2024 | GPA: 3.89 / 4.0",
          periodId: "2024 | IPK: 3.89 / 4.0",
          isCurrent: false,
          summaryEn:
            "Relevant Coursework: Algorithms, Data Structures, Databases, Web Programming, Mobile Programming, OOP",
          summaryId:
            "Mata Kuliah Relevan: Algoritma, Struktur Data, Basis Data, Pemrograman Web, Pemrograman Mobile, OOP",
          bulletsJson: JSON.stringify({ en: [], id: [] }),
          tagsJson: JSON.stringify([]),
          published: true,
          sortOrder: 1,
        },
        {
          kind: "EDUCATION",
          organization: "Telkom University",
          roleEn: "Bachelor's Degree (S1) in Informatics",
          roleId: "Sarjana (S1) Informatika",
          location: "Bandung, Indonesia",
          periodEn: "2026 | GPA: 3.68 / 4.0",
          periodId: "2026 | IPK: 3.68 / 4.0",
          isCurrent: false,
          summaryEn: "Relevant Coursework: Machine Learning, Process Mining",
          summaryId: "Mata Kuliah Relevan: Machine Learning, Process Mining",
          bulletsJson: JSON.stringify({ en: [], id: [] }),
          tagsJson: JSON.stringify([]),
          published: true,
          sortOrder: 2,
        },

        // Work Experience
        {
          kind: "WORK",
          organization: "PT Bank Negara Indonesia (Persero) Tbk (BNI)",
          roleEn: "Officer Development Program (ODP) — IT",
          roleId: "Officer Development Program (ODP) — IT",
          location: "Jakarta, Indonesia",
          periodEn: "Present",
          periodId: "Saat ini",
          isCurrent: true,
          summaryEn:
            "Banking technology track in BNI's Officer Development Program (IT), focusing on software engineering and enterprise systems.",
          summaryId:
            "Jalur teknologi informasi pada Officer Development Program (ODP IT) BNI, berfokus pada rekayasa perangkat lunak dan sistem enterprise.",
          bulletsJson: JSON.stringify({ en: [], id: [] }),
          tagsJson: JSON.stringify([]),
          published: true,
          sortOrder: 3,
        },
        {
          kind: "WORK",
          organization: "PT. Tabel Data Informatika",
          roleEn: "Full-Stack Developer Intern",
          roleId: "Full-Stack Developer Intern",
          location: "Bandung, Indonesia",
          periodEn: "Jul 2023 - Jun 2024",
          periodId: "Jul 2023 - Jun 2024",
          isCurrent: false,
          summaryEn: "",
          summaryId: "",
          bulletsJson: JSON.stringify({
            en: [
              "Developed the Hasjrat application using Java Spring Boot for the backend and Angular, Bootstrap, and TypeScript for the frontend.",
              "Developed and integrated APIs with the user interface, connecting backend services to the frontend.",
              "Managed PostgreSQL databases and implemented CRUD operations for data management.",
              "Participated in application deployment using a microservices architecture.",
            ],
            id: [
              "Mengembangkan aplikasi Hasjrat menggunakan Java Spring Boot untuk backend serta Angular, Bootstrap, dan TypeScript untuk frontend.",
              "Mengembangkan dan mengintegrasikan API dengan antarmuka pengguna untuk menghubungkan layanan backend ke frontend.",
              "Mengelola basis data PostgreSQL dan mengimplementasikan operasi CRUD untuk manajemen data.",
              "Berpartisipasi dalam deployment aplikasi menggunakan arsitektur microservices.",
            ],
          }),
          tagsJson: JSON.stringify([]),
          published: true,
          sortOrder: 4,
        },

        // Organizational Experience
        {
          kind: "ORGANIZATION",
          organization: "Chevalier LAB - Telkom University",
          roleEn: "Android Division - Participant",
          roleId: "Divisi Android - Peserta",
          location: "Bandung, Indonesia",
          periodEn: "Sep 2021 - Aug 2022",
          periodId: "Sep 2021 - Agu 2022",
          isCurrent: false,
          summaryEn: "",
          summaryId: "",
          bulletsJson: JSON.stringify({
            en: [
              "Contributed to the development of the Noyu App Android application using Kotlin.",
              "Participated in study groups and discussions on Android fundamentals.",
              "Participated in laboratory events, including seminars and webinars.",
            ],
            id: [
              "Berkontribusi dalam pengembangan aplikasi Android Noyu App menggunakan Kotlin.",
              "Berpartisipasi dalam study group dan diskusi fundamental Android.",
              "Berpartisipasi dalam kegiatan laboratorium termasuk seminar dan webinar.",
            ],
          }),
          tagsJson: JSON.stringify([]),
          published: true,
          sortOrder: 5,
        },
        {
          kind: "ORGANIZATION",
          organization: "Chevalier LAB - Telkom University",
          roleEn: "Laboratory Assistant - Android Division Mentor",
          roleId: "Asisten Laboratorium - Mentor Divisi Android",
          location: "Bandung, Indonesia",
          periodEn: "Sep 2022 - Oct 2023",
          periodId: "Sep 2022 - Okt 2023",
          isCurrent: false,
          summaryEn: "",
          summaryId: "",
          bulletsJson: JSON.stringify({
            en: [
              "Coordinated Android Division study group activities.",
              "Created the syllabus and mentored participants in Android application development.",
              "Supported and took responsibility for various laboratory events.",
            ],
            id: [
              "Mengoordinasikan kegiatan study group Divisi Android.",
              "Menyusun silabus dan membimbing peserta dalam pengembangan aplikasi Android.",
              "Mendukung dan bertanggung jawab atas berbagai acara laboratorium.",
            ],
          }),
          tagsJson: JSON.stringify([]),
          published: true,
          sortOrder: 6,
        },
        {
          kind: "ORGANIZATION",
          organization: "Teaching Assistant - STMIK AMIK Bandung",
          roleEn: "Object-Oriented Programming (Java)",
          roleId: "Pemrograman Berorientasi Objek (Java)",
          location: "Bandung, Indonesia",
          periodEn: "Feb 2024 - Jul 2024",
          periodId: "Feb 2024 - Jul 2024",
          isCurrent: false,
          summaryEn: "",
          summaryId: "",
          bulletsJson: JSON.stringify({
            en: [
              "Led and guided students in completing their OOP final projects.",
              "Taught OOP concepts: Encapsulation, Abstraction, Inheritance, and Polymorphism.",
            ],
            id: [
              "Membimbing mahasiswa dalam menyelesaikan proyek akhir OOP.",
              "Mengajarkan konsep OOP: Encapsulation, Abstraction, Inheritance, dan Polymorphism.",
            ],
          }),
          tagsJson: JSON.stringify([]),
          published: true,
          sortOrder: 7,
        },
        {
          kind: "ORGANIZATION",
          organization: "Teaching Assistant - STMIK AMIK Bandung",
          roleEn: "Algorithms and Programming (Java)",
          roleId: "Algoritma dan Pemrograman (Java)",
          location: "Bandung, Indonesia",
          periodEn: "Jul 2024 - Jan 2025",
          periodId: "Jul 2024 - Jan 2025",
          isCurrent: false,
          summaryEn: "",
          summaryId: "",
          bulletsJson: JSON.stringify({
            en: [
              "Facilitated discussions and practical sessions on Java fundamentals.",
              "Taught Java fundamentals: Control Flow, Loops, Methods, and Arrays.",
            ],
            id: [
              "Memfasilitasi diskusi dan sesi praktikum fundamental Java.",
              "Mengajarkan dasar Java: Control Flow, Loops, Methods, dan Arrays.",
            ],
          }),
          tagsJson: JSON.stringify([]),
          published: true,
          sortOrder: 8,
        },
      ],
    });
    console.log("✓ Seeded 8 CV-aligned Experiences");
  }

  // 5. Seed CV-aligned SkillGroups if empty (Certificates intentionally left empty for manual upload in /admin)
  const skillCount = await prisma.skillGroup.count();
  if (skillCount === 0) {
    await prisma.skillGroup.createMany({
      data: [
        {
          nameEn: "Programming Languages",
          nameId: "Bahasa Pemrograman",
          itemsJson: JSON.stringify([
            "Python",
            "TypeScript",
            "JavaScript",
            "Java",
            "Kotlin",
          ]),
          sortOrder: 1,
        },
        {
          nameEn: "Web Technologies",
          nameId: "Teknologi Web",
          itemsJson: JSON.stringify([
            "HTML",
            "CSS",
            "Next.js",
            "React",
            "Angular",
            "Laravel",
            "Tailwind CSS",
            "Bootstrap",
            "Spring Boot",
            "PostgreSQL",
            "SQLite",
            "Prisma ORM",
          ]),
          sortOrder: 2,
        },
        {
          nameEn: "Tools",
          nameId: "Alat & Infrastruktur",
          itemsJson: JSON.stringify([
            "VS Code",
            "Postman",
            "Git",
            "Docker",
            "SSMS",
          ]),
          sortOrder: 3,
        },
      ],
    });
    console.log("✓ Seeded 3 CV-aligned SkillGroups");
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
