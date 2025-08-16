const express=require('express')

const {addAccount,showAllAccounts, editAccount, showOne, deleteOne}=require('../controllers/handleAccounts')


const router = express.Router()


router.route('/').post(addAccount).get(showAllAccounts)
router.route('/:id').delete(deleteOne).put(editAccount).get(showOne)

module.exports=router