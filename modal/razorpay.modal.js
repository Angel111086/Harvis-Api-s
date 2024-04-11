var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Razorpay = function(razorpay) {   
  this.user_id = razorpay.user_id;
  this.razorpay_paymentid = razorpay.razorpay_paymentid;
  this.org_name = razorpay.org_name;
  this.status = razorpay.status;
  this.payableAmount = razorpay.payableAmount;
  this.shipping_id = razorpay.shipping_id;
  this.statusId = razorpay.statusId;
  this.createdById = razorpay.createdById;  
  this.creationDate = razorpay.creationDate;
  this.modifiedById = razorpay.modifiedById;
  this.modificationDate = razorpay.modificationDate;
};

Razorpay.createRazorpay = function (razorpay, result) {       
    pool.query("INSERT INTO razorpaydetails SET ?", razorpay, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"Details Saved Successfully."});

            }
        });           
};

Razorpay.getAllDetails = function (result) {       
    pool.query(`select razor.*, user.user_name, ship.address_line1,ship.address_line2,ship.city 
                from razorpaydetails razor
                LEFT JOIN user as user ON(razor.user_id = user.user_id) 
                LEFT JOIN shippingaddress as ship ON(razor.shipping_id = ship.shipping_id)`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Razorpay.getAllDetailsOfUser = function (id,result) {       
    pool.query(`select razor.*, user.user_name, ship.address_line1,ship.address_line2,ship.city 
                from razorpaydetails razor
                LEFT JOIN user as user ON(razor.user_id = user.user_id) 
                LEFT JOIN shippingaddress as ship ON(razor.shipping_id = ship.shipping_id) 
                where razor.user_id=${id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};
module.exports = Razorpay;