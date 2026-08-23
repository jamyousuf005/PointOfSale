const express=require('express')

const {addAccount,showAllAccounts, editAccount, showOne, deleteOne}=require('./account.controller')
const ensureAuthenticated = require('../../middlewares/auth')


const router = express.Router()


router.route('/')
.all(ensureAuthenticated)
.post(addAccount).get(showAllAccounts)

router.route('/:id').all(ensureAuthenticated).delete(deleteOne).put(editAccount).get(showOne)

module.exports=router