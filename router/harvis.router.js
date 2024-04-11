const express = require('express');
const router = express.Router();
var multer = require('multer');
var http = require('http');
var path = require('path');
const mycontroller = require('../controller/harvis.controller');

const DIR = './public/product';
let storage = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, DIR);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let upload = multer({storage: storage}); 
//---------------------------------------------------------------------

const USERDIR = './public/user';
let storageUser = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, USERDIR);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let uploadUser = multer({storage: storageUser}); 

//----------------------------------------------------------------------------

const CARTDIR = './public/cart';
let storageCart = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, CARTDIR);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let uploadCart = multer({storage: storageCart}); 

//-----------------------------------------------------------------


//------------------Test Api-------------------------------------

router.get("/greetings", mycontroller.greetings);
router.post("/adminLogin", mycontroller.adminLogin);
//---------------------------------------------------------------

//-------------------Category Api-------------------------------
router.post("/insertCategory", mycontroller.insertCategory);
router.post("/updateCategory", mycontroller.updateCategory);
router.get("/deleteCategory", mycontroller.deleteCategory);
router.get("/getAllCategories", mycontroller.getAllCategories);
router.get("/getCategoryByCategoryId", mycontroller.getCategoryByCategoryId);
//--------------------------------------------------------------


//-----------------------Subcategory Api---------------------------

router.post("/insertSubcategory", mycontroller.insertSubcategory);
router.post("/updateSubcategory", mycontroller.updateSubcategory);
router.get("/deleteSubcategory", mycontroller.deleteSubcategory);
router.get("/getAllSubcategories", mycontroller.getAllSubcategories);
router.get("/getAllSubcategoriesByCategory", mycontroller.getAllSubcategoriesByCategory);
router.get("/getSubcategoryBySubcategoryId", mycontroller.getSubcategoryBySubcategoryId);
//-----------------------------------------------------------------

//-----------------------Product Api---------------------------

router.post("/insertProduct", upload.single('product_image'),mycontroller.insertProduct);
router.post("/updateProduct", upload.single('product_image'),mycontroller.updateProduct);
router.get("/deleteProduct", mycontroller.deleteProduct);
router.get("/getAllProducts", mycontroller.getAllProducts);
router.get("/getProducts", mycontroller.getProducts);
router.get("/getProductsByProductId", mycontroller.getProductsByProductId);
router.get("/searchProduct", mycontroller.searchProduct);
//-----------------------------------------------------------------

//-----------------------User Api---------------------------

router.post("/registerUser", mycontroller.registerUser);
router.post("/userLogin",mycontroller.userLogin);
router.post("/updateUser", uploadUser.single('user_image'),mycontroller.updateUser);
router.get("/getAllUsers", mycontroller.getAllUsers);

//-----------------------------------------------------------------


//-----------------------Orders Api---------------------------

router.post("/insertOrder", mycontroller.insertOrder);
router.post("/updateOrder", mycontroller.updateOrder);
router.get("/deleteOrder", mycontroller.deleteOrder);
router.get("/getAllOrders", mycontroller.getAllOrders);
router.get("/getAllOrdersByUserId", mycontroller.getAllOrdersByUserId);
router.get("/getAllOrdersByDate",mycontroller.getAllOrdersByDate);
router.get("/getAllOrdersByOrderId",mycontroller.getAllOrdersByOrderId);
//-----------------------------------------------------------------

//--------------------------OrderDetail Api-------------------------
router.post("/insertOrderDetail", mycontroller.insertOrderDetail);
router.post("/updateOrderDetail", mycontroller.updateOrderDetail);
router.get("/deleteOrderDetail", mycontroller.deleteOrderDetail);
router.get("/getAllOrderDetail", mycontroller.getAllOrderDetail);
//-----------------------------------------------------------------

//--------------------------Offer Api-------------------------
router.post("/insertOffer", mycontroller.insertOffer);
router.post("/updateOffer", mycontroller.updateOffer);
router.get("/deleteOffer", mycontroller.deleteOffer);
router.get("/getAllOffers", mycontroller.getAllOffers);
router.get("/getAllOfferByOfferId", mycontroller.getAllOfferByOfferId);
//-----------------------------------------------------------------

//--------------------------Shipping Api-------------------------
router.post("/insertShippingAddress", mycontroller.insertShippingAddress);
router.post("/updateShippingAddress", mycontroller.updateShippingAddress);
router.get("/deleteShippingAddress", mycontroller.deleteShippingAddress);
router.get("/getAllAddress", mycontroller.getAllAddress);
router.get("/getShippingAddressById", mycontroller.getShippingAddressById)
//-----------------------------------------------------------------

//---------------------------Invoice Api's---------------------------

router.post('/generateInvoice',mycontroller.generateInvoice);
router.get('/printInvoice', mycontroller.printInvoice);

//-------------------------------------------------------------------

//--------------------------------------------------------------------

//--------------------------Wishlist Api----------------------------
router.post('/insertWishlist', mycontroller.insertWishlist);
router.post('/updateWishlist', mycontroller.updateWishlist);
router.get('/deleteWishlist', mycontroller.deleteWishlist);
router.get('/getAllWishlist', mycontroller.getAllWishlist);

//--------------------------------------------------------------

//--------------------Subscription Api-----------------------------

router.post('/insertSubscription', mycontroller.insertSubscription);
router.get('/getAllSubscription', mycontroller.getAllSubscription);

//-------------------------------------------------------------------

//------------------------User Count Api------------------------------

router.get('/getCustomerCount', mycontroller.getCustomerCount);

//-------------------------------------------------------------------

//----------------------------searchProduct----------------------------
router.get('/searchProduct', mycontroller.searchProduct);
router.get('/getProductCount', mycontroller.getProductCount);
router.get('/getTotalOrders', mycontroller.getTotalOrders);
router.get('/getTotalRevenueByMonth', mycontroller.getTotalRevenueByMonth);
//----------------------------------------------------------------------

//----------------------------Analytics Api----------------------------
router.get('/getYearlySale', mycontroller.getYearlySale);
router.get('/getMonthlySale', mycontroller.getMonthlySale);
router.get('/getWeeklySale', mycontroller.getWeeklySale);

//----------------------------------------------------------------------

//-----------------------Change Password--------------------------------
router.post('/changePassword', mycontroller.ChangePassword)
//----------------------------------------------------------------------


//-----------------------ShoppingCart Api's------------------------

router.post('/addToCart', uploadCart.single('product_image'),mycontroller.addToCart);
router.post('/updateCart', mycontroller.updateCart);
router.get('/deleteCart', mycontroller.deleteCart);
router.get('/getUserCartItems',mycontroller.getUserCartItems);
router.get('/getTotalCartProduct', mycontroller.getTotalCartProduct);
router.get('/clearCart', mycontroller.clearCart);

router.post('/proceedToCheckout', mycontroller.proceedToCheckout);
router.post('/updatePaymentStatus', mycontroller.updatePaymentStatus);

//-----------------------------------------------------------------------

//----------------------Transaction Type--------------------------------

router.post('/insertTransaction', mycontroller.insertTransaction);
router.get('/getAllTransaction', mycontroller.getAllTransaction);
router.get('/getAllTransactionOfUser', mycontroller.getAllTransactionOfUser);
//----------------------------------------------------------------------

//-----------------------Other Orders Api--------------------------------
router.get('/incomingOrder', mycontroller.incomingOrder);
router.get('/todayOrder', mycontroller.todayOrder);
//----------------------------------------------------------------------

//-----------------------Razorpay Api--------------------------------
router.post('/insertRazorpayDetails', mycontroller.insertRazorpayDetails);
router.get('/getAllRazorpayDetails', mycontroller.getAllRazorpayDetails);
router.get('/getAllRazorpayDetailsOfUser', mycontroller.getAllRazorpayDetailsOfUser);
//----------------------------------------------------------------------


//----------------------------Revenue Api----------------------------
router.get('/getYearlyRevenue', mycontroller.getYearlyRevenue);
router.get('/getMonthlyRevenue', mycontroller.getMonthlyRevenue);
router.get('/getWeeklyRevenue', mycontroller.getWeeklyRevenue);

//----------------------------------------------------------------------

//---------------------Forgot Password----------------------------------
  router.post('/forgotPassword', mycontroller.forgotPassword);
  router.post('/resetPassword', mycontroller.resetPassword);
//-------------------------------------------------------------------

//----------------------------------------------------------------
router.get('/getRazorPayDetails', mycontroller.getRazorPayDetails);
//---------------------------------------------------------------
module.exports = router;