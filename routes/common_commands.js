// var express = require('express');
// var router = express.Router();
// var csrf = require('csurf');
//
//
// var mongoose = require('mongoose');
// mongoose.connect('localhost:27017/telegramdb');
// mongoose.Promise = global.Promise;
// let Recruitment = require('../schema/recruitment');
// let bot = require('../index').bot;
//
//
// router.get('/cvs/:file_id', isLoggedIn, function(req, res, next) {
//     bot.getFile(req.params.file_id).then(function(docs) {
//         // res.status(301).send(docs);
//         res.download(docs);
//     });
// });
//
// router.get('/cvs', isLoggedIn, function(req, res, next) {
//     Recruitment.find({}, function(err, docs) {
//         if(err) throw err;
//
//         res.render('cv', {
//             cvs: docs
//         });
//     })
// });
//
//
// bot.getFile('BQADBAADqQQAAgRWCVD59dggPAIyuAI').then(function(res) {
//     console.log("I GOT THE FILE :D", res);
// }).catch(function(err) {
//     console.log("DIDN'T GET IT :(", err);
// })

// reservation.findOne({user_id: 1231}).exec((city) => {
//     console.log("1");
//     if (!city) throw 'No city found';
//     //modify city.embedded.dynamic.field
//     return;
// }).then((city) => {
//     console.log("2");
//     if (!city) throw 'City not saved';
//     // res.send(city);
// }).catch((err) => {
//     console.log("3");
//     console.log(err);
// });
// mongoose.disconnect();