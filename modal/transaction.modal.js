var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Transaction = function(transaction) {   
  this.user_id = transaction.user_id;
  this.order_id = transaction.order_id;
  this.shipping_id = transaction.shipping_id;
  this.payment_code = transaction.payment_code;
  this.transactiontype = transaction.transactiontype;
  this.paymentmode = transaction.paymentmode;  
  this.statusId = transaction.statusId;
  this.createdById = transaction.createdById;  
  this.creationDate = transaction.creationDate;
  this.modifiedById = transaction.modifiedById;
  this.modificationDate = transaction.modificationDate;
};

Transaction.createTransaction = function (transaction, result) {       
    pool.query("INSERT INTO transaction SET ?", transaction, function (err, res) {
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


Transaction.getAllTransaction = function (result) {       
    pool.query("select * from transaction Where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Transaction.getAllTransactionByUser = function (user_id,result) {       
    pool.query(`select * from transaction Where statusId=1 and user_id=${user_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};


module.exports = Transaction;