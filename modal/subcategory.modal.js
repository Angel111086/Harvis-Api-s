var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Subcategory = function(subcategory) {   
  this.subcategory_name = subcategory.subcategory_name;
  this.category_id = subcategory.category_id;
  this.statusId = subcategory.statusId;
  this.createdById = subcategory.createdById;  
  this.creationDate = subcategory.creationDate;
  this.modifiedById = subcategory.modifiedById;
  this.modificationDate = subcategory.modificationDate;
};

Subcategory.createSubcategory = function (subcategory, result) {       
    pool.query("INSERT INTO subcategory SET ?", subcategory, function (err, res) {
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

Subcategory.updateSubcategory = function (id,subcategory,result) {       
    pool.query(`update subcategory SET subcategory_name=?, modifiedById=?, 
    modificationDate=? where subcategory_id=?`, 
    [subcategory.subcategory_name,subcategory.modifiedById, subcategory.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

Subcategory.deleteSubcategory = function (id,result) {       
    pool.query("delete from subcategory where subcategory_id=?", 
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

Subcategory.getAllSubcategory = function (result) {       
    pool.query("select * from subcategory Where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Subcategory.getAllSubcategoryByCategoryId = function (category_id, result) {       
    pool.query("select * from subcategory Where statusId=1 and category_id=?", 
                [category_id],function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Subcategory.getSubcategoryById = function (id,result) {       
    pool.query("select * from subcategory where subcategory_id=?", 
    [id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = Subcategory;