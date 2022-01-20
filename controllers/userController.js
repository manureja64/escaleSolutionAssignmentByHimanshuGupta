const User = require('../models/User');
const Business = require('../models/Business');
const Products = require('../models/Products');
var async = require('async');
const { body, validationResult } = require('express-validator');

//Display list of all Users.
exports.user_list = function (req, res, next) {
    User.find({})
        .exec(function (err, list_users) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('user_list', { title: 'Users List', user_list: list_users });
        });
};

//Display detail page for a specific User.
exports.user_detail = function (req, res, next) {
    async.parallel({
        user: function (callback) {
            User.findById(req.params.id)
                .exec(callback);
        },

        user_products: function (callback) {
            Products.find({ 'user': req.params.id })
                .exec(callback);
        },

        user_business: function (callback) {
            Business.find({ 'user': req.params.id })
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.user == null) {//No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('user_detail', { title: 'User Detail', user: results.user, user_products: results.user_products, user_business: results.user_business });
    });
};

//Display User create form on GET
exports.user_create_get = function (req, res, next) {
    var user = new User();
    res.render('user_form', { title: 'Create User', user: user, errors: null });
};

//Handle User create on POST.
exports.user_create_post = [
    //Validate and sanitize the name field.
    body('name', 'Name is required').trim().isLength({ min: 1 }),

    //Process request after validation and sanitization
    (req, res, next) => {
        //Extract the validation errors from a request
        const errors = validationResult(req);

        //Create a user object with escaped and trimmed data.
        var user = new User(
            {
                name: req.body.name,
                email: req.body.email,
                bio: req.body.bio
            }
        );

        if (!errors.isEmpty()) {
            //If there are errors, render the form again with sanitized values/errors
            res.render('user_form', { title: 'Create User', user: user, errors: errors.array() });
            return;
        }
        else {
            //Data from form is valid
            user.save(function (err) {
                if (err) { return next(err); }
                res.redirect(user.url);
            });
        }
    },
];


