const User = require('../models/User');
const Business = require('../models/Business');
const Products = require('../models/Products');
var async = require('async');
const { body, validationResult } = require('express-validator');

//Display list of all Users.
exports.product_list = function (req, res, next) {
    Products.find({})
        .exec(function (err, list_products) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('product_list', { title: 'Products List', product_list: list_products });
        });
};

//Display detail page for a specific User.
exports.product_detail = function (req, res, next) {
    async.parallel({
        product: function (callback) {
            Products.findById(req.params.id)
                .populate('user')
                .populate('business')
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.product == null) {//No results.
            var err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('product_detail', { title: 'Product Detail', product: results.product });//, user_products: results.user_products, user_business: results.user_business });
    });
};

//Display Product created through User form on GET
exports.product_user_create_get = function (req, res, next) {
    var product = new Products();
    res.render('product_form', { title: 'Create Product', product: product, errors: null });
};

//Handle Product created through User on POST.
exports.product_user_create_post = [
    //Validate and sanitize the name field.
    body('name', 'Name is required').trim().isLength({ min: 1 }),

    //Process request after validation and sanitization
    (req, res, next) => {
        //Extract the validation errors from a request
        const errors = validationResult(req);

        //Create a user object with escaped and trimmed data.
        var product = new Products(
            {
                name: req.body.name,
                mrp: req.body.mrp,
                description: req.body.description,
                user: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            //If there are errors, render the form again with sanitized values/errors
            res.render('product_form', { title: 'Create Product', product: product, errors: errors.array() });
            return;
        }
        else {
            //Data from form is valid
            product.save(function (err) {
                if (err) { return next(err); }

                async.parallel({
                    user: function (callback) {
                        User.findById(req.params.id).populate('products').populate('business').exec(callback);

                    },
                }, function (err, results) {
                    if (err) {
                        return next(err);
                    }
                    var prod = product._id;
                    results.user.products.push(prod);
                    results.user.save();


                })
                res.redirect(product.url);
            });
        }
    },
];

////////////////////////////////////////////
//Display Product created through User form on GET
exports.product_business_create_get = function (req, res, next) {
    var product = new Products();
    res.render('product_form', { title: 'Create Product', product: product, errors: null });
};

//Handle Product created through User on POST.
exports.product_business_create_post = [
    //Validate and sanitize the name field.
    body('name', 'Name is required').trim().isLength({ min: 1 }),

    //Process request after validation and sanitization
    (req, res, next) => {
        //Extract the validation errors from a request
        const errors = validationResult(req);
        // var userId = undefined;
        Business.findById(req.params.id).exec(function (err, resBusiness) {

            // });
            // async.parallel({
            //     business: function (callback) {
            //         Business.findById(req.params.id).exec(callback);

            //     },
            // }, function (err, results) {
            //     if (err) {
            //         return next(err);
            //     }

            //Create a user object with escaped and trimmed data.
            var product = new Products(
                {
                    name: req.body.name,
                    mrp: req.body.mrp,
                    description: req.body.description,
                    business: req.params.id,
                    user: resBusiness.user
                }
            );
            userId = resBusiness.user;
            if (!errors.isEmpty()) {
                //If there are errors, render the form again with sanitized values/errors
                res.render('product_form', { title: 'Create Product', product: product, errors: errors.array() });
                return;
            }
            else {
                //Data from form is valid
                product.save(function (err11) {
                    if (err11) { return next(err11); }

                    // async.parallel({
                    //     business: function (callback) {
                    //         Business.findById(req.params.id).populate('products').populate('business').exec(callback);

                    //     },
                    // user: function (callback) {
                    User.findById(userId).exec(function (err1, resUser) {
                        if (err1) {
                            return next(err1);
                        }
                        var prod = product._id;
                        // results1.business.product.push(prod);
                        // results1.business.save();
                        resBusiness.product.push(prod);
                        resBusiness.save();
                        // results1.user.products.push(prod);
                        // results1.user.save();
                        resUser.products.push(prod);
                        resUser.save();
                    })
                    res.redirect(product.url);

                })
            }
        })
    },
];

////////////////////// UPDATE ////////////

//Display Product Update form on GET
exports.product_update_get = function (req, res, next) {
    async.parallel({
        product: function (callback) {
            Products.findById(req.params.id).populate('user').populate('business').exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.product == null) {
            var err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        res.render('product_form', { title: 'Create Product', product: results.product, errors: null });

    })
};

//Handle Product created through User on POST.
exports.product_update_post = [
    //Validate and sanitize the name field.
    body('name', 'Name is required').trim().isLength({ min: 1 }),

    //Process request after validation and sanitization
    (req, res, next) => {
        //Extract the validation errors from a request
        const errors = validationResult(req);

        //Create a user object with escaped and trimmed data.
        var product = new Products(
            {
                name: req.body.name,
                mrp: req.body.mrp,
                description: req.body.description,
                user: req.body.user,
                business: req.body.business,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            //If there are errors, render the form again with sanitized values/errors
            res.render('product_form', { title: 'Create Product', product: product, errors: errors.array() });
            return;
        }
        else {
            //Data from form is valid
            Products.findByIdAndUpdate(req.params.id, product, {}, function (err, theproduct) {
                if (err) { return next(err); }
                res.redirect(theproduct.url);
            });
        }
    },
];

////////////////DELETE ///////////////////////
exports.product_delete_get = function (req, res, next) {
    async.parallel({
        product: function (callback) {
            Products.findById(req.params.id).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.product == null) {
            res.redirect('/catalog/users')
        }
        //Successful, so render
        res.render('product_delete', { title: "Delete Product", product: results.product });
    });
};

exports.product_delete_post = function (req, res, next) {
    async.parallel({
        product: function (callback) {
            Products.findById(req.body.productId).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }

        //Success
        var userid = results.product.user;
        User.updateOne({ _id: userid }, { $pull: { products: req.params.id } });
        if (results.product.business) {
            var businessid = results.product.business;
            Business.updateOne({ _id: businessid }, { $pull: { product: req.params.id } });

        }

        Products.findByIdAndRemove(req.body.productId, function deleteProduct(err) {
            if (err) { return next(err); }
            //Success - go to user list
            res.redirect('/catalog/user/' + userid)
        });
    });
};