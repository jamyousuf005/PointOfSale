const Account = require('./account.model')

async function addAccount(req,res){
    const newAccount = await Account.create(req.body)
    return res.json({msg:'account added'})
}

async function showAllAccounts(req,res){
    const allAccounts = await Account.find({})
    return res.json(allAccounts)
}

async function deleteOne(req,res){
    const id = req.params.id
    await Account.findByIdAndDelete(id)
    res.json({msg:'deleted'})
}

async function showOne(req,res){
    const id =req.params.id
    const showOneAcc= await Account.findById(id)
    res.json(showOneAcc)
}

async function editAccount(req,res){
    const id=req.params.id
    const editById = await Account.findByIdAndUpdate(id,req.body)
    res.json({msg:"Account updated"})
}
module.exports={
    addAccount,
    showAllAccounts,
    deleteOne,
    showOne,
    editAccount
}