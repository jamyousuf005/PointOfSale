import { ContextProvider } from "./components/ContextApi";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from './components/Profile';
import POS from "./subCoponents/POS";
import GeneralSettings from "./subCoponents/GeneralSettings";
import MyTransactions from "./components/MyTransactions";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import Category from "./subCoponents/Category";
import AddProduct from "./subCoponents/AddProduct";
import ProductList from "./subCoponents/ProductList";
import PurchaseList from "./subCoponents/PurchaseList";
import AddPurchase from "./subCoponents/AddPurchase";
import ImportPurchase from "./subCoponents/ImportPurchase";
import SaleList from "./subCoponents/SaleList";
import AddSale from "./subCoponents/AddSale";
import ImportSale from "./subCoponents/ImportSale";
import Sale from "./subCoponents/Sale";
import Purchase from "./subCoponents/Purchase";
import AccountList from "./subCoponents/AccountList";
import AddAccount from "./subCoponents/AddAccount";
import MoneyTransfer from "./subCoponents/MoneyTransfer";
import CustomerList from "./subCoponents/CustomerList";
import AddCustomer from "./subCoponents/AddCustomer";
import ProductReport from "./subCoponents/ProductReport";
import SaleReport from "./subCoponents/SaleReport";
import PurchaseReport from "./subCoponents/PurchaseReport";
import PaymentReport from "./subCoponents/PaymentReport";
import Unit from "./subCoponents/Unit";
import Brand from "./subCoponents/Brand";
import Tax from "./subCoponents/Tax";
import EditProduct from './subCoponents/EditProduct'
import EditPurchases from "./subCoponents/EditPurchases";
import EditSale from "./subCoponents/EditSale";
import EditAccount from "./subCoponents/EditAccount";

function App() {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Dashboard />}>
            <Route path="/dashboard" element={<Home />} />
            
            <Route path="product/category" element={<Category />} />
            <Route path="product/add" element={<AddProduct />} />
            <Route path='product/edit/:id' element={<EditProduct/>} />
            <Route path="product/list" element={<ProductList />} />

            <Route path="purchases/list" element={<PurchaseList />} />
            <Route path="purchase/add" element={<AddPurchase />} />
            <Route path="purchase/import" element={<ImportPurchase />} />
             <Route path='purchases/edit/:id' element={<EditPurchases />} />


            <Route path="sale/list" element={<SaleList />} />
            <Route path="sale/pos" element={<POS />} />
            <Route path="sale/add" element={<AddSale />} />
            <Route path="sale/import" element={<ImportSale />} />
            <Route path='sale/edit/:id' element={<EditSale/>} />

            <Route path="return/sale" element={<Sale />} />
            <Route path="return/purchase" element={<Purchase />} />

            <Route path="account/list" element={<AccountList />} />
            <Route path="account/add" element={<AddAccount />} />
            <Route path="account/transfer" element={<MoneyTransfer />} />
            <Route path="account/edit/:id" element={<EditAccount/>} />

            <Route path="customer/list" element={<CustomerList />} />
            <Route path="customer/add" element={<AddCustomer />} />

            <Route path="reports/product" element={<ProductReport />} />
            <Route path="reports/sales" element={<SaleReport />} />
            <Route path="reports/purchase" element={<PurchaseReport />} />
            <Route path="reports/payment" element={<PaymentReport />} />

            <Route path="settings/unit" element={<Unit />} />
            <Route path="settings/brand" element={<Brand />} />
            <Route path="settings/tax" element={<Tax />} />
            <Route path="settings/general" element={<GeneralSettings />} />
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
