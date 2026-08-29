# Point of Sale (POS) System

A comprehensive, full-stack Point of Sale web application built with the MERN stack (MongoDB, Express, React, Node.js). This system is designed to handle retail operations including sales, inventory management, purchasing, accounting, and reporting.

## 🚀 Features

- **Authentication & Authorization**: Secure user login and registration using JWT.
- **Dashboard**: High-level overview of transactions and system statistics.
- **Product Management**: 
  - Add, edit, delete, and list products.
  - Manage categories, brands, and units.
- **Sales & POS Interface**:
  - Dedicated POS screen for rapid checkout.
  - Record sales, manage sale returns, and import sales data.
- **Purchases Management**:
  - Record and track purchases from suppliers.
  - Manage purchase returns.
- **Account & Finance**:
  - Track accounts, money transfers, and payments.
- **Customer Management**:
  - Maintain a database of customers and their transaction history.
- **Comprehensive Reporting**:
  - Generate reports for products, sales, purchases, and payments.
- **System Settings**:
  - Configure taxes, general application settings, and user profiles.

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling & UI**: Tailwind CSS, Material UI (MUI), Framer Motion
- **Routing**: React Router DOM
- **Data Visualization**: Chart.js, React-Chartjs-2
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **File Uploads**: Multer
- **Validation**: Joi (available for schema validation)

## 📁 Project Structure

```text
PointOfSale/
├── backend/            # Express Node.js Server
│   ├── src/
│   │   ├── core/       # Server setup and database connection
│   │   ├── features/   # Feature-based API endpoints (auth, products, sales, etc.)
│   │   └── middlewares/# Custom middlewares (asyncHandler, errorHandler, etc.)
│   └── .env            # Backend environment variables
├── frontend/           # React Vite Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── core/       # Context API and core frontend logic
│   │   ├── features/   # Feature-based views (Dashboard, POS, Settings, etc.)
│   │   └── layout/     # General app layouts
│   └── .env            # Frontend environment variables
└── uploads/            # Directory for uploaded media/files
```

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas cluster)

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd PointOfSale
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend/` directory based on your environment. You will need at least:
  ```env
  PORT=8001
  MONGODB_URL=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  ```
- Start the backend development server:
```bash
npm run start
```
*(The server should run on `http://localhost:8001`)*

### 3. Frontend Setup
Open a new terminal tab.
```bash
cd frontend
npm install
```
- Start the frontend development server:
```bash
npm run dev
```
*(The React app will typically run on `http://localhost:5173`)*

## 📖 Walkthrough & Usage

1. **Start the Application**: Ensure both backend and frontend servers are running.
2. **Access the Web App**: Navigate to the frontend URL (e.g., `http://localhost:5173`).
3. **Login / Register**: Create a new account or log in if you already have credentials.
4. **Dashboard Navigation**: Use the sidebar to navigate between Products, Purchases, Sales, Accounts, and Reports.
5. **POS Terminal**: Head over to the `Sales > POS` route to access the rapid checkout interface. Add products to the cart and process payments instantly.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the ISC License.
