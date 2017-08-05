var info = require('./info');

module.exports = {
    encoded: {
        not_member_of_channel: encodeURI("شما در کانال تلگرام ما عضو نیستید. لطفا برای ادامه استفاده از روبات، در کانال زیر عضو شوید: \n ")  + info.telegram_channel_link,
        be_member_of_channel: encodeURI("لطفا حهت ادامه استفاده از روبات، ابتدا در کانال زیر عضو شوید: \n ")  + info.telegram_channel_link,
        telegram_channel_item: encodeURI("کانال تلگرام ما: \n ")  + info.telegram_channel_link,
        // instagram_page_item: encodeURI("لینک صفحه اینستاگرام: \n ") + info.instagram_page_link,
        contact_us: encodeURI("جهت درخواست سفارش خود، به آیدی زیر مراجعه نمایید:" +
            "\n" +
            "@czonline"),
        time_reservation: encodeURI("برای تعیین وقت شوروم با شماره های زیر تماس بگیرید:" +
            "\n" +
            "☎ 021-26119097" +
            "\n" +
            "☎ 021-22286530" +
            "\n\n" +
            "یا از طریق شماره زیر در تلگرام درخواست خود را ارسال کنید:" +
            "\n" +
            "📱 09332793795"),

    },
    normal: {
        greetings: "به ربات خوش آمدید.",
        successful_channel_joint: "بسیار عالی! اکنون میتوانید از ربات استفاده کنید.",
        instagram_choose_page: "پیج مورد نظر خود را انتخاب نمایید.",
        main_menu_message: 'گزینه مورد نظر خود را انتخاب کنید',
        error_occurred: "مشکلی ناگهانی در روبات پیش آمده است! لطفا مجدداً تلاش نمایید.",
        choose_type: "لطفا مدل مورد نظر خود را انتخاب کنید.",
        no_product_found: "هیچ محصولی در این دسته وجود ندارد.",
        error_in_showing_picture: 'خطا در نمایش تصویر',

        choose_day: 'روز مورد نظر خود را انتخاب کنید',
        choose_hour: 'ساعت مورد نظر خود را انتخاب کنید',
        choose_name: 'لطفا نام خود را وارد کنید',
        choose_phone: 'شماره خود را از طریق دکمه زیر ارسال نمایید',
        reservation_set: 'وقت شما با موفقیت رزرو شد',
        reservation_canceled: 'درخواست شما لغو شد',

        res : {
            intro: 'شما با مشخصات زیر درخواست تعیین وقت کرده اید:',
            accepted: `درخواست شما <i>تایید شده است.</i>`,
            not_yet: `درخواست شما <i>در دست بررسی</i> است.`,
            rejected: `درخواست شما <i>رد شده است.</i>`,
        }
    }
};