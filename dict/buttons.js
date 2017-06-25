



const BUTTONS = {
    //------------------------------------ THIS IS JUST FOR TEST
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
    //------------------------------------ THIS IS THE INTRODUCTION
    became_member: {
        label: 'عضو شدم',
        command: '/became_member'
    },
    //------------------------------------ THIS IS THE MAIN PART
    male_collection: {
        label: 'کلکسیون آقایان',
        command: '/male_collection'
    },
    female_collection: {
        label: 'کلکسیون بانوان',
        command: '/female_collection'
    },
    accessory: {
        label: 'Accessory',
        command: '/accessory'
    },
    telegram_channel: {
        label: 'کانال تلگرام',
        command: '/telegram_channel'
    },
    instagram_page: {
        label: 'صفحه اینستاگرام',
        command: '/instagram_page'
    },
    contact_us: {
        label: 'ارتباط با ما',
        command: '/contact_us'
    },
    time_reservation: {
        label: 'تعیین وقت',
        command: '/time_reservation'
    }
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