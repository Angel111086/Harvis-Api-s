var express = require("express");
var mysql = require('mysql');
var app = express();
var path = require('path');
const passport = require('passport');
var jwt = require('jsonwebtoken');
var jimp = require("jimp");
const pool = require('../authorization/pool');
const passwordHash = require('password-hash');
var crypto = require('crypto');
const nodemailer = require('nodemailer');

//models

var Category = require('../modal/category.model');
var Subcategory = require('../modal/subcategory.modal');
var Product = require('../modal/product.modal');
var User = require('../modal/user.modal');
var Order = require('../modal/orders.modal');
var OrderDetail = require('../modal/orderdetail.modal');
var Offer = require('../modal/offer.modal');
var Shipping = require('../modal/shipping.modal');
var Invoice = require('../modal/invoice.modal');
//var Cart = require('../modal/cart.modal');
//var CartDetail = require('../modal/cartdetail.modal');
var Wishlist = require('../modal/wishlist.modal');
var ShoppingCart = require('../modal/shoppingcart.modal')
const Subscription = require("../modal/subscription.modal");
const { select } = require("underscore");
const Transaction = require("../modal/transaction.modal");
const Razorpay = require("../modal/razorpay.modal");
const { getMaxListeners } = require("process");
//--------------------------------------------------------
module.exports.greetings = function(req, res){
    res.json({"status" : "Welcome to Mrs. Harvis Organique"});
}

//--------------------Admin Tasks----------------------------------

//Admin Login Api
module.exports.adminLogin = function(req,res)
{    
    var username = req.body.username;  
    var password = req.body.password;
    var query= `select * from adminlogin where adminname='${username}' and adminpassword='${password}'`;
    console.log(query);
    pool.query(query,function(err, user){
        if(err)
        {
            console.log(err);
            res.json({ status: 401, success: false, error: "Invalid Username and Password." });
        }
        else{     
            console.log('The solution is: ', user);
            console.log('Length', user.length);
            console.log('Password',password);            
            if(user.length > 0)
            {                 
                if(user[0].adminpassword == password)
                {
                    console.log("working", user[0].adminpassword);         
                    var token = "";
                    var secret = "";
                    secret = {type: 'admin', _id: user[0].id, password: user[0].adminpassword};
                                              token = jwt.sign(secret, 'mrsharvisorganique', {
                                                  expiresIn: 31557600000
                                });
                    console.log("Demo=" + token);
                    res.send({status:200, success: true,
                              message:"Login Successful",token:token,
                    });
                }
                else{
                        res.send({status:200, success: false, 
                            message:"Password Mismatch"});
                    }
                }         
                else
                {
                    res.send({status:401, success: false, 
                        message:"Invalid Username and Password"});
                }
            }
            
        });  
}

//-----Login Api Ends------


//----------------------Category Api's--------------------- 

//Insert Api..

module.exports.insertCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var category = new Category(req.body);                
        if(!category.category_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
        }
        category.statusId=1;
        category.createdById = user[0].id;
        category.creationDate = new Date;
        Category.createCategory(category, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//Update Category

module.exports.updateCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var category = new Category(req.body);                 
        if(!req.body.category_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category Id.' });        
        }
        else if(!category.category_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
        }        
        category.modifiedById = user[0].id;
        category.modificationDate = new Date;
        Category.updateCategory(req.body.category_id,category,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//delete Category

module.exports.deleteCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        //var category = new Category(req.query);
        //category.statusId = 0;           
        Category.deleteCategory(req.query.category_id,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//Get All Categories

module.exports.getAllCategories = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Category.getAllCategory(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
   //    }
 // })(req,res,next)
}

module.exports.getCategoryByCategoryId = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Category.getCategoryById(req.query.category_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
    //   }
 // })(req,res,next)
}

//-------------------------------------------------------------
//Category Ends..

//------------------Subcategory Api's--------------------------

//insert Api.
module.exports.insertSubcategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var subcategory = new Subcategory(req.body);                
        if(!subcategory.subcategory_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Subcategory Name.' });        
        }
        else if(!subcategory.category_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
        }
        subcategory.statusId=1;
        subcategory.createdById = user[0].id;
        subcategory.creationDate = new Date;
        Subcategory.createSubcategory(subcategory, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }    
  })(req,res,next)
}

//Update Subcategory

module.exports.updateSubcategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var subcategory = new Subcategory(req.body);                 
        if(!req.body.subcategory_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Subcategory Id.' });        
        }
        else if(!subcategory.subcategory_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Subcategory Name.' });        
        }        
        subcategory.modifiedById = user[0].id;
        subcategory.modificationDate = new Date;
        Subcategory.updateSubcategory(req.body.subcategory_id,subcategory,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//delete Subategory

module.exports.deleteSubcategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        //var subcategory = new Subcategory(req.query);
        //subcategory.statusId = 0;           
        Subcategory.deleteSubcategory(req.query.subcategory_id,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//Get All Categories

module.exports.getAllSubcategories = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Subcategory.getAllSubcategory(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
     //  }
  //})(req,res,next)
}

//Get All Subctegories by category Id

module.exports.getAllSubcategoriesByCategory = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Subcategory.getAllSubcategoryByCategoryId(req.query.category_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
   //    }
 // })(req,res,next)
}

module.exports.getSubcategoryBySubcategoryId = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Subcategory.getSubcategoryById(req.query.subcategory_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
   //    }
 // })(req,res,next)
}

//----------------------------------------------------------------------------------------
//SubCategory Ends...

//----------------------------------Product Api's-----------------------------------------

//insert Product Api.
module.exports.insertProduct = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {
        try
        {    
            if(!req.file){
                //console.log('Image1', req.file);
                //console.log('Image', req.file.filename);
                res.status(400).send({ success:false, message: 'Please Provide Product Image.' });        
            }
            else{ 
            var fn = './public/product/' + req.file.filename;  
            //let newfileName = req.file.filename + ".png"
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/product/' + fn) // save
                console.log('Resized !!')              
            });  
            var product = new Product(req.body,fn); 
                console.log('Product', req.body);         
                console.log('Product Image', fn);
                if(!product.category_id){
                    return res.status(400).send({ success:false, message: 'Please Provide Category Name.' });        
                }
                if(!product.subcategory_id){
                    res.status(400).send({ success:false, message: 'Please Provide Subcategory Name.' });        
                }
                if(!product.product_name){
                    res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
                }
                if(!product.product_price){
                    res.status(400).send({ success:false, message: 'Please Provide Product Price.' });        
                }
                if(!product.product_discount){
                    res.status(400).send({ success:false, message: 'Please Provide Product Discount.' });        
                }
                if(!product.product_actualprice){
                    res.status(400).send({ success:false, message: 'Please Provide Product Actual Price.' });        
                }
                product.statusId=1;
                product.createdById = user[0].id;
                product.creationDate = new Date;
                Product.createProduct(product, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
        }catch(e){ console.log("catch",e);   }  }  
})(req,res,next)
}

//update Product Api..
module.exports.updateProduct = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {
        try
        {    
            if(!req.file)
            {
                //res.status(400).send({ success:false, message: 'Please Provide Product Image.' });
                
                var product = new Product(req.body);
                console.log('Product', product);      
                if(!product.category_id){
                    return res.status(400).send({ success:false, message: 'Please Provide Category Name.' });        
                }
                if(!product.subcategory_id){
                    res.status(400).send({ success:false, message: 'Please Provide Subcategory Name.' });        
                }
                if(!product.product_name){
                    res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
                }
                if(!product.product_price){
                    res.status(400).send({ success:false, message: 'Please Provide Product Price.' });        
                }
                if(!product.product_discount){
                    res.status(400).send({ success:false, message: 'Please Provide Product Discount.' });        
                }
                if(!product.product_actualprice){
                    res.status(400).send({ success:false, message: 'Please Provide Product Actual Price.' });        
                }
                product.statusId=1;
                product.modifiedById = user[0].id;
                product.modificationDate = new Date;
                Product.updateProduct(req.body.product_id,product, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
            
            else{ 
            var fn = './public/product/' + req.file.filename;  
            //let newfileName = req.file.filename + ".png"
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/product/' + fn) // save
                console.log('Resized !!')              
            });  
            var product = new Product(req.body,fn);          
            if(!product.category_id){
                    return res.status(400).send({ success:false, message: 'Please Provide Category Name.' });        
            }
                if(!product.subcategory_id){
                    res.status(400).send({ success:false, message: 'Please Provide Subcategory Name.' });        
                }
                if(!product.product_name){
                    res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
                }
                if(!product.product_price){
                    res.status(400).send({ success:false, message: 'Please Provide Product Price.' });        
                }
                if(!product.product_discount){
                    res.status(400).send({ success:false, message: 'Please Provide Product Discount.' });        
                }
                if(!product.product_actualprice){
                    res.status(400).send({ success:false, message: 'Please Provide Product Actual Price.' });        
                }
                product.statusId=1;
                product.modifiedById = user[0].id;
                product.modificationDate = new Date;
                Product.updateProduct(req.body.product_id,product, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
        }catch(e){ console.log("catch",e);   }  }  
  })(req,res,next)
}

module.exports.deleteProduct = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        //var product = new Product(req.query);          
        Product.deleteProduct(req.query.product_id,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
  })(req,res,next)
}

module.exports.getAllProducts = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getAllProduct(req.query.category_id, req.query.subcategory_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found."});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
      // }
//  })(req,res,next)
}

module.exports.getProducts = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getAllProducts(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"+err});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       //}
 // })(req,res,next)
}

module.exports.getProductsByProductId = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getProductById(req.query.product_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
    //   }
  //})(req,res,next)
}

module.exports.searchProduct = function (req, res, next) { 
    // passport.authenticate('jwt', function(err,user)
    // {
    //   if (err || !user) 
    //   {
    //     return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //   }
      var page = parseInt(req.query.page);
      var size = parseInt(req.query.size);
      var name = req.query.name;    

      var query = {}
      if(page < 0 || page === 0) {
            response = {status:400,success:false, message:"Invalid page number, should start with 1"};
            return res.json(response)
      }
      query.skip = size * (page - 1)
      query.limit = size
       var search_query;
       if(name)
       {         
        search_query = `SELECT count(product_name) as Total from product where product_name LIKE '%${name}%'`
       }
       console.log('Count', search_query);
       pool.query(search_query,function(err,totalCount){
            if(err) {
                   response = {status:400,success:false,message:"Error fetching data."};
            }
            if(name)
            {

                search_query = `select product_name from product where product_name LIKE '%${name}%' limit ${query.limit}  offset ${query.skip}`
            }
            console.log('Query', search_query);
            pool.query(search_query, function(err,data){
            
            if(err) {
                console.log(err)
                response = {status:400,success:false,message:"Error fetching data"};
            } 
            else if(data.length == 0){
              response = {status: 200, success : false, message : "No Data Found"};
            }
            else {
              var totalPages = Math.ceil(totalCount[0].Total / size);    

                response = {status: 200, success : true, message : "Data Found", "SearchData": data,"Pages":totalPages,"TotalCount":totalCount};
            }
  
            res.json(response);
        });
    })
    //})(req, res, next);
}

//----------------------------------------------------------------------------------------------

//Product Ends....

//-------------------------------------------User Api's-----------------------------------------

//insert User Api.
module.exports.registerUser = function(req,res)
{       
        console.log('Body',req.body);       
        var user = new User(req.body);             
        if(!user.user_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide User Name.' });        
        }
        // if(!user.user_password)
        // {
        //     return res.status(400).send({ error:true, message: 'Please Provide User Password.' });        
        // }
        // if(!user.user_mobile)
        // {
        //     return res.status(400).send({ error:true, message: 'Please Provide User Mobile.' });        
        // }
        user.statusId=1;
        //user.createdById = "";
        user.creationDate = new Date;
        User.createUser(user, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"User Details not saved." + err});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
}    


//User Login Api
// module.exports.userLogin = function(req,res)
// {    
//     var username = req.body.username;  
//     var password = req.body.password;
//     var query= `select * from user where user_name='${username}'`;
//     console.log(query);
//     pool.query(query,function(err, user){
//         if(err)
//         {
//             console.log(err);
//             return res.json({ status: 401, success: false, error: "Something Went Wrong." });
//         }
//         else{     
//             console.log('The solution is: ', user);
//             console.log('Length', user.length);
//             console.log('Password',password);
//             if(user.length == 0){
//                 return res.json({ status: 401, success: false, error: "Username does not Exists." });
//             }          
//             else if(user.length > 0)
//             {                
//                 if(passwordHash.verify(password,user[0].user_password))
//                 //if(user[0].user_password == password)
//                 {
//                     console.log("working", user[0].user_password);         
//                     var token = "";
//                     var secret = "";
//                     secret = {type: 'user', _id: user[0].user_id, password: user[0].user_password};
//                                               token = jwt.sign(secret, 'mrsharvisorganique', {
//                                                   expiresIn: 31557600000
//                                 });
//                     console.log("Demo=" + token);
//                     res.send({status:200, success: true,
//                               message:"Login Successful",user: user[0].user_name,token:token,
//                     });
//                 }
//                 else{
//                         return res.send({status:200, success: false,  
//                             message:"Password Mismatch"});
//                         res.sendStatus(200);
//                     }
//                 }         
//                 else
//                 {
//                     return res.send({status:401, success: false, 
//                         message:"Invalid Username and Password"});
//                 }
//             }
            
//         });  
// }

//Modified Api

module.exports.userLogin = function(req,res)
{    
    var email = req.body.user_email;  
    var query= `select * from user where user_email='${email}'`;
    console.log(query);
    pool.query(query,function(err, user){
        if(err)
        {
            console.log(err);
            return res.json({ status: 401, success: false, error: "Something Went Wrong." });
        }
        else{     
            console.log('The solution is: ', user);
            if(user.length == 0){
                //return res.json({ status: 401, success: false, error: "Username does not Exists." });
                console.log('User Email', email);
                var username;
                console.log('Body',req.body);   
                var user = new User(req.body);  
                user.statusId=1;
                user.creationDate = new Date;
                User.createUser(user, function(err, data) 
                {
                    if(err){
                        console.log('Error', err);
                        return res.json({ status: 401, success: false, message: "Something Went Wrong." });
                    }
                    else{
                        var token = "";
                        var secret = "";
                        secret = {type: 'user', user_email: email};
                                  token = jwt.sign(secret, 'mrsharvisorganique', {expiresIn: 31557600000});
                        console.log("Demo=" + token);

                        //to get username
                        pool.query(`select * from user where user_id = ${data.id}`,function(err,namedata){
                            if(err){
                                console.log("Select If",err);
                            }
                            else{
                                username = namedata[0].user_name;
                                console.log('Unregistered UN', username);
                                res.send({status:200, success: true,message:"Login Successful",id: data.id, 
                                    username: username, token:token });
                            }
                        });
                }
            });

            }          
            else if(user.length > 0)
            {      
                if(user[0].user_email == email)
                {          
                    var token = "";
                    var secret = "";
                    secret = {type: 'user', user_email: user[0].user_email};
                                token = jwt.sign(secret, 'mrsharvisorganique', {expiresIn: 31557600000});
                    console.log("Demo=" + token);
                    res.send({status:200, success: true,
                              message:"Login Successful",id: user[0].user_id, user: user[0].user_name,token:token,
                    });
                }     
                else
                {
                    return res.send({status:401, success: false, message:"Email Does Not Exists."});
                }
            }
        }
        });  
}


//-----User Login Api Ends------


//Update User Api...


module.exports.updateUser = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {
        try
        {    console.log('Auth User', user[0].user_id);
            if(!req.file)
            {
                //res.status(400).send({ success:false, message: 'Please Provide Product Image.' });
                
                var user = new User(req.body);
                console.log('User', user);      
                if(!user.user_mobile){
                    return res.status(400).send({ success:false, message: 'Please Provide User Mobile.' });        
                }
                user.statusId=1;
                //user.modifiedById = user[0].user_id;
                user.modificationDate = new Date;
                User.updateUser(req.body.user_id,user, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
            
            else{ 
            var fn = './public/user/' + req.file.filename;  
            //let newfileName = req.file.filename + ".png"
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/user/' + fn) // save
                console.log('Resized !!')              
            });  
            var user = new User(req.body,fn);
                console.log('User', user);      
                if(!user.user_mobile){
                    return res.status(400).send({ success:false, message: 'Please Provide User Mobile.' });        
                }
                user.statusId=1;
                //user.modifiedById = user[0].user_id;
                user.modificationDate = new Date;
                User.updateUser(req.body.user_id,user, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
        }catch(e){ console.log("catch",e);   }  }  
  })(req,res,next)
}

//For Admin, to see the number of users..will work with admin token

module.exports.getAllUsers = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            User.getAllUsers(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}


//------------------------------------------------------------------------------------------------
 // user ends..

//--------------------------------------------------------------------------------------------------

//Orders Api's

//insert Api.
module.exports.insertOrder = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var order = new Order(req.body);  
        order.user_id = user[0].user_id              
        if(!order.user_id)
        {
            return res.status(400).send({ error:true, message: 'No User.' });        
        }
        else if(!order.totalAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Total Amount.' });        
        }
        else if(!order.payableAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payable Amount.' });        
        }
        else if(!order.shipping_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!order.payment_type)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payment Type.' });        
        }
        order.statusId=1;
        order.createdById = user[0].user_id;
        order.creationDate = new Date;
        Order.createOrders(order, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }    
  })(req,res,next)
}

//Update Order

module.exports.updateOrder = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var order = new Order(req.body);
        order.user_id = user[0].user_id;             
        if(!order.user_id)
        {
           return res.status(400).send({ error:true, message: 'No User.' });        
        }
        else if(!order.totalAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Total Amount.' });        
        }
        else if(!order.payableAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payable Amount.' });        
        }
        else if(!order.shipping_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!order.payment_type)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payment Type.' });        
        }       
        order.modifiedById = user[0].user_id;
        order.modificationDate = new Date;
        Order.updateOrders(req.body.order_id,order,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//delete Order

module.exports.deleteOrder = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        var order = new Order(req.query);
        order.statusId = 0;           
        Order.deleteOrders(req.query.order_id,order,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//Get All Orders
//For Admin..
module.exports.getAllOrders = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Order.getAllOrders(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

//orders of the specific user..
//User Token
module.exports.getAllOrdersByUserId = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Order.getAllOrdersByUser(user[0].user_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}
//All Orders According to month or date
//admin token
module.exports.getAllOrdersByDate = function(req,res,next)
{
    var from_date = req.query.from_date;
    var to_date = req.query.to_date;
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        Order.getAllOrdersByDate(from_date,to_date,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found"});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        } 
        else{
            res.send({status:200,success:true,message:
                    "Detail Found", data:data});
        }
    });
  }
})(req,res,next)
}

module.exports.getAllOrdersByOrderId = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Order.getAllOrdersByOrderId(req.query.order_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

//-------------------------------------------------------------------------------------------------

//------------------------------Order Detail-------------------------------------------------

//Orders Detail Api's

//insert Api. User Token
module.exports.insertOrderDetail = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        let odData = req.body;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];
            console.log(Object.values(value));               
            order = new OrderDetail(odData[i]);                
            if(!order.order_id)
            {
                return res.status(400).send({ error:true, message: 'No Order.' });        
            }
            else if(!order.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            }        
            order.statusId=1;
            order.createdById = user[0].user_id;
            order.creationDate = new Date;
            OrderDetail.createOrderDetail(order, function(err, data) 
            {
                if(err){
                    res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        res.send({status:200,success:true,message:data.message});
                    }
                }
            });
        }    
    }
  })(req,res,next)
}

//Update Order

module.exports.updateOrderDetail = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        let odData = req.body;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];
            console.log(Object.values(value)); 
            var orderdetail_id = odData[i].orderdetail_id;              
            order = new OrderDetail(odData[i]);                  
            if(!order.product_id)
            {
                return res.status(400).send({ error:true, message: 'No Product.' });        
            }        
            order.modifiedById = user[0].user_id;
            order.modificationDate = new Date;
            OrderDetail.updateOrderDetail(orderdetail_id,order,function(err, data) 
            {
                if(err){
                    res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        res.send({status:200,success:true,message:data.message});
                    }
                }
            }); 
        }
    }
    
  })(req,res,next)
}

//delete Order

module.exports.deleteOrderDetail = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        var order = new OrderDetail(req.query);
        order.statusId = 0;           
        OrderDetail.deleteOrderDetail(req.query.orderdetail_id,order,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }
    
  })(req,res,next)
}

//Get All Orders

module.exports.getAllOrderDetailById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var order_id = req.query.order_id;
            OrderDetail.getAllOrderDetailById(order_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

module.exports.getAllOrderDetail = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            //var order_id = req.query.order_id;
            OrderDetail.getAllOrderDetail(user[0].user_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}
//-------------------------------------------------------------------------------------


//----------------------------Offer Api's-------------------------------------------


//Offer Api's

//insert Api. Admin Token
module.exports.insertOffer = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var offer = new Offer(req.body);      
        console.log("Offer", req.body);          
        if(!offer.offer_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Name.' });        
        }
        if(!offer.offer_code)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Code.' });        
        }
        if(!offer.no_of_users)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Number of Users.' });        
        }
        if(!offer.fromDate)
        {
            return res.status(400).send({ error:true, message: 'Please Provide From Date.' });        
        }
        if(!offer.expiryDate)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Expiry Date' });        
        }
        if(!offer.minimum_cartvalue)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Minimum Cart Value.' });        
        }
        if(!offer.maximumDiscount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Maximum Discount.' });        
        }
        if(!offer.discountType)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Discount Type.' });        
        }
        if(!offer.discount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Discount.' });        
        }
        if(!offer.category_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category' });        
        }
        if(!offer.subcategory_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Subcategory.' });        
        }
        if(!offer.product_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Product.' });        
        }        
        offer.statusId=1;
        offer.createdById = user[0].id;
        offer.creationDate = new Date;
        Offer.createOffer(offer, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }    
  })(req,res,next)
}

//Update Offer

module.exports.updateOffer = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var offer = new Offer(req.body);            
        if(!offer.offer_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Name.' });        
        }
        if(!offer.offer_code)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Code.' });        
        }
        if(!offer.no_of_users)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Number of Users.' });        
        }
        if(!offer.fromDate)
        {
            return res.status(400).send({ error:true, message: 'Please Provide From Date.' });        
        }
        if(!offer.expiryDate)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Expiry Date' });        
        }
        if(!offer.minimum_cartvalue)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Minimum Cart Value.' });        
        }
        if(!offer.maximumDiscount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Maximum Discount.' });        
        }
        if(!offer.discountType)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Discount Type.' });        
        }
        if(!offer.discount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Discount.' });        
        }
        if(!offer.category_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category' });        
        }
        if(!offer.subcategory_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Subcategory.' });        
        }
        if(!offer.product_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Product.' });        
        }       
        offer.modifiedById = user[0].id;
        offer.modificationDate = new Date;
        Offer.updateOffer(req.body.offer_id,offer,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//delete Offer

module.exports.deleteOffer = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        //var offer = new Offer(req.query);          
        Offer.deleteOffer(req.query.offer_id,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }
    
  })(req,res,next)
}

//Get All Orders

module.exports.getAllOffers = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Offer.getAllOffer(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

module.exports.getAllOfferByOfferId = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var offer_id = req.query.offer_id;
            Offer.getAllOfferById(offer_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

//-------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------

//Shipping Address Api's for user
//User Token
//insert Api.
module.exports.insertShippingAddress = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
        console.log('Shipping Address', user);          
        var shipping = new Shipping(req.body);  
        shipping.user_id = user[0].user_id              
        if(!shipping.user_id)
        {
            return res.status(400).send({ error:true, message: 'No User.' });        
        }
        else if(!shipping.first_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide First Name.' });        
        }
        else if(!shipping.last_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Last Name' });        
        }
        else if(!shipping.address_line1)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!shipping.city)
        {
            return res.status(400).send({ error:true, message: 'Please Provide City.' });        
        }
        else if(!shipping.postalcode)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Postal Code.' });        
        }
        else if(!shipping.mobilenumber)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Mobile Number.' });        
        }
        shipping.statusId=1;
        shipping.createdById = user[0].user_id;
        shipping.creationDate = new Date;
        Shipping.createShipping(shipping, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }    
  })(req,res,next)
}

//Update Shipping Address

module.exports.updateShippingAddress = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var shipping = new Shipping(req.body);
        shipping.user_id = user[0].user_id              
        if(!shipping.user_id)
        {
            return res.status(400).send({ error:true, message: 'No User.' });        
        }      
        else if(!shipping.address_line1)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!shipping.city)
        {
            return res.status(400).send({ error:true, message: 'Please Provide City.' });        
        }
        else if(!shipping.postalcode)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Postal Code.' });        
        }
        else if(!shipping.mobilenumber)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Mobile Number.' });        
        }
        shipping.statusId=1;
        shipping.modifiedById = user[0].user_id;
        shipping.modificationDate = new Date;
        Shipping.updateShipping(req.body.shipping_id,shipping,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//delete Shipping

module.exports.deleteShippingAddress = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        var shipping = new Shipping(req.query);
        shipping.statusId = 0;           
        Shipping.deleteShipping(req.query.shipping_id,shipping,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }
  })(req,res,next)
}

//Get All Address of a user by its user_id

module.exports.getAllAddress = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {
            Shipping.getAllShipping(user[0].user_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}


module.exports.getShippingAddressById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            Shipping.getShippingById(user[0].user_id,req.query.shipping_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}



//Shipping Api's Ends....
//----------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------

//Invoice Api's

//generate Invoice. user Token
module.exports.generateInvoice = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var invoice = new Invoice(req.body);                
        if(!invoice.order_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Order details.' });        
        }
        else if(!invoice.shipping_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping details.' });        
        }
        else if(!invoice.total_amount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Total Amount.' });        
        }
        else if(!invoice.amount_payable)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payable Amount.' });        
        }
        else if(!invoice.payment_mode)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payment Mode.' });        
        }
        invoice.invoice_date = new Date;
        invoice.user_id = user[0].user_id;
        invoice.statusId=1;
        invoice.createdById = user[0].user_id;
        invoice.creationDate = new Date;
        Invoice.createInvoice(invoice, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }    
  })(req,res,next)
}

//printing details for the invoice.
module.exports.printInvoice = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var view_query;
            var shipping_id = req.query.shipping_id;
            var order_id = req.query.order_id;

            if(user[0].user_id){
                if(order_id){
                    if(shipping_id){
                        view_query=`select inn.*, ship.*, ord.* from invoice inn
                                    LEFT JOIN shippingaddress as ship ON (inn.shipping_id = ship.shipping_id)
                                    LEFT JOIN orders as ord ON(inn.order_id = ord.order_id)
                                    where ship.shipping_id=${shipping_id} and inn.order_id=${order_id}`;
                    }
                }
            }

            pool.query(view_query, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
        }
    })(req,res,next)
}
//Invoice Ends 
//------------------------------------------------------------------------------------------------------------------

//------------------------------------------------Wishlist Api-----------------------------------------------

//insert Api. User Token
// module.exports.insertWishlist = function(req,res,next)
// {
//     passport.authenticate('jwt',function(err,user)
//     {
//         console.log("IS Next", user);
//         if (err || !user) 
//         {            
//             console.log("User",err);
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){               
//         let wlData = req.body;
//         var value,wishlist,count=0;
//         for(i=0;i<wlData.length;i++)
//         {
//             value = wlData[i];
//             console.log(Object.values(value));               
//             wishlist = new Wishlist(wlData[i]);                
//             if(!wishlist.product_id)
//             {
//                 return res.status(400).send({ error:true, message: 'Please Provide Product' });        
//             }
//             wishlist.user_id = user[0].user_id;
//             wishlist.statusId=1;
//             wishlist.createdById = user[0].user_id;
//             wishlist.creationDate = new Date;
//             Wishlist.createWishlist(wishlist, function(err, data) 
//             {
//                 if(err){
//                     res.send({status:400,success:false,message:"Details not saved."});
//                 }
//                 else{
//                     count++;
//                     if(count==wlData.length)
//                     {
//                         res.send({status:200,success:true,message:data.message});
//                     }
//                 }
//             });
//         }    
//     }
//   })(req,res,next)
// }


module.exports.insertWishlist = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){                       
            var wishlist = new Wishlist(req.body);                
            if(!wishlist.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            }
            wishlist.user_id = user[0].user_id;
            wishlist.statusId=1;
            wishlist.createdById = user[0].user_id;
            wishlist.creationDate = new Date;
            Wishlist.createWishlist(wishlist, function(err, data) 
            {
                if(err){
                    res.send({status:400,success:false,message:"Details not saved."});
                }
                else{                    
                        res.send({status:200,success:true,message:data.message});
                }
            });
    }
  })(req,res,next)
}

//Update Wishlist

module.exports.updateWishlist = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        let wlData = req.body;
        var value,wishlist,count=0;
        for(i=0;i<wlData.length;i++)
        {
            value = wlData[i];
            console.log(Object.values(value)); 
            var wishlist_id = wlData[i].wishlist_id;              
            wishlist = new Wishlist(wlData[i]);                  
            if(!wishlist.product_id)
            {
                return res.status(400).send({ error:true, message: 'No Product.' });        
            }
            wishlist.user_id = user[0].user_id;
            wishlist.modifiedById = user[0].user_id;
            wishlist.modificationDate = new Date;
            Wishlist.updateWishlist(wishlist_id,wishlist,function(err, data) 
            {
                if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    count++;
                    if(count==wlData.length)
                    {
                        res.send({status:200,success:true,message:data.message});
                    }
                }
            }); 
        }
    }
    
  })(req,res,next)
}

//delete Wishlist

module.exports.deleteWishlist = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        var wishlist = new Wishlist(req.query);
        wishlist.statusId = 0;           
        Wishlist.deleteWishlist(req.query.wishlist_id,wishlist,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }
    
  })(req,res,next)
}

//Get All Wishlist

module.exports.getAllWishlist = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var user_id = user[0].user_id;
            Wishlist.getAllWishlist(user_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}








//-------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------------------
//Cart  Api's

//Create Cart User Token

// module.exports.addToCart = function(req,res,next)
// {
//     passport.authenticate('jwt',function(err,user)
//     {
//         console.log("IS Next", user);
//         if (err || !user) 
//         {            
//             console.log("User",err);
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){         
//         var cart = new Cart(req.body);
//         console.log('Test',user[0].user_id);
//         cart.user_id = user[0].user_id;
//         cart.date_placed = new Date;     
//         cart.statusId = 1;
//         cart.createdById = user[0].user_id;
//         cart.creationDate = new Date;
//         //cart = new Cart(cart);
//         Cart.createCart(cart, function(err, req,data) 
//         {
//             if(err){
//                 res.send({status:400,success:false,message:"Details not saved."});
//             }
//             else{
//                 //res.send({status:200,success:true,message:data.message});
//                 var cartdetail = new CartDetail(req.body)
//                 cartDetail.cart_id = data.id;
//                 console.log('CartDetail', cartDetail);
//                 cartDetail();
//             }
//         });
//     }    
//   })(req,res,next)
// }



// //------------------------------------------------------------------------------------------------------------------


// //-------------------------------------------------------------------------------------------------------------------

// //Adding to Cart in Cart Detail...

// function cartDetail(){
//     let cdData = req.body;
//     var value,order,count=0;
//     for(i=0;i<cdData.length;i++)
//     {
//         value = cdData[i];
//         console.log(Object.values(value));               
//         cartdetail = new CartDetail(cdData[i]);                
//         if(!cartdetail.product_id)
//         {
//             return res.status(400).send({ error:true, message: 'Please Provide Product.' });        
//         }
//         else if(!cartdetail.price)
//         {
//             return res.status(400).send({ error:true, message: 'Please Provide Price.' });        
//         }
//         else if(!cartdetail.quantity)
//         {
//             return res.status(400).send({ error:true, message: 'Please Provide Quantity.' });        
//         }      
//         cartdetail.statusId=1;
//         cartdetail.createdById = user[0].user_id;
//         cartdetail.creationDate = new Date;
//         CartDetail.createCartDetail(cartdetail, function(err, data) 
//         {
//             if(err){
//                     res.send({status:400,success:false,message:"Details not saved."});
//             }
//             else{
//                     count++;
//                     if(count==odData.length)
//                     {
//                         res.send({status:200,success:true,message:data.message});
//                     }
//                 }
//             });
//         }    
// }


//-------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
//Subscription Api's

module.exports.insertSubscription = function(req,res,next)
{               
    var subscription = new Subscription(req.body);  
    subscription.statusId=1;
    subscription.creationDate = new Date;
    Subscription.createSubscription(subscription, function(err, data) 
    {
        if(err){
                res.send({status:400,success:false,message:"Details not saved."});
        }
        else{
                res.send({status:200,success:true,message:data.message});
        }
    });
}    

//get All Subscription by admin token..

module.exports.getAllSubscription = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            Subscription.getAllsubscription(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

//---------------------------------------------------------------------------------------------------

//Customer Count

module.exports.getCustomerCount = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){                  
            pool.query(`select count(*) as Total from user where statusId=1`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

//-------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------
//Search Product

// module.exports.searchProduct = function (req, res, next) { 
//     passport.authenticate('jwt', function(err,user)
//     {
//       if (err || !user) 
//       {
//         return res.json({ status: 401, success: false, message: "Authentication Fail." });
//       }
//       var page = parseInt(req.query.page);
//       var size = parseInt(req.query.size);
//       var name = req.query.name;    

//       var query = {}
//       if(page < 0 || page === 0) {
//             response = {status:400,success:false, message:"Invalid page number, should start with 1"};
//             return res.json(response)
//       }
//       query.skip = size * (page - 1)
//       query.limit = size
//     //console.log("Search", req.query.search);
//        var search_query;
//        if(name)
//        {
//               search_query = `SELECT count(*) as Total FROM category 
//               WHERE category_name LIKE '%${name}%' AND StatusId = 1`
         
//        }
//        else{
//              search_query = `SELECT count(*) as Total FROM subcategory
//              WHERE StatusId = 1 AND SchoolId = ${user[0].SchoolId}`
//        }
//        console.log('Count', search_query);
//        pool.query(search_query,[user[0].SchoolId],function(err,totalCount){
//             if(err) {
//                    response = {status:400,success:false,message:"Error fetching data."};
//             }
//             if(name)
//             {
//                search_query = `SELECT category_name FROM category WHERE category_name LIKE '%${name}%' 
//                AND StatusId = 1 limit ${query.limit} offset ${query.skip}`

//                search_query = `SELECT category.category_name,subcategory.subcategory_name,product.product_name from 
//                                 category  
//                               LEFT JOIN subcategory ON (category.category_id = subcategory.category_id) 
//                               LEFT JOIN product ON (category.category_id = product.category_id) 
//                               where category.category_name LIKE '%${name}%' OR subcategory.subcategory_name 
//                               LIKE '%${name}%' OR product.product_name = '%${name}%'
//                               limit ${query.limit}  offset  ${query.skip} `


//             }
//             // else
//             // {
//             //     search_query = `SELECT subcategory_name FROM subcategory WHERE 
//             //     WHERE category_name LIKE '%${name}%'  AND StatusId = 1 
//             //     limit ${query.limit} offset ${query.skip}`      
//             // }
//             console.log('Query', search_query);
//             pool.query(search_query, function(err,data){
            
//             if(err) {
//                 console.log(err)
//                 response = {status:400,success:false,message:"Error fetching data"};
//             } 
//             else if(data.length == 0){
//               response = {status: 200, success : false, message : "No Data Found"};
//             }
//             else {
//               var totalPages = Math.ceil(totalCount / size);    
//                 response = {status: 200, success : true, message : "Data Found", "SearchData": data,"Pages":totalPages,"TotalCount":totalCount};
//             }
  
//             res.json(response);
//         });
//     })
//     })(req, res, next);
//     }
//------------------------------------------------------------------------------------------------------  

//-------------------------------------------------------------------------------------------------
module.exports.getProductCount = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT count(*) as Total FROM product WHERE MONTH(creationDate) = MONTH(CURDATE()) AND StatusId=1`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.getTotalOrders = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT count(*) as Total FROM orders WHERE MONTH(creationDate) = MONTH(CURDATE()) AND StatusId=1`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.getTotalRevenueByMonth = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT sum(product_quantity * product_price) as revenue FROM orderdetail WHERE MONTH(creationDate) = MONTH(CURDATE()) AND StatusId=1`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

//--------------------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------------------

//Revenue (Analytics) Product Wise

module.exports.getYearlySale = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            my_year = req.query.year;
            my_product = req.query.product_name;
            var my_query;
            if(!my_product){
                // my_query = `SELECT p.product_name,od.product_quantity,od.product_price,ord.order_date from product p 
                // LEFT JOIN orderdetail od on p.product_id = od.product_id 
                // LEFT JOIN orders ord on od.order_id = ord.order_id 
                // where YEAR(ord.order_date) = ${my_year} AND ord.statusId=1`;

                my_query = `SELECT p.product_name,
                                SUM(od.product_quantity) as product_quantity,
                                SUM(od.product_quantity * od.product_price) as price
                            FROM
                                product p 
                            LEFT JOIN
                                orderdetail od on p.product_id = od.product_id
                            LEFT JOIN
                                orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} AND ord.statusId=1
                            GROUP BY
                                p.product_name`;
            }
            else{
                // my_query = `SELECT p.product_name,od.product_quantity,od.product_price,ord.order_date from product p 
                // LEFT JOIN orderdetail od on p.product_id = od.product_id 
                // LEFT JOIN orders ord on od.order_id = ord.order_id 
                // where YEAR(ord.order_date) = ${my_year} AND p.product_name LIKE '%${my_product}%' and ord.statusId=1`;

                my_query = `SELECT p.product_name,
                                SUM(od.product_quantity) as product_quantity,
                                SUM(od.product_quantity * od.product_price) as price
                            FROM
                                product p 
                            LEFT JOIN
                                orderdetail od on p.product_id = od.product_id
                            LEFT JOIN
                                orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} AND p.product_name LIKE '%${my_product}%' AND ord.statusId=1
                            GROUP BY
                                p.product_name`;
            }
            pool.query(my_query, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}


module.exports.getMonthlySale = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            my_year = req.query.year;
            my_month = req.query.month;
            my_product = req.query.product_name;
            var my_query;
            if(!my_product){
                // my_query = `SELECT p.product_name,od.product_quantity,od.product_price,ord.order_date from product p 
                // LEFT JOIN orderdetail od on p.product_id = od.product_id 
                // LEFT JOIN orders ord on od.order_id = ord.order_id 
                // where YEAR(ord.order_date) = ${my_year} and MONTH(ord.order_date) = ${my_month} 
                // AND ord.statusId=1`;

                my_query = `SELECT p.product_name,
                    SUM(od.product_quantity) as product_quantity,
                    SUM(od.product_quantity * od.product_price) as price
                    FROM product p 
                    LEFT JOIN
                        orderdetail od on p.product_id = od.product_id
                    LEFT JOIN
                        orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} 
                        AND MONTH(ord.order_date) = ${my_month} AND ord.statusId=1
                    GROUP BY
                        p.product_name`

            }
            else{
                // my_query = `SELECT p.product_name,od.product_quantity,od.product_price,ord.order_date from product p 
                // LEFT JOIN orderdetail od on p.product_id = od.product_id 
                // LEFT JOIN orders ord on od.order_id = ord.order_id 
                // where YEAR(ord.order_date) = ${my_year} and MONTH(ord.order_date) = ${my_month} AND 
                // p.product_name LIKE '%${my_product}%' and ord.statusId=1`;

                my_query = `SELECT p.product_name,
                    SUM(od.product_quantity) as product_quantity,
                    SUM(od.product_quantity * od.product_price) as price
                    FROM product p 
                    LEFT JOIN
                        orderdetail od on p.product_id = od.product_id
                    LEFT JOIN
                        orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} 
                        and MONTH(ord.order_date) = ${my_month} AND p.product_name LIKE '%${my_product}%' AND ord.statusId=1
                    GROUP BY
                        p.product_name`

            }
            console.log('Monthly Query', my_query);
            pool.query(my_query, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.getWeeklySale = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            my_year = req.query.year;
            my_month = req.query.month;
            my_product = req.query.product_name;
            var my_query;
            if(!my_product){
                // my_query = `SELECT STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Sunday'), '%X%V %W') AS 'Week Start', 
                //             STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Saturday'), '%X%V %W') AS 'Week End', 	    
                //             p.product_name,od.product_quantity,od.product_price,ord.order_date from product p 
                //             LEFT JOIN orderdetail od on p.product_id = od.product_id 
                //             LEFT JOIN orders ord on od.order_id = ord.order_id 
                //             where YEAR(ord.order_date) = ${my_year} and MONTH(ord.order_date) = ${my_month} AND 
                //             ord.order_date >= YEARWEEK(ord.order_date) AND ord.statusId=1`;

                my_query = `SELECT STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Sunday'), '%X%V %W') AS 'Week Start', 
                            STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Saturday'), '%X%V %W') AS 'Week End', p.product_name,
                            SUM(od.product_quantity) as product_quantity,
                            SUM(od.product_quantity * od.product_price) as price
                            FROM product p 
                            LEFT JOIN
                                orderdetail od on p.product_id = od.product_id
                            LEFT JOIN
                                orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} 
                                and MONTH(ord.order_date) = ${my_month} AND ord.order_date >= YEARWEEK(ord.order_date) AND ord.statusId=1
                            GROUP BY
                                p.product_name`;
            }
            else{
                // my_query = `SELECT STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Sunday'), '%X%V %W') AS 'Week Start', 
                //             STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Saturday'), '%X%V %W') AS 'Week End', 	    
                //             p.product_name,od.product_quantity,od.product_price,ord.order_date from product p 
                //             LEFT JOIN orderdetail od on p.product_id = od.product_id 
                //             LEFT JOIN orders ord on od.order_id = ord.order_id 
                //             where YEAR(ord.order_date) = ${my_year} and MONTH(ord.order_date) = ${my_month} AND 
                //             ord.order_date >= YEARWEEK(ord.order_date) AND 
                //             p.product_name LIKE '%${my_product}%' and ord.statusId=1`;

                my_query = `SELECT STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Sunday'), '%X%V %W') AS 'Week Start', 
                            STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Saturday'), '%X%V %W') AS 'Week End', p.product_name,
                            SUM(od.product_quantity) as product_quantity,
                            SUM(od.product_quantity * od.product_price) as price
                            FROM product p 
                            LEFT JOIN
                                orderdetail od on p.product_id = od.product_id
                            LEFT JOIN
                                orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} 
                                and MONTH(ord.order_date) = ${my_month} AND p.product_name LIKE '%${my_product}%'
                                ord.order_date >= YEARWEEK(ord.order_date) AND ord.statusId=1
                            GROUP BY
                                p.product_name`;


            }
            //Test Query
            // SELECT p.product_name,od.product_quantity,od.product_price,ord.order_date from product p 
            // LEFT JOIN orderdetail od on p.product_id = od.product_id 
            // LEFT JOIN orders ord on od.order_id = ord.order_id 
            // where ord.order_date >= DATE_SUB(CURDATE(), INTERVAL 7 day) AND ord.statusId=1
            pool.query(my_query, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

//---------------------------------------------------------------------------------------------------------------

//---------------------Change Password Api-----------------------------------------------------

module.exports.ChangePassword = function(req,res,next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var new_password = req.body.password;
            User.changePassword(user[0].user_id,new_password,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"Password Cannot be Changed."});
                }
                else{
                    res.send({status:200,success:true,message:data.message});
                }
            })
        }
    })(req,res,next)

}

//---------------------------------------------------------------------------------------------


//-----------------Shopping Cart Api's----------------------------------------------------------

module.exports.addToCart = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {         
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){         
        try
        {    
            if(!req.file){
                res.status(400).send({ success:false, message: 'Please Provide Product Image.' });        
            }
            else{ 
            var fn = './public/cart/' + req.file.filename;  
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/cart/' + fn) // save
                console.log('Resized !!')              
            });  
            var cart = new ShoppingCart(req.body,fn);        
            if(!cart.product_name){
                    res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
            }
            cart.user_id = user[0].user_id;
            cart.statusId=1;
            cart.createdById = user[0].user_id;
            cart.creationDate = new Date;
            ShoppingCart.createShoppingCart(cart, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
        }catch(e){ console.log("catch",e);   }  
    }  
  })(req,res,next)
}


module.exports.updateCart = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var cart = new ShoppingCart(req.body);            
        cart.modifiedById = user[0].user_id;
        cart.modificationDate = new Date;
        ShoppingCart.updateShoppingCart(cart,req.body.cart_id,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
})(req,res,next);
}

module.exports.deleteCart = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        ShoppingCart.deleteShoppingCart(req.body.cart_id,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not Deleted."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
})(req,res,next);
}

module.exports.getUserCartItems = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            ShoppingCart.getAllCartItems(user[0].user_id, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.getTotalCartProduct = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT sum(product_quantity) as quantity FROM shopping_cart WHERE user_id = ${user[0].user_id} AND StatusId=1`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.clearCart = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        pool.query(`delete from shopping_cart where user_id in (${user[0].user_id})`,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not Deleted." + err});
            }
            else{
                res.send({status:200,success:true,message:"Cart Cleared."});
            }
        }); 
      
    }
})(req,res,next);
}
//--------------------------------------------------------------------------------------------------


//--------------------------Checkout Api------------------------------------------------------------

module.exports.proceedToCheckout = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var order = new Order(req.body);  
        order.user_id = user[0].user_id              
        if(!order.user_id)
        {
            return res.status(400).send({ error:true, message: 'No User.' });        
        }
        else if(!order.totalAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Total Amount.' });        
        }
        else if(!order.payableAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payable Amount.' });        
        }
        else if(!order.shipping_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!order.payment_type)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payment Type.' });        
        }
        order.statusId=1;
        order.createdById = user[0].user_id;
        order.creationDate = new Date;
        console.log("Orders", order);
        Order.createOrders(order, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                //res.send({status:200,success:true,message:data.message, id: data.id});
                console.log('Data Id', data.id[0].order_id);
                console.log('Data ', data);
                var ord_id = data.id[0].order_id;
                var pa = data.id[0].payableamount;
                console.log("Payable", data.id[0].payableamount);
                insertOrderDetail(user[0].user_id,ord_id, pa,req,res);
            }
        });
    }    
  })(req,res,next)
}


insertOrderDetail = async function(user_id,order_id, pa,req,res){
try{
    console.log('OrderDetailId', order_id);
    let odData = req.body.products;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];

            console.log(Object.values(value));  
            odData[i].order_id = order_id;
            order = new OrderDetail(odData[i]);   

            if(!order_id)
            {
                return res.status(400).send({ error:true, message: 'No Order.' });        
            }
            else if(!order.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            } 
            // else if(!order.offer_id)
            // {
            //     return res.status(400).send({ error:true, message: 'Please Provide Offer' });        
            // }        
            order.statusId=1;
            order.createdById = user_id;
            order.creationDate = new Date;
            OrderDetail.createOrderDetail(order, function(err, data) 
            {
                if(err){
                    return res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        console.log('Test PA Value', pa);
                        curlRazorPay(order_id,pa, res);
                        
                        
                    }
                }
            });
        }    
}catch(e){console.log(e)}
}

const request = require('request');


function curlRazorPay(oid,ap, res){
        var amt = ap;
        auth = "Basic " + Buffer.from('rzp_test_mrKy6vydDmReI5' + ":" + 'kwW81hJdV7zMHEYIPyNh79qU').toString("base64");
        var my_data = {
            "amount": amt,
            "currency": "INR"
        }
        console.log("my data", my_data);
        request({
          url: `https://api.razorpay.com/v1/orders`, 
          headers: {"Authorization" : auth, "content-type": "application/json"},
          method: "POST", json: true, body: my_data}, function(err, response, json)
          {
            console.log('Test3');
            if (err) {
                console.log(err)
                throw err;
            }
            else
            {
                console.log('Razor JSON', json);
                res.send({status:200,success:true,message: "Details Saved Successfully.", orderId: oid, razor_orderId: json.id});
            }
          }      
        );
    
}




module.exports.updatePaymentStatus = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
            var order_status = req.body.order_status;
            var payment_status = req.body.payment_status;
            var id = req.body.order_id;
            pool.query(`update orders set order_status='${order_status}',
            payment_status='${payment_status}' where order_id=${id}`,function(err,data){
            if(err){
                res.send({status:400,success:false,message:"Something went wrong." + err});
            }            
            else{
                res.send({status:200,success:true,message:"Detail Updated Successfully."});
            }
            });
        }
  })(req,res,next)
}
//--------------------------------------------------------------------------------------------------


//------------------------------------Transaction Api-----------------------------------------------

module.exports.insertTransaction = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {         
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){         
        try
        {    
 
            var transaction = new Transaction(req.body);
            transaction.user_id = user[0].user_id;
            if(!transaction.order_id){
                    res.status(400).send({ success:false, message: 'Please Provide Order.' });        
            }
            if(!transaction.shipping_id){
                res.status(400).send({ success:false, message: 'Please Provide Shipping.' });        
            }
            if(!transaction.payment_code){
                res.status(400).send({ success:false, message: 'Please Provide Payment.' });        
            }
            transaction.statusId=1;
            transaction.createdById = user[0].user_id;
            transaction.creationDate = new Date;
            Transaction.createTransaction(transaction, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
               
        }catch(e){ console.log("catch",e);   }  
    }  
  })(req,res,next)
}

module.exports.getAllTransaction = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Transaction.getAllTransaction(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

module.exports.getAllTransactionOfUser = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Transaction.getAllTransactionByUser(user[0].user_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}
//--------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------



//-----------------------------Incoming Order----------------------------------------------------

module.exports.incomingOrder = function(req,res,next){
    passport.authenticate('jwt',function(err,user){
        if(err || !user){
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            // var query = `select ord.*, user.user_name from orders ord
            // LEFT JOIN user as user ON(ord.user_id = user.user_id) 
            // Where ord.statusId=1 and ord.order_status Like 'Order Placed'
            // and date(ord.order_date) = CURDATE()`;

            var query = `select ord.*, detail.*,pro.product_name,user.user_name from orders ord 
                         LEFT JOIN user as user ON(ord.user_id = user.user_id) 
                         LEFT JOIN orderdetail as detail ON(ord.order_id = detail.order_id) 
                         LEFT JOIN product as pro ON(detail.product_id = pro.product_id) 
                         Where ord.statusId=1 and ord.order_status Like 'Order Placed' and date(ord.order_date) = CURDATE() `
            console.log(query);
            pool.query(query, function (err, data) {
            if(err) {
                res.send({status:400,success:false,message:"No Detail Found"});
            }
            else if(data.length == 0){                       
                res.send({status:200,success:true,message:"No Detail Available"});
            }
            else{
                res.send({status:200,success:true,message:
                    "Detail Found", data:data});
            }
        });
        }
    })(req,res,next);
}

module.exports.todayOrder = function(req,res,next){
    passport.authenticate('jwt',function(err,user){
        if(err || !user){
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            // var query = `select ord.*, user.user_name from orders ord
            // LEFT JOIN user as user ON(ord.user_id = user.user_id) 
            // Where ord.statusId=1 and date(ord.order_date) = CURDATE()`;

            var query = `select ord.*, detail.*,pro.product_name,user.user_name from orders ord 
            LEFT JOIN user as user ON(ord.user_id = user.user_id) 
            LEFT JOIN orderdetail as detail ON(ord.order_id = detail.order_id) 
            LEFT JOIN product as pro ON(detail.product_id = pro.product_id) 
            Where ord.statusId=1 and date(ord.order_date) = CURDATE() `
            console.log(query);
            pool.query(query, function (err, data) {
            if(err) {
                res.send({status:400,success:false,message:"No Detail Found"});
            }
            else if(data.length == 0){                       
                res.send({status:200,success:true,message:"No Detail Available"});
            }
            else{
                res.send({status:200,success:true,message:
                    "Detail Found", data:data});
            }
        });
        }
    })(req,res,next);
}

//-----------------------------------------------------------------------------------------------


//---------------------------------Razorpay--------------------------------------------------

module.exports.insertRazorpayDetails = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var razorpay = new Razorpay(req.body);    
        razorpay.user_id = user[0].user_id;        
        if(!razorpay.razorpay_paymentid)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Razorpay Payment Id.' });        
        }
        razorpay.statusId=1;
        razorpay.createdById = user[0].user_id;
        razorpay.creationDate = new Date;
        Razorpay.createRazorpay(razorpay, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

module.exports.getAllRazorpayDetails = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Razorpay.getAllDetails(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

module.exports.getAllRazorpayDetailsOfUser = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Razorpay.getAllDetailsOfUser(user[0].user_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}
//------------------------------------------------------------------------------------------------

//Revenue (Analytics) Revenue Wise

module.exports.getYearlyRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_year = req.query.year;
            pool.query(`select date_format(order_date,'%b') as months,sum(product_price*product_quantity)as revenue from orders,orderdetail where orders.order_id=orderdetail.order_id 
            and year(order_date)= ${my_year}
            group by date_format(order_date,'%b') `, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.getMonthlyRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_year = req.query.year;
            var my_month = req.query.month;
            pool.query(`select date_format(order_date,'%b') as months,sum(product_price*product_quantity)as revenue 
            from orders,orderdetail where orders.order_id=orderdetail.order_id 
            and year(order_date) = ${my_year} and month(order_date) = ${my_month}
            group by date_format(order_date,'%b')`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.getWeeklyRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_year = req.query.year;
            var my_month = req.query.month;
            pool.query(`SELECT STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Sunday'), '%X%V %W') AS 'Week Start', 
                        STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Saturday'), '%X%V %W') AS 'Week End', 
                        SUM(product_price*product_quantity) AS revenue FROM orders,orderdetail 
                        WHERE orders.order_id=orderdetail.order_id and year(order_date) = ${my_year} and 
                        month(order_date) = ${my_month} and orders.statusId = 1 GROUP BY YEARWEEK(order_date) 
                        ORDER BY YEARWEEK(order_date) `, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}




//------------------------------------------------------------------------------------------------------------


//---------------------------------------------------ForGot Password-----------------------------------------

module.exports.forgotPassword = function(req,res){
    var email = req.body.email
    if(email == ''){
        res.send({status:200,success:true,message:"Email Required"});
    }
    pool.query(`select adminemail from adminlogin where adminemail = '${email}'`, function(err,data){
        console.log('Data', data);
        if(err){
            res.send({status:200,success:true,message:"Something Went Wrong."});
        }
        if(data.length == 0 ){
            res.send({status:200,success:true,message:"No Email Available"});
        }
        else{            
            const token = crypto.randomBytes(20).toString('hex');

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true, 
                        ignoreTLS: false,
                        //secure: false,
                        auth: {
                            user: 'dev.cerbosys@gmail.com',
                            pass: 'Cerbosys@123!',
                        },
                    });

                    const mailOptions = {
                        from: 'dev.cerbosys@gmail.com',
                        to: email,
                        subject: 'Link To Reset Password',
                        text: 'You are receiving this because you have requested the reset of the password for your account.\n\n'
                        + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n'
                        // + `http://45.80.152.232:2000/resetPassword/${token}`
                        + `http://localhost:3000/resetPassword `
                        + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
                    };

                    transporter.sendMail(mailOptions, function(err,resp){
                        if(err){
                            console.log('Error' + err);
                            res.send({status:400,success:false,message:"Cannot Send Mail" });
                        }
                        else{
                            console.log('Sent');
                            res.send({status:200,success:true,message:"Recovery Email Sent."});
                        }
                    });

                }
            });

}

module.exports.resetPassword = function(req,res){
    var pass = req.body.password;
    var email = req.body.email;
    pool.query(`update adminlogin set adminpassword='${pass}' where adminemail = '${email}'`, function(err,data){
        if(err){
            res.send({status:400,success:false,message:"Something Went Wrong."});
        }
        else if(data.affectedRows==0){
            res.send({status:200,success:true,message:"Password cannot be updated. Please check your email."});
        }
        else{
            res.send({status:200,success:true,message:"Password Updated Successfully."});
        }
    });
}
//------------------------------------------------------------------------------------------------------------

//Get Razor Pay details;

module.exports.getRazorPayDetails = function(req,res){    
    pool.query(`select * from razorpaycredentials`, function(err,data){
        if(err){
            res.send({status:400,success:false,message:"Something Went Wrong."});
        }        
        else{
            res.send({status:200,success:true,message:"Data Found.", data: data});
        }
    });
}