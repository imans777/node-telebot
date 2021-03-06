var mongoose = require('mongoose');
mongoose.connect('localhost:27017/telegramdb');
mongoose.Promise = global.Promise;

/*
* Things that should be changed on server:
* - here, telegram_test_token -> telegram_token
* - user, telegram_test_token -> telegram_token
* - info, change local date (hours and minutes) */

var Telebot = require('telebot');
var BUTTONS = require('./dict/buttons');
var info = require('./dict/info');
// var commands_admin = require('./commands_admin');
var bot = new Telebot({
    token: info.telegram_test_token,
    polling: {
        interval: 100,
        retryTimeout: 500
    },
    usePlugins: ['namedButtons', 'askUser'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
});


module.exports = {
    bot
};

// const bot = new TeleBot({
//     token: 'TELEGRAM_BOT_TOKEN', // Required. Telegram Bot API token.
//     polling: { // Optional. Use polling.
//         interval: 1000, // Optional. How often check updates (in ms).
//         timeout: 0, // Optional. Update polling timeout (0 - short polling).
//         limit: 100, // Optional. Limits the number of updates to be retrieved.
//         retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
//         proxy: 'http://username:password@yourproxy.com:8080' // Optional. An HTTP proxy to be used.
//     },
//     webhook: { // Optional. Use webhook instead of polling.
//         key: 'key.pem', // Optional. Private key for server.
//         cert: 'cert.pem', // Optional. Public key.
//         url: 'https://....', // HTTPS url to send updates to.
//         host: '0.0.0.0', // Webhook server host.
//         port: 443, // Server port.
//         maxConnections: 40 // Optional. Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
//     },
//     allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
//     usePlugins: ['askUser'], // Optional. Use build-in plugins from pluginFolder.
//     pluginFolder: '../plugins/', // Optional. Plugin folder location relative to telebot package.
//     pluginConfig: { // Optional. Plugin configuration.
//         // myPluginName: {
//         //   data: 'my custom value'
//         // }
//     }
// });
//FOR ADMIN CONTROL PANNEL BOT

/*var newbot = new Telebot({
    token: info.telegram_admin_token,
    usePlugins: ['namedButtons', 'askUser'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS.admin
        }
    }
});*/
// newbot.on('text', function(msg) {
//     msg.reply.text(msg.text);
//     console.log("Here");
// });
// commands_admin(newbot);
// commands.HIDE(bot);
// commands.START(bot, info);
// var replies = require('./replies')(BUTTONS);
var commands = require('./commands');
commands(bot/*, newbot*/);
bot.start();
// newbot.start();



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