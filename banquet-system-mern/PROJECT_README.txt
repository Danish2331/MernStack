================================================================================
                LA GRACE - ENTERPRISE BANQUET MANAGEMENT SUITE
================================================================================

🏛️  PROJECT VISION & SCOPE
    "La Grace" is not merely a booking form; it is a comprehensive digital 
    transformation of the luxury event management industry. By bridging the 
    gap between high-end digital customer experiences and rigid backend 
    operational security, it serves as a dual-purpose platform: a marketing 
    engine for customers and a command center for administration.

    The system was architected to solve three critical industry problems:
    1. The "Visual Trust" Deficit (solved via Native 360° Tours).
    2. Operational Fragility (solved via the 3-Gate Security Pipeline).
    3. Communication Latency (solved via Real-time Status Synchronization).

================================================================================
🧠  CORE LOGIC & ARCHITECTURE
================================================================================

    [1] THE DUAL-INTERFACE STRATEGY
    The application is split into two distinct, isolated frontends communicating
    with a unified monolithic backend. This ensures that "Client-Side" logic
    (Beauty, Tours, Ease) never compromises "Admin-Side" logic (Security, 
    Audit Trails, Financials).

    [2] THE 3-GATE SECURITY PIPELINE (The "State Machine")
    Unlike standard apps where a booking is simply "Pending" or "Confirmed," 
    La Grace enforces a strict, linear approval chain. A booking cannot skip 
    a gate. This is the heart of our backend logic:

    🔹 GATE 1: IDENTITY VERIFICATION (The Clerk)
       - Logic: "Is this a real person with valid ID?"
       - Action: The Clerk reviews uploaded documents. If valid, the state 
         moves to 'ADMIN1_APPROVED'. If not, it is rejected or flagged.
       - Role: Removes spam and fraud before it reaches management.

    🔹 GATE 2: FINANCIAL & AVAILABILITY AUDIT (The Manager)
       - Logic: "Is the slot truly free, and has the deposit cleared?"
       - Action: The Manager checks the physical calendar and triggers the 
         Payment Request. Once the customer pays, the Manager validates the 
         transaction ID. State moves to 'PAYMENT_VERIFIED'.
       - Role: Ensures revenue integrity and prevents double-booking.

    🔹 GATE 3: FINAL COMPLIANCE LOCK (The SuperAdmin)
       - Logic: "Is the entire chain valid for archival?"
       - Action: The SuperAdmin reviews the entire trail—Docs + Payment. 
         Upon 'FINAL_APPROVAL', the slot is permanently locked, and the 
         invoice is immutable.

================================================================================
✨  KEY TECHNICAL INNOVATIONS
================================================================================

    🎥  NATIVE 360° IMMERSION ENGINE
        We rejected the standard approach of redirecting users to YouTube. 
        Instead, we engineered a custom "Modal Overlay System" that injects 
        4K panoramic streams directly into the DOM. This keeps the user 
        engaged within the application ecosystem, increasing conversion rates.

    💎  TIER-BASED VISUAL BRANDING
        The UI is context-aware. It detects the "Tier" of the hall being 
        viewed (Silver, Gold, or Diamond) and dynamically re-skins the 
        interface—adjusting borders, badges, and accents—to subconsciously 
        reinforce the value proposition of the selected venue.

================================================================================
🛠️  TECHNOLOGY STACK
================================================================================

    FRONTEND:  React 18, TypeScript, Tailwind CSS, Axios Interceptors
    BACKEND:   Node.js, Express.js (MVC Pattern)
    DATABASE:  MongoDB Atlas (with Mongoose strict schemas)
    SECURITY:  JWT Stateless Auth, BCrypt Hashing, RBAC Middleware

================================================================================
🚀  DEPLOYMENT & ACCESS
================================================================================

    [PREREQUISITES]
    Node.js v16+ | MongoDB Local/Atlas

    1. BACKEND (Port 5000)      --> cd backend && npm run dev
    2. CUSTOMER APP (Port 5173) --> cd frontend-customer && npm run dev
    3. ADMIN PORTAL (Port 5174) --> cd frontend-admin && npm run dev

    [DEMO CREDENTIALS]
    👑 Super Admin: super@banquet.com  / SuperPass123!
    👔 Manager:     manager@banquet.com / ManagerPass123!
    👮 Clerk:       clerk@banquet.com   / ClerkPass123!
    👤 Customer:    customer@test.com   / UserPass123!

================================================================================
