const BUTTONS = {
    hello: {
        label: '👋 Hello',
        command: '/hello'
    },
    world: {
        label: '🌍 World Wide',
        command: '/world'
    },
    hide: {
        label: '⌨️ Hide keyboard',
        command: '/hide'
    },

};

module.exports = BUTTONS;





// const reply_default = bot.keyboard([])
// const reply_on_not_channel_member = bot.inlineKeyboard([
//     [
//         // First row with command callback button
//         bot.inlineButton('Command button', {callback: '/hello'})
//     ],
//     [
//         // Second row with regular command button
//         bot.inlineButton('Regular data button', {callback: 'hello'})
//     ]
// ]);