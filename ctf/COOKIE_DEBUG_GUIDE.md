# 🍪 Cookie Debugging Guide

## Why Your Cookie Gets "Cleared" After Login

**The cookie isn't actually being cleared by the frontend!** 

When you navigate to `/challenge`, the page makes API calls to fetch categories and questions. If the **backend doesn't recognize your JWT cookie**, it returns a **401 Unauthorized** error, which triggers the frontend to clear localStorage and redirect to login.

## How to Debug This Issue

### Step 1: Open Browser DevTools
1. Press `F12` or `Ctrl+Shift+I`
2. Go to the **Console** tab
3. Go to the **Network** tab
4. Go to the **Application** tab → **Cookies** section

### Step 2: Login and Watch the Console

You'll see logs like this:

```
📤 POST /auth/login
🍪 Cookies being sent: (empty or previous cookies)
📋 Request config: { withCredentials: true, baseURL: '...' }

📥 Response from /auth/login: 200
✅ Response headers: {...}
🍪 Backend set cookie: jwt=eyJhbGc...
✅ Login response: { user: {...} }
🍪 Cookie should be set by backend
```

### Step 3: Check Application Tab
- **Application** → **Cookies** → `https://ctf-backend-1.onrender.com`
- You should see a cookie named `jwt` with:
  - ✅ HttpOnly: true
  - ✅ Secure: true (in production)
  - ✅ SameSite: None (for cross-origin)
  - ✅ Path: /

### Step 4: Navigate to Challenges Page

Watch the console carefully:

**If cookie is working:**
```
📤 GET /submission/categories
🍪 Cookies being sent: jwt=eyJhbGc...
📥 Response from /submission/categories: 200
```

**If cookie is NOT working (THIS IS YOUR ISSUE):**
```
📤 GET /submission/categories
🍪 Cookies being sent: (empty or no jwt cookie)
❌ Error from /submission/categories: 401 { message: "Unauthorized" }
⚠️ 401 Unauthorized - JWT Cookie is missing or invalid!
💥 THIS IS WHY YOUR COOKIE IS "CLEARED" - Backend rejected it!
🔧 Backend needs to fix cookie configuration (sameSite, secure, path)
🔄 Redirecting to login page...
```

## Root Cause Analysis

The issue is **backend cookie configuration**. Your backend sets cookies differently for different endpoints:

### Current Backend Issue:

**Login/Signup (authController.js):**
```javascript
res.cookie("jwt", token, { 
  httpOnly: true, 
  secure: NODE_ENV === 'production',
  maxAge: 1 * 24 * 60 * 60 * 1000
  // ❌ MISSING: sameSite, path
});
```

**Logout (authController.js):**
```javascript
res.clearCookie("jwt", { 
  httpOnly: true, 
  sameSite: 'strict', // ❌ Different from login!
  secure: NODE_ENV === 'production'
});
```

## Backend Fix Required

Update your `authController.js`:

```javascript
// Add this helper function at the top
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  path: '/' // Available on all routes
});

// Signup (line ~50)
res.cookie("jwt", token, getCookieOptions());

// Login (line ~90)
res.cookie("jwt", token, getCookieOptions());

// Logout (line ~120)
res.clearCookie("jwt", getCookieOptions());
```

## CORS Configuration (Backend)

Also verify your backend has correct CORS settings:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',           // Local dev
    'https://your-frontend-domain.com' // Production
  ],
  credentials: true, // ✅ CRITICAL - allows cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

## Why `sameSite: 'none'` is Needed

- Your frontend: `http://localhost:5173`
- Your backend: `https://ctf-backend-1.onrender.com`

These are **different origins** (cross-origin), so the browser requires:
- `sameSite: 'none'` - allows cross-origin cookie sending
- `secure: true` - required when `sameSite: 'none'` is used (HTTPS only)

## What to Look For in Network Tab

### Login Request:
**Response Headers:**
```
Set-Cookie: jwt=eyJhbGc...; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400
```

### Categories Request:
**Request Headers:**
```
Cookie: jwt=eyJhbGc...
```

If the Cookie header is **missing** in the categories request, the backend won't authenticate you → returns 401 → frontend "clears" the session.

## Frontend is Working Correctly ✅

The frontend code is correct:
- ✅ `withCredentials: true` on all API calls
- ✅ Proper error handling for 401
- ✅ Cookie detection and logging

The issue is **100% backend cookie configuration**.

## Testing After Backend Fix

1. Clear all cookies (Application tab → Clear storage)
2. Login
3. Check console for `🍪 Backend set cookie`
4. Check Application tab for `jwt` cookie
5. Navigate to Challenges
6. Check console - should show `🍪 Cookies being sent: jwt=...`
7. No 401 errors should appear

---

**TL;DR:** The cookie isn't being "cleared" - it's being **rejected by the backend** due to incorrect cookie configuration. Fix the backend's `getCookieOptions()` and CORS settings.
