var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const CartDetail = function(cartdetail) {   
  this.cart_id = cartdetail.cart_id;
  this.product_id = cartdetail.product_id;
  this.price = cartdetail.price;
  this.discount = cartdetail.discount;
  this.quantity = cartdetail.quantity;
  this.statusId = cartdetail.statusId;
  this.createdById = cartdetail.createdById;  
  this.creationDate = cartdetail.creationDate;
  this.modifiedById = cartdetail.modifiedById;
  this.modificationDate = cartdetail.modificationDate;
};

CartDetail.createCartDetail = function (cartdetail, result) {       
    pool.query("INSERT INTO cartdetail SET ?", [cartdetail], function (err, res) {
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

CartDetail.updateCartDetail = function (id,cartdetail,result) {       
    pool.query(`update cartdetail SET product_id=?, price=?,
    discount=?, quantity=?, modifiedById=?, modificationDate=? where cartdetail_id=?`, 
    [cartdetail.product_id, cartdetail.price, cartdetail.discount,cartdetail.quantity, 
        cartdetail.modifiedById, cartdetail.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

CartDetail.deleteCartDetail = function (id,result) {           
    //pool.query("update cartdetail SET statusId=? where cartdetail_id=?",
    pool.query("delete from cartdetail WHERE cartdetail_id=?",
    [id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details deleted Successfully."});

            }
        });           
};



module.exports = CartDetail;