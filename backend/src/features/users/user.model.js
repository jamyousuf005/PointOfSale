const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Cashier'],
        default: 'Admin'
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false // will be set during signup or employee creation
    }

},{timestamps:true})

const User = mongoose.model('user',userSchema)

module.exports=User