# 🏥 MediCare — Modern Patient Management Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

<p align="center">
  A state-of-the-art, glassmorphic Patient Management System (PMS) built with Next.js 16 App Router, React 19, MongoDB Atlas, and interactive 3D visual experiences. Streamline clinic intake, practitioner authentication, doctor schedules, and diagnostic records in one unified platform.
</p>

[**Key Features**](#-key-features) • [**Authentication & Database**](#-authentication--mongodb-architecture) • [**Deployment Guide**](#-deployment-guide) • [**Getting Started**](#-getting-started)

</div>

---

## 🌟 Executive Overview

**MediCare** is engineered to replace fragmented hospital and clinic workflows with a unified, high-performance mission control. Designed with deep cosmic tones, glassmorphism, fluid interactive physics, MongoDB persistence, and instant-response state management, MediCare provides clinicians and medical administrators with seamless patient management without cognitive fatigue.

---

## ✨ Key Features

### 🔐 1. MongoDB Authentication & Route Protection
- **Role-Based Access**: Dedicated workflows for Doctors, Administrators, Staff, and Nurses.
- **Encrypted Password Storage**: Bcrypt hashing (`bcryptjs`) with salt rounds.
- **Edge-Compatible JWT Sessions**: Cryptographically signed tokens (`jose`) stored in secure `httpOnly` cookies.
- **Middleware Guard**: Next.js route protection automatically intercepts unauthorized access to `/dashboard`, `/patients`, `/appointments`, and `/records`, redirecting visitors seamlessly to `/login`.
- **1-Click Quick Demo Login**: Instant pre-filled authentication shortcuts for rapid testing and evaluations.

### 🚀 2. Cinematic 3D Landing Page
- **Full-Screen 3D Looping Canvas**: Integrated high-definition 3D video hero background with smooth fade-in and depth vignette shading.
- **Synced Dot Navigation**: A 5-point fixed floating glass capsule (`Home`, `About`, `Designers`, `Features`, `News`) that tracks viewport scroll in real-time via `IntersectionObserver`.
- **Fluid Interactive Water Wake**: Hardware-accelerated canvas ripple effect that generates refractive liquid wave crests on cursor movement and clicks.

### 👥 3. Patient Directory & Registry
- **Comprehensive Demographic Profiling**: First/Last names, age, gender, contact phone, email, full address, and blood group categorization (`A+`, `O-`, `AB+`, etc.).
- **Real-Time Multi-Field Search**: Instant client-side filtering across names, contact details, and emails.
- **Full CRUD Management**: Modal-driven creation, inline updates, and safety-prompted deletion.
- **Smart Pagination**: Smooth page navigation handling large patient registries.

### 📅 4. Smart Appointment Engine
- **Multi-Department & Doctor Scheduling**: Slot allocation for Cardiology, Dermatology, Orthopedics, Neurology, Pediatrics, General Medicine, and ENT.
- **One-Click Status Workflow**: Transition appointments seamlessly across `Scheduled`, `Completed`, and `Cancelled` states with color-coded badges.
- **Date & Category Filtering**: Filter appointments by status counts (`All`, `Scheduled`, `Completed`, `Cancelled`) alongside global keyword search.

### 📋 5. Clinical Records & Rx Vault
- **Structured Diagnosis & Prescriptions**: Record clinical observations, diagnostic findings, prescriptions, and dosage instructions.
- **Detailed Clinical Modal View**: Expand any patient's diagnostic record in one click to view doctor observations, timestamps, and medication history.

### 📊 6. Practice Analytics Dashboard
- **Real-Time Clinical Metrics**: Live overview of Total Registered Patients, Today's Scheduled Visits, Pending Consultations, and Medical Records.
- **Recent Patient Intake Feed**: Quick-access table showing recently registered patients.
- **Daily Appointments Digest**: Upcoming consultation queue with doctor tags and visit status indicators.

---

## 🗄️ Authentication & MongoDB Architecture

### Environment Variables
Configure your environment variables in `.env.local` (or in your hosting provider's dashboard):

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pms?retryWrites=true&w=majority

# JWT Secret for Session Signing
JWT_SECRET=your_super_secret_jwt_key_here
```

### Pre-Configured Demo Credentials
| Role | Email | Password |
|---|---|---|
| **Doctor** | `doctor@medicare.com` | `password123` |
| **Admin** | `admin@medicare.com` | `password123` |

---

## 🚀 Deployment Guide

### Option 1: Deploy to Vercel (Recommended)
1. Push your repository to GitHub / GitLab.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and select the root directory (or `pms-app` if in a subfolder).
4. Under **Environment Variables**, add:
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_jwt_secret_key`
5. Click **Deploy**. Vercel will automatically build and deploy the Next.js application.

### Option 2: Deploy to Netlify
1. Connect your repository on [Netlify](https://netlify.com).
2. Set Build Command to `npm run build` and Publish Directory to `.next`.
3. Add `MONGODB_URI` and `JWT_SECRET` in **Site Configuration > Environment Variables**.
4. Trigger deploy.

### Option 3: Deploy via Node / Self-Hosted VPS
1. Clone and install dependencies:
   ```bash
   git clone <repo_url>
   cd pms-app
   npm install
   ```
2. Set your environment variables in `.env.local`:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your real MongoDB URI
   ```
3. Build and start the production server:
   ```bash
   npm run build
   npm run start
   ```
4. (Optional) Run with PM2 for zero-downtime process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "medicare-pms" -- start
   ```

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Jose (JWT HS256)](https://github.com/panva/jose) + [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/)
- **Typography**: [Plus Jakarta Sans (via `next/font/google`)](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [@tanstack/react-form](https://tanstack.com/form)

---

## 💻 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Builds an optimized production bundle |
| `npm run start` | Runs the production build server |
| `npm run lint` | Runs ESLint with zero-error validation |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">
  <sub>Crafted with passion for modern medical practices. MediCare — Production Ready Edition.</sub>
</div>
