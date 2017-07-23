var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var formidable = require('formidable');
var fs = require('fs');

// var Cart = require('../models/cart');
// var Order = require('../models/order');
var User = require('../models/user');
var Type = require('../models/type');
var Product = require('../models/product');

// var gravatar = require('gravatar');

var csrfProtection = csrf();

// router.get('/auth/google', passport.authenticate('google', { scope: [
//     'https://www.googleapis.com/auth/plus.login',
//     'https://www.googleapis.com/auth/plus.profile.emails.read'
//     ]}
// ));
// router.get( '/auth/google/callback', passport.authenticate( 'google', {
//     successRedirect: '/',
//     failureRedirect: '/user/signup',
//     failureFlash: true
// }), function(req, res, next) {
//     var oldUrl = '/user/account';
//     if(req.session.oldUrl) {
//         oldUrl = req.session.oldUrl;
//         req.session.oldUrl = null;
//     }
//     // req.session.user = ;
//     // req.app.locals.username = ;
//     res.redirect(oldUrl);
//         // User.findOne({'email': req.body.email}, function(err, user) {
//         //     if(err) {
//         //         return res.write('Unexpected Error.');
//         //     }
//         //     if(!user) {
//         //         return res.write('User Not Found!');
//         //     }
//         //     req.session.user = user;
//         //     req.app.locals.username = user.username;
//         //     res.redirect('/user/account');
//         // });
// });

// router.get('/profile/:id', function(req, res, next) {
//     console.log(req.params.id);
//     User.findOne({'userID': req.params.id}, function(err, foundUser) {
//         if(err) {
//             throw err;
//         }
//         var notFound = "", hasError = false, gender = "unknown";
//         if(!foundUser) {
//             notFound = "This user doesn't exist!";
//             hasError = true;
//         } else {
//             gender = (foundUser.sex == "male"? "male": (foundUser.sex == "female"? "female" : "unknown"));
//             foundUser.image = gravatar.url(foundUser.email);
//         }
//
//         res.render('user/profile', {
//             user: foundUser,
//             gender: gender,
//             hasError: hasError,
//             message: notFound
//         });
//     });
// });
//
// router.post('/setting', isLoggedIn, function(req, res, next) {
//     User.findOneAndUpdate({
//         'email': req.session.user.email
//     }, {
//         'age': req.body.age,
//         'description': req.body.description,
//         'sex': req.body.sex
//     }, function(err, user) {
//         req.session.user.age = req.body.age;
//         req.session.user.description = req.body.description;
//         req.session.user.sex = req.body.sex;
//         if(err) {
//             req.flash('error', 'There was a problem changing information');
//             req.redirect('/user/setting');
//         }
//         req.flash('success', 'Settings Successfully Changed!');
//         res.redirect('/user/setting');
//     });
// });
//
//
//
// router.get('/account', isLoggedIn, function(req, res, next) {
//     Order.find({user: req.user}, function(err, orders) {
//         if(err) {
//             throw err;
//         }
//         var cart;
//         orders.forEach(function(order) {
//            cart = new Cart(order.cart);
//            order.items = cart.generateArray();
//         });
//         res.render('user/account', {
//             orders: orders
//         });
//     });
// });
//
// router.get('/setting', isLoggedIn, function(req, res, next) {
//     var userData = req.session.user;
//     var errMsg = req.flash('error')[0];
//     var isErr = true;
//     var hasSth;
//     if(errMsg) {
//         hasSth = true;
//     }
//     if(!errMsg) {
//         errMsg =  req.flash('success')[0];
//         if(errMsg) {
//             hasSth = true;
//         }
//         else {
//             hasSth = false;
//         }
//         isErr = false;
//     }
//     var isMan, isWoman;
//     if(req.session.user.sex) {
//         if(req.session.user.sex == "male")
//             isMan = true;
//         else
//             isMan = false;
//         isWoman = !isMan;
//     }
//     else
//         isWoman = false;
//
//     //set the gravatar, by the way
//     var image = gravatar.url(userData.email);
//     userData.image = image;
//
//     res.render('user/setting', {
//         user: userData,
//         errMsgSetting: errMsg,
//         hasErrorSetting: isErr,
//         hasSomething: !hasSth,
//         isMan: isMan,
//         isWoman: isWoman
//     });
// });
//
// router.get('/logout', isLoggedIn, function(req, res, next) {
//     req.logout();
//     res.redirect('/');
// });



//TODO: THIS IS THE SIGNUP PART -> THE ADMIN USER/PASS SHOULD BE ADDED VIA THIS WAY - MANUALLY MAY RESULT IN FAILURE
// router.get('/signup', notLoggedIn, function(req, res, next) {
//     var messages = req.flash('error');
//     res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
// });
//
// router.post('/signup', notLoggedIn, passport.authenticate('local.signup', {
//     failureRedirect: '/signup',
//     failureFlash: true
// }), function(req, res, next) {
//     User.findOne({'username': req.body.username}, function(err, user) {
//         if(err) {
//             return res.write('Unexpected Error!');
//         }
//         req.session.user = user;
//         req.app.locals.username = user.username;
//         res.redirect('/account');
//     });
// });

//----------------------------------------------------------------------------------------------------------------------

// router.get('/:gender/:type/')

router.post('/:gender/add', isLoggedIn, function(req, res, next) {
    Type.count({gender: req.params.gender}, function(err, c) {
        var type = new Type({
            gender: req.params.gender,
            type_name: req.body.type,
            priority: (c + 1)
        });
        type.save(function (err) {
            if (err)
                throw err;

            res.redirect('/' + req.params.gender);
        });
    });
});

router.post('/:gender/:type/:number/previous', isLoggedIn, function (req, res, next) {
    move_product(req.params.gender, req.params.type, req.params.number, false).then(function(r) {
        res.redirect('/' + req.params.gender + '/' + req.params.type);
    });
});

router.post('/:gender/:type/:number/delete', isLoggedIn, function (req, res, next) {
    Product.findOne({gender: req.params.gender, type: req.params.type, number: Number(req.params.number)}, function (err, wanted_doc) {
        if(err) throw err;
        //TODO: also take off the headers!!! :D
        //TODO: go through all docs and the ones that are after this, decrease their number by one, then remove this, along with its image

        // remove_files(wanted_doc).then(function() {
        // var wanted_file_number = get_number_path(wanted_doc.picture);

        fs.unlink(wanted_doc.botdir, function(errul) {
            if(errul) throw errul;

            Product.find({gender: req.params.gender, type: req.params.type}).sort({number: 'asc'}).exec(function(errr, docs) {
                if(errr) throw errr;

                //set the numbers (just like the priority with types)
                docs.forEach(function(doc, index) {
                    if (doc.number > wanted_doc.number) {
                        doc.number--;

                        doc.save(function (errdoc) {
                            if (errdoc) throw errdoc;

                            if (index == docs.length - 1) {
                                wanted_doc.remove(function (errwd) {
                                    if (errwd) throw errwd;

                                    res.redirect('/' + req.params.gender + '/' + req.params.type);
                                });
                            }
                        });
                    } else {
                        if (index == docs.length - 1) {
                            wanted_doc.remove(function (errwd) {
                                if (errwd) throw errwd;

                                res.redirect('/' + req.params.gender + '/' + req.params.type);
                            });
                        }
                    }
                });
            });
        });
    });
});

/*
docs.forEach(function(doc, index) {
    if(doc.number > wanted_doc.number) {
        doc.number --;

        /* TODO: we have a problem here!

         we have two separate things: 'number' and 'file_number'
         number: the order of products
         file_number: the number which has gone by its file name
         I think we must check two things:
         - remove the file by its 'file_number', not 'number'!
         - if the number of a doc is greater than this, decrement it
         - if the file_number of a doc is greater than this, decrement it by fs.rename

         - when done (all the 'number's and 'file_number's have been checked), safely delete the wanted_doc and redirect!

         Think we should use promise, one for each of the number and file_number :-?
         We'll talk about that when I'm back!
         *

        var oldPath = get_numberless_path(doc.botdir); //-> ./public/image/male/فشن/    (n.png is removed)
        var picNumber = get_number_path(doc.botdir); //-> ./public/image/male/فشن/3.png  (3)
        var oldPathExtension = get_extension(doc.botdir); //-> ./public/image/male/فشن/3.png  (png)
        var newPath = oldPath + (doc.number) + '.' + oldPathExtension;
        oldPath += (doc.number + 1) + '.' + oldPathExtension;

        fs.rename(oldPath, newPath, function (errfs) {
            if(errfs) throw errfs;

            doc.save(function(errdoc) {
                if(errdoc) throw errdoc;

                if(index == docs.length - 1) {
                    wanted_doc.remove(function(errwd) {
                        if(errwd) throw errwd;

                        res.redirect('/' + req.params.gender + '/' + req.params.type);
                    });
                }
            });
        });
    } else {
        if(index == docs.length - 1) {
            wanted_doc.remove(function(errwd) {
                if(errwd) throw errwd;

                res.redirect('/' + req.params.gender + '/' + req.params.type);
            });
        }
    }
});
*/
function remove_files(wanted_doc) {
    return new Promise(function(resolve, reject) {
        Product.find({gender: wanted_doc.gender, type: wanted_doc.type}).sort({picture: 'asc'}).exec(function(err, docs) {
            console.log(wanted_doc.picture);
            var wanted_file_number = get_number_path(wanted_doc.picture);

            fs.unlink(wanted_doc.botdir, function(errul) {
                if(errul) throw errul;

                if(wanted_file_number == docs.length - 1) {
                    return resolve();
                }

                docs.forEach(function(doc, index) {
                    var doc_file_number = get_number_path(doc.botdir);

                    // if(doc_file_number > wanted_file_number) {
                        // console.log("-----------\nFile Parts:");
                        // var oldPath = get_numberless_path(doc.botdir); //-> ./public/image/male/فشن/    (n.png is removed)
                        // console.log(oldPath);
                        // var picNumber = get_number_path(doc.botdir); //-> ./public/image/male/فشن/3.png  (3)
                        // var oldPathExtension = get_extension(doc.botdir); //-> ./public/image/male/فشن/3.png  (png)
                        // var newPath = oldPath + String(doc_file_number - 1) + '.' + oldPathExtension;
                        // oldPath = oldPath + String(doc_file_number) + '.' + oldPathExtension;
                        // console.log(doc_file_number);
                        // console.log(oldPathExtension);
                        // console.log(oldPath);
                        // console.log(newPath);
                        // console.log('-----------');
                        //
                        // console.log("THIS IS FOR THE PRODUCT" + doc.number);
                        // console.log(oldPath);
                        // console.log(newPath);
                        //TODO: we also have to change the 'picture' property if we are going to change the name of the file!!!!
                        // fs.rename(oldPath, newPath, function (errfs) {
                        //     if(errfs) throw errfs;
                        //
                        //     doc.picture = get_normal_dir(newPath);
                        //     doc.save(function(errs) {
                        //         if(errs) throw errs;
                                if(index == docs.length - 1) {
                                    return resolve();
                                }
                            // });
                        // });
                    // } else {
                    //     if (index == docs.length - 1) {
                    //         return resolve();
                    //     }
                    // }

                    // if(doc.number > wanted_doc.number) {
                    //     doc.number --;
                    //
                    //     /* TODO: we have a problem here!
                    //
                    //      we have two separate things: 'number' and 'file_number'
                    //      number: the order of products
                    //      file_number: the number which has gone by its file name
                    //      I think we must check two things:
                    //      - remove the file by its 'file_number', not 'number'!
                    //      - if the number of a doc is greater than this, decrement it
                    //      - if the file_number of a doc is greater than this, decrement it by fs.rename
                    //
                    //      - when done (all the 'number's and 'file_number's have been checked), safely delete the wanted_doc and redirect!
                    //
                    //      Think we should use promise, one for each of the number and file_number :-?
                    //      We'll talk about that when I'm back!
                    //      * */
                    //
                    //
                    // }
                });
            });
        });
    });
}

router.post('/:gender/:type/:number/next', isLoggedIn, function (req, res, next) {
    move_product(req.params.gender, req.params.type, req.params.number, true).then(function(r) {
        res.redirect('/' + req.params.gender + '/' + req.params.type);
    });
});

router.post('/:gender/:type/add', isLoggedIn, function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;

        var p = './public';
        if(!fs.existsSync(p))
            fs.mkdirSync(p);
        p += '/';

        p += 'image';
        if(!fs.existsSync(p))
            fs.mkdirSync(p);
        p += '/';

        p += req.params.gender;
        if(!fs.existsSync(p))
            fs.mkdirSync(p);
        p += '/';

        p += req.params.type;
        if(!fs.existsSync(p))
            fs.mkdirSync(p);
        p += '/';

        Product.find({gender: req.params.gender, type: req.params.type}).sort({picture: 'asc'}).exec(function(errf, docs) {
            if(errf) throw errf;
            if(docs.length == 0) {
                p += '1';
            } else {
                var highest = get_number_path(docs[0].picture);
                docs.forEach(function (elem) {
                    var n = get_number_path(elem.picture);
                    if (highest < n) {
                        highest = n;
                    }
                });
                p += (highest + 1);
            }
            if(files.filetoupload.type == 'image/png')
                p += '.png';
            else if(files.filetoupload.type == 'image/jpg')
                p += '.jpg';
            else
                console.log("WRONG EXTENSION");

            var pro = new Product({
                number: (docs.length + 1),
                gender: req.params.gender,
                type: req.params.type,
                picture: get_normal_dir(p),
                description: fields.description
            });

            pro.save(function(errr) {
                if(errr) throw errr;

                fs.rename(oldpath, p, function (error) {
                    if (error) throw error;

                    res.redirect('/' + req.params.gender + '/' + req.params.type);
                });
            });
            // console.log(files.filetoupload);
        });
        // p += files.filetoupload.name;
    });
});

router.post('/:gender/:type/previous', isLoggedIn, function(req, res, next) {
    move_type(req.params.gender, req.params.type, false).then(function(r) {
        res.redirect('/' + req.params.gender);
    });
});

router.get('/:gender/:type/edit', isLoggedIn, function(req, res, next) {
    Type.findOne({gender: req.params.gender, type_name: req.params.type}, function(err, doc) {
        if(err) throw err;
        if(!doc) {
            res.redirect('/' + req.params.gender);
        }

        res.render('type', {
            gender: req.params.gender,
            gender_persian: getPersianEquiv(req.params.gender),
            type: req.params.type
        });
    });
});

router.post('/:gender/:type/edit', isLoggedIn, function(req, res, next) {
    Type.findOne({gender: req.params.gender, type_name: req.params.type}, function(err, doc) {
        if(err) throw err;
        if(!doc) {
            res.redirect('/' + req.params.gender);
            return;
        }
        doc.type_name = req.body.edited_type_name;
        doc.save(function(errs) {
            if(errs) throw errs;
            Product.find({gender: req.params.gender, type: req.params.type}, function(errp, docs) {
                if(errp) throw errp;
                if(docs.length == 0) {
                    res.redirect('/' + req.params.gender);
                    return;
                }

                var my_count = 0;
                for(var i = 0; i < docs.length; i++) {
                    // console.log("Stage 7:" + i + "_" + my_count);
                    docs[i].type = req.body.edited_type_name;
                    docs[i].save(function(errps) {
                        if(errps) throw errps;
                        my_count++;
                        // console.log("Stage 7_:" + i + "_" + my_count);
                        if(my_count == docs.length) {
                            res.redirect('/' + req.params.gender);
                        }
                    });
                }
            });
        });
    });
});

router.post('/:gender/:type/delete', isLoggedIn, function(req, res, next) {
    Type.findOne({gender: req.params.gender, type_name: req.params.type}).exec(function(err, wanted_doc) {
        if(err) throw err;

        //TODO: do the same as Product.delete !
        Type.find({gender: req.params.gender}).sort({priority: 'asc'}).exec(function (errr, docs) {
            if(errr) throw errr;

            docs.forEach(function (doc, index) {
                if(doc.priority > wanted_doc.priority) {
                    doc.priority --;

                    doc.save(function(error) {
                        if(error) throw error;

                        if(index == docs.length - 1) {
                            wanted_doc.remove(function(er) {
                                if(er) throw er;

                                res.redirect('/' + req.params.gender);
                            });
                        }
                    });
                } else {
                    if(index == docs.length - 1) {
                        wanted_doc.remove(function(er) {
                            if(er) throw er;

                            res.redirect('/' + req.params.gender);
                        });
                    }
                }
            });
        });
    });
});

router.post('/:gender/:type/next', isLoggedIn, function(req, res, next) {
    move_type(req.params.gender, req.params.type, true).then(function(r) {
        res.redirect('/' + req.params.gender);
    });
});

router.get('/:gender/:type', isLoggedIn, function (req, res, next) {
    // console.log(req.params.gender);
    // console.log(req.params.type);
    Product.find({gender: req.params.gender, type: req.params.type}).sort({number: 'asc'}).exec(function (err, docs) {
        if(err)
            throw err;

        var tripleDocs = getProducts(docs);

        res.render('products', {
            gender: req.params.gender,
            gender_persian: getPersianEquiv(req.params.gender),
            type: req.params.type,
            products: tripleDocs
        });
    })
});

router.get('/collections', isLoggedIn, function(req, res, next) {
    var collections = {
        male: {
            label: 'کالکشن آقایان',
            command: '/male'
        },
        femele: {
            label: 'کالکشن بانوان',
            command: '/femele'
        },
        spouse: {
            label: 'کالکشن همسران',
            command: '/spouse'
        },
        baby: {
            label: 'کالکشن کودکان',
            command: '/baby'
        },
        narriage: {
            label: 'کالکشن عروسی',
            command: '/narriage'
        },
        jewelry: {
            label: 'کالکشن جواهرات',
            command: '/jewelry'
        },
        kafsh: {
            label: 'کالکشن کفش',
            command: '/kafsh'
        },
        accessory: {
            label: 'کالکشن اکسسوری',
            command: '/accessory'
        }
    }
    res.render('collections', {
        col: collections
    });
});

router.get('/:gender', isLoggedIn, function(req, res, next) {
    Type.find({gender: req.params.gender}).sort({priority: 'asc'}).exec(function(err, docs) {
        if(err)
            throw err;

        var tripleDocs = getProducts(docs);

        res.render('types', {
            gender: req.params.gender,
            gender_persian: getPersianEquiv(req.params.gender),
            types: tripleDocs
        });
    });
});

router.use(csrfProtection);

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/', function(req, res, next) {
    var messages = req.flash('error');
    res.render('login', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/', passport.authenticate('local.signin', {
    failureRedirect: '/',
    failureFlash: true
}), function(req, res, next) {
    User.findOne({ $or:[{'username': req.body.email}, {'email': req.body.email}] }, function(err, user) {
        if(err) {
            return res.write('Unexpected Error.');
        }
        if(!user) {
            return res.write('User Not Found!');
        }
        req.session.user = user;
        req.app.locals.username = user.username;
        res.redirect('/collections');
    });
});

module.exports = router;

//TODO: e.g previous of 1 -> docs.length - 1! :) / same for the next
function move_type(gender, type, forward) {
    return new Promise(function(resolved, reject) {
        Type.find({gender: gender}).sort({priority: 'asc'}).exec(function (err, docs) {
            if(err)
                throw err;

            Type.findOne({gender: gender, type_name: type}).exec(function(errr, wanted_doc) {
                if(errr)
                    throw errr;

                if(!forward) {
                    if(wanted_doc.priority < 2)
                        return resolved(true);
                    docs.forEach(function (doc, index) {
                        if (doc.priority == wanted_doc.priority - 1 || doc.priority == wanted_doc.priority) {
                            if (doc.priority == wanted_doc.priority - 1)
                                doc.priority++;
                            else
                                doc.priority--;

                            doc.save(function (error) {
                                if (error) throw error;
                                if (doc.priority == wanted_doc.priority)
                                    return resolved(true);
                            });
                        }
                    });
                } else {
                    // console.log(wanted_doc.priority);
                    // console.log(docs.length - 1);
                    if(wanted_doc.priority > docs.length - 1) {
                        // console.log("failure");
                        return resolved(true);
                    }
                    docs.forEach(function (doc, index) {
                        if (doc.priority == wanted_doc.priority || doc.priority == wanted_doc.priority + 1) {
                            if (doc.priority == wanted_doc.priority)
                                doc.priority++;
                            else
                                doc.priority--;

                            doc.save(function (error) {
                                if (error) throw error;
                                console.log("pass");
                                if (doc.priority == wanted_doc.priority + 1)
                                    return resolved(true);
                            });
                        }
                    });
                }
            });
        });
    });
}

function move_product(gender, type, number, forward) {
    return new Promise(function(resolved, reject) {
        Product.find({gender: gender, type: type}).sort({number: 'asc'}).exec(function (err, docs) {
            if(err)
                throw err;

            Product.findOne({gender: gender, type: type, number: number}).exec(function(errr, wanted_doc) {
                if(errr)
                    throw errr;

                if(!forward) {
                    if(wanted_doc.number < 2)
                        return resolved(true);
                    docs.forEach(function (doc, index) {
                        if (doc.number == wanted_doc.number - 1 || doc.number == wanted_doc.number) {
                            if (doc.number == wanted_doc.number - 1)
                                doc.number++;
                            else
                                doc.number--;

                            doc.save(function (error) {
                                if (error) throw error;
                                if (doc.number == wanted_doc.number)
                                    return resolved(true);
                            });
                        }
                    });
                } else {
                    if(wanted_doc.number > docs.length - 1)
                        return resolved(true);
                    docs.forEach(function (doc, index) {
                        if (doc.number == wanted_doc.number || doc.number == wanted_doc.number + 1) {
                            if (doc.number == wanted_doc.number)
                                doc.number++;
                            else
                                doc.number--;

                            doc.save(function (error) {
                                if (error) throw error;
                                console.log("pass");
                                if (doc.number == wanted_doc.number + 1)
                                    return resolved(true);
                            });
                        }
                    });
                }
            });
        });
    });
}

function get_normal_dir(str) { // ./public/
    str = str.substr(9, str.length - 9);
    str = './' + str;
    return str;
}

function get_numberless_path(path) { //-> ./public/image/male/فشن/    (n.png is removed)
    var pieces = String(path).split('/');
    return path.substr(0, path.length - pieces[pieces.length - 1]);
}

function get_number_path(path) { //-> ./image/3.png    gives us: (3)
    var file_name = path.split('/');
    file_name = file_name[file_name.length - 1];
    var number = file_name.split('.');
    return Number(number[0]);
}

function get_extension(path) { //-> ./image/3.png    gives us: (png)
    var pieces = String(path).split('.');
    return pieces[pieces.length - 1];
}

function getProducts(docs) {
    // docs.forEach(function(doc, i) {
    //     User.findById(doc.owner, function(err, user) {
    //         if(err) {
    //             return;
    //         }
    //         docs[i].owner = user;
    //     });
    // });
    var productChunks = [];
    var chunckSize = 3;
    for (var i = 0; i < docs.length; i += chunckSize) {
        productChunks.push(docs.slice(i, i + chunckSize));
    }
    return productChunks;
}

function getPersianEquiv(str) {
    if(str == 'male')
        return 'آقایان';
    else if(str == 'femele')
        return 'بانوان';
    else if(str == 'spouse')
        return 'همسران';
    else if(str == 'baby')
        return 'کودکان';
    else if(str == 'narriage')
        return 'عروسی';
    else if(str == 'jewelry')
        return 'جواهرات';
    else if(str == 'kafsh')
        return 'کفش';
    else if(str == 'accessory')
        return 'اکسسوری';
    else
        return 'نامشخص';
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/collections');
}