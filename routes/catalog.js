var express = require('express');
var router = express.Router();


//Require controller modules
var user_controller = require('../controllers/userController');
var business_controller = require('../controllers/businessController');
var product_controller = require('../controllers/productController');


//USER ROUTES///

//GET request to CREATE a new User
router.get('/user/create', user_controller.user_create_get);

//POST request to CREATE a new User
router.post('/user/create', user_controller.user_create_post);

// //GET request to DELETE a User.
// router.get('/user/:id/delete', user_controller.user_delete_get);

// //POST request to DELETE a User.
// router.post('/user/:id/delete', user_controller.user_delete_post);

// //GET request to UPDATE a User.
// router.get('/user/:id/update', user_controller.user_update_get);

// //POST request to UPDATE a User.
// router.post('/user/:id/update', user_controller.user_update_post);

//GET request for one User.
router.get('/user/:id', user_controller.user_detail);

//GET request for all Users.
router.get('/users', user_controller.user_list);
// router.post('/users', user_controller.user_list_post);


//BUSINESS ROUTES///

//GET request to CREATE a new Business
router.get('/business/create/:id', business_controller.business_create_get);

//POST request to CREATE a new Business
router.post('/business/create/:id', business_controller.business_create_post);

// //GET request to DELETE a Business.
// router.get('/business/:id/delete', business_controller.business_delete_get);

// //POST request to DELETE a Business.
// router.post('/business/:id/delete', business_controller.business_delete_post);

// //GET request to UPDATE a Business.
// router.get('/business/:id/update', business_controller.business_update_get);

// //POST request to UPDATE a Business.
// router.post('/business/:id/update', business_controller.business_update_post);

//GET request for one Business.
router.get('/business/:id', business_controller.business_detail);

//GET request for all Businesses.
router.get('/businesses', business_controller.business_list);
// router.post('/businesses', user_controller.business_list_post);


//PRODUCT ROUTES///

//GET request to CREATE a new Product through a User
router.get('/product/user/create/:id', product_controller.product_user_create_get);

//POST request to CREATE a new Product through a User
router.post('/product/user/create/:id', product_controller.product_user_create_post);

//GET request to CREATE a new Product through a Business
router.get('/product/business/create/:id', product_controller.product_business_create_get);

//POST request to CREATE a new Product through a Business
router.post('/product/business/create/:id', product_controller.product_business_create_post);


//GET request to DELETE a Product.
router.get('/products/:id/delete', product_controller.product_delete_get);

//POST request to DELETE a Product.
router.post('/products/:id/delete', product_controller.product_delete_post);

//GET request to UPDATE a Product.
router.get('/products/:id/update', product_controller.product_update_get);

//POST request to UPDATE a Product.
router.post('/products/:id/update', product_controller.product_update_post);

//GET request for one Product.
router.get('/products/:id', product_controller.product_detail);

//GET request for all Products.
router.get('/products', product_controller.product_list);
// router.post('/products', product_controller.product_list_post);

module.exports = router;
