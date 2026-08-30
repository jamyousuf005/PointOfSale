const express=require('express')

const {addAccount,showAllAccounts, editAccount, showOne, deleteOne}=require('./account.controller')
const ensureAuthenticated = require('../../middlewares/auth')


const authorizeRoles = require('../../middlewares/authorizeRoles')

const router = express.Router()

router.route('/')
.all(ensureAuthenticated, authorizeRoles('Admin'))
.post(addAccount).get(showAllAccounts)

router.route('/:id').all(ensureAuthenticated, authorizeRoles('Admin')).delete(deleteOne).put(editAccount).get(showOne)

module.exports=router