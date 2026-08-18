# 🏥 MediCare — Modern Patient Management Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

<p align="center">
  A state-of-the-art, glassmorphic Patient Management System (PMS) built with Next.js 16 App Router, React 19, and interactive 3D visual experiences. Streamline clinic intake, doctor schedules, and encrypted diagnostic records in one unified platform.
</p>

[**Explore Live Demo**](#getting-started) • [**Key Features**](#-key-features) • [**Architecture**](#-project-structure) • [**Getting Started**](#-getting-started)

</div>

---

## 🌟 Executive Overview

**MediCare** is engineered to replace fragmented hospital and clinic workflows with a unified, high-performance mission control. Designed with deep cosmic tones, glassmorphism, fluid interactive physics, and instant-response state management, MediCare provides clinicians and medical administrators with seamless patient management without cognitive fatigue.

---

## ✨ Key Features

### 🚀 1. Cinematic 3D Landing Page
- **Full-Screen 3D Looping Canvas**: Integrated high-definition 3D video hero background with smooth fade-in and depth vignette shading.
- **Synced Dot Navigation**: A 5-point fixed floating glass capsule (`Home`, `About`, `Designers`, `Features`, `News`) that tracks viewport scroll in real-time via `IntersectionObserver`.
- **Fluid Interactive Water Wake**: Hardware-accelerated canvas ripple effect that generates refractive liquid wave crests on cursor movement and clicks with smooth cubic decay.

### 👥 2. Patient Directory & Registry
- **Comprehensive Demographic Profiling**: First/Last names, age, gender, contact phone, email, full address, and blood group categorization (`A+`, `O-`, `AB+`, etc.).
- **Real-Time Multi-Field Search**: Instant client-side filtering across names, contact details, and emails.
- **Full CRUD Management**: Modal-driven creation, inline updates, and safety-prompted deletion.
- **Smart Pagination**: Smooth page navigation handling large patient batches.

### 📅 3. Smart Appointment Engine
- **Multi-Department & Doctor Scheduling**: Slot allocation for Cardiology, Dermatology, Orthopedics, Neurology, Pediatrics, General Medicine, and ENT.
- **One-Click Status Workflow**: Transition appointments seamlessly across `Scheduled`, `Completed`, and `Cancelled` states with color-coded badges.
- **Date & Category Filtering**: Filter appointments by status counts (`All`, `Scheduled`, `Completed`, `Cancelled`) alongside global keyword search.
- **Conflict Prevention**: Built-in validation for appointment timestamps and practitioner availability.

### 📋 4. Clinical Records & Rx Vault
- **Structured Diagnosis & Prescriptions**: Record clinical observations, diagnostic findings, prescriptions, and dosage instructions.
- **Detailed Clinical Modal View**: Expand any patient's diagnostic record in one click to view doctor observations, timestamps, and medication history.
- **Secure Persistence**: Integrated client-side local storage engine initialized with realistic healthcare seed data.

### 📊 5. Practice Analytics Dashboard
- **Real-Time Clinical Metrics**: Live overview of Total Registered Patients, Today's Scheduled Visits, Pending Consultations, and Medical Records.
- **Recent Patient Intake Feed**: Quick-access table showing recently registered patients.
- **Daily Appointments Digest**: Upcoming consultation queue with doctor tags and visit status indicators.
- **Instant Quick-Action Shortcuts**: Fast navigation to add patients, schedule consults, or log prescriptions.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16.3.0](https://nextjs.org/) (App Router & Turbopack) | High-speed React framework with optimized SSR/Client rendering |
| **UI Library** | [React 19.2.8](https://react.dev/) | Component architecture & modern state primitives |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end static typing and robust schema enforcement |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Modules | Modern utility styling combined with scoped component animation sheets |
| **Components** | [DaisyUI v5](https://daisyui.com/) | Accessible UI primitives and theme foundation |
| **Forms** | [@tanstack/react-form](https://tanstack.com/form) | Performant, type-safe form validation and state management |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG iconography |
| **Animation & FX** | HTML5 Canvas 2D + CSS3 Keyframes | Hardware-accelerated water physics and 3D glow caustics |

---

## 📁 Project Structure

```text
pms-app/
├── public/                               # Static assets, videos, logos, SVGs
│   ├── for_this_image_animate_it_as_r.mp4 # 3D background animation video
│   ├── logo.svg                          # MediCare SVG brandmark
│   └── ...
├── src/
│   ├── app/                              # Next.js App Router directory
│   │   ├── appointments/page.tsx         # Appointments calendar & status pipeline
│   │   ├── dashboard/page.tsx            # Clinical overview metrics & quick actions
│   │   ├── patients/page.tsx             # Patient registry, search & CRUD modals
│   │   ├── records/page.tsx              # Medical records & prescription vault
│   │   ├── globals.css                   # Global theme tokens, glass tokens & scrollbars
│   │   ├── layout.tsx                    # Root HTML layout with Google Font injection
│   │   ├── page.module.css               # 3D landing styles, dark theme & dot nav
│   │   └── page.tsx                      # 5-section interactive 3D landing page
│   ├── components/                       # Shared reusable components
│   │   ├── ClientLayout.tsx              # Layout wrapper with Seed state & Water effect
│   │   ├── Modal.tsx                     # Reusable backdrop-filtered modal window
│   │   ├── Navbar.tsx                    # Top sticky header with search & profile badge
│   │   ├── Sidebar.tsx                   # Collapsible navigation drawer
│   │   ├── StatCard.tsx                  # Gradient-accented metric indicator cards
│   │   ├── StatusBadge.tsx               # Status pills (Scheduled / Completed / Cancelled)
│   │   ├── Toast.tsx                     # Context-driven feedback alert notifications
│   │   ├── TopNav.tsx                    # Dynamic header with smooth scroll & glass morph
│   │   └── WaterEffect.tsx               # 3D fluid water ripple canvas effect
│   ├── lib/
│   │   └── storage.ts                    # LocalStorage abstraction with mock data seeding
│   └── types/
│       └── index.ts                      # TypeScript data definitions & schemas
├── package.json                          # Project dependencies & scripts
├── tsconfig.json                         # TypeScript configuration
└── README.md                             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.18.0` or higher
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anubhav-Akhil/MediCare.git
   cd MediCare/pms-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 💻 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Builds an optimized production bundle |
| `npm run start` | Runs the production build server |
| `npm run lint` | Runs ESLint to check code quality and standard compliance |

---

## 🎨 Design System & Accessibility

- **Cosmic Dark & Vivid Palette**: Built with a deep `#0c001a` background, vibrant purple (`#7c3aed`), fuchsia (`#d946ef`), and pink (`#ec4899`) accents designed to minimize ocular fatigue during extended shifts.
- **Glassmorphism**: Layered semi-translucent cards (`rgba(255, 255, 255, 0.035)` with `backdrop-filter: blur(20px)`) establish clear optical hierarchy.
- **Micro-Interactions**: Hover lifts, smooth spring easing, and dynamic dot morphing give tactile feedback for every user action.
- **Zero-Obversion Cursor Physics**: Custom fluid ripples trail smoothly without adding obstructive cursor elements or blocking clicks.

---

## 🔒 Privacy & Data Architecture

- **Local Persistence**: All patient records, consultations, and prescriptions are persisted in browser storage using structured JSON models with type validation.
- **Automatic Seed Engine**: On first launch, MediCare auto-populates realistic clinical data (patients, doctors, upcoming visits, and prescriptions) for immediate evaluation and demo readiness.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Crafted with passion for modern medical practices. MediCare — Launch Edition.</sub>
</div>
