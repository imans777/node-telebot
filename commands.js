var BUTTONS = require('./dict/buttons');
var info = require('./dict/info');
var replies = require('./dict/replies')(BUTTONS);
var messages = require('./dict/messages');
var request = require('request');
var fs = require('fs');
var moment = require('moment');
var async = require('async');

var Type = require('./schema/type');
// var com_same = require('./commands_same');
var Product = require('./schema/product');
var Reservation = require('./schema/reservation');
var Customer = require('./schema/customers');
var Notif = require('./schema/notif');

module.exports = function(bot/*, botad*/) {

    var set_buttons = function(msg, gender) {
        return new Promise(function(resolve, reject) {
            // console.log("PARTS 1:");
            // console.log(gender);
            console.log("START->");
            console.log("START->" + moment().millisecond());
            reset_buttons(get_gender(gender, info.gender_collection_buttons_prefix));
            Type.find({'gender': gender}).sort({priority: 'asc'}).exec(function(err, types) {
                if(err) {
                    error_occurred(msg.from.id, err);
                    return;
                }
                console.log("START->" + moment().millisecond());
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
                console.log("START->" + moment().millisecond());
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
        var cus = new Customer({
            user_id: msg.from.id,
            first_name: msg.from.first_name,
            last_name: msg.from.last_name,
            username: msg.from.username,
            is_joined: false,
            previous: BUTTONS.previous.command,
            next: BUTTONS.next.command,
            return_back: BUTTONS.return_back.command
        });
        cus.save(function(errsc) {
            if(errsc) console.log(errsc);
            bot.sendMessage(msg.from.id, messages.normal.greetings).then(function() {
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
        is_joined_FIXED(msg).then(function(res) {
            if(!res) {
                 not_joined(msg);
            } else {
                 bot.sendMessage(msg.from.id,
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

        set_p_n(msg).then(function(hoy) {
            var gen = get_gender(msg.text);
            if (msg.text == BUTTONS.return_back.label) {
                if (BUTTONS.return_back.command == BUTTONS.main_menu.command) {
                    // console.log("I'm here!");
                     bot.event(BUTTONS.main_menu.command, msg, props);
                }
                gen = get_gender(BUTTONS.return_back.command);
            }
            // set_p_n(msg).then(is_joined.bind(null, msg)).then(function(res) {
            // is_joined(msg).then(set_p_n.bind(null, msg)).then(function(res) {
            is_joined_FIXED(msg).then(function (res) {
                if (!res) {
                     not_joined(msg);
                } else {
                    set_buttons(msg, gen)
                        .then(set_replies.bind(null, msg, gen))
                        .then(set_on_collection.bind(null, msg));
                }
            });
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
    // bot.on(BUTTONS.accessory.command, function(msg, props) {
    //     is_joined(msg).then(function(res) {
    //         if(!res) {
    //             return not_joined(msg);
    //         } else {
    //             return bot.sendMessage(msg.from.id, messages.normal.choose_type, {replyMarkup:
    //                 bot.keyboard(replies.accessory, {resize: true})
    //             });
    //         }
    //     });
    // });
    // bot.on('callbackQuery', function(msg) {
    //     // User message alert
    //     bot.sendMessage(msg.from.id,
    //         "Hi " + msg.data, {replyMarkup: 'hide'});
    //     return bot.answerCallbackQuery(msg.id, "Inline button callback: " + msg.data, true);
    // });

    bot.on(BUTTONS.telegram_channel.command, function(msg) {
        is_joined_FIXED(msg).then(function(res) {
            if(!res) {
                 not_joined(msg);
            } else {
                 bot.sendMessage(msg.from.id,
                    decodeURI(messages.encoded.telegram_channel_item));
            }
        });

    });

    bot.on(BUTTONS.instagram_page.command, function(msg) {
        is_joined_FIXED(msg).then(function(res) {
            if(!res) {
                 not_joined(msg);
            } else {
                 bot.sendMessage(msg.from.id,
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
         bot.sendMessage(msg.from.id, decodeURI(replyText));
    });

    bot.on(BUTTONS.contact_us.command, function(msg) {
        is_joined_FIXED(msg).then(function(res) {
            if(!res) {
                 not_joined(msg);
            } else {
                 bot.sendMessage(msg.from.id,
                    decodeURI(messages.encoded.contact_us));
            }
        });
    });

    bot.on('/سلام', function(msg) {
        bot.sendMessage(msg.from.id, "Hi");
    });

    bot.on('/hi', function(msg) {
        // is_joined(msg).then(function(res) {
        //     if(!res) {
        //         return not_joined(msg);
        //     } else {
        //         return bot.sendMessage(msg.from.id,
        //             decodeURI(messages.encoded.time_reservation));
        //     }
        // });
        var base = moment();
        console.log(base);
        base.hour(10).minute(30).second(0).millisecond(0);
        var that = moment().format();

        var t = moment(new Date()).year();
        console.log(t);


        console.log(base.get('year'));          //2017  (2017)
        console.log(base.get('month'));         //7     (August - 8)
        console.log(base.get('date'));          //2     (2th)
        console.log(base.get('hour'));          //17    (17)
        console.log(base.get('minute'));        //28    (28)
        console.log(base.get('second'));        //49    (49)
        console.log(base.get('millisecond'));   //769   (769)
        console.log(base.day());                //3     (Wednesday - 5)
        console.log(base.date());               //2     (2th)
        console.log(base.format('ddd'));        //Wed   (Wed)

        base.add(1, 'm'); //minute
        base.add(1, 'h'); ///hour
        base.add(1, 'd');
        console.log(base.format('ddd'));        //Fri   -> Tommorrow is Fri
        console.log(base);
        base.add(6, 'd');
        console.log(base.format('ddd'));
        console.log(base);
        console.log("------");
        console.log(base);
        base.day('Sat');
        console.log(base);
        base.day('sat');
        console.log(base);
        base.day(2);
        console.log(base);

        // return bot.sendMessage(msg.from.id, "GIVE DAY.", {replyMarkup:
        //     bot.keyboard([["Sat"], ["Sun"], ['cancel']], {resize: true}), ask: 'gotten_day'
        // });
    });
    bot.on('/now', function(msg) {
        // return bot.sendMessage(msg.from.id, moment(get_now()));
        var now = moment(get_now());
        console.log(now);
        console.log(now.format('ddd'));
        console.log(now.format('YYYY/M/D'));

        var meme = require('moment-jalaali');
        var n = meme();
        console.log(n);
        console.log(n.format('ddd'));
        console.log(meme(now).format('jYYYY/jM/jD k:m:s'));
    });

    bot.on('/test', function(msg) {
        Reservation.find({}).exec(function(err, docs) {
            docs.forEach(function(elem, i) {
                console.log(moment(elem.date));
            });
        });
    });

    bot.on(info.time_errors, function(msg, props) {
         Reservation.findOne({user_id: msg.from.id}).remove(function(err) {
            if(err) throw err;
            return error_occurred(msg.from.id);
        });
        // console.log("In Er");
        // return bot.event(BUTTONS.main_menu.command, msg, props);
    });

    bot.on('ask.gotten_day', function(msg, props) {
        if(msg.text == info.cancel) {
            return;
            // return bot.event(info.time_errors, msg, props);
        }

        // var times = get_hours(msg.text);
         get_hours(msg.text).then(function(hours) {

            var time_with_day = moment(get_now());
            var day_name = get_day_name_from_label(msg.text);
            console.log("Day: " + day_name);
            if(!day_name) {
                //override the plan :D
                // return;
                throw "DAY NOT VALID";
            }
            if(hours.length == 0) {
                throw "NOT FREE HOURS ON THIS DAY";
            }

            var last_hour_of_now = moment(get_now()).hour(info.times[info.times.length - 1].hour).minute(30).second(0).millisecond(0);
            if(last_hour_of_now.isSameOrBefore(time_with_day) && last_hour_of_now.format('ddd') == day_name) {
                time_with_day.add(6, 'd');
            }
            while(time_with_day.format('ddd') != day_name) {
                time_with_day.add(1, 'd');
            }

            var r = new Reservation({
                date: time_with_day,
                user_id: msg.from.id
            });

            r.save(function(errs) {
                if(errs) throw errs;

                var times = hours;
                console.log(times);
                //if times == SOMETHING_INVALID_RETURNED! => return to main menu along with a proper msg
                times = get_proper_hours(times);
                times.push([info.cancel]);
                bot.sendMessage(msg.from.id, messages.normal.choose_hour, {replyMarkup:
                    bot.keyboard(times, {resize: true}), ask: 'gotten_time'
                });
            });
        }).catch(function(e) {
            console.log("In Ca");
            if(e == "NOT FREE HOURS ON THIS DAY") {
                 bot.sendMessage(msg.from.id, messages.normal.reservation_not_free_hour, {replyMarkup:
                    bot.keyboard(replies.main_menu, {resize: true})
                });
            } else {
                 error_occurred(msg.from.id);
            }
            // bot.sendMessage(msg.from.id,
            //     messages.normal.main_menu_message, {replyMarkup:
            //         bot.keyboard(replies.main_menu, {resize: true})});
        });
    });

    bot.on('ask.gotten_time', function(msg, props) {
        if(msg.text == info.cancel) {
            //remove reservation
            return;
            // return Reservation.findOne({user_id: msg.from.id}).remove(function(errr) {
            //     if(errr) throw errr;
            //     return error_get_back_to_main_menu(msg.from.id);
            // });
            //     .catch(function(e) {
            //     console.log("In Ca");
            //     bot.sendMessage(msg.from.id,
            //         messages.normal.main_menu_message, {replyMarkup:
            //             bot.keyboard(replies.main_menu, {resize: true})});
            // });
            // return;
        }

        var pure_hour = get_normal_hour(msg.text);
        if(!pure_hour) {
            //override the plan :D
            return bot.event(info.time_errors, msg, props);
        }

         Reservation.findOne({user_id: msg.from.id}).exec(function(err, doc) {
            if(err) throw err;

            if(!doc) {
                return error_occurred(msg.from.id);
            }

            doc.date = moment(doc.date).hour(pure_hour).minute(30).second(0).millisecond(0);
             Reservation.find({date: doc.date.valueOf()}).exec(function(err_t, docs_t) {
                if(err_t) throw err_t;

                var pass = true;
                console.log(docs_t);
                docs_t.forEach(function(d, i) {
                    if(d.user_id != msg.from.id) {
                        if(moment(d.date).isSame(moment(doc.date))) {
                            pass = false;
                            return;
                        }
                    }
                });

                if(!pass) {
                     doc.remove(function(err_r) {
                        if(err_r) throw err_r;
                         error_occurred(msg.from.id);
                    });
                } else {
                     doc.save(function(errs) {
                        if(errs) throw errs;

                         bot.sendMessage(msg.from.id, messages.normal.choose_name, {replyMarkup:
                            bot.keyboard([[info.cancel]], {resize: true}), ask: 'gotten_name'
                        });
                    });
                }
            }).catch(function(e) {
                console.log(e);
                 error_occurred(msg.from.id);
            });
        });
    });

    bot.on('ask.gotten_name', function(msg, props) {
        if(msg.text == info.cancel) {
            //remove reservation
            return;
            // return Reservation.findOne({user_id: msg.from.id}).remove(function(errr) {
            //     if(errr) throw errr;
            //     return error_get_back_to_main_menu(msg.from.id);
            // });
            //     .catch(function(e) {
            //     console.log("In Ca");
            //     bot.sendMessage(msg.from.id,
            //         messages.normal.main_menu_message, {replyMarkup:
            //             bot.keyboard(replies.main_menu, {resize: true})});
            // });
        }

         Reservation.findOne({user_id: msg.from.id}).exec(function(err, doc) {
            if(err) throw err;

            if(!doc) {
                return error_occurred(msg.from.id);
            }

            doc.name = msg.text;
             doc.save(function(errs) {
                if(errs) throw errs;

                 bot.sendMessage(msg.from.id, messages.normal.choose_phone, {replyMarkup:
                    bot.keyboard([[bot.button('contact', 'ارسال شماره')], [info.cancel]], {resize: true})
                });
            });
        });
    });

    // Buttons
    // bot.on('/buttons', function(msg) {
    //
    //     var replyMarkup = bot.keyboard([
    //         [bot.button('contact', 'Your contact')]
    //     ], {resize: true});
    //
    //     return bot.sendMessage(msg.from.id, 'Button example.', {replyMarkup});
    // });

    bot.on(['contact'], function(msg, props) {
        if(msg.text == info.cancel) {
            //remove reservation
            return Reservation.findOne({user_id: msg.from.id}).remove(function(errr) {
                if(errr) throw errr;
                return error_get_back_to_main_menu(msg.from.id);
            });
        }
        console.log(props);
        console.log(msg.contact);
         Reservation.findOne({user_id: msg.from.id}).exec(function(err, doc) {
            if (err) throw err;

            if (!doc) {
                return error_occurred(msg.from.id);
            }

            doc.phone = msg.contact.phone_number;
            doc.form_completed = true;
            doc.save(function(errs) {
                if(errs) throw errs;

                 bot.sendMessage(msg.from.id, messages.normal.reservation_set, {replyMarkup:
                    bot.keyboard(replies.main_menu, {resize: true})
                });
            });
        });
    });

    // bot.on(info.cancel, function(msg) {
    //     console.log("cancel");
    //     return Reservation.findOne({user_id: msg.from.id}).remove(function(err) {
    //         if(err) throw err;
    //         return bot.sendMessage(msg.from.id, messages.normal.reservation_canceled).then(function() {
    //             return error_get_back_to_main_menu(msg.from.id);
    //         });
    //     })
    // });
    bot.on('/hide', function(msg) {
         bot.sendMessage(msg.from.id, "OK", {replyMarkup: 'hide'});
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

    // var tick_delay = 10;
    // bot.on('tick', function(msg) {
    setInterval(function() {
        // console.log(tick_delay);
        // tick_delay --;
        // if(tick_delay < 0) {
             Notif.findOne({}).exec(function(err, doc) {
                if(err) throw err;
                if(!doc) {
                    // tick_delay = 10;
                    return;
                }

                var m = doc.message;
                 doc.remove(function(errr) {
                    if(errr) throw errr;

                    Customer.find({}).exec(function(errc, docs) {
                        if(errc) throw errc;
                        async.forEachSeries(docs, function(doc, callback) {
                            bot.sendMessage(doc.user_id, m).then(function() {
                                callback();
                            });
                        }, function() {
                            // tick_delay = 10;
                        });
                    })
                })
            });
        // }
    },  2 * 60 * 1000); //send notification from site to users
    setInterval(function() {
        // console.log("here");
        Reservation.find({}).exec(function(err, docs) {
            if(err) throw err;
            if(docs.length == 0) return;

            docs.forEach(function(doc, i) {
                var now = moment(get_now());
                var reserved_time = moment(doc.date);
                if(now.isSameOrAfter(reserved_time)) {
                    docs[i].remove(function(errR) {
                        if(errR) throw errR;
                    })
                }
            });
        });
    }, 15 * 60 * 1000); //omit outdated reservations

    bot.on('text', function(msg, props) {
        set_p_n(msg).then(is_joined_FIXED.bind(null, msg)).then(function(res) {
        // is_joined(msg).then(set_p_n.bind(null, msg)).then(function(res) {
            if(!res) {
                return;
            }
            console.log("S0");

            if(msg.text == info.time_reservation) {
                //check if a reservation with such user_id exists or not
                //if not, collect the form
                //if  so, show its information with a cancel button
                 Reservation.findOne({user_id: msg.from.id}).exec(function(err, doc) {
                    if(err) throw err;

                    if(doc) {
                        return send_reserved_time_info(msg.from.id);
                    } else {
                        var days = get_days();
                        days.push([info.cancel]);
                         bot.sendMessage(msg.from.id, messages.normal.choose_day, {replyMarkup:
                            bot.keyboard(days, {resize: true}), ask: 'gotten_day'
                        });
                    }
                });
                return;
            } else if(msg.text == info.cancel) {
                 Reservation.findOne({user_id: msg.from.id, accepted: false}).remove(function(err) {
                    if(err) throw err;
                     bot.sendMessage(msg.from.id, messages.normal.reservation_canceled).then(function() {
                         error_get_back_to_main_menu(msg.from.id);
                    });
                });
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
            console.log("S1");
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
                    // console.log("S2");
                    // bot.on(BUTTONS[button].command, function(msg, props) {
                    //     return bot.sendMessage(msg.from.id, "I\'M receiving sth from you");
                    // });
                    // console.log(button);
                    // console.log("PASSED 3");
                    var type = sub_from(BUTTONS[button].label);
                    console.log(type + " = " + msg.text);
                    if(type == msg.text) {
                        console.log("S3");
                        // return bot.event(BUTTONS[button].command, msg, props);
                        // console.log(BUTTONS[button].command);
                        var r = parse_command(BUTTONS[button].command);
                        console.log(r);
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
                            console.log("S4");
                            // console.log(docs);
                            //calculating reply
                            var current_product = [];
                            //set BUTTONS
                            // console.log('length: ' , docs.length);
                            if(r.number == -1) {
                                r.number += docs.length + 1;
                            }

                            var num = {
                                next: ((r.number - 1) > 0? (r.number - 1): (r.number - 1 + docs.length)),
                                current: r.number,
                                previous: r.number % docs.length + 1
                            };
                            var num_2 = {
                                next: num.current,
                                current: num.previous,
                                previous: num.previous % docs.length + 1
                            };
                            var num_3 = {
                                next: num_2.current,
                                current: num_2.previous,
                                previous: num_2.previous % docs.length + 1
                            };
                            var num2 = {
                                next: ((num.next - 1) > 0? (num.next - 1): (num.next - 1 + docs.length)),
                                current: num.next,
                                previous: num.next % docs.length + 1
                            };
                            var num3 = {
                                next: ((num2.next - 1) > 0? (num2.next - 1): (num2.next - 1 + docs.length)),
                                current: num2.next,
                                previous: num2.next % docs.length + 1
                            };
                            // console.log(num_3);
                            // console.log(num_2);
                            // console.log(num);
                            // console.log(num2);
                            // console.log(num3);

                            // console.log('gotten number:');
                            // console.log(num);
                            // var next_num = r.number + 1;
                            BUTTONS.previous.command = '/' + r.gender + '_' + r.type + '_' + num_3.previous;
                            BUTTONS.next.command = '/' + r.gender + '_' + r.type + '_' + num3.next;
                            BUTTONS.return_back.command = '/' + r.gender + '_' + info.collection;
                            // console.log(BUTTONS);
                            // console.log("SAVED3");
                            console.log("S5");
                            //TODO: this is where the users's previous and next should be changed to BUTTONS.previous and next
                            Customer.findOne({user_id: msg.from.id}).exec(function(err, doc) {
                                if(err)
                                    throw err;
                                if(!doc)
                                    throw err;

                                doc.previous = BUTTONS.previous.command;
                                doc.next = BUTTONS.next.command;
                                doc.return_back = BUTTONS.return_back.command;
                                doc.save(function(errs) {
                                    console.log("SAVED");
                                    if(errs)
                                        throw errs;
                                });
                            });
                            // console.log("SAVED2");

                            current_product.push([sub_from(BUTTONS.previous.label), sub_from(BUTTONS.next.label)]);
                            current_product.push([BUTTONS.return_back.label]);
                            replies.current_type = current_product;
                            console.log("S6");
                            // console.log('replies:');
                            // console.log(current_product);
                            // console.log("Place: " + docs[r.number - 1].botdir);
                            // if(!docs[r.number - 1]) {
                            //     return error_get_back_to_main_menu(msg.from.id);
                            // }
                            try {
                                 bot.sendPhoto(
                                    msg.from.id, decodeURI(docs[num.current - 1].botdir), {caption:
                                        decodeURI("(" + num.current + "/" + docs.length + ")\n" + docs[num.current - 1].description), replyMarkup:
                                        bot.keyboard(replies.current_type, {resize: true})}
                                ).then(function(e) {
                                     bot.sendPhoto(
                                        msg.from.id, decodeURI(docs[num2.current - 1].botdir), {caption:
                                            decodeURI("(" + num2.current + "/" + docs.length + ")\n" + docs[num2.current - 1].description), replyMarkup:
                                            bot.keyboard(replies.current_type, {resize: true})}
                                    ).then(function(e2) {
                                         bot.sendPhoto(
                                            msg.from.id, decodeURI(docs[num3.current - 1].botdir), {caption:
                                                decodeURI("(" + num3.current + "/" + docs.length + ")\n" + docs[num3.current - 1].description), replyMarkup:
                                                bot.keyboard(replies.current_type, {resize: true})}
                                        ).catch(function(err) {
                                            console.log("SOMETHING 1 HAPPENED");
                                            console.log(err);
                                            return bot.sendMessage(msg.from.id, messages.normal.error_in_showing_picture);
                                        });;
                                    }).catch(function(err) {
                                        console.log("SOMETHING 2 HAPPENED");
                                        console.log(err);
                                        return bot.sendMessage(msg.from.id, messages.normal.error_in_showing_picture);
                                    });;
                                }).catch(function(err) {
                                    console.log("SOMETHING 3 HAPPENED");
                                    console.log(err);
                                    return bot.sendMessage(msg.from.id, messages.normal.error_in_showing_picture);
                                });
                            } catch(e) {
                                console.log("SOMETHING 4 HAPPENED");
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
                return resolved(!(member.result.status == 'left' || member.result.status == 'kicked'));
            }).catch(function(r) {
                // console.log("Channel not found/admin");
                // console.log(r);
                return resolved(false);
            });
        });
    }

    function is_joined_FIXED(msg) {
        return new Promise(function(resolved, reject) {
            return resolved(true);
        });
    }

    function set_p_n(msg) {
        return new Promise(function(resolved, reject) {
            Customer.findOne({user_id: msg.from.id}).exec(function (err, doc) {
                if (err)
                    return reject();
                if (!doc)
                    return reject();
                console.log("\n----> " + msg.from.id + ":\nBEFORE -> " + BUTTONS.previous.command + " && " + BUTTONS.next.command + " && " + BUTTONS.return_back.command);
                BUTTONS.previous.command = doc.previous;
                BUTTONS.next.command = doc.next;
                BUTTONS.return_back.command = doc.return_back;
                console.log("AFTER -> " + BUTTONS.previous.command + " && " + BUTTONS.next.command + " && " + BUTTONS.return_back.command);
                return resolved();
            })
        });
    }

    function get_days() {
        var days = [];
        var days_left = 7;
        //now's hour plus a little amount so that he can't reserve instantly :D
        var now = moment(get_now());

        //test for time
        // now.add(1, 'days');

        //check the end of today,   if we're later than that, start from tomorrow
        //                          if we're soner than that, start from today, decreasing "days_left"
        //add every single days till 'days_left' becomes zero, if encountered friday, ignore
        //---> DONE
        var last_hour_of_now = moment(now);
        last_hour_of_now.hour(info.times[info.times.length - 1].hour).minute(30).second(0).millisecond(0);

        if(now.isBefore(last_hour_of_now) && now.format('ddd') != info.days.Fri.name) {
            // days.push([now.format('ddd')]);
            days.push([info.days[now.format('ddd')].label]);
            days_left --;
        }
        now.add(1, 'days');
        while(days_left > 0) {
            if(now.format('ddd') != info.days.Fri.name) {
                // days.push([now.format('ddd')]);
                days.push([info.days[now.format('ddd')].label]);
            }
            now.add(1, 'days');
            days_left --;
        }

        console.log(days);
        // console.log(last_hour_of_now);
        return days;
    }

    function get_hours(day) {
        return new Promise(function(resolved, reject) {
            var now = moment(get_now());
            var hours = [];
            day = get_day_name_from_label(day);
            if(!day) {
                return resolved(null);
            }

            var reserved_day = moment(now); //chosen day
            var last_hour_of_now = moment(get_now()).hour(info.times[info.times.length - 1].hour).minute(30).second(0).millisecond(0);
            if(last_hour_of_now.isSameOrBefore(reserved_day) && last_hour_of_now.format('ddd') == day) {
                reserved_day.add(6, 'd');
            }
            while (reserved_day.format('ddd') != day) {
                reserved_day.add(1, 'd');
            }

            // console.log(reserved_day.format('YYYY/M/D - ddd - k:m:s'));

            //check dates availability, then add each of them to the list (e.g for 10:30, only add '10' as number!)
            //for thursday, check that the last hour is not valid
            //attend the date! this monday is not the same as last monday! so date (2th Aug 2017) must be checked when fetching from db!
            //maybe checking it with now with 'isBefore' works out, but should be considered more carefully!
            //a for loop for each of the time, should it pass filters, it's added, otherwise it's ignored
            //filters: available (not reserved before) / check thursday exception /

            async.forEachSeries(info.times, function (this_time, callback) {

                var wanted_time = moment(reserved_day).hour(this_time.hour).minute(30).second(0).millisecond(0); //chosen days with each hours
                //for test only!
                // wanted_time.add()
                // var start_time; //chosen day - calculated hour
                // var end_time; //day after chosen day - start of day! (so it doesn't affect tommorrow's dates
                Reservation.findOne({date: wanted_time.valueOf()}).exec(function (err, doc) {
                    if (err) throw err;

                    // console.log("This is the doc");
                    // console.log(doc);
                    //check Existence
                    if (doc) {
                        callback();
                    } else {
                        //check Thu
                        if (moment(wanted_time).format('ddd') == info.days.Thu.name && this_time.hour == info.times[info.times.length - 1].hour) {
                            callback();
                        } else {
                            //check The time to be after now
                            // console.log("CLOCKS:");
                            // console.log(wanted_time.format('YYYY/M/D - ddd - k:m:s'));
                            // console.log(reserved_day.format('YYYY/M/D - ddd - k:m:s'));
                            // console.log(wanted_time.isSameOrAfter(reserved_day));
                            // console.log("----------");
                            if(wanted_time.isSameOrBefore(now)) {
                                callback();
                            } else {
                                hours.push([this_time.hour]);
                                callback();
                            }
                        }
                    }
                });

            }, function (erras) {
                if (erras) throw erras;
                resolved(hours);
            });
        });
    }

    function get_proper_hours(hours) {
        //turn 10/11/... to (10:30-11:30)/(11:30/12:30)/....
        hours.forEach(function(hour, idx) {
            info.times.forEach(function(time, index) {
                if(hour[0] == time.hour) {
                    hour[0] = String(time.hour) + String(":30 - ") + String(time.hour + 1);
                    return;
                }
            });
        });

        return hours;
    }

    function get_normal_hour(hour) {
        var normal_hour = hour;
        var has_changed = false;
        info.times.forEach(function(time, idx) {
            var n_h = String(time.hour) + String(":30 - ") + String(time.hour + 1);
            if(hour == n_h) {
                normal_hour = time.hour;
                has_changed = true;
                return;
            }
        });
        if(has_changed)
            return normal_hour;
        else
            return null;
    }

    function get_day_name_from_label(day) {
        if(day == info.days.Sat.label)
            return info.days.Sat.name;
        else if(day == info.days.Sun.label)
            return info.days.Sun.name;
        else if(day == info.days.Mon.label)
            return info.days.Mon.name;
        else if(day == info.days.Tue.label)
            return info.days.Tue.name;
        else if(day == info.days.Wed.label)
            return info.days.Wed.name;
        else if(day == info.days.Thu.label)
            return info.days.Thu.name;
        // else if(day == info.days.Fri.label)
        //     return info.days.Fri.name;
        else
            return null;
    }

    function get_now() {
        return moment().add(info.delta_date_from_server.hour + info.short_break_between_in_hour, 'h').add(info.delta_date_from_server.minute, 'm');
    }

    function parse_command(cmd) { // /gender_type_number
        if(typeof cmd != 'string')
            return;

        var parts = get_parts(cmd);
        var obj = {
            gender: get_gender(parts[0]),
            type: parts[1],
            number: -1
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
        return bot.sendMessage(id, messages.normal.error_occurred, {replyMarkup:
            bot.keyboard(replies.main_menu, {resize: true})
        });
    }

    function send_reserved_time_info(id) {
        return Reservation.findOne({user_id: id}).exec(function(err, doc) {
            if(err) throw err;

            var statement = make_statement_for_time_reservation(doc);
            var rep = [[BUTTONS.main_menu.label]];
            if(doc.accepted) {
                statement += messages.normal.res.accepted;
            } else if(doc.rejected) {
                statement += messages.normal.res.rejected;
                rep.push([info.cancel]);
            } else {
                statement += messages.normal.res.not_yet;
                rep.push([info.cancel]);
            }

            return bot.sendMessage(id, decodeURI(statement), {replyMarkup:
                bot.keyboard(rep, {resize: true}), parseMode: 'html'
            });
        });
    }

    function make_statement_for_time_reservation(doc) {
        var statement = encodeURI(messages.normal.res.intro + "\n");
        statement += String("نام: ") + doc.name + encodeURI("\n");
        statement += String("شماره تلفن: ") + doc.phone + encodeURI("\n");
        statement += String("روز: ") + info.days[moment(doc.date).format('ddd')].label + String(" " + doc.short_date_jalaali) + encodeURI("\n");
        var hour = Number(moment(doc.date).format('k'));
        statement += String("ساعت: ") + String(hour) + String(":30 - ") + String(hour + 1) + encodeURI("\n\n");
        return statement;
    }

    function error_get_back_to_main_menu(id) {
        return bot.sendMessage(id, messages.normal.main_menu_message, {replyMarkup:
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

    function reset_buttons(gender_collection) {
        for(var button in BUTTONS) {
            if(BUTTONS.hasOwnProperty(button)) {
                if(button.indexOf(gender_collection) != -1) {
                // if (button.indexOf(info.male_collection_buttons_prefix) != -1 || button.indexOf(info.femele_collection_buttons_prefix) != -1 ||
                //     button.indexOf(info.spouse_collection_buttons_prefix) != -1 || button.indexOf(info.baby_collection_buttons_prefix) != -1 ||
                //     button.indexOf(info.narriage_collection_buttons_prefix) != -1 || button.indexOf(info.jewelry_collection_buttons_prefix) != -1 ||
                //     button.indexOf(info.kafsh_collection_buttons_prefix) != -1 || button.indexOf(info.accessory_collection_buttons_prefix) != -1) {
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

