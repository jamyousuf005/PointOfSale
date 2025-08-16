    const mongoose = require('mongoose')

    const addAccount = new mongoose.Schema({
            name:{
                type:String,
                required:true
            },
            accountNumber:{
                type:String,
                required:true
            },
            initialBalance:{
                type:Number,
                required:true,
            },
            note:{
                type:String,
                required:true
            }
    })

    const Account = mongoose.model('Account',addAccount)

    module.exports=Account