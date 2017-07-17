var BUTTONS = require('./dict/buttons');
var info = require('./dict/info');
var replies = require('./dict/replies')(BUTTONS);
var messages = require('./dict/messages');
var request = require('request');
var fs = require('fs');
var Type = require('./schema/type');
// var com_same = require('./commands_same');
var Product = require('./schema/product');

module.exports = function(bot/*, botad*/) {

    var set_buttons = function(msg, gender) {
        return new Promise(function(resolve, reject) {
            // console.log("PARTS 1:");
            // console.log(gender);
            reset_buttons();
            Type.find({'gender': gender}).sort({priority: 'asc'}).exec(function(err, types) {
                if(err) {
                    error_occurred(msg.from.id, err);
                    return;
                }
                //TODO: all prefixes like this should be fixed
                var prefix = get_gender(gender, info.gender_collection_buttons_prefix);
                // var prefix = (gender == info.male? info.male_collection_buttons_prefix: info.femele_collection_buttons_prefix);
                for(var i = 0; i < types.length; i++) {
                    BUTTONS[prefix + i] = {
                        label: gender[0] + "_" + types[i].type_name,
                        command: "/" + gender + "_" + types[i].type_name
                    };
                    // if(i == types.length - 1) {
                    //     // console.log("THIS IS PART ONE:");
                    //     // console.log("BUTTONS:");
                    //
                    // }
                }
                BUTTONS[prefix + 'back'] = {
                    label: BUTTONS.main_menu.label,
                    command: BUTTONS.main_menu.command // '/' + gender + '_collection'
                };
                // console.log(BUTTONS);
                resolve(msg, gender);
                // if(types.length == 0) {
                //
                // }
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
            var my_type = get_gender(gender, info.gender_collection_buttons_prefix);
            // var my_type = (gender == info.male? info.male_collection_buttons_prefix: info.femele_collection_buttons_prefix);

            // my_type = 'male_type';

            // console.log(my_type);
            var returnKey;
            var i = 0;
            for(var key in BUTTONS) {
                // if(key.indexOf(my_type) != -1)
                //     console.log(key + " : " + BUTTONS[key].label);
                if(BUTTONS.hasOwnProperty(key) && key.indexOf(my_type) != -1) {
                    if(key.indexOf('back') != -1) {
                        returnKey = key;
                        // console.log("THIS IS KEY");
                        // console.log(key);
                    } else {
                        //TODO: make it 3 a row -> i = 0; i % 3 = 0; male_type[male_type.length - 1].push([THE BUTTON]); i++;
                        if(i % 3 == 0) {
                            male_types.push([sub_from(BUTTONS[key].label)]);
                            i = 0;
                        } else {
                            male_types[male_types.length - 1].push(sub_from(BUTTONS[key].label));
                        }
                        i++;
                    }

                }
            }
            male_types.push([BUTTONS[returnKey].label]);
            // console.log("THIS IS PART TWO");
            // console.log("HERE IS THE LIST OF TYPES:");
            // male_types.push(['بازگ'])
            // console.log(male_types);
            replies.male_collection = male_types;
            resolve(msg);
        }).catch(function(e) {
            console.log("Something happened in set_replies");
            console.log(e);
        });
    };

    var set_on_collection = function(msg) {
        return new Promise(function(resolve, reject) {
            return bot.sendMessage(msg.from.id,
                messages.normal.choose_type, {replyMarkup:
                    bot.keyboard(replies.male_collection, {resize: true})});
        }).catch(function(e) {
            console.log("Something happened in set_collections");
            console.log(e);
        });
    };

    bot.on('/initialize', function(msg) {
        if(msg.chat.id) {
            console.log("ID OF THE CHANNEL:");
            console.log(msg.chat.id);
        }
    });

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
                    not_joined(msg).catch(function(r) {
                        console.log("error in start");
                        console.log(r);
                    });
                } else {
                    return bot.event(BUTTONS.main_menu.command, msg).catch(function(r) {
                        console.log("error in start");
                        console.log(r);
                    });
                }
            }).catch(function(r) {
                console.log("error in start");
                console.log(r);
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
                not_joined(msg);
            } else {
                bot.sendMessage(msg.from.id, messages.normal.successful_channel_joint)
                    .then(function(m) {
                        return bot.event(BUTTONS.main_menu.command, msg);
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

    bot.on([BUTTONS.male_collection.command, BUTTONS.femele_collection.command,
        BUTTONS.spouse_collection.command, BUTTONS.baby_collection.command,
        BUTTONS.narriage_collection.command, BUTTONS.jewelry_collection.command,
        BUTTONS.kafsh_collection.command, BUTTONS.accessory_collection.command,
        BUTTONS.return_back.label/*THIS IS NOT BINDED*/], function(msg) {
        // getMaleCollection(msg);
        // var gen = info.male;
        var gen = get_gender(msg.text);
        if(msg.text == BUTTONS.return_back.label) {
            if(BUTTONS.return_back.command == BUTTONS.main_menu.command) {
                // console.log("I'm here!");
                return bot.event(BUTTONS.main_menu.command, msg, props);
            }
            gen = get_gender(BUTTONS.return_back.command);
        }
        is_joined(msg).then(function(res) {
            if (!res) {
                return not_joined(msg);
            } else {
                set_buttons(msg, gen)
                    .then(set_replies.bind(null, msg, gen))
                    .then(set_on_collection.bind(null, msg));
            }
        });
        // bot.getFile()
        // console.log(msg);
        // bot.sendMessage(msg.from.id,
        //     "TEST", {replyMarkup:
        //     bot.keyboard(replies.male_collection, {resize: true})});
    });
    // bot.on(BUTTONS.femele_collection.command, function(msg) {
    //     var gen = info.femele;
    //     is_joined(msg).then(function(res) {
    //         if (!res) {
    //             return not_joined(msg);
    //         } else {
    //             set_buttons(msg, gen)
    //                 .then(set_replies.bind(null, msg, gen))
    //                 .then(set_on_collection.bind(null, msg));
    //         }
    //     });
    // });

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
                    messages.normal.instagram_choose_page, {replyMarkup:
                    bot.keyboard(replies.instagram_page, {resize: true})
                });
            }
        });
    });

    bot.on([BUTTONS.instagram_1.command, BUTTONS.instagram_2.command,
        BUTTONS.instagram_3.command, BUTTONS.instagram_4.command,
        BUTTONS.instagram_5.command, BUTTONS.instagram_6.command,
        BUTTONS.instagram_7.command, BUTTONS.instagram_8.command,
        BUTTONS.instagram_9.command, BUTTONS.instagram_10.command], function(msg) {
        //
        var replyText = get_insta_page(msg);
        return bot.sendMessage(msg.from.id, decodeURI(replyText));
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
                return;
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
                if (button.indexOf(info.male) != -1 || button.indexOf(info.femele) != -1 ||
                    button.indexOf(info.spouse) != -1 || button.indexOf(info.baby) != -1 ||
                    button.indexOf(info.narriage) != -1 || button.indexOf(info.jewelry) != -1 ||
                    button.indexOf(info.kafsh) != -1 || button.indexOf(info.accessory) != -1 ||
                    button == info.previous || button == info.next) {
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
                        // console.log(r);
                        if(r.type == info.collection) { //return to main_menu
                            return bot.event(BUTTONS[button].command, msg, props);// bot.sendMessage(msg.from.id, messages.normal.main_menu_message, {replyMarkup:
                            //bot.keyboard(replies.main_menu, {resize: true})});
                        }
                        if(!r.gender) {
                            return bot.sendMessage(msg.from.id, messages.normal.error_occurred, {replyMarkup:
                                bot.keyboard(replies.main_menu, {resize: true})
                            });
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
                                return bot.sendMessage(msg.from.id, messages.normal.no_product_found, {replyMarkup:
                                    bot.keyboard(replies.current_type, {resize: true})});
                                // return;
                            }
                            // console.log(docs);
                            //calculating reply
                            var current_product = [];
                            //set BUTTONS
                            // console.log('length: ' , docs.length);
                            var num = {
                                previous: ((r.number - 1) > 0? (r.number - 1): (r.number - 1 + docs.length)),
                                next: r.number % docs.length + 1
                            };
                            // console.log('gotten number:');
                            // console.log(num);
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
                            // console.log("Place: " + docs[r.number - 1].botdir);

                            // if(!docs[r.number - 1]) {
                            //     return error_get_back_to_main_menu(msg.from.id);
                            // }
                            try {
                                return bot.sendPhoto(
                                    msg.from.id, decodeURI(docs[r.number - 1].botdir), {caption:
                                        decodeURI("(" + r.number + "/" + docs.length + ")\n" + docs[r.number - 1].description), replyMarkup:
                                        bot.keyboard(replies.current_type, {resize: true})}
                                ).catch(function(err) {
                                    console.log("SOMETHING HAPPENED");
                                    console.log(err);
                                    return bot.sendMessage(msg.from.id, messages.normal.error_in_showing_picture);
                                });
                            } catch(e) {
                                console.log("SOMETHING HAPPENED");
                                console.log(e);
                                return bot.sendMessage(msg.from.id, messages.normal.error_in_showing_picture);
                            }


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
            }).catch(function(r) {
                console.log("Channel not found/admin");
                console.log(r);
                resolved(true);
            });
        });
    }

    function parse_command(cmd) { // /gender_type_number
        if(typeof cmd != 'string')
            return;

        var parts = get_parts(cmd);
        var obj = {
            gender: get_gender(parts[0]),
            type: parts[1],
            number: 1
        };
        if(parts[2] && Number(parts[2])) {
            obj.number = Number(parts[2]);
        }
        return obj;
        // var returnObj = {
        //     gender: info.male,
        //     type: '',
        //     number: 1
        // };
        // // console.log("1 PASSED");
        // if(typeof cmd != 'string')
        //     return;
        // // console.log("2 PASSED");
        // if(cmd[1] == info.male[0]) {
        //     var rest = cmd.substr(info.male.length + 2 /* /male_ */, cmd.length - info.male.length - 2); //type_number
        //     if(rest.indexOf('_') != -1) {
        //         var res = rest.split('_');
        //         rest = res[0];
        //         returnObj.number = res[1];
        //     }
        //     returnObj.type = rest;
        // } else if(cmd[1] == info.femele[0]) {
        //     returnObj.gender = info.femele;
        //     var rest = cmd.substr(info.femele.length + 2 /* /male_ */, cmd.length - info.femele.length - 2);
        //     if(rest.indexOf('_') != -1) {
        //         var res = rest.split('_');
        //         rest = res[0];
        //         returnObj.number = res[1];
        //     }
        //     returnObj.type = rest; //type_number
        // }
        // console.log("3");
        // console.log(returnObj);
        // console.log("PASSED");
        // return returnObj;
    }

    function sub_from(str, number = 2) {
        return str.substr(number, str.length - number);
    }

    function error_occurred(id, err = "Not recieved") {
        console.log(err);
        bot.sendMessage(id, messages.normal.error_occurred, {replyMarkup:
            bot.keyboard(replies.main_menu, {resize: true})
        });
    }

    function error_get_back_to_main_menu(id) {
        return bot.sendMessage(id, messages.normal.error_occurred, {replyMarkup:
            bot.keyboard(replies.main_menu ,{resize: true})
        });
    }

    function get_gender(str, return_type = info.gender) {
        var gen;
        if(str == info.male || str == BUTTONS.male_collection.command || str == BUTTONS.male_collection.label || str == info.male_collection_buttons_prefix)
            gen = info.male;
        else if(str == info.femele || str == BUTTONS.femele_collection.command || str == BUTTONS.femele_collection.label || str == info.femele_collection_buttons_prefix)
            gen = info.femele;
        else if(str == info.spouse || str == BUTTONS.spouse_collection.command || str == BUTTONS.spouse_collection.label || str == info.spouse_collection_buttons_prefix)
            gen = info.spouse;
        else if(str == info.baby || str == BUTTONS.baby_collection.command || str == BUTTONS.baby_collection.label || str == info.baby_collection_buttons_prefix)
            gen = info.baby;
        else if(str == info.narriage || str == BUTTONS.narriage_collection.command || str == BUTTONS.narriage_collection.label || str == info.narriage_collection_buttons_prefix)
            gen = info.narriage;
        else if(str == info.jewelry || str == BUTTONS.jewelry_collection.command || str == BUTTONS.jewelry_collection.label || str == info.jewelry_collection_buttons_prefix)
            gen = info.jewelry;
        else if(str == info.kafsh || str == BUTTONS.kafsh_collection.command || str == BUTTONS.kafsh_collection.label || str == info.kafsh_collection_buttons_prefix)
            gen = info.kafsh;
        else if(str == info.accessory || str == BUTTONS.accessory_collection.command || str == BUTTONS.accessory_collection.label || str == info.accessory_collection_buttons_prefix)
            gen = info.accessory;
        else
            gen = "";

        if(return_type == info.gender) {
            return gen;
        } else if(return_type == info.gender_collection_buttons_prefix) {
            if(gen == info.male)
                return info.male_collection_buttons_prefix;
            else if(gen == info.femele)
                return info.femele_collection_buttons_prefix;
            else if(gen == info.spouse)
                return info.spouse_collection_buttons_prefix;
            else if(gen == info.baby)
                return info.baby_collection_buttons_prefix;
            else if(gen == info.narriage)
                return info.narriage_collection_buttons_prefix;
            else if(gen == info.jewelry)
                return info.jewelry_collection_buttons_prefix;
            else if(gen == info.kafsh)
                return info.kafsh_collection_buttons_prefix;
            else if(gen == info.accessory)
                return info.accessory_collection_buttons_prefix;
        } else {
            return gen;
        }
    }

    function get_insta_page(msg) {
        var replyText = msg.text;
        if(msg.text == BUTTONS.instagram_1.label) {
            replyText += encodeURI("\n") + info.instagram.main_page;
        } else if(msg.text == BUTTONS.instagram_2.label) {
            replyText += encodeURI("\n") + info.instagram.second_page;
        }else if(msg.text == BUTTONS.instagram_3.label) {
            replyText += encodeURI("\n") + info.instagram.online_sell;
        }else if(msg.text == BUTTONS.instagram_4.label) {
            replyText += encodeURI("\n") + info.instagram.femele_page;
        }else if(msg.text == BUTTONS.instagram_5.label) {
            replyText += encodeURI("\n") + info.instagram.baby_page;
        }else if(msg.text == BUTTONS.instagram_6.label) {
            replyText += encodeURI("\n") + info.instagram.jewelry_page;
        }else if(msg.text == BUTTONS.instagram_7.label) {
            replyText += encodeURI("\n") + info.instagram.accessory_page;
        }else if(msg.text == BUTTONS.instagram_8.label) {
            replyText += encodeURI("\n") + info.instagram.kafsh_page;
        }else if(msg.text == BUTTONS.instagram_9.label) {
            replyText += encodeURI("\n") + info.instagram.video_page;
        }else if(msg.text == BUTTONS.instagram_10.label) {
            replyText += encodeURI("\n") + info.instagram.management_page;
        }
        return replyText;
    }

    function reset_buttons() {
        for(var button in BUTTONS) {
            if(BUTTONS.hasOwnProperty(button)) {
                if (button.indexOf(info.male_collection_buttons_prefix) != -1 || button.indexOf(info.femele_collection_buttons_prefix) != -1 ||
                    button.indexOf(info.spouse_collection_buttons_prefix) != -1 || button.indexOf(info.baby_collection_buttons_prefix) != -1 ||
                    button.indexOf(info.narriage_collection_buttons_prefix) != -1 || button.indexOf(info.jewelry_collection_buttons_prefix) != -1 ||
                    button.indexOf(info.kafsh_collection_buttons_prefix) != -1 || button.indexOf(info.accessory_collection_buttons_prefix) != -1) {
                    delete BUTTONS[button];
                }
            }
        }
        // BUTTONS = require('./dict/buttons');
    }

    //---------------------------------------------------------------------------------------------
    /*var storage_location = "";

    botad.on('/start', function(msg) {
        // console.log(replies.admin.main_menu);
        return botad.sendMessage(msg.from.id, 'شروع', {replyMarkup:
            botad.keyboard(replies.admin.main_menu, {resize: true})
        });
    });

    botad.on(BUTTONS.admin.return_to_main_menu.command, function(msg) {
        storage_location = "";
        return botad.sendMessage(msg.from.id, "گزینه مورد نظر خود را انتخاب کنید", {replyMarkup:
            botad.keyboard(replies.admin.main_menu, {resize: true})});
    });

    botad.on(BUTTONS.admin.add_type.command, function(msg) {
        BUTTONS.admin.male.command = '/' + info.male_collection_buttons_prefix;
        BUTTONS.admin.femele.command = '/' + info.femele_collection_buttons_prefix;
        BUTTONS.admin.spouse.command = '/' + info.spouse_collection_buttons_prefix;
        BUTTONS.admin.baby.command = '/' + info.baby_collection_buttons_prefix;
        BUTTONS.admin.narriage.command = '/' + info.narriage_collection_buttons_prefix;
        BUTTONS.admin.jewelry.command = '/' + info.jewelry_collection_buttons_prefix;
        BUTTONS.admin.kafsh.command = '/' + info.kafsh_collection_buttons_prefix;
        BUTTONS.admin.accessory.command = '/' + info.accessory_collection_buttons_prefix;

        replies.admin.set_gender = [
            [BUTTONS.admin.male.label, BUTTONS.admin.femele.label],
            [BUTTONS.admin.return_to_main_menu.label]
        ];

        storage_location = "";

        return botad.sendMessage(msg.from.id, "جنسیت", {replyMarkup:
            botad.keyboard(replies.admin.set_gender, {resize: true})
        });
    });

    botad.on(BUTTONS.admin.add_product.command, function(msg) {
        BUTTONS.admin.male.command = '/product_male';
        BUTTONS.admin.femele.command = '/product_femele';

        replies.admin.set_gender = [
            [BUTTONS.admin.male.label, BUTTONS.admin.femele.label],
            [BUTTONS.admin.return_to_main_menu.label]
        ];

        storage_location = "";

        return botad.sendMessage(msg.from.id, "جنسیت", {replyMarkup:
            botad.keyboard(replies.admin.set_gender, {resize: true})
        });
    });

    // botad.on([BUTTONS.admin.male.command, BUTTONS.admin.femele.command],
    function add_type_gender_page(msg) {
        var type = new Type({
            gender: (msg.text == BUTTONS.admin.male.label? info.male: info.femele) + '_p',
            type_name: ''
        });

        type.save(function(err, doc) {
            if(err)
                return botad.sendMessage(msg.from.id, "نشد");

            return botad.sendMessage(msg.from.id, "نام", {replyMarkup:
                botad.keyboard(replies.empty), ask: 'type_name'});
        });
    }//);

    botad.on('ask.type_name', function(msg) {
        Type.findOne({gender: /[_p$]/}, function(err, doc) {
            if(err) {
                console.log(err);
            }

            doc.gender = doc.gender.substr(0, doc.gender.length - 2);
            doc.type_name = msg.text;
            doc.save(function(err) {
                console.log("Done");
                storage_location = "";
                return botad.sendMessage(msg.from.id, 'ثبت گردید', {replyMarkup:
                    botad.keyboard(replies.admin.main_menu, {resize: true})
                });
            });
        });
    });

    function add_product_with_gender(msg) {
        // var gender = get_parts(msg.text)[1];
        var gender = (msg.text == BUTTONS.admin.male.label? info.male: info.femele);
        console.log(gender);
        Type.find({'gender': gender}, function(err, docs) {
            if(err) {
                console.log(err);
            }
            // console.log(docs);
            replies.admin.types = [];
            docs.forEach(function(doc, i, docs) {
                var title = gender + '_' + doc.type_name;
                    BUTTONS.admin[title] = {
                        label: doc.type_name,
                        command: '/product_' + title
                    };
                    replies.admin.types.push([BUTTONS.admin[title].label]);
            });
            replies.admin.types.push([BUTTONS.admin.return_to_main_menu.label]);

            console.log(BUTTONS.admin);
            console.log('----------------');
            console.log(replies.admin.types);
            return botad.sendMessage(msg.from.id, "مدل", {replyMarkup:
                botad.keyboard(replies.admin.types, {resize: true, once: true})
            });
        });
    }

    botad.on('ask.product_description', function(msg) {
        var parts = get_parts(storage_location); // product - gender - type - number
        Product.findOne({gender: parts[1], type: parts[2], number: parts[3]}, function(err, doc) {
            if(err) {
                error_occurred(msg.from.id, err);
                return;
            }
            doc.description = msg.text;
            doc.save(function(err) {
                console.log("Done");
                storage_location = "";
                return botad.sendMessage(msg.from.id, 'ثبت گردید', {replyMarkup:
                    botad.keyboard(replies.admin.main_menu, {resize: true})
                });
            });
        });
    });

    botad.on('text', function(msg, props) {
        if(msg.text == BUTTONS.admin.male.label || msg.text == BUTTONS.admin.femele.label) { //مردانه or زنانه
            if(sub_from(BUTTONS.admin.male.command, 1) == info.male_collection_buttons_prefix || sub_from(BUTTONS.admin.male.command, 1) == info.femele_collection_buttons_prefix) {
                storage_location = "";
                return add_type_gender_page(msg);
            } else if(BUTTONS.admin.male.command.indexOf('product') != -1 || BUTTONS.admin.femele.command.indexOf('product') != -1) {
                storage_location = "";
                return add_product_with_gender(msg);
            }
        }

        //check if it was '/product_gender_type' then set the 'storage_location' to it
        //then send a message and prepare for getting the photo
        for(var button in BUTTONS.admin) {
            if(BUTTONS.admin.hasOwnProperty(button)) {
                var parts = get_parts(button);
                if(parts[0] == info.male || parts[0] == info.femele) {
                    if (msg.text == parts[1]) {
                        storage_location = BUTTONS.admin[button].command;
                        return botad.sendMessage(msg.from.id, "عکس را بفرستید", {replyMarkup:
                            bot.keyboard(replies.empty)
                        });
                    }
                }
            }
        }

        //in the bot.on('photo') check storage_location to be valid to continue
        //after receiving image, check extension, save it in the files, get ready to get description (prepare a default description)

        //when received desc, send a success message, get back to main menu
    });

    // Ask name event
    // botad.on('ask.name', function(msg) {
    //     const id = msg.from.id;
    //     const name = msg.text;
    //     // Ask user age
    //     return botad.sendMessage(id, `Nice to meet you, ${ name }! How old are you?`, {ask: 'age'});
    // });

    // Ask age event
    // botad.on('ask.age', function(msg) {
    //     const id = msg.from.id;
    //     const age = Number(msg.text);
    //     if (!age) {
    //         // If incorrect age, ask again
    //         return botad.sendMessage(id, 'Incorrect age. Please, try again!', {ask: 'age'});
    //     } else {
    //         // Last message (don't ask)
    //         return botad.sendMessage(id, `You are ${ age } years old. Great!`);
    //     }
    // });

    botad.on('photo', function(msg) {
        if(!storage_location) {
            return botad.sendMessage(msg.from.id, "دستور اشتباه");
        }
        // console.log(msg);
        //get image from user and save it to local
        botad.getFile(msg.photo[msg.photo.length - 1].file_id).then(function(f) {
            // console.log(f);
            // request.get(f.fileLink).on('response', function(res) {
            //     res.pipe(fs.createWriteStream('./image/male/test.png'));
            var parts = get_parts(storage_location); // product - gender - type
            console.log(parts);
            var p = '';
            //  PATH:   ./image/{{GENDER}}/{{TYPE}}/{{FILECOUNT+1}}.{{FILEEXTENSIOIN}}
            p += './image';
            if (!fs.existsSync(p))
                fs.mkdirSync(p);
            p += '/';

            p += parts[1];
            if(!fs.existsSync(p))
                fs.mkdirSync(p);
            p += '/';

            p += parts[2];
            if(!fs.existsSync(p))
                fs.mkdirSync(p);
            p += '/';

            Product.count({gender: parts[1], type: parts[2]}, function(err, c) {
                p += (c + 1);
                // p += '.';
                // p += 'png';
                // console.log(p);
                // var t = encodeURI(p);
                // console.log(t);
                // console.log(decodeURI(t));
                // res.pipe(fs.createWriteStream(t)); //-> ERROR
                // res.pipe(fs.createWriteStream(decodeURI(t)));
                var pro = new Product({
                        number: (c + 1),
                        gender: parts[1],
                        type: parts[2],
                        picture: p,
                        description: 'توضیحات پیشفرض'
                });
                // request.get(f.fileLink).pipe(fs.createWriteStream(p)).on('finish', function() {
                //     botad.sendMessage(msg.from.id, "ثبت شد", {replyMarkup:
                //         botad.keyboard(replies.admin.main_menu, {resize: true})
                //     });
                // });
                pro.save(function(err) {
                    if(err) {
                        error_occurred(msg.from.id, err);
                        return;
                    }
                    request
                        .get(f.fileLink)
                        .on('response', function(response) {
                            // console.log(response.statusCode); // 200
                            var con_type = response.headers['content-type'];
                            con_type = con_type.split('/');
                            console.log(con_type);
                            p += '.' + con_type[1];
                        })
                        .pipe(fs.createWriteStream(p))
                        .on('finish', function() {
                            storage_location += "_";
                            storage_location += (c + 1);
                            botad.sendMessage(msg.from.id, "عکس دریافت شد. توضیحات را وارد کنید", {replyMarkup:
                                'hide',// botad.keyboard(replies.admin.main_menu, {resize: true}),
                                ask: 'product_description'
                            });
                        });
                });
            });

            // console.log("res");
            // console.log(res);

            // var file_parts = res.split('.');

            // p += '1';
            // p += '.png';
            // res.pipe(fs.createWriteStream(p));
            // });
        }).catch(function(f) {
            // console.log(f);
        });
    });*/

    function get_parts(str) {
        if(typeof str != 'string') {
            return null;
        }
        var res = String(str).split('_');
        if(res[0].indexOf('/') != -1) {
            res[0] = res[0].substr(1, res[0].length - 1);
        }
        return res;
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

