var express = require("express");
var mysql = require('mysql');
var app = express();
var path = require('path');
const passport = require('passport');
var jwt = require('jsonwebtoken');
var jimp = require("jimp");
const pool = require('../authorization/pool');
const passwordHash = require('password-hash');

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
var Cart = require('../modal/cart.modal');
var CartDetail = require('../modal/cartdetail.modal');
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
        var category = new Category(req.query);
        category.statusId = 0;           
        Category.deleteCategory(req.query.category_id,category,function(err, data) 
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
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
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
       }
  })(req,res,next)
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
        var subcategory = new Subcategory(req.query);
        subcategory.statusId = 0;           
        Subcategory.deleteSubcategory(req.query.subcategory_id,subcategory,function(err, data) 
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
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
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
       }
  })(req,res,next)
}

//Get All Subctegories by category Id

module.exports.getAllSubcategoriesByCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
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
       }
  })(req,res,next)
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
                if(!product.product_quantity){
                    res.status(400).send({ success:false, message: 'Please Provide Product Quantity.' });        
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
                if(!product.product_quantity){
                    res.status(400).send({ success:false, message: 'Please Provide Product Quantity.' });        
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
                if(!product.product_quantity){
                    res.status(400).send({ success:false, message: 'Please Provide Product Quantity.' });        
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
        var product = new Product(req.query);
        product.statusId = 0;           
        Product.deleteProduct(req.query.product_id,product,function(err, data) 
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
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Product.getAllProduct(req.query.category_id, req.query.subcategory_id,function(err,data){
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
            return res.status(400).send({ error:true, message: 'Please Provide Name.' });        
        }
        if(!user.user_password)
        {
            return res.status(400).send({ error:true, message: 'Please Provide User Password.' });        
        }
        if(!user.user_mobile)
        {
            return res.status(400).send({ error:true, message: 'Please Provide User Mobile.' });        
        }
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

module.exports.userLogin = function(req,res)
{    
    const username = req.body.username;  
    const password = req.body.password;
    console.log('Request',req);
    console.log('Username',username);
    console.log('Password',password);

    var query= `select * from user where user_name='${username}'`;
    console.log(query);
    pool.query(query,function(err, user){
        if(err)
        {
            console.log(err);
            return res.json({ status: 401, success: false, message: "Something Went Wrong." });
        }
        else{     
            console.log('The solution is: ', user);
            console.log('Length', user.length);
            console.log('Password',password);
            if(user.length == 0){
                return res.json({ status: 401, success: false, message: "Username does not Exists." });
            }          
            else if(user.length > 0)
            {                
                if(passwordHash.verify(password,user[0].user_password))
                //if(user[0].user_password == password)
                {
                    console.log("working", user[0].user_password);         
                    var token = "";
                    var secret = "";
                    secret = {type: 'user', _id: user[0].user_id, password: user[0].user_password};
                                              token = jwt.sign(secret, 'mrsharvisorganique', {
                                                  expiresIn: 31557600000
                                });
                    console.log("Demo=" + token);
                    res.send({status:200, success: true,
                              message:"Login Successful",token:token,
                    });
                }
                else{
                        return res.send({status:200, success: false,  
                            message:"Password Mismatch"});
                        res.sendStatus(200);
                    }
                }         
                else
                {
                    return res.send({status:401, success: false, 
                        message:"Invalid Username and Password"});
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

module.exports.getAllOrderDetail = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var order_id = req.query.order_id;
            OrderDetail.getAllOrderDetail(order_id,function(err,data){
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
        if(!offer.offer_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Name.' });        
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
        var offer = new Offer(req.query);
        offer.statusId = 0;           
        Offer.deleteOffer(req.query.offer_id,offer,function(err, data) 
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
        else if(user){
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
                        view_query=`select inn.*, ship.* from invoice inn
                                    LEFT JOIN shippingaddress as ship ON (inn.shipping_id = ship.shipping_id)
                                    where ship.shipping_id=${shipping_id}`;
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


//------------------------------------------------------------------------------------------------------------------
//Cart  Api's

//Create Cart User Token

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
        var cart = new Cart(req.body);
        console.log('Test',user[0].user_id);
        cart.user_id = user[0].user_id;
        cart.date_placed = new Date;     
        cart.statusId = 1;
        cart.createdById = user[0].user_id;
        cart.creationDate = new Date;
        //cart = new Cart(cart);
        Cart.createCart(cart, function(err, req,data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                //res.send({status:200,success:true,message:data.message});
                var cartdetail = new CartDetail(req.body)
                cartDetail.cart_id = data.id;
                console.log('CartDetail', cartDetail);
                cartDetail();
            }
        });
    }    
  })(req,res,next)
}



//------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------------------

//Adding to Cart in Cart Detail...

function cartDetail(){
    let cdData = req.body;
    var value,order,count=0;
    for(i=0;i<cdData.length;i++)
    {
        value = cdData[i];
        console.log(Object.values(value));               
        cartdetail = new CartDetail(cdData[i]);                
        if(!cartdetail.product_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Product.' });        
        }
        else if(!cartdetail.price)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Price.' });        
        }
        else if(!cartdetail.quantity)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Quantity.' });        
        }      
        cartdetail.statusId=1;
        cartdetail.createdById = user[0].user_id;
        cartdetail.creationDate = new Date;
        CartDetail.createCartDetail(cartdetail, function(err, data) 
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


//-------------------------------------------------------------------------------------------------------------------