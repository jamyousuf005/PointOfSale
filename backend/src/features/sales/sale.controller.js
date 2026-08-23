const Sale = require('./sale.model')

async function addSale(req,res){
    const body=req.body;
   const newSale= await Sale.create(body)
    return res.json({msg:'added',newSale})
}

async function showSales(req,res){
    const ShowAllSales=await Sale.find({})
    return res.status(200).json(ShowAllSales)
}
async function deleteSale(req,res){
     const id = req.params.id
     const deletedSale = await Sale.findByIdAndDelete(id)
     return res.json({msg:'deleted'})
}

async function showOne(req,res){
    const id = req.params.id;
    const productWithId = await Sale.findById(id)
    return res.json(productWithId); 

}
 async function editSale(req,res){
     const id = req.params.id
     const editedSale = await Sale.findByIdAndUpdate(id,req.body)
     return res.json({msg:"updated the sale"})
 }


module.exports={
    addSale,
    showSales,
    deleteSale,
    showOne,
    editSale
}