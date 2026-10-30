# DigiTube Backstage 🎵

> **Enterprise Music Distribution, DDEX Ingestion & Royalty Settlement Platform**

DigiTube Backstage is a modern web application designed for record labels and independent artists to manage song releases, metadata, digital service providers (Spotify, Apple Music, YouTube Music, JioSaavn, Wynk, Meta, etc.), financial payouts, and quality assurance workflows.

---

## ✨ Features

- **Artist Backstage Portal**:
  - Interactive 9-Step Release Wizard (Metadata, Artwork validation, Lossless Audio master, Contributor credits, Copyright, Royalty splits, DSP selection).
  - Studio Master Audio QC Player with dynamic waveform visualization and lossless playback.
  - Transparent Wallet & Direct Indian Banking (NEFT/RTGS & UPI direct settlement).
  - Monthly DSP Statement Ingestion with automatic 15% platform commission deduction and 85% net artist payouts.

- **Super Admin & Staff Desk (`/admin`)**:
  - **Quality Review Queue**: Inspect and approve/reject song submissions, attach QA notes.
  - **DSP Distribution Grid**: Monitor batch deliveries and per-store ingestion.
  - **Staff RBAC**: Role-based access control (Super Admin, Release Manager, Catalog Staff, Accounts Staff, Support Staff).
  - **Security Shield**: Brute-force rate limiting protection, anti-XSS, anti-clickjacking headers, and session verification.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Frontend**: [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Database & Storage**: [MongoDB Atlas](https://www.mongodb.com/atlas), Local JSON Fallback Store
- **Authentication**: Email OTP via Nodemailer / SMTP, Bcrypt.js password hashing, HTTP-only session cookies
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/Karan778862/Digitube-backstage.git
cd Digitube-backstage
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update the required variables:
- `MONGODB_URI`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Privacy
- Sensitive secrets and `.env` credentials are excluded via `.gitignore`.
- Role-based route guards prevent unauthorized staff access.

---

## 📄 License
Private & Confidential © DigiTube Network. All rights reserved.
