var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Product = function(product, file) {   
  this.category_id = product.category_id;
  this.subcategory_id = product.subcategory_id;    
  this.product_name = product.product_name;
  this.product_description = product.product_description;   
  this.product_price = product.product_price;   
  this.product_discount = product.product_discount;   
  this.product_actualprice = product.product_actualprice;   
  //this.product_quantity = product.product_quantity;   
  this.product_image = file;   
  this.statusId = product.statusId;
  this.createdById = product.createdById;  
  this.creationDate = product.creationDate;
  this.modifiedById = product.modifiedById;
  this.modificationDate = product.modificationDate;
};

Product.createProduct = function (product, result) {       
    pool.query("INSERT INTO product SET ?", product, function (err, res) {
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

Product.updateProduct = function(id,product,result) {
    var update_query, value;
    pool.query(`select * from product where product_id=${id}`,function(err, data){
        if(err){
            console.log(err);
            result(err, null);
        }
        else{
            console.log(data.length);
            if(data.length>0)
            {
                if(product.product_image !== undefined){
                    update_query = `update product SET product_name=?, product_description=?, product_price=?,
                    product_discount=?, product_actualprice=?, product_image=?, modifiedById=?, 
                    modificationDate=? where product_id=?`;

                    value = [product.product_name, product.product_description, product.product_price, 
                    product.product_discount, product.product_actualprice, product.product_image,product.modifiedById,
                    product.modificationDate, id];
                }
                else{
                    update_query = `update product SET product_name=?, product_description=?, product_price=?,
                    product_discount=?, product_actualprice=?, modifiedById=?, 
                    modificationDate=? where product_id=?`;

                    value = [product.product_name, product.product_description, product.product_price, product.product_discount,
                    product.product_actualprice, product.modifiedById,
                    product.modificationDate, id];
                }
                pool.query(update_query, value, function (err, res) 
                {
                    if(err) 
                    {
                        console.log(err);
                        result(err, null);
                    }
                    else
                    {                       
                            result(null, {status:200,success:true,message:"Details Updated Successfully."});
            
                    }
                });

            }

        }
    });
           
};

Product.deleteProduct = function (id,result) {       
    pool.query("delete from product where product_id=?", 
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


Product.getProductById = function (id,result) {       
    pool.query("select * from product where product_id=?", 
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


Product.getAllProduct = function (category_id, subcategory_id ,result) {       
    pool.query(`select pro.*, cat.category_name, sub.subcategory_name
                from product pro LEFT JOIN category as cat 
                ON(pro.category_id = cat.category_id) 
                LEFT JOIN subcategory as sub ON(pro.subcategory_id = sub.subcategory_id)
                Where pro.statusId=1 and pro.category_id=${category_id} and pro.subcategory_id=${subcategory_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getAllProducts = function (result) {       
    pool.query(`select pro.*, cat.category_name, sub.subcategory_name
                from product pro LEFT JOIN category as cat 
                ON(pro.category_id = cat.category_id) 
                LEFT JOIN subcategory as sub ON(pro.subcategory_id = sub.subcategory_id)
                Where pro.statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = Product;