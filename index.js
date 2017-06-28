var mongoose = require('mongoose');
mongoose.connect('localhost:27017/telegramdb');
mongoose.Promise = global.Promise;

var Telebot = require('telebot');
var BUTTONS = require('./dict/buttons');
var info = require('./dict/info');
// var replies = require('./replies')(BUTTONS);
var commands = require('./commands');
var commands_admin = require('./commands_admin');


var bot = new Telebot({
    token: info.telegram_token,
    usePlugins: ['namedButtons'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
});

//FOR ADMIN CONTROL PANNEL BOT
// var newbot = new Telebot(info.telegram_token);
// newbot.on('text', function(msg) {
//     msg.reply.text(msg.text);
//     console.log("Here");
// });
// commands_admin(newbot);
// newbot.start();

// commands.HIDE(bot);
// commands.START(bot, info);
commands(bot);
bot.start();



//
//
// /**
//  * This example demonstrates using polling.
//  * It also demonstrates how you would process and send messages.
//  */
//
//
// const TOKEN = process.env.TELEGRAM_TOKEN || '418136982:AAEyYQ8gcGwUDAAYJzbpXOBpwwGWhDMohwU';
// const TelegramBot = require('node-telegram-bot-api');
// // const request = require('request');
// const options = {
//     onlyFirstMatch: true,
//     polling: true
// };
// const bot = new TelegramBot(TOKEN, options);
//
//
// // Matches /photo
// bot.onText(/\/photo/, function onPhotoText(msg) {
//     // From file path
//     // const photo = `${__dirname}/../test/data/photo.gif`;
//     bot.sendPhoto(msg.chat.id, 'pic.png', {
//         caption: "I'm a bot!"
//     });
// });
//
//
// // Matches /audio
// bot.onText(/\/audio/, function onAudioText(msg) {
//     // From HTTP request
//     // const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
//     // const audio = request(url);
//     bot.sendAudio(msg.chat.id, '');
// });
//
//
// // Matches /love
// bot.onText(/\/love/, function onLoveText(msg) {
//     const opts = {
//         reply_to_message_id: msg.message_id,
//         reply_markup: JSON.stringify({
//             keyboard: [
//                 ['Yes'],
//                 ['No']
//             ]
//         })
//     };
//     bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
//
//     bot.onText(/Yes/, function onYesText(msg) {
//         bot.sendMessage(msg.chat.id, 'successful', {});
//     });
//
//     bot.onText(/No/, function onYesText(msg) {
//         bot.sendMessage(msg.chat.id, 'successful', {});
//     });
// });
//
//
// // Matches /echo [whatever]
// bot.onText(/\/echo (.+)/, function onEchoText(msg, match) {
//     const resp = match[1];
//     bot.sendMessage(msg.chat.id, resp);
// });
//
//
// // Matches /editable
// bot.onText(/\/editable/, function onEditableText(msg) {
//     const opts = {
//         reply_markup: {
//             inline_keyboard: [
//                 [
//                     {
//                         text: 'Edit Text',
//                         // we shall check for this value when we listen
//                         // for "callback_query"
//                         callback_data: 'edit'
//                     }
//                 ]
//             ]
//         }
//     };
//     bot.sendMessage(msg.from.id, 'Original Text', opts);
// });
//
//
// // Handle callback queries
// bot.on('callback_query', function onCallbackQuery(callbackQuery) {
//     const action = callbackQuery.data;
//     const msg = callbackQuery.message;
//     const opts = {
//         chat_id: msg.chat.id,
//         message_id: msg.message_id,
//     };
//     var text;
//
//     if (action === 'edit') {
//         text = 'Edited Text';
//     }
//
//     bot.editMessageText(text, opts);
// });
//
//
// // const TelegramBot = require('node-telegram-bot-api');
// //
// // // replace the value below with the Telegram token you receive from @BotFather
// // const token = '418136982:AAEyYQ8gcGwUDAAYJzbpXOBpwwGWhDMohwU';
// //
// // // Create a bot that uses 'polling' to fetch new updates
// // const bot = new TelegramBot(token, {polling: true});
// //
// // // Matches "/echo [whatever]"
// // bot.onText(/\/echo (.+)/, function(msg, match) {
// //     // 'msg' is the received Message from Telegram
// //     // 'match' is the result of executing the regexp above on the text content
// //     // of the message
// //
// //     const chatId = msg.chat.id;
// //     const resp = match[1]; // the captured "whatever"
// //
// //     // send back the matched "whatever" to the chat
// //     bot.sendMessage(chatId, resp);
// //     // bot.sendAudio(chatId, './audio.mp3');
// //     bot.sendPhoto(chatId, './pic.png');
// //     console.log("reached here");
// //
// //     const opts = {
// //         reply_to_message_id: msg.message_id,
// //         reply_markup: JSON.stringify({
// //             keyboard: [
// //                 ['Yes, you are the bot of my life ❤'],
// //                 ['No, sorry there is another one...']
// //             ]
// //         })
// //     };
// //     bot.sendMessage(chatId, 'Do you love me?', opts);
// // });
// //
// // bot.on('/start', function(msg) {
// //     bot.sendMessage(msg.chat.id, "Welcome to my Bot!", {
// //         reply_to_message_id: msg.message_id,
// //         reply_markup: JSON.stringify({
// //             keyboard: [
// //                 ['Men'],
// //                 ['Women']
// //             ]
// //         })
// //     });
// // });
// //
// // bot.on(/[M][e][n]/, function(msg, match) {
// //     bot.sendMessage(msg.chat.id, "Good Choice!");
// // });
// //
// // bot.on(/Women/, function(msg, match) {
// //     bot.sendMessage(msg.chat.id, "Not Approved!");
// // });
// //
// // // Listen for any kind of message. There are different kinds of
// // // messages.
//
// bot.on('message', function(msg) {
//     const chatId = msg.chat.id;
//
//     // send a message to the chat acknowledging receipt of their message
//     bot.sendMessage(chatId, 'Received your message');
//
//     console.log("received ");
//     console.log(msg);
//
//     if(msg.text == '/start') {
//         bot.sendMessage(msg.chat.id, "Welcome to my Bot!", {
//             // reply_to_message_id: msg.message_id,
//             "parse_mode": "Markdown",
//             reply_markup: JSON.stringify({
//                 resize_keyboard: true,
//                 one_time_keyboard: true,
//                 keyboard: [
//                     ['مردانه'],
//                     ['زنانه']
//                 ]
//             })
//         });
//
//         bot.onText(/مردانه/, function onYesText(msg) {
//             bot.sendMessage(msg.chat.id, 'successful', {
//                 reply_to_message_id: msg.message_id,
//                 reply_markup: JSON.stringify({
//                     keyboard: [
//                         [{text: '/love'}]
//                     ]
//                 })
//             });
//         });
//
//         bot.onText(/زنانه/, function onYesText(msg) {
//             bot.sendMessage(msg.chat.id, 'aborted');
//         });
//     }
// });
//
// // bot.command()