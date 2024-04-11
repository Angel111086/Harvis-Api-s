var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Category = function(category) {   
  this.category_name = category.category_name;
  this.statusId = category.statusId;
  this.createdById = category.createdById;  
  this.creationDate = category.creationDate;
  this.modifiedById = category.modifiedById;
  this.modificationDate = category.modificationDate;
};

Category.createCategory = function (category, result) {       
    pool.query("INSERT INTO category SET ?", category, function (err, res) {
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

Category.updateCategory = function (id,category,result) {       
    pool.query("update category SET category_name=?, modifiedById=?, modificationDate=? where category_id=?", 
    [category.category_name,category.modifiedById, category.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

Category.deleteCategory = function (id,result) {       
    pool.query("delete from category where category_id=?", 
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

Category.getAllCategory = function (result) {       
    pool.query("select * from category Where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Category.getCategoryById = function (id,result) {       
    pool.query("select * from category where category_id=?", 
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

module.exports = Category;