// var express = require('express');
// var router = express.Router();
// var csrf = require('csurf');
// var passport = require('passport');
// var formidable = require('formidable');
// var fs = require('fs');
//
// // var Cart = require('../models/cart');
// // var Order = require('../models/order');
// var User = require('../models/user');
// var Type = require('../models/type');
// var Product = require('../models/product');
//
// // var gravatar = require('gravatar');
//
// var csrfProtection = csrf();
//
// router.post('/:gender/add', isLoggedIn, function(req, res, next) {
//     Type.count({gender: req.params.gender}, function(err, c) {
//         var type = new Type({
//             gender: req.params.gender,
//             type_name: req.body.type,
//             priority: (c + 1)
//         });
//         type.save(function (err) {
//             if (err)
//                 throw err;
//
//             res.redirect('/' + req.params.gender);
//         });
//     });
// });
//
// module.exports = router;
//
// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/');
// }
