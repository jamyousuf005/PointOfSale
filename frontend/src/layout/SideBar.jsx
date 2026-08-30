import React, { useState } from 'react';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowForward, IoIosClose } from "react-icons/io";


import { BiMenuAltLeft, BiPurchaseTag } from 'react-icons/bi';
import { BsCart2 } from 'react-icons/bs';
import { IoReturnDownBack } from 'react-icons/io5';
import { MdAccountBalanceWallet, MdPerson } from 'react-icons/md';
import { TbReportSearch } from 'react-icons/tb';
import { CiSettings } from 'react-icons/ci';
import { RiDashboard2Line } from "react-icons/ri";

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <RiDashboard2Line />,
  },
  {
    label: 'Product',
    icon: <BiMenuAltLeft />,
    sub: [
      { label: 'Category', path: '/product/category' },
      { label: 'Add Product', path: '/product/add' },
      { label: 'Product List', path: '/product/list' },
    ],
  },
  {
    label: 'Purchase',
    icon: <BiPurchaseTag />,
    sub: [
      { label: 'Purchase List', path: '/purchase/list' },
      { label: 'Add Purchase', path: '/purchase/add' },
      { label: 'Import CSV', path: '/purchase/import' },
    ],
  },
  {
    label: 'Sale',
    icon: <BsCart2 />,
    sub: [
      { label: 'Sale List', path: '/sale/list' },
      { label: 'POS', path: '/sale/pos' },
      { label: 'Add Sale', path: '/sale/add' },
      { label: 'Import CSV', path: '/sale/import' },
    ],
  },
  {
    label: 'Return',
    icon: <IoReturnDownBack />,
    sub: [
      { label: 'Sale Return', path: '/return/sale' },
      { label: 'Purchase Return', path: '/return/purchase' },
    ],
  },
  {
    label: 'Accounting',
    icon: <MdAccountBalanceWallet />,
    sub: [
      { label: 'Account List', path: '/account/list' },
      { label: 'Add Account', path: '/account/add' },
      { label: 'Money Transfer', path: '/account/transfer' },
    ],
  },
  {
    label: 'Customer',
    icon: <MdPerson />,
    sub: [
      { label: 'Customer List', path: '/customer/list' },
      { label: 'Add Customer', path: '/customer/add' },
    ],
  },
  {
    label: 'Supplier',
    icon: <MdPerson />,
    sub: [
      { label: 'Supplier List', path: '/supplier/list' },
      { label: 'Add Supplier', path: '/supplier/add' },
    ],
  },
  {
    label: 'Reports',
    icon: <TbReportSearch />,
    sub: [
      { label: 'Product Report', path: '/reports/product' },
      { label: 'Sales Report', path: '/reports/sales' },
      { label: 'Purchase Report', path: '/reports/purchase' },
      { label: 'Payment Report', path: '/reports/payment' },
    ],
  },
  {
    label: 'Settings',
    icon: <CiSettings />,
    sub: [
      { label: 'Unit', path: '/settings/unit' },
      { label: 'Brand', path: '/settings/brand' },
      { label: 'Tax', path: '/settings/tax' },
      { label: 'Warehouse', path: '/settings/warehouse' },
      { label: 'General', path: '/settings/general' },
      { label: 'Employees', path: '/settings/employees' },
    ],
  },
];

const Sidebar = ({ isOpen, onCrossClick }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const role = (localStorage.getItem('role') || 'Cashier').toLowerCase(); // Normalize to lowercase

  const filteredNavItems = navItems.filter(item => {
    if (role === 'admin') return true; // Admin sees all
    if (role === 'manager') {
      // Manager cannot see Accounting or Employees
      if (item.label === 'Accounting') return false;
      return true;
    }
    if (role === 'cashier') {
      // Cashier only sees Dashboard, Product, Sale, Return, Customer, Supplier
      const allowedForCashier = ['Dashboard', 'Product', 'Sale', 'Return', 'Customer', 'Supplier'];
      if (!allowedForCashier.includes(item.label)) return false;
      return true;
    }
    return false;
  }).map(item => {
    // Further filter sub-menus if necessary
    if (role === 'manager' && item.label === 'Settings') {
      // Filter out Employees from Settings for Manager
      return {
        ...item,
        sub: item.sub.filter(subItem => subItem.label !== 'Employees')
      };
    }
    if (role === 'cashier' && item.label === 'Product') {
      // Cashiers can only view Product List, not Add/Category
      return {
        ...item,
        sub: item.sub.filter(subItem => subItem.label === 'Product List')
      };
    }
    if (role === 'cashier' && item.label === 'Return') {
      // Cashiers can only view Sale Return
      return {
        ...item,
        sub: item.sub.filter(subItem => subItem.label === 'Sale Return')
      };
    }
    if (role === 'cashier' && item.label === 'Customer') {
      // Cashiers can only view Customer List
      return {
        ...item,
        sub: item.sub.filter(subItem => subItem.label === 'Customer List')
      };
    }
    if (role === 'cashier' && item.label === 'Supplier') {
      // Cashiers can only view Supplier List
      return {
        ...item,
        sub: item.sub.filter(subItem => subItem.label === 'Supplier List')
      };
    }
    return item;
  });

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <aside
      className={`
         fixed top-0 mt-10 left-0 h-[calc(100vh-2rem)]  w-72 overflow-y-auto
        bg-purple-100 z-50 p-4 
        transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 shadow-lg
      `}
    >
      <div className="flex w-full justify-end md:hidden">
        <IoIosClose
          onClick={onCrossClick}
          className="text-2xl cursor-pointer absolute mt-2.5"
        />
      </div>

      <ul className="space-y-1 mt-2">
        {filteredNavItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => {
                if (item.sub) {
                  toggleDropdown(index);
                } else {
                  setOpenDropdown(null); 
                  navigate(item.path);
                  if (onCrossClick) onCrossClick();
                }
              }}
              className={`w-full flex items-center justify-between 
                px-3 py-2 text-gray-800 rounded text-md transition cursor-pointer ${
                openDropdown === index ? 'bg-white' : 'hover:bg-purple-200'
              }`}
            >
              <div className=" flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.sub &&
                (openDropdown === index ? (
                  <IoIosArrowDown className="text-xl text-purple-600" />
                ) : (
                  <IoIosArrowForward className="text-xl text-purple-600" />
                ))}
            </button>

            
            {item.sub && (
              <div
                className={`overflow-hidden transition-all duration-400 bg-white rounded p-2 mt-1 space-y-1 custom-scrollbar ${openDropdown === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 p-0'}`}
                style={{
                  pointerEvents: openDropdown === index ? 'auto' : 'none',
                  overflowY: openDropdown === index ? 'auto' : 'hidden',
                }}
              >
                {item.sub.map((sub, subIdx) => (
                  <p
                    key={subIdx}
                    onClick={() => {
                      navigate(sub.path);
                      if (onCrossClick) onCrossClick();
                    }}
                    className="text-base text-gray-600 cursor-pointer hover:text-purple-700 px-2 py-1 rounded-md transition-all duration-300 
                    ease-in-out transform hover:translate-x-2"
                  >
                    {sub.label}
                  </p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;