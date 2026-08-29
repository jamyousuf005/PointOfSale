
const express = require('express')
const cors = require("cors")
require('dotenv').config()
const bodyParser=require('body-parser')
const productsRouter= require('../features/products/product.routes')
const categoryRouter = require('../features/products/category.routes')
const purchaseRouter=require('../features/purchases/purchase.routes')
const salesRouter = require('../features/sales/sale.routes')
const accountsRouter=require('../features/accounts/account.routes')
const userRouter=require('../features/users/user.routes')
const returnRouter=require('../features/returns/return.routes')
const reportRouter=require('../features/reports/report.routes')
const warehouseRouter=require('../features/warehouses/warehouse.routes')
const moneyTransferRouter = require('../features/accounts/moneyTransfer.routes')
const { connectMongoDb } = require('./connection');
const path = require('path')
const app = express()

const PORT = process.env.PORT || 8001

const mongo_url=process.env.MONGODB_URL
connectMongoDb(mongo_url)
.then(()=>console.log("mongodb connected"))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors('*'))
app.use(bodyParser.json())
app.use('/uploads', express.static(path.resolve(__dirname, '../../../uploads')))

app.get('/',(req,res)=>{
    res.send('im running')
})

const errorHandler = require('../middlewares/errorHandler')

app.use('/auth',userRouter)

app.use('/api/products',productsRouter)
app.use('/api/categories',categoryRouter)
app.use('/api/purchase',purchaseRouter)
app.use('/api/sales',salesRouter)
app.use('/api/accounts',accountsRouter)
app.use('/api/returns',returnRouter)
app.use('/api/reports',reportRouter)
app.use('/api/warehouses',warehouseRouter)
app.use('/api/money-transfers', moneyTransferRouter)

app.use(errorHandler)

app.listen(PORT,()=>console.log("server started"))
