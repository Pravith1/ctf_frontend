# CTF Frontend - Routing Setup

## Overview
This document describes the routing structure for the CTF platform.

## Route Structure

### Main Routes

1. **`/`** - Login Page
   - Component: `LoginPage`
   - Public route

2. **`/leaderboard`** - Scoreboard
   - Component: `Leaderboard`
   - Protected route

3. **`/challenge`** - Challenges List Page
   - Component: `ChallengesPage`
   - Protected route
   - Displays all available challenges in a grid
   - Each challenge card is clickable

4. **`/challenge/:id`** - Individual Challenge (Answer Solving)
   - Component: `AnswerSolving`
   - Protected route
   - Dynamic route that accepts challenge ID
   - Receives challenge data via router state

5. **`/admin`** - Admin Dashboard
   - Component: `Admin`
   - Protected route (admin only)

6. **`/learn`** - Learning Resources
   - Coming soon placeholder
   - Protected route

## Navigation Flow

```
Challenges Page (/challenge)
        ↓ (click on challenge card)
Answer Solving Page (/challenge/:id)
```

### How Challenge Data is Passed

1. **From ChallengesPage to AnswerSolving:**
   ```javascript
   navigate(`/challenge/${challenge.id}`, { state: { challenge } });
   ```

2. **In AnswerSolving component:**
   ```javascript
   const location = useLocation();
   const { id } = useParams();
   const passedChallenge = location.state?.challenge;
   ```

## Challenge Data Structure

Each challenge object contains:
```javascript
{
  id: number,
  title: string,
  difficulty: string,  // 'Easy', 'Medium', 'Hard'
  points: number,
  comments: number,
  rating: number,
  category: string,  // 'Web', 'Cryptography', 'Forensics', 'Miscellaneous'
  author: string,
  solves: number,
  description: string,
  linkText: string,
  linkUrl: string,
  additionalInfo: string,
  additionalLinkText: string,
  additionalLinkUrl: string,
  tags: string[]
}
```

## Components Updated

### 1. App.jsx
- Fixed import casing (`./Pages/` → `./pages/`)
- Added new route for `/challenge/:id`
- Separated challenges list from challenge detail view

### 2. Challenge.jsx (ChallengesPage)
- Added `useNavigate` hook
- Integrated `CTFHeader` component
- Added `handleChallengeClick` function
- Made challenge cards clickable
- Extended challenge data with additional fields

### 3. AnswerSolving.jsx
- Added `useLocation` and `useParams` hooks
- Modified to accept challenge data from router state
- Falls back to default challenge if no data is passed
- Dynamically displays challenge information

### 4. chalenge.css
- Removed duplicate header styles (now uses CTFHeader)
- Updated background colors to match theme
- Cleaned up unused navigation styles

## Protected Routes

All routes except `/` (login) are protected using the `ProtectedRoute` component:
- Checks if user is authenticated
- Admin route has additional `adminOnly` check
- Redirects to login if not authenticated

## Future Enhancements

1. Add API integration for fetching challenge data
2. Implement challenge filtering and search
3. Add challenge difficulty-based color coding
4. Implement submission tracking
5. Add challenge rating and comment features
