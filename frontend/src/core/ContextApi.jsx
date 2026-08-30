import { createContext, useState, useEffect, use } from "react";
import laptop from '../assets/laptop.jpeg';
import laptop2 from '../assets/laptop2.jpg';

export const ContextApi = createContext();

export const ContextProvider = ({ children }) => {

  const [customers, setCustomers] = useState([]);



  const [products, setProducts] = useState([])
  const [purchases, setPurchases] = useState([])
  const [sales, setSales] = useState([])
  const [accounts, setAccounts] = useState([])






  useEffect(() => {


    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAccounts(data);
      })
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSales(data);
      })
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.showAllPurchases)) setPurchases(data.showAllPurchases);
      })
      .catch((err) => console.error('error fetching api', err))

  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/customers`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .catch((err) => console.error('Error fetching customers:', err))
  }, [])

  return (
    <ContextApi.Provider value={{
      laptop, laptop2, products, setProducts, customers, setCustomers
      , purchases, setPurchases, sales, setSales, accounts, setAccounts
    }}>
      {children}
    </ContextApi.Provider>
  );
};
