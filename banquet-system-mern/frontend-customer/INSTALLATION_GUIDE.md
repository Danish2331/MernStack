# 🚀 Installation Guide - Customer Frontend

## Step-by-Step Instructions

### Step 1: Verify Backend is Running
```bash
# In your backend directory
cd /path/to/banquet-system-mern/backend
npm run dev
```
✅ Backend should be running on `http://localhost:5000`

---

### Step 2: Copy Files to Frontend Directory

Copy all the generated files into your `frontend-customer/` directory:

```
banquet-system-mern/
└── frontend-customer/        ← COPY ALL FILES HERE
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    ├── .gitignore
    ├── README.md
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        ├── types/
        ├── utils/
        ├── App.tsx
        ├── main.tsx
        └── index.css
```

---

### Step 3: Install Dependencies

```bash
cd frontend-customer
npm install
```

This will install:
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React (icons)
- React DatePicker
- TypeScript + Vite

---

### Step 4: Create Environment File

```bash
cp .env.example .env
```

The `.env` file should contain:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 5: Start Development Server

```bash
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

---

### Step 6: Test the Application

#### 6.1 Register a New Account
1. Go to `http://localhost:5173/register`
2. Fill in name, email, password
3. Click "Create Account"
4. You should be redirected to `/halls`

#### 6.2 Browse Venues
1. Click "Venues" in navbar
2. You should see hall cards (if halls exist in your database)

#### 6.3 Book a Venue
1. Click "REQUEST PROPOSAL" on any hall card
2. Select a date
3. Select time slots (pills should turn gold when selected)
4. Fill in your details
5. Click "Submit Booking Request"

#### 6.4 Test Atomic Lock (409 Conflict)
To test the 409 conflict handling:
1. Open two browser windows side-by-side
2. In both windows, select the same hall, date, and time slots
3. Submit from Window 1 → Success
4. Submit from Window 2 → You should see **"SLOT CONFLICT"** error

---

## 🔧 Troubleshooting

### Issue: "Network Error" when making API calls

**Cause**: Backend not running or CORS issue

**Solution**:
1. Verify backend is running: `http://localhost:5000`
2. Check backend has CORS enabled:
```typescript
// In backend/src/server.ts
import cors from 'cors';
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));
```

---

### Issue: Images not loading

**Cause**: Backend not serving static files

**Solution**:
Check your backend serves the `/uploads` folder:
```typescript
// In backend/src/server.ts
import express from 'express';
app.use('/uploads', express.static('public/uploads'));
```

---

### Issue: "Module not found" errors

**Cause**: Dependencies not installed or path aliases not configured

**Solution**:
```bash
npm install
```

If still issues, delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: TypeScript errors

**Cause**: Vite needs to resolve `@/*` path aliases

**Solution**: Check `vite.config.ts` has:
```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 🎯 Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can register new account
- [ ] Can login
- [ ] Can see hall listing
- [ ] Can view hall details
- [ ] Can select date and time slots
- [ ] Can submit booking
- [ ] Can view "My Bookings" page
- [ ] 409 conflict error works when same slot booked twice

---

## 📝 Next Steps After Installation

1. **Populate Database with Halls**
   - Use your backend scripts or admin panel to add halls
   - Upload images to `backend/public/uploads/`

2. **Test Booking Flow**
   - Register as customer
   - Book a hall
   - Use your backend smoke test to verify booking created

3. **Build Admin Frontend**
   - Use similar structure for `frontend-admin/`
   - Implement role-based dashboards

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Check backend terminal for API errors
3. Verify all environment variables are correct
4. Ensure MongoDB is running

---

**Installation Complete! 🎉**

Your luxury banquet booking system frontend is now ready to use!
