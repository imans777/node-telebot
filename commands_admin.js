// var BUTTONS = require('./dict/buttons');
// var info = require('./dict/info');
// var replies = require('./dict/replies')(BUTTONS);
// var messages = require('./dict/messages');
var request = require('request');
var fs = require('fs');
// var mongoose = require('mongoose');


module.exports = function(bot) {

    bot.on('photo', function(msg) {
        // console.log(msg);
        //get image from user and save it to local
        bot.getFile(msg.photo[msg.photo.length - 1].file_id).then(function(f) {
            // console.log(f);
            request.get(f.fileLink).on('response', function(res) {
                var p = '';
                //  PATH:   ./image/{{GENDER}}/{{TYPE}}/{{FILECOUNT+1}}.{{FILEEXTENSIOIN}}
                p += './image';
                if (!fs.existsSync(p))
                    fs.mkdirSync(p);
                p += '/';
                p += '1';
                p += '.png';
                res.pipe(fs.createWriteStream(p));
            });
        }).catch(function(f) {
            // console.log(f);
        });
    });
};

