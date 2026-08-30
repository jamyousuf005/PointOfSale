const mongoose = require('mongoose')

    const addAccount = new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
            currentBalance: {
                type: Number,
                default: function() { return this.initialBalance; }
            },
            note:{
                type:String,
                required:true
            }
    })

    const Account = mongoose.model('Account',addAccount)

    module.exports=Account