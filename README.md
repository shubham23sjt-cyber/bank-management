# 🏦 Bank Management System (NestJS + Prisma + CQRS)

A **real-world banking backend system** built using **NestJS**, **Prisma**, and **CQRS architecture**.

This project simulates core banking operations such as:

* Account creation
* Money transfer
* Deposit & withdrawal
* Transaction history
* Email notifications
* PDF receipt generation

---

## 🚀 Features

* 🔐 JWT Authentication (Register/Login)
* 👤 User Management
* 🏦 Account Creation
* 💸 Transfer Money between accounts
* ➕ Deposit Money
* ➖ Withdraw Money
* 📜 Transaction History (CQRS Query Side)
* 📧 Email Notifications (Handlebars templates)
* 📄 PDF Receipts (HTML → PDF via Puppeteer)
* ⚡ CQRS Architecture (Commands + Queries separation)
* 🗄️ PostgreSQL with Prisma ORM

---

## 🧠 Architecture

This project follows **CQRS (Command Query Responsibility Segregation)**:

### Commands (Write operations)

* Create Account
* Deposit
* Withdraw
* Transfer

### Queries (Read operations)

* Get Transaction History

### Structure

```id="c1"
src/
├── auth/
├── account/
├── transaction/
│   ├── commands/
│   ├── commandhandler/
│   ├── queries/
│   ├── querieshandler/
│   └── dto/
├── email/
├── pdf/
├── prisma/
```

---

## 🏗️ Tech Stack

* **Backend:** NestJS
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (Passport)
* **Architecture:** CQRS
* **Email Service:** Nodemailer (Mailtrap)
* **PDF Generation:** Puppeteer
* **Templating Engine:** Handlebars

---

## ⚙️ Installation

```bash id="c2"
git clone <your-repo-url>
cd bank-management

npm install
```

---

## 🔑 Environment Variables

Create `.env` file:

```id="c3"
DATABASE_URL="postgresql://user:password@localhost:5432/bank"
MAIL_HOST="sandbox.smtp.mailtrap.io"
MAIL_PORT=2525
MAIL_USER="your_mailtrap_user"
MAIL_PASS="your_mailtrap_password"

```

---

## 🗄️ Database Setup

```bash id="c4"
npx prisma migrate dev
```

---

## ▶️ Run the Project

```bash id="c5"
npm run start:dev
```

---

## 🔐 API Endpoints

### Auth

* `POST /auth/register`
* `POST /auth/login`

### Account

* `POST /account` → Create account

### Transactions

* `POST /transaction/deposit`
* `POST /transaction/withdraw`
* `POST /transaction/transfer`
* `GET /transaction/history`

---

## 📧 Email & PDF System

* Email templates → `src/email/templates/transaction.hbs`
* PDF templates → `src/pdf/templates/receipt.hbs`

### Flow

```id="c6"
Transaction → DB Commit → Generate PDF → Send Email
```

---

## ⚠️ Important Design Decisions

* DB transactions are kept **fast and atomic**
* Email + PDF generation are executed **outside DB transaction**
* Prisma Decimal values are converted before rendering
* CQRS used to separate read and write logic

---

## 🧪 Example Flow

1. Register user
2. Login → get JWT token
3. Create account
4. Deposit money
5. Transfer money
6. Receive email + PDF receipt
7. Check transaction history

---

## 📌 Future Improvements

* Queue system (Bull + Redis) for async jobs
* Multi-account support per user
* Rate limiting
* Docker support
* Admin dashboard

---

## 👨‍💻 Author

Shubham

