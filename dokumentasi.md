# DOKUMENTASI SISTEM PKM (SAKTIKU)

## 1. Deskripsi Proyek
**Sistem PKM** atau dengan nama brand **Saktiku** adalah aplikasi web akuntansi sederhana berbasis *double-entry bookkeeping*. Aplikasi ini dirancang untuk membantu Pelaku Kegiatan Mahasiswa (PKM) maupun UMKM dalam melakukan pencatatan transaksi keuangan, mengelola siklus akuntansi dasar, serta menghasilkan laporan keuangan secara otomatis.

Fitur utama yang dimiliki meliputi: multi-tenant (pemilik usaha terpisah), pemilihan jenis usaha, pemetaan kategori transaksi terhadap akun, pencatatan transaksi umum, saldo awal, jurnal penyesuaian, siklus akuntansi (Jurnal Umum, Buku Besar, Neraca Saldo), laporan keuangan (Laba/Rugi, Neraca, Perubahan Modal, Arus Kas), ekspor laporan ke Excel/PDF, autentikasi (JWT + Google Login), onboarding guide, serta manajemen profil pengguna.

---

## 2. Teknologi yang Digunakan

### Backend (API)
- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [Express.js 5.x](https://expressjs.com/) - Web framework
- [mysql2](https://www.npmjs.com/package/mysql2) - MySQL driver (Promise-based + Connection Pooling)
- [jsonwebtoken](https://jwt.io/) - Autentikasi berbasis token (JWT)
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Hashing password
- [cors](https://www.npmjs.com/package/cors) - Cross-Origin Resource Sharing
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variables
- [multer](https://github.com/expressjs/multer) - Upload file (avatar pengguna)
- [google-auth-library](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token) - Verifikasi Google ID Token
- [exceljs](https://github.com/exceljs/exceljs) - Ekspor laporan ke Excel (.xlsx)
- [pdfkit](https://pdfkit.org/) - Ekspor laporan ke PDF
- [moment](https://momentjs.com/) - Manipulasi dan format tanggal
- [nodemon](https://nodemon.io/) (DevDependency) - Auto-restart saat development

### Frontend (SPA)
- [React 19](https://react.dev/) - UI Library
- [React Router DOM 7](https://reactrouter.com/) - Routing
- [Vite 7](https://vitejs.dev/) - Build tool & dev server
- [Axios](https://axios-http.com/) - HTTP Client
- [React Toastify](https://fkhadra.github.io/react-toastify/) - Notifikasi
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Recharts](https://recharts.org/) - Grafik & visualisasi data
- [React Joyride](https://docs.react-joyride.com/) - Onboarding tour/guide
- [Google Identity Services (GSI)](https://developers.google.com/identity/gsi) - Google Login SDK

### Database
- [MySQL](https://www.mysql.com/) / [MariaDB](https://mariadb.org/)

---

## 3. Struktur Proyek

```plaintext
Sistem PKM/
├── backend/
│   ├── public/
│   │   └── uploads/              # File upload (avatar user)
│   ├── src/
│   │   ├── app.js                # Konfigurasi Express (middleware & route setup dasar)
│   │   ├── server.js             # Entry point server (mount routes, static, DB test, listen)
│   │   ├── config/
│   │   │   └── db.js             # Konfigurasi koneksi MySQL (Pool)
│   │   ├── middleware/
│   │   │   └── auth.middleware.js # Middleware proteksi route (verifikasi JWT)
│   │   ├── routes/               # Definisi endpoint API per modul
│   │   │   ├── accounting.js
│   │   │   ├── auth.routes.js
│   │   │   ├── business.js
│   │   │   ├── categories.js
│   │   │   ├── reports.js
│   │   │   ├── reviews.js
│   │   │   ├── transactions.js
│   │   │   └── users.js
│   │   ├── controllers/          # Handler request/response per modul
│   │   │   ├── accountingController.js
│   │   │   ├── auth.controller.js
│   │   │   ├── businessController.js
│   │   │   ├── categoriesController.js
│   │   │   ├── reportsController.js
│   │   │   ├── reviewsController.js
│   │   │   ├── transactionsController.js
│   │   │   └── userController.js
│   │   ├── services/             # Business logic layer
│   │   │   ├── accounting.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── categorySetupservice.js
│   │   └── utils/                # Helper/utility
│   ├── .env                      # Variabel lingkungan backend
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── Images/               # Asset gambar (logo, icon)
│   │   └── panduan/
│   │       └── GUIDEBOOK SAKTIKU 2026.pdf  # Buku panduan aplikasi
│   ├── src/
│   │   ├── App.jsx               # Root component & routing utama
│   │   ├── main.jsx              # Entry point React
│   │   ├── index.css             # Global CSS
│   │   ├── components/           # Komponen reusable
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── guide/
│   │   │   │   └── OnboardingGuide.jsx
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── layout.css
│   │   │   ├── BusinessTypeModal.jsx
│   │   │   ├── BusinessTypeModal.css
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── ConfirmModal.css
│   │   ├── context/              # React Context
│   │   │   ├── BusinessContext.jsx
│   │   │   └── GuideContext.jsx
│   │   ├── pages/                # Halaman berdasarkan fitur
│   │   │   ├── AccountingCycle/
│   │   │   │   ├── AdjustingJournal.jsx
│   │   │   │   ├── GeneralJournal.jsx
│   │   │   │   ├── Ledger.jsx
│   │   │   │   ├── TrialBalance.jsx
│   │   │   │   └── accountingCycle.css
│   │   │   ├── Auth/
│   │   │   │   ├── Register.jsx
│   │   │   │   └── Register.css
│   │   │   ├── Categories/
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── CategoryForm.jsx
│   │   │   │   ├── CategoryList.jsx
│   │   │   │   └── Category.css
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── dashboard.css
│   │   │   ├── Landing/
│   │   │   │   ├── Landing.jsx
│   │   │   │   └── landing.css
│   │   │   ├── LoginPage/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.css
│   │   │   ├── OpeningBalance/
│   │   │   │   ├── OpeningBalance.jsx
│   │   │   │   └── OpeningBalance.css
│   │   │   ├── Panduan/
│   │   │   │   ├── Panduan.jsx
│   │   │   │   └── Panduan.css
│   │   │   ├── Profile/
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── profile.css
│   │   │   ├── Reports/
│   │   │   │   ├── BalanceSheet.jsx
│   │   │   │   ├── CashFlow.jsx
│   │   │   │   ├── EquityChange.jsx
│   │   │   │   ├── ProfitLoss.jsx
│   │   │   │   └── reports.css
│   │   │   └── Transaction/
│   │   │       └── Transaction.jsx
│   │   ├── services/             # API Service Layer (Axios)
│   │   │   ├── Api.js
│   │   │   ├── accountService.js
│   │   │   ├── authService.js
│   │   │   ├── businessService.js
│   │   │   ├── categoryService.js
│   │   │   ├── reportService.js
│   │   │   ├── transactionService.js
│   │   │   └── userService.js
│   │   ├── store/                # State management
│   │   └── utils/                # Helper frontend
│   ├── index.html                # HTML entry (load GSI SDK)
│   ├── vite.config.js            # Konfigurasi Vite + Proxy API
│   └── package.json
│
├── sistem_pkm.sql               # Dump database (skema + data awal)
├── .hintrc
└── .gitignore
```

---

## 4. Arsitektur Aplikasi

Aplikasi ini menerapkan arsitektur **Client-Server Terpisah (SPA + REST API)** dengan pembagian tanggung jawab yang jelas:

1. **Frontend (Presentation Layer)** - React SPA yang dijalankan dengan Vite. Semua request ke `/api/*` dan `/uploads/*` di-proxy ke backend melalui konfigurasi `vite.config.js`.
2. **Backend (API Layer)** - Express.js REST API dengan pola pemisahan **Route → Controller → Service**. Beberapa modul juga melakukan query langsung ke database melalui connection pool.
3. **Data Layer** - MySQL/MariaDB dengan strategi **multi-tenancy berbasis `tenant_id`** untuk memisahkan data antar usaha.
4. **Authentication** - JSON Web Token (JWT) disimpan di `localStorage` frontend dan diverifikasi di backend melalui `auth.middleware.js`.
5. **Double-Entry Accounting** - Setiap transaksi keuangan diproses menjadi minimal 2 entri jurnal (Debit dan Kredit) dengan jumlah yang harus seimbang.

**Alur komunikasi:** `Frontend (Axios) → Vite Proxy (/api) → Express Backend → MySQL DB → Response JSON → Frontend`.

---

## 5. Skema Database

Database `sistem_pkm` memiliki tabel-tabel berikut (berdasarkan `sistem_pkm.sql`):

| Tabel | Deskripsi |
|---|---|
| `tenants` | Data usaha (nama usaha, alamat, kontak, dll.) |
| `users` | Data pengguna (email, username, password, role, avatar, `tenant_id`, `business_type_id`) |
| `business_types` | Daftar jenis usaha (Dagang/Jasa/Produksi/Industri, dll.) |
| `business_type_categories` | Pemetaan kategori transaksi per jenis usaha (akun debit/kredit, `category_type`, `is_adjustment`) |
| `categories` | Kategori transaksi umum (opsional/legacy) |
| `accounts` | *Chart of Accounts* (COA) per tenant (`code`, `name`, `type`, `normal_balance`, `parent_account_id`, `opening_balance`, `current_balance`, `is_system`, `level`, `is_leaf`, `deleted_at`) |
| `transactions` | Header transaksi (`tenant_id`, `business_type_id`, `category_id`, `type`, `amount`, `description`, `transaction_date`, `payment_method`) |
| `journal_entries` | Entri jurnal double-entry (`transaction_id`, `account_id`, `debit`, `credit`, `description`, `entry_date`, `tenant_id`) |
| `opening_balances` | Saldo awal per akun (`tenant_id`, `business_type_id`, `account_id`, `as_of_date`, `side`, `amount`, `description`, `created_by`) |
| `reports` | Konfigurasi/penyimpanan terkait laporan |
| `sessions` | Data sesi login |
| `reviews` | Feedback/review pengguna terhadap aplikasi |

**Relasi Utama:**
- `users.tenant_id` → `tenants.id`
- `transactions.tenant_id` → `tenants.id`
- `journal_entries.transaction_id` → `transactions.id`
- `accounts.tenant_id` → `tenants.id`
- `opening_balances.tenant_id` → `tenants.id`
- `business_type_categories.business_type_id` → `business_types.id`

---

## 6. Modul & Fitur Aplikasi

### 6.1 Autentikasi (`/api/auth`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Registrasi akun baru |
| `POST` | `/api/auth/login` | Login dengan email & password (mengembalikan JWT token + data user) |
| `POST` | `/api/auth/google-login` | Login menggunakan Google ID Token (Google Identity Services) |

### 6.2 Pengguna (`/api/users`) – *Protected Route*
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/users/:id` | Mendapatkan data profil pengguna |
| `PUT` | `/api/users/:id` | Update profil pengguna (termasuk upload avatar via Multer) |

### 6.3 Bisnis (`/api/business`) – *Protected Route*
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST/GET` | `/api/business/*` | Pengaturan jenis usaha, setup kategori berdasarkan jenis usaha, dan inisialisasi COA awal per tenant |

### 6.4 Kategori (`/api/categories`) – *Protected Route*
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET/POST/PUT/DELETE` | `/api/categories/*` | CRUD kategori transaksi (mapping ke akun Debit/Kredit) |

### 6.5 Transaksi (`/api/transactions`) – *Protected Route*
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/transactions/accounts` | Daftar akun yang tersedia untuk transaksi |
| `GET` | `/api/transactions/opening-balance/accounts` | Daftar akun yang boleh diisi saldo awal (Asset/Liability/Equity; Contra Asset masuk sisi Kredit) |
| `GET` | `/api/transactions/opening-balance` | Daftar data saldo awal |
| `POST` | `/api/transactions/opening-balance` | Menyimpan saldo awal (otomatis membuat transaksi `opening_balance` + jurnal dengan akun lawan Ekuitas) |
| `POST` | `/api/transactions/adjusting` | Membuat Jurnal Penyesuaian (berbasis kategori dengan flag `is_adjustment=1`) |
| `GET` | `/api/transactions/adjusting/filter` | Filter jurnal penyesuaian berdasarkan tanggal & `business_type_id` |
| `POST` | `/api/transactions` | Membuat transaksi umum (otomatis membuat jurnal Debit/Kredit berdasarkan mapping kategori) |
| `GET` | `/api/transactions` | Daftar semua transaksi (tidak termasuk `opening_balance`, mengecualikan transaksi adjustment sesuai filter query) |
| `GET` | `/api/transactions/filter` | Filter transaksi berdasarkan `start_date`, `end_date`, dan `business_type_id` |
| `GET` | `/api/transactions/export/excel` | Ekspor daftar transaksi ke file Excel (.xlsx) |
| `GET` | `/api/transactions/export/pdf` | Ekspor daftar transaksi ke file PDF |
| `DELETE` | `/api/transactions/all?business_type_id=...` | Menghapus semua transaksi berdasarkan jenis usaha |
| `GET` | `/api/transactions/:id` | Detail transaksi berdasarkan ID |
| `PUT` | `/api/transactions/:id` | Update transaksi (menghapus & membuat ulang journal entries) |
| `DELETE` | `/api/transactions/:id` | Hapus transaksi (juga menangani penghapusan `opening_balances` jika tipe `opening_balance`) |

### 6.6 Siklus Akuntansi (`/api/accounting`) – *Protected Route*
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/accounting/jurnal-umum` | Data Jurnal Umum (filter: `start_date`, `end_date`, `business_type_id`) |
| `GET` | `/api/accounting/buku-besar` | Data Buku Besar per akun (filter: `account_id`, `start_date`, `end_date`, `business_type_id`) |
| `GET` | `/api/accounting/neraca-saldo` | Data Neraca Saldo (filter: `start_date`, `end_date`, `business_type_id`) |
| `GET` | `/api/accounting/jurnal-penyesuaian` | Data Jurnal Penyesuaian |
| `POST` | `/api/accounting/reset` | Reset data akuntansi (sesuai implementasi service) |

### 6.7 Laporan Keuangan (`/api/reports`) – *Protected Route*
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/reports/setup-coa` | Setup Chart of Accounts |
| `GET` | `/api/reports/coa` | Daftar Chart of Accounts |
| `GET` | `/api/reports/accounts` | Daftar akun |
| `POST` | `/api/reports/adjusting-journal` | Buat jurnal penyesuaian (via reports) |
| `GET` | `/api/reports/adjusting-journals` | Daftar jurnal penyesuaian |
| `GET` | `/api/reports/laba-rugi` | Laporan Laba/Rugi (filter: `start_date`, `end_date`, `business_type_id`, `period`) |
| `GET` | `/api/reports/neraca` | Laporan Neraca (filter: `end_date`, `business_type_id`) |
| `GET` | `/api/reports/perubahan-modal` | Laporan Perubahan Modal (filter: `start_date`, `end_date`, `business_type_id`) |
| `GET` | `/api/reports/arus-kas` | Laporan Arus Kas (filter: `start_date`, `end_date`, `business_type_id`) |
| `POST` | `/api/reports/close-book` | Proses tutup buku (jika diimplementasikan) |
| `GET` | `/api/reports/trial-balance` | Neraca Saldo (via reports) |
| `GET` | `/api/reports/dashboard` | Data ringkasan dashboard (filter: `business_type_id`) |

### 6.8 Review/Feedback (`/api/reviews`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/reviews` | Kirim review/feedback |
| `GET` | `/api/reviews` | Daftar review/feedback |

> **Catatan:** Seluruh route yang dilindungi (`Protected`) memerlukan header `Authorization: Bearer <JWT_TOKEN>`. Penempatan route dengan parameter `:id` sudah diatur setelah route spesifik untuk menghindari *route shadowing*.

---

## 7. Konfigurasi

### 7.1 Backend - `.env` (`backend/.env`)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sistem_pkm
JWT_SECRET=supersecret
GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Keterangan:**
- `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME` - Konfigurasi koneksi MySQL
- `JWT_SECRET` - Kunci rahasia untuk signing/verifikasi JWT (gunakan nilai kuat di production)
- `GOOGLE_CLIENT_ID` - Client ID Google OAuth untuk Google Login (ambil dari [Google Cloud Console](https://console.cloud.google.com/))

### 7.2 Frontend

- **`vite.config.js`** - Mengkonfigurasi proxy development:
  ```js
  proxy: {
    '/api': { target: 'http://localhost:5000', changeOrigin: true, secure: false },
    '/uploads': { target: 'http://localhost:5000', changeOrigin: true, secure: false }
  }
  ```
- **`src/services/Api.js`** - Base URL menggunakan `/api` (via proxy), menambahkan interceptor untuk auto-inject `Authorization: Bearer <token>` dari `localStorage`
- **`index.html`** - Memuat Google Identity Services SDK (`https://accounts.google.com/gsi/client`), judul `Saktiku`, favicon `/Images/SK.png`, font `Plus Jakarta Sans`

---

## 8. Cara Menjalankan Aplikasi

### Prasyarat
- [Node.js](https://nodejs.org/) LTS (v18+ direkomendasikan)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- [MySQL](https://www.mysql.com/) / [MariaDB](https://mariadb.org/) (bisa via [XAMPP](https://www.apachefriends.org/))

### Langkah 1: Setup Database
1. Jalankan MySQL/MariaDB
2. Buat database:
   ```sql
   CREATE DATABASE sistem_pkm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Import file `sistem_pkm.sql` (melalui phpMyAdmin, DBeaver, atau CLI MySQL)

### Langkah 2: Menjalankan Backend
```bash
cd backend
npm install
npm run dev
```
Server backend akan berjalan di: **`http://localhost:5000`**

Route test: `GET http://localhost:5000/` → Response: `"API PKM jalan"`

### Langkah 3: Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi frontend akan berjalan di: **`http://localhost:5173`**

Frontend akan otomatis melakukan proxy request `/api/*` menuju backend.

### Langkah 4: Build untuk Production (Frontend)
```bash
cd frontend
npm run build
npm run preview
```
Hasil build akan tersimpan di folder `frontend/dist/`.

---

## 9. Logika Bisnis Penting

| Aspek | Penjelasan |
|---|---|
| **Multi-Tenancy** | Hampir seluruh query SQL memfilter berdasarkan `tenant_id` yang diambil dari JWT (`req.user.tenant_id`). Hal ini menjamin isolasi data antar usaha. |
| **Double-Entry Bookkeeping** | Fungsi `createJournalEntry` (di controller/service terkait) memastikan setiap transaksi menghasilkan minimal 2 baris jurnal (Debit & Kredit). Sistem mengasumsikan jumlah debit = kredit berdasarkan mapping akun. |
| **Saldo Awal (Opening Balance)** | Saat menyimpan saldo awal, sistem menentukan `contra_account_id` (umumnya akun Ekuitas/Modal) untuk menjaga keseimbangan jurnal. Tersedia juga logika `ensureEquityBalance` untuk menyeimbangkan selisih Total Aset – Total Kewajiban secara otomatis. |
| **Business Type Aware** | `business_type_id` diperoleh dari data tenant/user. Kategori transaksi (`business_type_categories`) dipetakan per jenis usaha, sehingga mapping akun bisa berbeda sesuai tipe usaha. |
| **Dashboard Flow Detection** | Menggunakan `TRANSACTION_DASHBOARD_FLOW_SQL` untuk menganalisis pola kode akun pada jurnal (Kas/Bank 1101, Pendapatan, Beban, Persediaan 14%, Piutang 1301, Hutang 2101, Retur) guna mengklasifikasikan arus transaksi (income/expense/purchase/sale/purchase_return/sales_return/non_cash). |
| **Update Transaksi** | Saat mengupdate transaksi, sistem menghapus `journal_entries` lama terlebih dahulu, kemudian membuat ulang berdasarkan data kategori terbaru (agar jurnal tetap konsisten). |
| **Hapus Transaksi Opening Balance** | Pada `deleteTransaction`, jika tipe transaksi adalah `opening_balance`, maka record di tabel `opening_balances` juga dihapus berdasarkan pencocokan `tenant_id`, `business_type_id`, `amount`, dan `as_of_date`. |
| **Export Laporan** | Ekspor Excel menggunakan **ExcelJS** (header laporan, merge cell, styling border & warna tema, format angka). Ekspor PDF menggunakan **PDFKit** (layout landscape, header tabel berulang di halaman baru, perhitungan total debit/kredit, auto-page break). |

---

## 10. Rekomendasi Pengembangan

Untuk pengembangan lebih lanjut, disarankan untuk menambahkan:

- **ERD (Entity Relationship Diagram)** - Visualisasi relasi tabel (bisa di-generate dari `sistem_pkm.sql`)
- **API Specification (OpenAPI/Swagger)** - Dokumentasi API lengkap beserta contoh request/response per endpoint
- **Postman Collection** - Untuk mempermudah testing API
- **`.env.example`** - Template environment variables terpisah (tanpa nilai sensitif)
- **Deployment Guide** - Panduan deploy production (Nginx, PM2, reverse proxy, SSL, environment production)
- **RBAC (Role-Based Access Control)** - Pengelompokan hak akses pengguna yang lebih granular
- **Validasi Jurnal Otomatis** - Pengecekan wajib balance Debit=Kredit sebelum commit transaksi
- **Manajemen COA Dinamis** - Kemampuan menambah/edit akun COA per tenant tanpa bergantung data sistem baku
- **Soft Delete Konsisten** - Pemanfaatan `deleted_at` pada `accounts` secara konsisten di seluruh query
- **Unit/Integration Testing** - Penambahan test (Jest/Supertest) untuk meningkatkan kualitas kode

---

## 11. Kesimpulan

**Sistem PKM (Saktiku)** merupakan aplikasi akuntansi web yang mengimplementasikan prinsip dasar *double-entry bookkeeping*, arsitektur terpisah (SPA + REST API), dan konsep multi-tenant dengan cukup baik. Pemisahan layer (Routes – Controllers – Services) pada backend serta pemisahan komponen/pages/services pada frontend membuat kode terstruktur dan mudah dikembangkan.

Aplikasi ini sudah mampu mencakup alur siklus akuntansi dasar hingga pembuatan laporan keuangan, dilengkapi fitur ekspor Excel/PDF dan berbagai kemudahan UX (onboarding guide, notifikasi, UI responsif). 
---

