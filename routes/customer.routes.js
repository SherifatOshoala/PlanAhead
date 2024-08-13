const express = require ('express')
const router = express.Router()
const {createCustomer, verifyCustomerEmail, customerLogin, forgotPassword, completeForgotPassword, changePassword, resendOtp, updateProfile} = require("../controllers/customer.controllers.js")

router.post('/customers', createCustomer)

router.get("/verify-email/:email/:otp", verifyCustomerEmail)

router.post('/login', customerLogin)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password', completeForgotPassword)

router.patch('/change-password/:customer_id', changePassword)

router.get('/resend-otp/:email', resendOtp)

router.patch('/update-customer-profile/:id', updateProfile)


module.exports= router
