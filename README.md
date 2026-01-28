# Banquet Hall Booking System

Enterprise-grade MERN stack application with financial-grade concurrency control using the Inventory Ledger pattern.

## 🏗️ Architecture

- **Monorepo**: TurboRepo with workspaces
- **Backend**: Node.js, Express, MongoDB, Redis (Redlock)
- **Frontend**: Dual Vite/React apps (Customer + Admin)
- **Storage**: MinIO (S3-compatible)
- **Concurrency**: HallDayInventory ledger with atomic slot locking

## 📁 Project Structure

```
banquet-hall-booking-system/
├── apps/
│   ├── backend/           # Express API with strict TypeScript
│   ├── admin-client/      # Admin dashboard (Vite + React)
│   └── customer-client/   # Customer booking app (Vite + React)
├── packages/
│   └── shared-types/      # Shared TypeScript interfaces
├── docker/                # Docker configurations
├── docker-compose.yml     # Infrastructure orchestration
└── turbo.json            # TurboRepo pipeline
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Docker & Docker Compose
- npm >= 9.0.0

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Infrastructure
```bash
# Start MongoDB, Redis, MinIO
npm run docker:up

# Verify MinIO bucket creation
curl http://localhost:9000/banquet-assets
# OR visit in browser: http://localhost:9001 (user: minioadmin, pass: minioadmin123)
```

### 3. Development
```bash
# Run all apps in dev mode
npm run dev
```

## 🐳 Docker Services

| Service  | Port(s)      | Credentials                          |
|----------|--------------|--------------------------------------|
| MongoDB  | 27017        | admin / adminpassword                |
| Redis    | 6379         | (no auth)                            |
| MinIO    | 9000, 9001   | minioadmin / minioadmin123           |

## 🔐 Key Features

### Customer App
- 360° hall rotation view
- Multi-hall booking with date/time picker
- Real-time availability check
- Booking status dashboard
- Payment & invoice generation

### Admin App
- Three-tier approval pipeline (Admin1 → Admin2 → Admin3)
- RBAC with hierarchical creation privileges
- Document verification workflow
- Payment tracking
- Final approval gateway

## 🧪 Testing & Verification

```bash
# Run all tests
npm test

# Lint all packages
npm run lint

# Format code
npm run format
```

## 📦 Useful Commands

```bash
# View Docker logs
npm run docker:logs

# Stop infrastructure
npm run docker:down

# Clean volumes (⚠️ deletes data)
npm run docker:clean
```

## 📝 Development Notes

- All TypeScript configs extend `tsconfig.base.json` (strict mode enforced)
- Shared types are centralized in `packages/shared-types`
- Use atomic MongoDB operations for slot locking (see Architecture Contract)
- TTL-based TemporaryHold documents expire in 2 hours

---

**Status**: Phase 0 Complete ✅
