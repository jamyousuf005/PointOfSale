
const express = require('express')
const cors = require("cors")
require('dotenv').config()
const bodyParser=require('body-parser')
const productsRouter= require('../features/products/product.model')
const purchaseRouter=require('../features/purchases/purchase.model')
const salesRouter = require('../features/sales/sale.model')
const accountsRouter=require('../features/accounts/account.model')
const userRouter=require('../features/users/user.model')
const { connectMongoDb } = require('./connection');
const app = express()

const PORT = process.env.PORT || 8001

const mongo_url=process.env.MONGODB_URL
connectMongoDb(mongo_url)
.then(()=>console.log("mongodb connected"))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors('*'))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send('im running')
})

app.use('/auth',userRouter)

app.use('/api/products',productsRouter)
app.use('/api/purchase',purchaseRouter)
app.use('/api/sales',salesRouter)
app.use('/api/accounts',accountsRouter)

app.listen(PORT,()=>console.log("server started"))
