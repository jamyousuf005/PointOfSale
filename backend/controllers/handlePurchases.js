const Purchase = require('../models/purchase');

async function addPurchase(req,res){
    const body=req.body
    const newPurchase= await Purchase.insertOne(body)
    return res.status(201).json({msg:'Purchase made successfully',newPurchase})
}

 async function showPurchase(req,res){
     const showAllPurchases = await Purchase.find({});
     res.json({msg:'here is response',showAllPurchases})
 }

 async function deletePurchase(req,res){
     const deleteById  = req.params.id
     await Purchase.findByIdAndDelete(deleteById)
     return res.json({msg:"purchase deleted"})
}
   
  async function editPuchase(req,res) {
    const id = req.params.id
     await Purchase.findByIdAndUpdate(id,req.body)
    return res.json({msg:'updated the purchase'})
  }
   
  async function showOnePurchase(req,res){
   const id = req.params.id
   const purchase=await Purchase.findById(id)
   res.json(purchase)
  }

module.exports={
    addPurchase,
    showPurchase,
    deletePurchase,
    editPuchase,
    showOnePurchase
}