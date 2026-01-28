# Phase 0: Setup Instructions

## 📋 ACTION 1: Monorepo Skeleton ✅ COMPLETE

The folder structure has been created:
```
MernStack/
├── apps/
│   ├── backend/
│   ├── admin-client/
│   └── customer-client/
├── packages/
│   └── shared-types/
└── docker/
```

---

## 📋 ACTION 2: Infrastructure (docker-compose.yml) ✅ COMPLETE

**File**: `docker-compose.yml`

**Services Configured**:
- ✅ **MongoDB 7.0** (port 27017) with persistent volume
- ✅ **Redis Alpine** (port 6379) for Redlock
- ✅ **MinIO** (ports 9000 API, 9001 Console)
- ✅ **MinIO Init Service** - Auto-creates `banquet-assets` bucket with public download access

---

## 📋 ACTION 3: Configuration Files ✅ COMPLETE

### Root `package.json` ✅
- Workspaces enabled: `["apps/*", "packages/*"]`
- TurboRepo configured
- Convenience scripts for Docker management

### `tsconfig.base.json` ✅
- **Strict mode**: `"strict": true`
- **No implicit any**: `"noImplicitAny": true`
- All workspace packages will extend this base config

### Additional Files Created:
- ✅ `turbo.json` - Build pipeline orchestration
- ✅ `.prettierrc` - Code formatting rules
- ✅ `.gitignore` - Standard MERN exclusions
- ✅ `.env.example` - Environment configuration template
- ✅ `README.md` - Quick start guide

---

## 📋 ACTION 4: Verification Commands

> **⚠️ Windows PowerShell Users**: If you encounter "running scripts is disabled" error, run this first:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
> Then close and reopen your terminal.

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Infrastructure
```bash
npm run docker:up
```

### Step 3: Verify MinIO Bucket Creation

**Option A - Browser (Recommended)**:
```
Open: http://localhost:9001
Login: minioadmin / minioadmin123
Navigate to "Buckets" → Verify "banquet-assets" exists
```

**Option B - Command Line**:
```bash
curl http://localhost:9000/banquet-assets/
```
Expected response: `<?xml version="1.0" encoding="UTF-8"?>` (indicating bucket exists)

**Option C - Check Docker Logs**:
```bash
docker logs banquet-minio-init
```
Expected output: `Bucket banquet-assets created and set to public download access`

---

## 🎯 Next Steps (After Verification)

Once infrastructure is running:
1. ✅ Copy `.env.example` to `.env`: `cp .env.example .env`
2. Proceed to **Phase 1**: Core Database Architecture
   - Create Mongoose schemas (HallDayInventory, TemporaryHold, Booking)
   - Implement atomic slot locking logic
   - Write TDD unit tests

---

## 🔧 Troubleshooting

**If MongoDB fails to start**:
```bash
npm run docker:clean  # Removes volumes
npm run docker:up
```

**If MinIO bucket not created**:
```bash
docker logs banquet-minio-init  # Check initialization logs
```

**View all service logs**:
```bash
npm run docker:logs
```
