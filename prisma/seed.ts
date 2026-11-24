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
          "Quiet engineering for banking systems, applied AI, and calm web software.",
        headlineId:
          "Rekayasa tenang untuk sistem perbankan, AI terapan, dan perangkat lunak web yang berkesan.",
        rolesJson: JSON.stringify({
          en: [
            "Software Engineer",
            "ODP IT · Banking Systems",
            "Business & AI Enthusiast",
            "Personal Digital Hub",
          ],
          id: [
            "Software Engineer",
            "ODP IT · Sistem Perbankan",
            "Penggiat Bisnis & AI",
            "Personal Digital Hub",
          ],
        }),
        bioEn:
          "Software Engineer currently in the Officer Development Program (ODP IT) at Bank Negara Indonesia (BNI). I enjoy bridging resilient backend engineering, banking business value, and applied AI inside clean, human-friendly digital systems.",
        bioId:
          "Software Engineer yang saat ini menjalani Officer Development Program (ODP IT) di Bank Negara Indonesia (BNI). Fokus menjembatani rekayasa sistem yang tangguh, dampak bisnis perbankan, dan AI terapan dalam antarmuka digital yang bersih dan nyaman.",
        aboutStoryEn:
          "Welcome to shizuku (雫) — my personal digital hub and rainy-day workspace on the internet.\n\nBy day, I work in banking technology through BNI's Officer Development Program (ODP IT), learning how mission-critical financial systems balance reliability, governance, and real customer impact. Outside core engineering, I love exploring applied AI workflows, building self-hosted web tools, and crafting interfaces that feel serene and thoughtful rather than noisy.\n\nEverything you see here — from projects and career milestones to certificates — is powered by my own lightweight CMS so this space can continuously grow alongside my work.",
        aboutStoryId:
          "Selamat datang di shizuku (雫) — ruang kerja digital pribadi dan portofolio bernuansa hujan milik saya di internet.\n\nSehari-hari saya berkarya di dunia teknologi perbankan melalui Officer Development Program (ODP IT) di Bank Negara Indonesia (BNI), mempelajari bagaimana sistem finansial berskala besar menjaga keandalan, tata kelola, dan nilai nyata bagi nasabah. Di luar pekerjaan inti, saya gemar mengeksplorasi otomasi AI terapan, membangun aplikasi web self-hosted, serta merancang antarmuka yang tenang dan menyenangkan.\n\nSeluruh konten di sini — mulai dari proyek, perjalanan karier, hingga sertifikat — dikelola langsung lewat CMS ringan buatan sendiri agar ruang ini terus tumbuh seiring karya saya.",
        location: "Jakarta, Indonesia",
        currentRoleEn: "Officer Development Program (ODP) — IT",
        currentRoleId: "Officer Development Program (ODP) — IT",
        currentOrg: "PT Bank Negara Indonesia (Persero) Tbk",
        availabilityEn: "Open for Tech & AI Discussions",
        availabilityId: "Terbuka untuk Diskusi Tech & AI",
        currentlyEn:
          "Deep-diving into enterprise banking architecture, applied LLM workflows, and self-hosting clean web systems on lean Alpine VMs.",
        currentlyId:
          "Mendalami arsitektur perbankan skala enterprise, alur kerja LLM terapan, dan self-hosting sistem web ringan di Alpine VM.",
        heroImage: "",
        heroImageMobile: "",
        avatarImage: "",
        email: "farhansatria.07@gmail.com",
        linkedinUrl: "https://www.linkedin.com/in/farhansatrian/",
        githubUrl: "https://github.com/farhansatrian",
        instagramUrl: "https://www.instagram.com/farhansatria_n/",
        youtubeUrl: "https://www.youtube.com/@ahansn",
        resumeUrl: "",
        statsJson: JSON.stringify([
          {
            value: "ODP IT",
            labelEn: "Bank Negara Indonesia",
            labelId: "Bank Negara Indonesia",
          },
          {
            value: "4+",
            labelEn: "Shipped Systems",
            labelId: "Sistem Terbangun",
          },
          {
            value: "AI × Fin",
            labelEn: "Core Curiosity",
            labelId: "Fokus Eksplorasi",
          },
        ]),
        pillarsJson: JSON.stringify([
          {
            code: "01",
            titleEn: "Banking-Grade Reliability",
            titleId: "Keandalan Standar Perbankan",
            descEn:
              "Designing auditable, well-structured software with clear data invariants, clean authentication, and calm operational footprints.",
            descId:
              "Merancang perangkat lunak terstruktur dengan integritas data jelas, autentikasi aman, dan operasional yang rapi serta mudah dirawat.",
          },
          {
            code: "02",
            titleEn: "Applied AI & Automation",
            titleId: "AI Terapan & Otomasi",
            descEn:
              "Turning LLMs and structured workflows into practical tools that cut repetitive analysis and accelerate everyday decision-making.",
            descId:
              "Mengubah LLM dan alur kerja terstruktur menjadi alat praktis yang memangkas analisis berulang dan mempercepat pengambilan keputusan.",
          },
          {
            code: "03",
            titleEn: "Business-Aware Engineering",
            titleId: "Engineering Berdampak Bisnis",
            descEn:
              "Translating banking and operational pain points into intuitive products where technical elegance directly serves people.",
            descId:
              "Menerjemahkan kebutuhan bisnis dan operasional perbankan menjadi produk intuitif di mana kualitas teknis langsung memberi dampak.",
          },
        ]),
      },
    });
    console.log("✓ Seeded initial SiteProfile");
  }

  // 3. Seed Projects if empty
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          slug: "kostkas-ledger",
          title: "KostKas — Shared Finance Ledger",
          category: "FULLSTACK",
          year: "2026",
          status: "PRODUCTION",
          roleEn: "Creator & Full-Stack Engineer",
          roleId: "Pembuat & Full-Stack Engineer",
          summaryEn:
            "Double-checked community treasury & expense reimbursement engine with audit logs, monthly budgets, and containerized Alpine VM deployment.",
          summaryId:
            "Sistem buku besar kas bersama, iuran bulanan, dan reimbursement dengan jejak audit, anggaran bulanan, serta deploy kontainer di Alpine VM.",
          descriptionEn:
            "KostKas was built to bring banking-grade financial clarity to shared living expenses. Instead of error-prone spreadsheets, every contribution charge, partial payment allocation, direct expense, and member reimbursement flows through an explicit Cash Movement ledger with idempotency keys and audit trails.\n\nArchitected for a resource-constrained 1 GB RAM Alpine VM using multi-stage Docker builds, GHCR image publishing, and strict server-side validation.",
          descriptionId:
            "KostKas dibangun untuk menghadirkan kejernihan finansial ala sistem perbankan pada pengelolaan kas bersama. Setiap tagihan iuran, alokasi pembayaran parsial, pengeluaran langsung, dan reimbursement tercatat melalui buku besar Cash Movement lengkap dengan idempotency key dan audit log.\n\nDirancang khusus agar berjalan efisien di Alpine VM 1 GB RAM menggunakan multi-stage Docker build, publikasi image GHCR, dan validasi server yang ketat.",
          highlightsJson: JSON.stringify([
            {
              code: "01",
              titleEn: "Ledger-First Accounting Model",
              titleId: "Model Akuntansi Berbasis Buku Besar",
              detailEn:
                "Separates charges, payment confirmations, reimbursement obligations, and actual cash movements so balances remain reconcilable at any point in time.",
              detailId:
                "Memisahkan tagihan, konfirmasi pembayaran, kewajiban reimbursement, dan mutasi kas aktual agar saldo selalu dapat direkonsiliasi.",
            },
            {
              code: "02",
              titleEn: "Server-Side Sessions & Audit Trail",
              titleId: "Sesi Server-Side & Jejak Audit",
              detailEn:
                "Implements revocable database-backed sessions, bcrypt hashing, idempotency protection, and structured audit logs for every mutation.",
              detailId:
                "Menerapkan sesi tervalidasi database yang dapat dicabut, hashing bcrypt, proteksi idempotency, dan catatan audit terstruktur.",
            },
            {
              code: "03",
              titleEn: "Lean Alpine VM Production Stack",
              titleId: "Stack Produksi Ringan di Alpine VM",
              detailEn:
                "Prebuilt multi-stage Docker images via GitHub Actions keep deployment predictable without compiling on low-memory servers.",
              detailId:
                "Image Docker prebuilt lewat GitHub Actions membuat proses deploy konsisten tanpa membebani RAM server saat kompilasi.",
            },
          ]),
          impactMetricEn: "Zero manual reconciliation errors · <1 GB VM footprint",
          impactMetricId: "Nol salah hitung kas · Ringan di VM <1 GB RAM",
          techStackJson: JSON.stringify([
            "Next.js 16",
            "TypeScript",
            "Prisma",
            "PostgreSQL",
            "Tailwind CSS",
            "Docker",
            "GHCR",
          ]),
          coverImage: "/assets/cover-platform.jpg",
          liveUrl: "",
          repoUrl: "https://github.com/farhansatrian/kostkas",
          featured: true,
          published: true,
          sortOrder: 1,
        },
        {
          slug: "banking-workflow-architecture",
          title: "Digital Banking Process & API Architecture",
          category: "BANKING",
          year: "2025",
          status: "INTERNAL",
          roleEn: "ODP IT · Software & Solutions Engineer",
          roleId: "ODP IT · Software & Solutions Engineer",
          summaryEn:
            "Enterprise banking initiative bridging business analysis, resilient service design, and automated operational visibility across internal workflows.",
          summaryId:
            "Inisiatif teknologi perbankan yang menjembatani analisis bisnis, desain layanan backend tangguh, dan visibilitas operasional otomatis.",
          descriptionEn:
            "Part of hands-on banking technology rotations focusing on how high-trust financial institutions translate business requirements into maintainable software architecture.\n\nCovered structured requirement mapping, API contract design, operational risk controls, and clear stakeholder communication between business units and engineering squads.",
          descriptionId:
            "Bagian dari proyek teknologi perbankan yang berfokus pada bagaimana institusi finansial menerjemahkan kebutuhan bisnis menjadi arsitektur perangkat lunak yang andal dan mudah dirawat.\n\nMencakup pemetaan kebutuhan bisnis, desain kontrak API, kontrol risiko operasional, serta kolaborasi lintas unit bisnis dan tim engineering.",
          highlightsJson: JSON.stringify([
            {
              code: "01",
              titleEn: "Business-to-Tech Alignment",
              titleId: "Penyelarasan Bisnis ke Teknis",
              detailEn:
                "Translated banking operational bottlenecks into clear functional specs, sequence flows, and measurable KPIs before writing code.",
              detailId:
                "Menerjemahkan hambatan operasional perbankan menjadi spesifikasi fungsional, alur sekuens, dan KPI terukur sebelum tahap implementasi.",
            },
            {
              code: "02",
              titleEn: "Security & Audit Readiness",
              titleId: "Kesiapan Keamanan & Audit",
              detailEn:
                "Embedded strict input validation, role boundaries, and structured activity trails aligned with enterprise banking governance.",
              detailId:
                "Menanamkan validasi input ketat, batas hak akses, dan pencatatan aktivitas terstruktur sesuai tata kelola perbankan.",
            },
          ]),
          impactMetricEn: "Enterprise Governance · Cross-Functional Delivery",
          impactMetricId: "Tata Kelola Enterprise · Kolaborasi Lintas Divisi",
          techStackJson: JSON.stringify([
            "System Design",
            "REST API",
            "SQL",
            "Business Analysis",
            "Security Controls",
          ]),
          coverImage: "/assets/cover-banking.jpg",
          liveUrl: "",
          repoUrl: "",
          featured: true,
          published: true,
          sortOrder: 2,
        },
        {
          slug: "applied-ai-workflow-lab",
          title: "Applied AI Document & Insight Copilot",
          category: "AI",
          year: "2026",
          status: "PROTOTYPE",
          roleEn: "AI Workflow Builder",
          roleId: "Pengembang Alur Kerja AI",
          summaryEn:
            "Experimental AI workspace for structuring long technical/business documents into crisp executive briefs, checklists, and searchable knowledge.",
          summaryId:
            "Ruang kerja AI eksperimental untuk mengolah dokumen teknis dan bisnis panjang menjadi ringkasan eksekutif, checklist, dan pengetahuan terstruktur.",
          descriptionEn:
            "Built out of curiosity for making Generative AI genuinely useful in daily analytical and engineering work rather than just chat demos.\n\nFocuses on deterministic JSON output schemas, prompt evaluation templates, and human-in-the-loop review panels so business users stay in full control of generated insights.",
          descriptionId:
            "Dibangun dari ketertarikan menjadikan Generative AI benar-benar berguna untuk pekerjaan analitis dan engineering harian, bukan sekadar demo chat.\n\nBerfokus pada skema output JSON terstruktur, template evaluasi prompt, serta panel tinjauan manusia agar pengguna bisnis tetap memegang kendali penuh.",
          highlightsJson: JSON.stringify([
            {
              code: "01",
              titleEn: "Structured Schema Extraction",
              titleId: "Ekstraksi Skema Terstruktur",
              detailEn:
                "Validates LLM outputs with Zod schemas so downstream dashboards and workflows receive predictable structured data.",
              detailId:
                "Memvalidasi output LLM menggunakan skema Zod agar dashboard dan alur kerja menerima data terstruktur yang konsisten.",
            },
            {
              code: "02",
              titleEn: "Human-in-the-Loop Verification",
              titleId: "Verifikasi Human-in-the-Loop",
              detailEn:
                "Highlights source citations and confidence notes so analysts can verify every generated point in seconds.",
              detailId:
                "Menampilkan rujukan sumber dan catatan ringkas agar analis dapat memverifikasi setiap poin dalam hitungan detik.",
            },
          ]),
          impactMetricEn: "Structured LLM Pipelines · Rapid Brief Generation",
          impactMetricId: "Pipeline LLM Terstruktur · Ringkasan Cepat",
          techStackJson: JSON.stringify([
            "TypeScript",
            "Next.js",
            "LLM APIs",
            "Zod",
            "Prompt Engineering",
          ]),
          coverImage: "/assets/cover-ai.jpg",
          liveUrl: "",
          repoUrl: "https://github.com/farhansatrian",
          featured: true,
          published: true,
          sortOrder: 3,
        },
        {
          slug: "shizuku-digital-hub",
          title: "shizuku (雫) — Personal Hub & Pastel CMS",
          category: "PERSONAL",
          year: "2026",
          status: "LIVE",
          roleEn: "Designer & Full-Stack Engineer",
          roleId: "Desainer & Full-Stack Engineer",
          summaryEn:
            "A rainy-cozy anime minimalist digital hub inspired by Japanese editorial web design, featuring a live bilingual Admin CMS and single-container SQLite VM stack.",
          summaryId:
            "Personal digital hub bernuansa anime hujan minimalis terinspirasi desain web editorial Jepang, dilengkapi Admin CMS bilingual live dan stack 1-container SQLite untuk VM.",
          descriptionEn:
            "shizuku combines serene pastel watercolor artistry with crisp modern frontend engineering. Designed to evolve beyond a static portfolio into a flexible personal home where new projects, career milestones, and certificates can be published visually from an interactive Admin CMS.\n\nRuns inside a single lightweight Docker container using SQLite in WAL mode and persistent volume uploads — consuming a fraction of the RAM of traditional multi-container stacks.",
          descriptionId:
            "shizuku memadukan estetika watercolor pastel yang tenang dengan rekayasa frontend modern. Dirancang melampaui portofolio statis menjadi rumah digital fleksibel tempat proyek, karier, dan sertifikat dapat dipublikasikan secara visual dari Admin CMS interaktif.\n\nBerjalan dalam satu kontainer Docker ringan menggunakan SQLite mode WAL dan volume upload persisten — jauh lebih hemat RAM dibanding arsitektur multi-kontainer.",
          highlightsJson: JSON.stringify([
            {
              code: "01",
              titleEn: "Single-Container SQLite Architecture",
              titleId: "Arsitektur 1-Container SQLite",
              detailEn:
                "Combines Next.js standalone runtime, SQLite WAL database, and persistent media uploads inside a single ~200 MB RAM container.",
              detailId:
                "Menyatukan runtime Next.js standalone, database SQLite WAL, dan penyimpanan upload persisten dalam 1 kontainer ~200 MB RAM.",
            },
            {
              code: "02",
              titleEn: "Bilingual Live Admin CMS",
              titleId: "Admin CMS Bilingual Live",
              detailEn:
                "Manage EN/ID copy, projects, experiences, certificates, and skills visually with instant cache revalidation.",
              detailId:
                "Kelola konten EN/ID, proyek, pengalaman, sertifikat, dan skill secara visual dengan pembaruan halaman instan.",
            },
          ]),
          impactMetricEn: "1-Container Deploy · Instant EN/ID Sync",
          impactMetricId: "Deploy 1 Kontainer · Sinkronisasi EN/ID Instan",
          techStackJson: JSON.stringify([
            "Next.js",
            "React 19",
            "Tailwind CSS v4",
            "Framer Motion",
            "Prisma",
            "SQLite WAL",
          ]),
          coverImage: "/assets/hero-rainy-anime.jpg",
          liveUrl: "",
          repoUrl: "https://github.com/farhansatrian/shizuku",
          featured: false,
          published: true,
          sortOrder: 4,
        },
      ],
    });
    console.log("✓ Seeded 4 initial projects");
  }

  // 4. Seed Experiences if empty
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    await prisma.experience.createMany({
      data: [
        {
          kind: "WORK",
          organization: "PT Bank Negara Indonesia (Persero) Tbk (BNI)",
          roleEn: "Officer Development Program (ODP) — Information Technology",
          roleId: "Officer Development Program (ODP) — Teknologi Informasi",
          location: "Jakarta, Indonesia",
          periodEn: "Present",
          periodId: "Sekarang",
          isCurrent: true,
          summaryEn:
            "Accelerated banking technology leadership & engineering track focused on enterprise IT delivery, banking domain mastery, and digital innovation.",
          summaryId:
            "Program akselerasi talenta teknologi perbankan yang berfokus pada pengembangan sistem IT enterprise, pemahaman bisnis perbankan, dan inovasi digital.",
          bulletsJson: JSON.stringify({
            en: [
              "Building and evaluating scalable software solutions aligned with banking security, governance, and reliability standards.",
              "Collaborating across business and technology teams to translate financial workflows into clean technical specifications.",
              "Exploring applied AI and workflow automation opportunities to improve analytical speed and operational precision.",
            ],
            id: [
              "Membangun dan mengevaluasi solusi perangkat lunak yang selaras dengan standar keamanan, tata kelola, dan keandalan perbankan.",
              "Berkolaborasi lintas tim bisnis dan teknologi untuk menerjemahkan proses finansial menjadi spesifikasi teknis yang terstruktur.",
              "Mengeksplorasi peluang AI terapan dan otomasi alur kerja untuk mempercepat analisis serta meningkatkan ketepatan operasional.",
            ],
          }),
          tagsJson: JSON.stringify([
            "Banking IT",
            "Software Engineering",
            "Business Analysis",
            "Applied AI",
          ]),
          published: true,
          sortOrder: 1,
        },
        {
          kind: "WORK",
          organization: "PT Tabel Data Informatika",
          roleEn: "Web Application Developer",
          roleId: "Pengembang Aplikasi Web",
          location: "Bandung, Indonesia",
          periodEn: "Project Experience",
          periodId: "Pengalaman Proyek",
          isCurrent: false,
          summaryEn:
            "Developed and implemented enterprise automotive catalog & business web features (Hasjrat application), optimizing relational database queries and usability.",
          summaryId:
            "Mengembangkan dan mengimplementasikan aplikasi web bisnis & katalog otomotif (aplikasi Hasjrat) dengan optimasi basis data relasional dan pengalaman pengguna.",
          bulletsJson: JSON.stringify({
            en: [
              "Implemented end-to-end web application modules and structured database schemas for automotive business operations.",
              "Improved catalog responsiveness and maintainability through modular OOP architecture and clean query design.",
            ],
            id: [
              "Mengimplementasikan modul aplikasi web end-to-end serta skema basis data terstruktur untuk operasional bisnis otomotif.",
              "Meningkatkan responsivitas katalog dan kemudahan perawatan melalui arsitektur OOP modular serta desain query yang bersih.",
            ],
          }),
          tagsJson: JSON.stringify([
            "Web Development",
            "Database Systems",
            "OOP",
            "Client Delivery",
          ]),
          published: true,
          sortOrder: 2,
        },
        {
          kind: "EDUCATION",
          organization: "Telkom University",
          roleEn: "Applied Software Engineering (Rekayasa Perangkat Lunak Aplikasi)",
          roleId: "D3 Rekayasa Perangkat Lunak Aplikasi",
          location: "Bandung, Indonesia",
          periodEn: "Graduated",
          periodId: "Lulus",
          isCurrent: false,
          summaryEn:
            "Grounded in practical software engineering fundamentals: web & mobile programming, object-oriented design, database architecture, and real-world client projects.",
          summaryId:
            "Fondasi kuat dalam rekayasa perangkat lunak terapan: pemrograman web & mobile, desain berorientasi objek, arsitektur basis data, dan proyek industri nyata.",
          bulletsJson: JSON.stringify({
            en: [
              "Completed final project partnering with industry on web system implementation and database optimization.",
              "Built strong fundamentals in software architecture, collaborative Git workflows, and UI craftsmanship.",
            ],
            id: [
              "Menyelesaikan proyek akhir bermitra dengan industri pada implementasi sistem web dan optimasi basis data.",
              "Membangun fondasi kuat dalam arsitektur perangkat lunak, kolaborasi Git, serta perancangan antarmuka.",
            ],
          }),
          tagsJson: JSON.stringify([
            "Software Engineering",
            "Web Programming",
            "Databases",
            "OOP",
          ]),
          published: true,
          sortOrder: 3,
        },
      ],
    });
    console.log("✓ Seeded 3 initial experiences");
  }

  // 5. Seed Certificates if empty
  const certCount = await prisma.certificate.count();
  if (certCount === 0) {
    await prisma.certificate.createMany({
      data: [
        {
          titleEn: "Banking Technology & Digital Innovation Foundations",
          titleId: "Fondasi Teknologi Perbankan & Inovasi Digital",
          issuer: "BNI Corporate University",
          category: "BANKING & LEADERSHIP",
          issuedDate: "2025",
          credentialId: "Edit via /admin",
          credentialUrl: "",
          imageUrl: "",
          featured: true,
          published: true,
          sortOrder: 1,
        },
        {
          titleEn: "Modern Full-Stack Web Engineering & Relational Databases",
          titleId: "Rekayasa Web Full-Stack Modern & Basis Data Relasional",
          issuer: "Software Engineering Certification",
          category: "SOFTWARE ENG",
          issuedDate: "2025",
          credentialId: "Edit via /admin",
          credentialUrl: "",
          imageUrl: "",
          featured: true,
          published: true,
          sortOrder: 2,
        },
        {
          titleEn: "Applied Generative AI & Practical Automation Workflows",
          titleId: "Generative AI Terapan & Alur Otomasi Praktis",
          issuer: "AI Practitioner Track",
          category: "AI & DATA",
          issuedDate: "2026",
          credentialId: "Edit via /admin",
          credentialUrl: "",
          imageUrl: "",
          featured: true,
          published: true,
          sortOrder: 3,
        },
      ],
    });
    console.log("✓ Seeded 3 initial certificates");
  }

  // 6. Seed SkillGroups if empty
  const skillCount = await prisma.skillGroup.count();
  if (skillCount === 0) {
    await prisma.skillGroup.createMany({
      data: [
        {
          nameEn: "Engineering & Web",
          nameId: "Engineering & Web",
          itemsJson: JSON.stringify([
            "TypeScript",
            "Next.js",
            "React",
            "Node.js",
            "Tailwind CSS",
            "REST APIs",
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
            "Linux / Alpine VM",
            "GitHub Actions",
          ]),
          sortOrder: 2,
        },
        {
          nameEn: "Banking & Business",
          nameId: "Perbankan & Bisnis",
          itemsJson: JSON.stringify([
            "System Architecture",
            "Business Analysis",
            "Banking Workflows",
            "Audit & Governance",
            "Product Thinking",
          ]),
          sortOrder: 3,
        },
        {
          nameEn: "AI & Automation",
          nameId: "AI & Otomasi",
          itemsJson: JSON.stringify([
            "LLM Integration",
            "Prompt Engineering",
            "Structured Outputs",
            "Workflow Automation",
            "AI Prototyping",
          ]),
          sortOrder: 4,
        },
      ],
    });
    console.log("✓ Seeded 4 initial skill groups");
  }

  // 7. Seed Daily-Drive WorkspaceApps if empty
  const appCount = await prisma.workspaceApp.count();
  if (appCount === 0) {
    await prisma.workspaceApp.createMany({
      data: [
        {
          name: "Agent Workspace",
          category: "AGENT",
          descriptionEn:
            "Planned daily AI agent hub, task runners, and personal automations.",
          descriptionId:
            "Rencana ruang kerja AI agent harian, otomasi tugas, dan asisten pribadi.",
          url: "/workspace",
          icon: "bot",
          badge: "PLANNED",
          isExternal: false,
          published: true,
          sortOrder: 1,
        },
        {
          name: "KostKas",
          category: "APP",
          descriptionEn:
            "Shared finance ledger, monthly dues, and expense tracking.",
          descriptionId:
            "Buku besar kas bersama, iuran bulanan, dan pencatatan pengeluaran.",
          url: "https://github.com/farhansatrian/kostkas",
          icon: "wallet",
          badge: "APP",
          isExternal: true,
          published: true,
          sortOrder: 2,
        },
        {
          name: "Projects & Specs",
          category: "INTERNAL",
          descriptionEn:
            "Selected banking IT, applied AI, and full-stack engineering works.",
          descriptionId:
            "Pilihan karya IT perbankan, AI terapan, dan software engineering.",
          url: "/projects",
          icon: "folder",
          badge: "WORKS",
          isExternal: false,
          published: true,
          sortOrder: 3,
        },
        {
          name: "Profile & Journey",
          category: "INTERNAL",
          descriptionEn:
            "About Farhan Satria Nugraha, ODP IT BNI journey, and toolkit.",
          descriptionId:
            "Tentang Farhan Satria Nugraha, perjalanan ODP IT BNI, dan keahlian.",
          url: "/about",
          icon: "user",
          badge: "INFO",
          isExternal: false,
          published: true,
          sortOrder: 4,
        },
        {
          name: "Certificates Vault",
          category: "INTERNAL",
          descriptionEn:
            "Verified certifications, awards, and credential archive.",
          descriptionId:
            "Arsip sertifikasi, penghargaan, dan kredensial terverifikasi.",
          url: "/certificates",
          icon: "award",
          badge: "VAULT",
          isExternal: false,
          published: true,
          sortOrder: 5,
        },
        {
          name: "Admin Studio",
          category: "INTERNAL",
          descriptionEn:
            "Manage hero artwork, daily workspace apps, projects, and profile.",
          descriptionId:
            "Kelola ilustrasi hero, aplikasi harian, proyek, dan profil live.",
          url: "/admin",
          icon: "settings",
          badge: "CMS",
          isExternal: false,
          published: true,
          sortOrder: 6,
        },
      ],
    });
    console.log("✓ Seeded 6 initial WorkspaceApps");
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
