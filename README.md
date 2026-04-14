# QuantiMeasure — Frontend

A modern React + Vite frontend for the Quantity Measurement Spring Boot backend.

## Project Structure

```
quantity-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Router + route definitions
    ├── index.css              # Global styles & CSS variables
    ├── constants.js           # Units, types, formatters
    ├── api/
    │   ├── client.js          # Axios instance with JWT interceptor
    │   ├── auth.js            # Login / Register API calls
    │   └── quantities.js      # All quantity operation API calls
    ├── context/
    │   └── AuthContext.jsx    # Global auth state (JWT + user)
    ├── components/
    │   ├── UI.jsx             # Shared UI: Button, Input, Card, Badge
    │   ├── Sidebar.jsx        # Navigation sidebar
    │   └── DashboardLayout.jsx # Protected layout wrapper
    └── pages/
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── OverviewPage.jsx
        ├── ConvertPage.jsx
        ├── ComparePage.jsx
        ├── ArithmeticPage.jsx
        └── HistoryPage.jsx
```

## Setup & Run

### 1. Start the Backend
```bash
cd QuantityMeasurementApp
mvn spring-boot:run
```
Backend runs on http://localhost:8080

### 2. Install Frontend Dependencies
```bash
cd quantity-frontend
npm install
```

### 3. Start the Frontend
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## Build for Production
```bash
npm run build
```

