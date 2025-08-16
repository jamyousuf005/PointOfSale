const mongoose = require('mongoose')

const addSale = new mongoose.Schema({
   customer:{
    type:String,
    required:true
   },
   warehouse:{
    type:String,
    required:true
   },
   biller:{
    type:String,
    required:true
   },
   saleStatus:{
    type:String
   },
   paymentStatus:{
     type:String
   },
    products: [{
        productName: String,
        productCode: String,
        alertQuantity: Number,
        productCost: Number,
        subTotal: Number,
    }],
    orderTax:{
        type:Number,
    } ,
    discount:{
        type:Number,
    },
    shippingCost:{
        type:Number,
    },
    Note:{
        type:String
    }   
},{timestamps:true}) 


const Sale = mongoose.model('sale',addSale)

module.exports=Sale