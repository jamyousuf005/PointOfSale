# Point of Sale (POS) System

A powerful, robust, and highly scalable Point of Sale web application built with the MERN stack (MongoDB, Express, React, Node.js). Engineered to give you complete control over your retail operations—from atomic transaction processing and dynamic dashboards to intricate inventory auditing and accounting balance tracking.

## 🚀 Features & Capabilities

- **⚡ Lightning-Fast POS Interface**: Dedicated, responsive Point of Sale screen designed for rapid checkouts and seamless user experience.
- **🏢 True Multi-Tenant Architecture**: Built from the ground up as a SaaS-ready platform. Complete data isolation ensures multiple businesses can securely operate within the same system independently.
- **📊 Real-Time Dynamic Dashboard**: Instantly view your business's health with live data on Revenue, Profit, Sale Returns, and Purchase Returns. Features a beautiful Yearly Report chart to track growth.
- **📈 Advanced Inventory Movement Ledger**: Never lose track of your stock. Every single transaction (Sales, Purchases, Returns, Adjustments) creates an immutable audit trail detailing exactly why, when, and how your stock quantities changed.
- **🧾 Intelligent Return Validations**: Bulletproof return system that strictly validates against original purchases and sales, ensuring no one can return more stock than what was originally transacted.
- **💼 Automated Accounting & Balances**: Dynamically tracks Customer and Supplier balances. Whenever a sale or purchase is marked as anything other than "Paid", the system automatically tracks the owed or pending balances with pinpoint accuracy.
- **👥 Comprehensive Entity Management**: Beautiful interfaces to add, edit, and track Products, Categories, Brands, Customers, Suppliers, and Employees.
- **🔐 Secure Authentication**: Robust JWT-based authentication and authorization with role-based access control.
- **📑 Detailed Analytics & Reporting**: Generate detailed tables and PDF reports for products, sales, purchases, and payments using powerful data-grids.

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
npm start
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
*(The React app will typically run on `http://localhost:5174`)*

## 📖 Walkthrough & Usage

1. **Start the Application**: Ensure both backend and frontend servers are running.
2. **Access the Web App**: Navigate to the frontend URL (e.g., `http://localhost:5174`).
3. **Login / Register**: Create a new account or log in if you already have credentials.
4. **Dashboard Navigation**: Use the sidebar to navigate between Products, Purchases, Sales, Accounts, and Reports.
5. **POS Terminal**: Head over to the `Sales > POS` route to access the rapid checkout interface. Add products to the cart and process payments instantly.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the ISC License.
