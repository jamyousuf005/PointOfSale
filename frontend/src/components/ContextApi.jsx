import { createContext, useState,useEffect, use } from "react";
import laptop from "../assets/laptop.jpeg";
import laptop2 from "../assets/laptop2.jpg";

export const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    
  const customers = [
  {
    id: 1,
    group: "Regular Customer",
    name: "Kamal udin Memon",
    company: "Teacher",
    email: "",
    phone: "03133006400",
    tax: "",
    address: "Badurabad Colony Dadu, Dadu ,Pakistan",
    balance: "0.00",
  },
  {
    id: 2,
    group: "Regular Customer",
    name: "Farhan Mallah",
    company: "ELDC Dadu",
    email: "",
    phone: "03103635188",
    tax: "0",
    address: "ELDC Dado Road Dadu, Dadu ,Pakistan",
    balance: "0.00",
  },
  {
    id: 3,
    group: "Regular Customer",
    name: "Muhammad Saleem Mangi",
    company: "advocate",
    email: "",
    phone: "03003238348",
    tax: "",
    address: "Wapda Colony Moro, Moro ,Pakistan",
    balance: "0.00",
  },
];   



   const [products,setProducts]=useState([])
   const [purchases,setPurchases] = useState([])
   const [sales,setSales]=useState([])    
   const [accounts,setAccounts]=useState([])
   
     
   const updateProduct = (productId, newProductData) => {
    console.log(productId,newProductData)
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, ...newProductData } : product
      )
    );
  };


    
    useEffect(()=>{
      fetch('http://localhost:8001/api/accounts')
      .then((res)=>res.json())
      .then((data)=> setAccounts(data))
      .catch((err)=>console.log(err))
    },[])
      
    useEffect(()=>{
         fetch(`http://localhost:8001/api/sales`)
         .then((res)=> res.json())
         .then((data)=> setSales(data))
         .catch((err)=>console.log(err))
    },[])

 useEffect(() => {
       fetch('http://localhost:8001/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  useEffect(() => {
         fetch(`http://localhost:8001/api/purchases`)
        .then((res)=> res.json())
        .then((data)=> setPurchases(data.showAllPurchases))
        .catch((err)=> console.log('error fetching api',err))
       
     }, [])

  return (
    <ContextApi.Provider value={{ laptop, laptop2 ,products,setProducts,customers
    ,purchases,setPurchases,sales,setSales,accounts,setAccounts,updateProduct}}>
      {children}
    </ContextApi.Provider>
  );
};
