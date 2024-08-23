const jwt = require('jsonwebtoken');
const Customers = require("../models/customers.model.js");


const authorisation = (req, res, next) => {
try {
const {token} = req.headers
if(!token) throw new Error ('Unathorised access!')
jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
if(err){
   return res.status(401).json({
status: false,
message: "Unauthorized access"
    })
}
const customer = await Customers.findOne({where: {email: decoded.email}})
if(customer == null) throw new Error ('Unauthorised access!')
req.params.customer_id = customer.customer_id
next()
  })
}
catch(error){
res.status(401).json({
    status: false,
    message: error.message
})
}
}

module.exports = {authorisation}