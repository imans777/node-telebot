var info = require('./info');

module.exports = {
    encoded: {
        not_member_of_channel: encodeURI("شما در کانال تلگرام ما عضو نیستید. لطفا برای ادامه استفاده از روبات، در کانال زیر عضو شوید: \n ")  + info.telegram_channel_link,
        be_member_of_channel: encodeURI("لطفا حهت ادامه استفاده از روبات، ابتدا در کانال زیر عضو شوید: \n ")  + info.telegram_channel_link,
        telegram_channel_item: encodeURI("کانال تلگرام ما: \n ")  + info.telegram_channel_link,
        instagram_page_item: encodeURI("لینک صفحه اینستاگرام: \n ") + info.instagram_page_link,
        contact_us: encodeURI("ارتباط با ما"),
        time_reservation: encodeURI("ارتباط با بخش فروش"),

    },
    normal: {
        greetings: "به ربات خوش آمدید.",
        successful_channel_joint: "بسیار عالی!",
        main_menu_message: 'گزینه مورد نظر خود را انتخاب کنید',
        error_occurred: "مشکلی ناگهانی در روبات پیش آمده است! لطفا مجدداً تلاش نمایید.",
        choose_type: "لطفا مدل مورد نظر خود را انتخاب کنید.",
        no_product_found: "هیچ محصولی در این دسته وجود ندارد.",
        error_in_showing_picture: 'خطا در نمایش تصویر',

    }
};