const express= require('express')
const {handleUserSignUp, handleUserLogin, getEmployees, addEmployee, deleteEmployee}=require('./user.controller')
const {signUpValidation, loginValidation}= require('../../middlewares/authValidation')

const router = express.Router()
const auth = require('../../middlewares/auth')
const authorizeRoles = require('../../middlewares/authorizeRoles')

router.post('/signup',signUpValidation,handleUserSignUp)
router.post('/login',loginValidation,handleUserLogin)

// Employee management routes
router.get('/employees', auth, getEmployees)
router.post('/employees', auth, authorizeRoles('Admin'), addEmployee)
router.delete('/employees/:id', auth, authorizeRoles('Admin'), deleteEmployee)
 
module.exports=router   