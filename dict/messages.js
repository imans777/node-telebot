var info = require('./info');

module.exports = {
    encoded: {
        not_member_of_channel: encodeURI("شما در کانال تلگرام ما عضو نیستید. لطفا برای ادامه استفاده از روبات، در کانال زیر عضو شوید: \n ")  + info.telegram_channel_link,
        be_member_of_channel: encodeURI("لطفا حهت ادامه استفاده از روبات، ابتدا در کانال زیر عضو شوید: \n ")  + info.telegram_channel_link,
        telegram_channel_item: encodeURI("کانال تلگرام ما: \n ")  + info.telegram_channel_link,
        instagram_page_item: encodeURI("لینک صفحه اینستاگرام: \n ") + info.instagram_page_link,
    },
    normal: {
        greetings: "به ربات خوش آمدید.",
        normal_use: "بسیار عالی! اکنون میتوانید از امکانات ربات استفاده کنید.",
        error_occurred: "مشکلی در روبات پیش آمده است. لطفا مجدداً تلاش نمایید.",
    }
};