const mongoose = require('mongoose')

const addSale = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
   paymentMethod: {
       type: String
   },
   accountId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Account'
   },
   totalAmount: {
       type: Number
   },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        productName: String,
        productCode: String,
        alertQuantity: Number,
        productCost: Number,
        quantity: Number,
        discount: Number,
        tax: Number,
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