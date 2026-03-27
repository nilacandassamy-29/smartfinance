# Smart Finance Management Mobile Application

## Academic Project Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Folder Structure](#folder-structure)
5. [Module Description](#module-description)
6. [Database Schema](#database-schema)
7. [Screen Flow](#screen-flow)
8. [Security Implementation](#security-implementation)
9. [Installation Guide](#installation-guide)
10. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Project Name:** SmartFinance - Personal Finance Management Application

**Objective:** Create a comprehensive mobile application that helps users manage their personal finances, including expenses, savings, investments, banking schemes, loans, insurance, and government schemes in a single secure platform.

**Target Users:**
- Working professionals managing household budgets
- Students learning financial management
- Families tracking expenses and investments
- Individuals exploring financial schemes

---

## Technology Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Framework** | Expo (React Native) | Cross-platform development, hot reloading, easy deployment |
| **Language** | JavaScript | Widely adopted, extensive ecosystem |
| **Styling** | NativeWind (Tailwind CSS) | Utility-first CSS, rapid UI development |
| **Navigation** | React Navigation | Industry standard, Drawer + Stack support |
| **Authentication** | Firebase Auth | Secure, Google Sign-In support, session management |
| **Database** | Firebase Firestore | Real-time sync, scalable NoSQL |
| **State Management** | React Context API | Built-in, sufficient for app complexity |
| **Platforms** | Android & iOS | Single codebase for both platforms |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    React Native Screens                      │ │
│  │  Home | Dashboard | Schemes | Expenses | Investments | etc  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    React Navigation                          │ │
│  │           Stack Navigator + Drawer Navigator                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ AuthContext  │  │ ThemeContext │  │ExpenseContext│           │
│  │  (User Auth) │  │ (Dark/Light) │  │ (CRUD Ops)   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Firebase Services                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │ │
│  │  │ Firebase    │  │ Firestore   │  │ Firebase    │          │ │
│  │  │ Auth        │  │ Database    │  │ Storage     │          │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
smartfinance/
├── App.js                          # Application entry point
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel configuration
├── global.css                      # Tailwind CSS directives
├── tailwind.config.js              # Tailwind theme configuration
├── package.json                    # Dependencies
│
└── src/
    ├── components/                 # Reusable UI components
    │
    ├── config/
    │   └── firebaseConfig.js       # Firebase initialization
    │
    ├── context/
    │   ├── AuthContext.js          # Authentication state management
    │   ├── ThemeContext.js         # Theme (dark/light) management
    │   └── ExpenseContext.js       # Expense CRUD operations
    │
    ├── data/
    │   ├── schemes.js              # Financial schemes data
    │   └── categories.js           # Expense categories
    │
    ├── navigation/
    │   └── AppNavigator.js         # Navigation structure
    │
    └── screens/
        ├── HomeScreen.js           # Welcome/Landing page
        ├── auth/
        │   ├── LoginScreen.js      # User login
        │   └── RegisterScreen.js   # User registration
        ├── dashboard/
        │   └── DashboardScreen.js  # Financial overview
        ├── modules/
        │   ├── SchemesScreen.js    # Scheme categories
        │   ├── ExpensesScreen.js   # Expense management
        │   └── InvestmentsScreen.js # SIP & Gold
        ├── profile/
        │   └── ProfileScreen.js    # User profile
        └── settings/
            └── SettingsScreen.js   # App settings
```

---

## Module Description

### 1. Authentication Module
**Files:** `AuthContext.js`, `LoginScreen.js`, `RegisterScreen.js`

**Features:**
- Email/Password authentication
- Multi-step registration with personal details
- ID proof collection (Aadhaar/PAN)
- Password encryption (handled by Firebase)
- Secure session management
- Forgot password functionality

**User Data Collected:**
| Field | Type | Required |
|-------|------|----------|
| Name | String | Yes |
| Email | String | Yes |
| Phone | String | Yes |
| Date of Birth | Date | Yes |
| Password | String (encrypted) | Yes |
| ID Proof Type | String | No |
| ID Proof Number | String | No |

---

### 2. Home/Welcome Module
**File:** `HomeScreen.js`

**Features:**
- App branding display
- Right-side hamburger menu
- Profile icon (logged-in users)
- Login button (guests)
- Theme toggle (dark/light)
- Quick access feature cards
- Welcome banner with CTA

---

### 3. Dashboard Module
**File:** `DashboardScreen.js`

**Features:**
- Total balance display
- Monthly income summary
- Total expenses breakdown
- Savings percentage
- Quick action buttons
- Investment overview (SIP, Gold)
- Active schemes list
- Recent transactions

---

### 4. Schemes Module
**File:** `SchemesScreen.js`, `schemes.js`

**Scheme Categories:**

#### Deposit Schemes
| Scheme | Eligibility |
|--------|-------------|
| Savings Account | Age 18+, Minors with guardian |
| Fixed Deposit | No upper age limit, Senior benefits |
| Recurring Deposit | Monthly income earners |

#### Loan Schemes
| Scheme | Eligibility |
|--------|-------------|
| Personal Loan | Age 21-60, Regular income, Credit 650+ |
| Home Loan | Age 21-60, Property documents |
| Education Loan | Student with admission, Co-borrower |
| Gold Loan | Gold collateral, Any age 18+ |
| Business Loan | Business registration, 2+ years |

#### Government Schemes
| Scheme | Eligibility |
|--------|-------------|
| APY | Age 18-40 |
| PMJJBY | Age 18-50 |
| PPF | Indian resident, 15-year lock-in |
| SCSS | Age 60+ |

#### Insurance Schemes
| Scheme | Coverage |
|--------|----------|
| Term Insurance | ₹50L - ₹5Cr |
| Health Insurance | ₹5L - ₹1Cr |
| ULIP | Life + Investment |

#### Digital & Investment
| Scheme | Requirements |
|--------|--------------|
| SIP | PAN mandatory, KYC complete |
| Gold Investment | Bank account linked |

---

### 5. Expense Management Module
**Files:** `ExpensesScreen.js`, `ExpenseContext.js`, `categories.js`

**Expense Categories:**
1. Salary (Income)
2. Family Expenses
3. Monthly Bills
4. Birthday Expenses
5. Functions/Festivals
6. Medical
7. Education
8. Transport
9. Groceries
10. Entertainment
11. Shopping
12. Other

**Features:**
- Add/Edit/Delete expenses
- Category-wise filtering
- Monthly income vs expense comparison
- Family member management
- Birthday tracking
- Function date reminders
- Visual category analysis

---

### 6. Investments Module
**File:** `InvestmentsScreen.js`

**Investment Types:**

**SIP (Systematic Investment Plan):**
- Portfolio overview
- Fund-wise breakdown
- Returns calculation
- Unit tracking

**Gold Investment:**
- Digital gold holdings
- Sovereign Gold Bonds
- Current gold rate display
- Total value calculation

---

### 7. Settings Module
**File:** `SettingsScreen.js`, `ThemeContext.js`

**Features:**
- Profile update
- Dark/Light mode toggle
- Theme enable/disable option
- Notification preferences
- Biometric login toggle
- Export data option
- Clear cache
- Privacy policy
- Help & FAQ
- Logout with confirmation

---

## Database Schema

### Firestore Collections

```
├── users/
│   └── {userId}/
│       ├── name: string
│       ├── email: string
│       ├── phone: string
│       ├── dob: timestamp
│       ├── idProofType: string
│       ├── idProof: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── expenses/
│   └── {expenseId}/
│       ├── userId: string
│       ├── amount: number
│       ├── category: string
│       ├── description: string
│       ├── date: timestamp
│       └── createdAt: timestamp
│
├── family/
│   └── {memberId}/
│       ├── userId: string
│       ├── name: string
│       ├── relationship: string
│       ├── dob: timestamp
│       └── notes: string
│
└── investments/
    └── {investmentId}/
        ├── userId: string
        ├── type: string
        ├── name: string
        ├── amount: number
        ├── units: number
        └── startDate: timestamp
```

---

## Screen Flow

```
                    ┌──────────────┐
                    │   App Start  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Home Screen  │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌──────▼──────┐   ┌─────▼─────┐
    │   Login   │   │   Drawer    │   │  Register │
    └─────┬─────┘   │    Menu     │   └─────┬─────┘
          │         └──────┬──────┘         │
          │                │                │
          │    ┌───────────┼───────────┐    │
          │    │           │           │    │
          │ ┌──▼──┐ ┌──────▼──────┐ ┌──▼──┐ │
          │ │Dash │ │   Schemes   │ │Expe │ │
          │ │board│ │   Module    │ │nses │ │
          │ └─────┘ └─────────────┘ └─────┘ │
          │                                  │
          └──────────────┬───────────────────┘
                         │
                  ┌──────▼──────┐
                  │  Dashboard  │
                  └─────────────┘
```

---

## Security Implementation

### 1. Authentication Security
- Firebase Authentication handles password hashing
- Session tokens with automatic expiration
- Secure credential transmission over HTTPS

### 2. Data Security
- Firestore security rules enforce user-level access
- User can only read/write their own data
- Server-side timestamp validation

### 3. Client Security
- No sensitive data stored locally (except preferences)
- AsyncStorage used only for theme preferences
- Input validation on all forms

### Firestore Security Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
    }
    match /family/{memberId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## Installation Guide

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI
- Expo Go app (Android/iOS)

### Setup Steps

1. **Clone/Download Project**
   ```bash
   cd smartfinance
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   Update `src/config/firebaseConfig.js` with your Firebase project credentials.

4. **Start Development Server**
   ```bash
   npx expo start
   ```

5. **Run on Device**
   - Scan QR code with Expo Go app
   - Or use Android/iOS emulator

---

## Future Enhancements

1. **Phase 2 Features:**
   - OTP verification for phone numbers
   - Google Sign-In (requires dev build)
   - Biometric authentication
   - Push notifications

2. **Phase 3 Features:**
   - Bill payment integration
   - Bank account linking
   - Investment recommendations (AI-based)
   - Budget planning tools

3. **Phase 4 Features:**
   - Multi-language support
   - Accessibility improvements
   - Offline mode with sync
   - Family sharing features

---

## Conclusion

SmartFinance is a comprehensive personal finance management application built with modern technologies. It provides users with a unified platform to:
- Track daily expenses
- Explore financial schemes
- Manage investments
- Monitor family finances
- Stay informed about eligibility criteria

The application follows best practices in mobile development, including:
- Component-based architecture
- Context-based state management
- Secure authentication
- Real-time data synchronization
- Responsive and accessible UI

---

**Project Developed For:** Academic Submission (Final Year / PG Level)

**Technology:** Expo (React Native) + Firebase

**Version:** 1.0.0

---
