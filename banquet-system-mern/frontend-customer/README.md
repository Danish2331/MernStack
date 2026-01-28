# Luxury Banquet Booking System - Customer Frontend

React frontend for the luxury banquet hall booking system with Oberoi-inspired design.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend running on `http://localhost:5000`

### Installation

1. **Copy all files** to your `frontend-customer/` directory

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Start development server:**
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 📁 Project Structure

```
frontend-customer/
├── src/
│   ├── api/              # API client and service layer
│   │   ├── client.ts     # Axios instance with JWT interceptor
│   │   ├── auth.ts       # Authentication API
│   │   ├── halls.ts      # Halls API
│   │   └── bookings.ts   # Bookings API (Atomic Lock logic)
│   ├── components/
│   │   ├── layout/       # Navbar, Footer
│   │   └── common/       # Reusable components
│   ├── context/          # React Context (Auth)
│   ├── pages/            # Page components
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Router setup
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Design System

### Colors
- **Navy**: `#2B2457` (Footer, headers)
- **Gold**: `#D87A31` (CTAs, accents)
- **Cream**: `#F8F5F0` (Backgrounds)

### Typography
- **Headers**: Playfair Display (Serif)
- **Body**: Lato (Sans-serif)

## 🔗 Available Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage | No |
| `/login` | Login page | No |
| `/register` | Registration | No |
| `/halls` | Venue listing | No |
| `/halls/:id` | Venue details | No |
| `/book/:id` | Booking form | Yes |
| `/my-bookings` | Customer bookings | Yes |

## ⚡ Key Features

### 1. **JWT Authentication**
- Automatic token attachment via Axios interceptor
- Token stored in `localStorage`
- Auto-redirect to login on 401

### 2. **Atomic Lock Booking**
- Date/time slot selection
- Real-time availability check
- **409 Conflict Handling**: If slots are taken, user is notified immediately

### 3. **3-Gate Approval Pipeline**
- Status tracking: `PENDING_ADMIN1` → `PENDING_ADMIN2` → `PENDING_ADMIN3` → `APPROVED`
- Visual status badges

### 4. **Responsive Design**
- Mobile-first approach
- Tailwind CSS utilities
- Hamburger menu on mobile

## 🔧 Backend Integration

Ensure your backend is running on `http://localhost:5000` with these endpoints:

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Halls
- `GET /api/halls`
- `GET /api/halls/:id`

### Bookings
- `GET /api/bookings/search?hallId=X&date=YYYY-MM-DD`
- `POST /api/bookings/hold`
- `GET /api/bookings/my`
- `GET /api/bookings/:id`

## 🐛 Common Issues

### CORS Error
Make sure your backend has CORS enabled for `http://localhost:5173`:
```typescript
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
```

### Images Not Loading
Check that your backend serves static files:
```typescript
app.use('/uploads', express.static('public/uploads'));
```

### 409 Conflict on Booking
This is **expected behavior** when slots are already booked. The UI will show an error and refresh availability.

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## 🎯 Next Steps

1. **Admin Frontend**: Create `frontend-admin/` with role-based dashboards
2. **360° Viewer**: Integrate panoramic image viewer library
3. **Payment Gateway**: Add payment integration (Stripe/Razorpay)
4. **Invoice Generation**: PDF invoice download feature
5. **Email Notifications**: Send booking confirmations

---

Built with ❤️ using React + Vite + TypeScript + Tailwind CSS
