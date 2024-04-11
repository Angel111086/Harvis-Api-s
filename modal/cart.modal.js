var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor

const Cart = function(cart) {   
  this.user_id = cart.user_id;
  this.date_placed = cart.date_placed;
  this.statusId = cart.statusId;
  this.createdById = cart.createdById;  
  this.creationDate = cart.creationDate;
  this.modifiedById = cart.modifiedById;
  this.modificationDate = cart.modificationDate;
};

Cart.createCart = function (cart, result) {       
    pool.query("INSERT INTO cart SET ?", [cart], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"Details Saved Successfully.", id:res.insertId });

            }
        });           
};

Cart.deleteCart = function (id,cart,result) {           
    pool.query("update cart SET statusId=? where cart_id=?", 
    [cart.statusId,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details deleted Successfully."});

            }
        });           
};


module.exports = Cart;