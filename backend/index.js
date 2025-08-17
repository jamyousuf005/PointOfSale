
const express = require('express')
const cors = require("cors")
require('dotenv').config()
const bodyParser=require('body-parser')
const productsRouter= require('./routes/product')
const purchaseRouter=require('./routes/purchase')
const salesRouter = require('./routes/sale')
const accountsRouter=require('./routes/account')
const userRouter=require('./routes/user')
const { connectMongoDb } = require('./connection');
const app = express()

const PORT = process.env.PORT || 8001

const mongo_url=process.env.MONGODB_URL
connectMongoDb(mongo_url)
.then(()=>console.log("mongodb connected"))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(bodyParser.json())

app.use('/auth',userRouter)

app.use('/api/products',productsRouter)
app.use('/api/purchase',purchaseRouter)
app.use('/api/sales',salesRouter)
app.use('/api/accounts',accountsRouter)

app.listen(PORT,()=>console.log("server started"))
