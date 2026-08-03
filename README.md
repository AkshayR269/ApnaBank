# 🏦 ApnaBank — Enterprise Full-Stack Digital Banking Platform

> A full-stack, concurrency-safe digital banking application built with **Spring Boot 3 (Java 21)**, **PostgreSQL**, **Spring Security 6 with JWT**, and **React 19 with Tailwind CSS**.

---

## 📌 Architecture Overview

```
 ┌────────────────────────────────────────────────────────┐
 │        React 19 + Tailwind CSS Frontend (Vite)         │  <-- Port 5173
 │   - Lightweight Corporate UI, AuthContext, Demo Login  │
 └───────────────────────────┬────────────────────────────┘
                             │  HTTP / REST APIs ('Authorization: Bearer <JWT>')
 ┌───────────────────────────▼────────────────────────────┐
 │         Spring Boot 3 Backend API (Port 8080)          │
 │   - Spring Security 6, JWT, BCrypt, @Transactional     │
 └───────────────────────────┬────────────────────────────┘
                             │  Spring Data JPA / SQL (Row Locking)
 ┌───────────────────────────▼────────────────────────────┐
 │       PostgreSQL Relational Database (Docker 5432)     │
 └────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

* **🔒 Concurrency-Safe Money Transfers**: Utilizes `@Transactional` service boundaries and **Pessimistic Write Row Locking (`FOR UPDATE`)** in PostgreSQL to prevent race conditions and double-spending bugs.
* **🛡️ Stateless JWT Security**: Powered by **Spring Security 6** and **BCrypt password hashing**. Automatically provisions Checking ($5,000) and Savings ($12,500) accounts plus a Virtual Debit Card upon registration.
* **📊 Dual Liquidity Dashboard**: Clean checking vs. high-yield savings (4.25% APY) overview with real-time balance tracking.
* **💳 Debit Card Controls**: Virtual Visa Debit Card viewer with show/hide card credential toggles and instant **Freeze / Unfreeze** lock controls.
* **📜 Searchable Audit Ledger**: Transaction history with category filtering, search by recipient/reference ID, and digital transaction receipt modals.
* **⚡ 1-Click Demo Login Bar**: Instant login pills (`Alex Morgan` & `Sarah Connor`) for rapid testing without manual credential entry.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.x, Spring Data JPA, Hibernate, Lombok |
| **Security** | Spring Security 6, JJWT (JSON Web Token), BCrypt PasswordEncoder |
| **Database** | PostgreSQL 16 (relational schema with row-level locking) |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React Icons, Axios |
| **Tooling** | Apache Maven 3.9+, Docker / Docker Compose |

---

## 🗄️ Database Entity Schema

* **`User`**: `id`, `full_name`, `email` (unique), `password` (BCrypt hash), `role`, `created_at`
* **`Account`**: `id`, `account_number` (unique), `account_type` (`CHECKING`/`SAVINGS`), `balance` (`BigDecimal`), `user_id`
* **`Transaction`**: `id`, `reference_number` (unique), `source_account_id`, `target_account_id`, `amount`, `transaction_type`, `status`, `timestamp`
* **`Card`**: `id`, `card_number`, `card_holder_name`, `expiry_date`, `cvv`, `is_frozen`, `account_id`

---

## 🌐 REST API Endpoints Map

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user + auto-provision accounts & card |
| `POST` | `/api/auth/login` | Public | Authenticate credentials & issue JWT token |
| `GET` | `/api/auth/me` | JWT | Get authenticated user profile |
| `GET` | `/api/accounts` | JWT | Fetch current user's accounts |
| `POST` | `/api/accounts/transfer` | JWT | Execute money transfer (`@Transactional` + row lock) |
| `POST` | `/api/accounts/deposit` | JWT | Deposit funds into specified account |
| `GET` | `/api/transactions/account/{id}` | JWT | Fetch account transaction history |
| `GET` | `/api/cards/account/{id}` | JWT | Fetch card attached to account |
| `PUT` | `/api/cards/{id}/toggle-freeze` | JWT | Toggle card Freeze / Unfreeze state |

---

## ⚡ Getting Started (Local Setup)

### Prerequisites
* **Java 21 JDK** & **Maven 3.8+**
* **Node.js v18+** & **npm**
* **Docker Desktop**

---

### Step 1: Start PostgreSQL in Docker

Run the official PostgreSQL container:

```bash
docker run -d \
  --name apnabank-postgres \
  -p 5432:5432 \
  -e POSTGRES_DB=apnabank_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e TZ=UTC \
  postgres:16-alpine
```

---

### Step 2: Run Spring Boot Backend

Navigate to `apnabank-backend/` and start the server:

```bash
cd apnabank-backend
mvn spring-boot:run
```
> Server starts on `http://localhost:8080` and automatically builds/updates PostgreSQL tables.

---

### Step 3: Run React Frontend

Navigate to `apnabank-frontend/` and launch the Vite dev server:

```bash
cd apnabank-frontend
npm install
npm run dev
```
> Application will be accessible at `http://localhost:5173`.

---

## 💡 Engineering Highlights

### 1. Concurrency Protection (`PESSIMISTIC_WRITE`)
```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT a FROM Account a WHERE a.id = :id")
Optional<Account> findByIdWithLock(@Param("id") Long id);
```
* **Why it matters**: Emits native `SELECT * FROM accounts WHERE id = ? FOR UPDATE` SQL in PostgreSQL, acquiring an exclusive row lock to block concurrent double-spending attempts.

### 2. Monetary Precision (`BigDecimal`)
* **Why it matters**: Avoids IEEE 754 floating-point rounding errors (`0.1 + 0.2 = 0.30000000000000004`). All balance operations and SQL columns use `BigDecimal` and `NUMERIC(15,2)`.

---

## 📜 License
This project is open-source and available under the **MIT License**.
