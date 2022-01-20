const User = require('../models/User');
const Business = require('../models/Business');
const Products = require('../models/Products');
var async = require('async');
const { body, validationResult } = require('express-validator');

//Display list of all Users.
exports.business_list = function (req, res, next) {
    Business.find({})
        .exec(function (err, list_business) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('business_list', { title: 'Business List', business_list: list_business });
        });
};

//Display detail page for a specific User.
exports.business_detail = function (req, res, next) {
    async.parallel({
        business: function (callback) {
            Business.findById(req.params.id)
                .populate('user')
                .exec(callback);
        },

        business_products: function (callback) {
            Products.find({ 'business': req.params.id })
                .exec(callback);
        },

        business_user: function (callback) {
            Business.find({ 'business': req.params.id })
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.business == null) {//No results.
            var err = new Error('Business not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('business_detail', { title: 'Business Detail', business: results.business, business_products: results.business_products, business_user: results.business_user });
    });
};

//Display User create form on GET
exports.business_create_get = function (req, res, next) {
    var business = new Business();
    res.render('business_form', { title: 'Create Business', business: business, errors: null });
};

//Handle User create on POST.
exports.business_create_post = [
    //Validate and sanitize the name field.
    body('name', 'Name is required').trim().isLength({ min: 1 }),

    //Process request after validation and sanitization
    (req, res, next) => {
        //Extract the validation errors from a request
        const errors = validationResult(req);

        //Create a user object with escaped and trimmed data.
        var business = new Business(
            {
                name: req.body.name,
                email: req.body.email,
                registrationNo: req.body.registrationNo,
                user: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            //If there are errors, render the form again with sanitized values/errors
            res.render('business_form', { title: 'Create Business', business: business, errors: errors.array() });
            return;
        }
        else {
            //Data from form is valid
            business.save(function (err) {
                if (err) { return next(err); }

                async.parallel({
                    user: function (callback) {
                        User.findById(req.params.id).populate('products').populate('business').exec(callback);

                    },
                }, function (err, results) {
                    if (err) {
                        return next(err);
                    }
                    var busi = business._id;
                    results.user.business.push(busi);
                    results.user.save();

                    res.redirect(business.url);
                })

            });
        }
    },
];

