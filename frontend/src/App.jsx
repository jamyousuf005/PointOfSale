import { ContextProvider } from './core/ContextApi';
import Dashboard from './layout/Dashboard';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Profile from './features/settings/Profile';
import POS from './features/sales/POS';
import GeneralSettings from './features/settings/GeneralSettings';
import Employees from './features/settings/Employees';
import MyTransactions from './features/dashboard/MyTransactions';
import Home from "./features/dashboard/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Category from './features/settings/Category';
import AddProduct from './features/products/AddProduct';
import ProductList from './features/products/ProductList';
import PurchaseList from './features/purchases/PurchaseList';
import AddPurchase from './features/purchases/AddPurchase';
import ImportPurchase from './features/purchases/ImportPurchase';
import SaleList from './features/sales/SaleList';
import AddSale from './features/sales/AddSale';
import ImportSale from './features/sales/ImportSale';
import Sale from './features/sales/Sale';
import AddSaleReturn from './features/sales/AddSaleReturn';
import Purchase from './features/purchases/Purchase';
import AddPurchaseReturn from './features/purchases/AddPurchaseReturn';
import AccountList from './features/accounts/AccountList';
import AddAccount from './features/accounts/AddAccount';
import MoneyTransfer from './features/accounts/MoneyTransfer';
import CustomerList from './features/customers/CustomerList';
import AddCustomer from './features/customers/AddCustomer';
import SupplierList from './features/suppliers/SupplierList';
import AddSupplier from './features/suppliers/AddSupplier';
import ProductReport from './features/products/ProductReport';
import SaleReport from './features/sales/SaleReport';
import PurchaseReport from './features/purchases/PurchaseReport';
import PaymentReport from './features/accounts/PaymentReport';
import Unit from './features/settings/Unit';
import Brand from './features/settings/Brand';
import Tax from './features/settings/Tax';
import Warehouse from './features/settings/Warehouse';
import EditProduct from './features/products/EditProduct';
import EditPurchases from './features/purchases/EditPurchases';
import EditSale from './features/sales/EditSale';
import EditAccount from './features/accounts/EditAccount';
import { ToastContainer } from "react-toastify";
import { useState } from "react";

function App() {
  const [isAuthenticated] = useState(() =>
    localStorage.getItem("token") ? true : false
  );

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <ContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* ✅ Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Home />} />

            <Route path="product/category" element={<Category />} />
            <Route path="product/add" element={<AddProduct />} />
            <Route path="product/edit/:id" element={<EditProduct />} />
            <Route path="product/list" element={<ProductList />} />

            <Route path="purchase/list" element={<PurchaseList />} />
            <Route path="purchase/add" element={<AddPurchase />} />
            <Route path="purchase/import" element={<ImportPurchase />} />
            <Route path="purchase/edit/:id" element={<EditPurchases />} />

            <Route path="sale/list" element={<SaleList />} />
            <Route path="sale/pos" element={<POS />} />
            <Route path="sale/add" element={<AddSale />} />
            <Route path="sale/import" element={<ImportSale />} />
            <Route path="sale/edit/:id" element={<EditSale />} />

            <Route path="return/sale" element={<Sale />} />
            <Route path="return/sale/add" element={<AddSaleReturn />} />
            <Route path="return/purchase" element={<Purchase />} />
            <Route path="return/purchase/add" element={<AddPurchaseReturn />} />

            <Route path="account/list" element={<AccountList />} />
            <Route path="account/add" element={<AddAccount />} />
            <Route path="account/transfer" element={<MoneyTransfer />} />
            <Route path="account/edit/:id" element={<EditAccount />} />

            <Route path="customer/list" element={<CustomerList />} />
            <Route path="customer/add" element={<AddCustomer />} />

            <Route path="supplier/list" element={<SupplierList />} />
            <Route path="supplier/add" element={<AddSupplier />} />

            <Route path="reports/product" element={<ProductReport />} />
            <Route path="reports/sales" element={<SaleReport />} />
            <Route path="reports/purchase" element={<PurchaseReport />} />
            <Route path="reports/payment" element={<PaymentReport />} />

            <Route path="settings/unit" element={<Unit />} />
            <Route path="settings/brand" element={<Brand />} />
            <Route path="settings/tax" element={<Tax />} />
            <Route path="settings/warehouse" element={<Warehouse />} />
            <Route path="settings/general" element={<GeneralSettings />} />
            <Route path="settings/employees" element={<Employees />} />
            <Route path="POS" element={<POS />} />

            <Route path="profile" element={<Profile />} />
            <Route path="mytransactions" element={<MyTransactions />} />
          </Route>
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
