var BUTTONS = require('./dict/buttons');
var info = require('./dict/info');
var replies = require('./dict/replies')(BUTTONS);
var messages = require('./dict/messages');
var request = require('request');
var fs = require('fs');
var Type = require('./schema/type');
var Product = require('./schema/product');

module.exports = function(bot) {

    var set_buttons = function(msg, gender) {
        return new Promise(function(resolve, reject) {
            // console.log("PARTS 1:");
            // console.log(gender);
            Type.find({'gender': gender}).exec(function(err, types) {
                if(err) {
                    error_occurred(msg.from.id, err);
                    return;
                }
                var prefix = (gender == info.male? info.male_collection_buttons_prefix: info.femele_collection_buttons_prefix);
                for(var i = 0; i < types.length; i++) {
                    BUTTONS[prefix + i] = {
                        label: gender[0] + "_" + types[i].type_name,
                        command: "/" + gender + "_" + types[i].type_name
                    };
                    if(i == types.length - 1) {
                        // console.log("THIS IS PART ONE:");
                        // console.log("BUTTONS:");
                        BUTTONS[prefix + 'back'] = {
                            label: BUTTONS.main_menu.label,
                            command: BUTTONS.main_menu.command //'/' + gender + '_collection'
                        };
                        console.log(BUTTONS);
                        resolve(msg, gender);
                    }
                }
                // resolve();
            });
        }).catch(function(e) {
            console.log("Something happened in set_buttons");
            console.log(e);
        });
    };

    var set_replies = function(msg, gender) {
        return new Promise(function(resolve, reject) {
            var male_types = [];
            // console.log("PARTS 2:");
            // console.log(gender);
            // console.log(info.male);
            var my_type = (gender == info.male? info.male_collection_buttons_prefix: info.femele_collection_buttons_prefix);

            // my_type = 'male_type';

            // console.log(my_type);
            var returnKey;
            for(var key in BUTTONS) {
                // if(key.indexOf(my_type) != -1)
                //     console.log(key + " : " + BUTTONS[key].label);
                if(BUTTONS.hasOwnProperty(key) && key.indexOf(my_type) != -1) {
                    if(key.indexOf('back') != -1) {
                        returnKey = key;
                    } else {
                        male_types.push([sub_from(BUTTONS[key].label)]);
                        console.log(sub_from(BUTTONS[key].label));
                    }

                }
            }
            male_types.push([BUTTONS[key].label]);
            console.log("THIS IS PART TWO");
            console.log("HERE IS THE LIST OF TYPES:");
            // male_types.push(['بازگ'])
            console.log(male_types);
            replies.male_collection = male_types;
            resolve(msg);
        }).catch(function(e) {
            console.log("Something happened in set_buttons");
            console.log(e);
        });
    };

    var set_on_collection = function(msg) {
        return new Promise(function(resolve, reject) {
            return bot.sendMessage(msg.from.id,
                messages.normal.choose_type, {replyMarkup:
                    bot.keyboard(replies.male_collection, {resize: true})});
        }).catch(function(e) {
            console.log("Something happened in set_buttons");
            console.log(e);
        });
    };

    bot.on('/start', function(msg) {
        // return bot.sendMessage(msg.from.id, messages.normal.greetings).then(function() {
        //     bot.getChatMember(info.my_channel_id, msg.from.id).then(function (member) {
        //         if (member.result.status == 'left' || member.result.status == 'kicked') {
        //             bot.sendMessage(msg.from.id,
        //                 decodeURI(messages.encoded.be_member_of_channel), {replyMarkup:
        //                     bot.keyboard(replies.entrance, {resize: true})
        //                 });
        //         } else {
        //             bot.event(BUTTONS.main_menu.command, msg);
        //         }
        //     });
        // });
        return bot.sendMessage(msg.from.id, messages.normal.greetings).then(function() {
            is_joined(msg).then(function(res) {
                if(!res) {
                    return not_joined(msg);
                } else {
                    bot.event(BUTTONS.main_menu.command, msg);
                }
            });
        });
    });

    bot.on(BUTTONS.became_member.command, function(msg) {
        // msg.reply.text(msg.text);
        // console.log("HE SENT: " + msg.text);
        // bot.getChatMember(info.my_channel_id, msg.from.id).then(function(member) {
        //     console.log(member.result);
        is_joined(msg).then(function(res) {
            if(!res) {
                return not_joined(msg);
            } else {
                return bot.sendMessage(msg.from.id, messages.normal.successful_channel_joint)
                    .then(function(m) {
                        bot.event(BUTTONS.main_menu.command, msg);
                    });
            }
        }).catch(function(member) {
            console.log("Failure");
            error_occurred(msg.from.id);
        });
            // if(member.result.status == 'left' || member.result.status == 'kicked') { //on not being a member of channel
            //     console.log("Not Member");
            //
            // } else {
            //     console.log("Success");
            //
            // }
            // console.log(q);
        // })
    });

    bot.on(BUTTONS.main_menu.command, function(msg) {
        is_joined(msg).then(function(res) {
            if(!res) {
                return not_joined(msg);
            } else {
                return bot.sendMessage(msg.from.id,
                    messages.normal.main_menu_message, {replyMarkup:
                        bot.keyboard(replies.main_menu, {resize: true})});
            }
        });
    });

    // bot.on(['بازگشت', 'm_بازگشت'], function(msg) {
    //     set_buttons(msg, info.male)
    //         .then(set_replies.bind(null, msg, info.male))
    //         .then(set_on_collection.bind(null, msg));
    // });

    // bot.on("Back", function(msg) {
    //     return bot.sendMessage(msg.from.id, "Hi");
    // });

    bot.on(BUTTONS.male_collection.command, function(msg) {

        // getMaleCollection(msg);
        is_joined(msg).then(function(res) {
            if (!res) {
                return not_joined(msg);
            } else {
                set_buttons(msg, info.male)
                    .then(set_replies.bind(null, msg, info.male))
                    .then(set_on_collection.bind(null, msg));
            }
        });


        // bot.getFile()
        // console.log(msg);
        // bot.sendMessage(msg.from.id,
        //     "TEST", {replyMarkup:
        //     bot.keyboard(replies.male_collection, {resize: true})});
    });



    // function getMaleCollection(msg) {
    //     return new Promise(function(resolve, reject) {
    //
    //
    //     }).then(function(res, rej) {
    //         res();
    //         console.log("THIS IS EXTRA PART");
    //     }).then(function() {
    //         console.log("THIS IS PART THREE");
    //     })
    // }

    bot.on(BUTTONS.femele_collection.command, function(msg) {

        is_joined(msg).then(function(res) {
            if (!res) {
                return not_joined(msg);
            } else {
                set_buttons(msg, info.femele)
                    .then(set_replies.bind(null, msg, info.femele))
                    .then(set_on_collection.bind(null, msg));
            }
        });
    });

    // bot.on('/this', function(msg) {
    //     return bot.sendMessage(msg.from.id,
    //     "THIS IS THIS", {replyMarkup: 'hide'});
    // });

    bot.on(BUTTONS.accessory.command, function(msg, props) {
        is_joined(msg).then(function(res) {
            if(!res) {
                return not_joined(msg);
            } else {
                return bot.sendMessage(msg.from.id, messages.normal.choose_type, {replyMarkup:
                    bot.keyboard(replies.accessory, {resize: true})
                });
            }
        });
    });



    // bot.on('callbackQuery', function(msg) {
    //     // User message alert
    //     bot.sendMessage(msg.from.id,
    //         "Hi " + msg.data, {replyMarkup: 'hide'});
    //     return bot.answerCallbackQuery(msg.id, "Inline button callback: " + msg.data, true);
    // });

    bot.on(BUTTONS.telegram_channel.command, function(msg) {
        is_joined(msg).then(function(res) {
            if(!res) {
                return not_joined(msg);
            } else {
                return bot.sendMessage(msg.from.id,
                    decodeURI(messages.encoded.telegram_channel_item));
            }
        });

    });

    bot.on(BUTTONS.instagram_page.command, function(msg) {
        is_joined(msg).then(function(res) {
            if(!res) {
                return not_joined(msg);
            } else {
                return bot.sendMessage(msg.from.id,
                    decodeURI(messages.encoded.instagram_page_item));
            }
        });

    });

    bot.on(BUTTONS.contact_us.command, function(msg) {
        is_joined(msg).then(function(res) {
            if(!res) {
                return not_joined(msg);
            } else {
                return bot.sendMessage(msg.from.id,
                    decodeURI(messages.encoded.contact_us));
            }
        });
    });

    bot.on(BUTTONS.time_reservation.command, function(msg) {
        is_joined(msg).then(function(res) {
            if(!res) {
                return not_joined(msg);
            } else {
                return bot.sendMessage(msg.from.id,
                    decodeURI(messages.encoded.time_reservation));
            }
        });
    });

    bot.on('/hide', function(msg) {
        return bot.sendMessage(msg.from.id, "OK", {replyMarkup: 'hide'});
    });

    // bot.on('/male_فشن', function(msg, props) {
    //     bot.sendMessage(msg.from.id,
    //     "THIS IS FASHEN");
    // });

    // for(var button in BUTTONS) {
    //     if(BUTTONS.hasOwnProperty(button)) {
    //         if(button.indexOf(info.male) != -1 || button.indexOf(info.femele) != -1) {
    //             console.log(button);
    //             bot.on(BUTTONS[button].command, function(msg, props) {
    //                 bot.sendMessage(msg.from.id, "I\'M receiving sth");
    //             });
    //         }
    //     }
    // }
    // bot.on(BUTTONS.return_back.label, function(msg, props) {
    //
    // });

    bot.on('text', function(msg, props) {
        is_joined(msg).then(function(res) {
            if(!res) {
                return not_joined(msg);
            }

        // var but = {
        //     label: 'This',
        //     command: '/this'
        // };

        //if key == male_type || femele_type ->
        //      buttons.label -> buttons.label (2, end) == msg.text ---> command

        // console.log(msg);
        // console.log(props);
        // console.log(BUTTONS);
            for(var button in BUTTONS) {
            // console.log(BUTTONS[button]);
            // console.log("PASSED 1");
            // if(BUTTONS[button].label.indexOf(info.return_back) != -1) {
            //     console.log("PASSED 2");
            //     bot.event(BUTTONS[button].command, msg, props);
            // }
            if(BUTTONS.hasOwnProperty(button)) {
                if (button.indexOf(info.male) != -1 || button.indexOf(info.femele) != -1 || button == info.previous || button == info.next) {
                    // bot.on(BUTTONS[button].command, function(msg, props) {
                    //     return bot.sendMessage(msg.from.id, "I\'M receiving sth from you");
                    // });
                    // console.log(button);
                    // console.log("PASSED 3");
                    var type = sub_from(BUTTONS[button].label);
                    if(type == msg.text) {
                        // return bot.event(BUTTONS[button].command, msg, props);
                        // console.log(BUTTONS[button].command);
                        var r = parse_command(BUTTONS[button].command);
                        console.log(r);
                        if(r.type == info.collection) { //return to main_menu
                            return bot.event(BUTTONS[button].command, msg, props);// bot.sendMessage(msg.from.id, messages.normal.main_menu_message, {replyMarkup:
                            //bot.keyboard(replies.main_menu, {resize: true})});
                        }
                        Product.find({gender: r.gender, type: r.type}).sort({number: 'asc'}).exec(function(err, docs) {
                            if(err || !docs) {
                                error_occurred(msg.from.id, err);
                                return;
                            }
                            if(docs.length == 0) {
                                BUTTONS.return_back.command = '/' + r.gender + '_' + info.collection;
                                replies.current_type = [
                                    [BUTTONS.return_back.label]
                                ];
                                bot.sendMessage(msg.from.id, messages.normal.no_product_found, {replyMarkup:
                                bot.keyboard(replies.current_type, {resize: true})});
                                return;
                            }
                            // console.log(docs);
                            //calculating reply
                            var current_product = [];
                            //set BUTTONS
                            console.log('length: ' , docs.length);
                            var num = {
                                previous: ((r.number - 1) > 0? (r.number - 1): (r.number - 1 + docs.length)),
                                next: r.number % docs.length + 1
                            };
                            console.log('gotten number:');
                            console.log(num);
                            // var next_num = r.number + 1;
                            BUTTONS.previous.command = '/' + r.gender + '_' + r.type + '_' + num.previous;
                            BUTTONS.next.command = '/' + r.gender + '_' + r.type + '_' + num.next;
                            BUTTONS.return_back.command = '/' + r.gender + '_' + info.collection;
                            // console.log(BUTTONS);

                            current_product.push([sub_from(BUTTONS.previous.label), sub_from(BUTTONS.next.label)]);
                            current_product.push([BUTTONS.return_back.label]);
                            replies.current_type = current_product;
                            // console.log('replies:');
                            // console.log(current_product);

                            return bot.sendPhoto(
                                    msg.from.id, docs[r.number - 1].picture, {caption:
                                    decodeURI("(" + r.number + "/" + docs.length + ")\n" + docs[r.number - 1].description), replyMarkup:
                                    bot.keyboard(replies.current_type, {resize: true})}
                                );

                            /*
                            * BUTTONS:
                            * PREVIOUS: /male_فشن_{{(number-1)%docs.length}}
                            * NEXT: /male_فشن_{{(number+1)%docs.length}}
                            * BACK: /male_collection_or_sth
                            *
                            * */
                        });
                        // return bot.sendMessage(msg.from.id, "I\'M receiving sth from you");
                    }


                }
                // else if(buttons.indexOf(info.femele) != -1) {
                //
                // }
            }
        }
        // if(msg.text == but.label)
        //     return bot.event(but.command, msg, props);
        // if(msg.text == "فشن")
        //     return bot.event('/male_فشن', msg, props);
        });
    });

    function not_joined(msg) {
        return bot.sendMessage(msg.from.id,
            decodeURI(messages.encoded.not_member_of_channel), {replyMarkup:
                bot.keyboard(replies.entrance, {resize: true})});
    }

    function is_joined(msg) {
        return new Promise(function(resolved, reject) {
            bot.getChatMember(info.my_channel_id, msg.from.id).then(function (member) {
                resolved(!(member.result.status == 'left' || member.result.status == 'kicked'));
            });
        });

    }

    function parse_command(cmd) { // /gender_type_number
        var returnObj = {
            gender: info.male,
            type: '',
            number: 1
        };
        // console.log("1 PASSED");
        if(typeof cmd != 'string')
            return;
        // console.log("2 PASSED");
        if(cmd[1] == info.male[0]) {
            var rest = cmd.substr(info.male.length + 2 /* /male_ */, cmd.length - info.male.length - 2); //type_number
            if(rest.indexOf('_') != -1) {
                var res = rest.split('_');
                rest = res[0];
                returnObj.number = res[1];
            }
            returnObj.type = rest;
        } else if(cmd[1] == info.femele[0]) {
            returnObj.gender = info.femele;
            var rest = cmd.substr(info.femele.length + 2 /* /male_ */, cmd.length - info.femele.length - 2);
            if(rest.indexOf('_') != -1) {
                var res = rest.split('_');
                rest = res[0];
                returnObj.number = res[1];
            }
            returnObj.type = rest; //type_number
        }
        // console.log("3");
        // console.log(returnObj);
        // console.log("PASSED");
        return returnObj;
    }

    function sub_from(str, number = 2) {
        return str.substr(number, str.length - number);
    }

    function error_occurred(id, err = "Not recieved") {
        console.log(err);
        bot.sendMessage(id, messages.normal.error_occurred, {replyMarkup: 'hide'});
    }
};



//PLAYING WITH BUTTONS

// var replyMarkup = bot.keyboard([
//     // [bot.button('contact', 'Your contact'), bot.button('location', 'Your location')],
//     // [bot.button('GoBackLabel', {callback: 'GoBackLabel'}), '/hide']
//     ['This']
// ], {resize: true});
//
// var rep = [bot.inlineKeyboard([bot.inlineButton('text',{callback:'/text'})])];
//
// var repl = bot.inlineKeyboard([
//     [
//         bot.inlineButton('callback', {callback: 'this_is_data'}),
//         bot.inlineButton('inline', {inline: 'some query'})
//     ], [
//         bot.inlineButton('url', {url: 'https://telegram.org'})
//     ]
// ]);

