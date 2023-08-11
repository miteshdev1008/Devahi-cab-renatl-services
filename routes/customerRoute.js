//creating the route
const cutomerRoute = require('express').Router();

//importing the methods
const { createCustomer, getAllEnquiries, deleteEnquiries, updatePaymentStatus, paidEnquiry, downloadPdf } = require('../controllers/customerController.js');
const { isLogin } = require('../middlewares/authandtoken.js');

//creation of query
cutomerRoute.post('/createquiry', createCustomer);

//getting all queries
cutomerRoute.get('/getallinquiries', isLogin, getAllEnquiries);

//deleting all queries
cutomerRoute.delete('/deleteinquiries/:id', isLogin, deleteEnquiries);

cutomerRoute.put('/updatePaymentStatus/:id', isLogin, updatePaymentStatus);

cutomerRoute.get('/getpaidenquirey', isLogin, paidEnquiry);

cutomerRoute.get('/downloadpdf', isLogin, downloadPdf);
//expoorting the route
module.exports = cutomerRoute;