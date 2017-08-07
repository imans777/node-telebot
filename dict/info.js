

const info = {
    my_channel_id: -1001009629265,                                               //the id of the channel the user must be a member of
    telegram_test_token: '418136982:AAETpKRABqQKb2Wf_AZXU9r4612yDMw2iZ0',
    telegram_token: '433749058:AAH3QkAkKZcpey3ipITI4RFMr-IYGsBho6s',             //the telegram token taken from botfather
    telegram_admin_token: '433488720:AAEUWco0cMppZMuDmpysaqAYNHtB8QBuVeg',       //the telegram token taken from botfather for the admin
    telegram_channel_link: encodeURI('https://t.me/czteam'),                     //the link to the telegram channel

    //the link to the instagram page
    instagram: {
        main_page: encodeURI('http://instagram.com/cameronzigzal'),
        second_page: encodeURI('http://instagram.com/cameronzigzaal'),
        online_sell: encodeURI('http://instagram.com/onlineczshop'),
        femele_page: encodeURI('http://instagram.com/cz.women'),
        baby_page: encodeURI('http://instagram.com/cz.kids'),
        jewelry_page: encodeURI('http://instagram.com/cz.jewellery'),
        accessory_page: encodeURI('http://instagram.com/cz.accessories'),
        kafsh_page: encodeURI('http://instagram.com/cz.shoes'),
        video_page: encodeURI('http://instagram.com/cz.videos'),
        management_page: encodeURI('http://instagram.com/kamranbakhtiyari')
    },

    gender: 'gender',
    male: 'male',
    femele: 'femele',
    spouse: 'spouse',
    baby: 'baby',
    narriage: 'narriage',
    jewelry: 'jewelry',
    kafsh: 'kafsh',
    accessory: 'accessory',

    gender_collection_buttons_prefix: 'gender_type',
    male_collection_buttons_prefix: 'male_type',
    femele_collection_buttons_prefix: 'femele_type',
    spouse_collection_buttons_prefix: 'spouse_type',
    baby_collection_buttons_prefix: 'baby_type',
    narriage_collection_buttons_prefix: 'narriage_type',
    jewelry_collection_buttons_prefix: 'jewelry_type',
    kafsh_collection_buttons_prefix: 'kafsh_type',
    accessory_collection_buttons_prefix: 'accessory_type',

    accessory_buttons_prefix: 'accessory_',
    return_back: 'بازگشت',
    return_to_main_menu: 'بازگشتن به منوی اصلی',
    collection: 'collection',
    previous: 'previous',
    next: 'next',

    cancel: 'لغو درخواست',

    time_reservation: 'تعیین وقت شوروم',
    short_break_between_in_hour: 1,
    delta_date_from_server: {
        hour: 0, //7,
        minute: 0, //30,
    },
    times: [
        {
            stringify: '10:30',
            hour: 10,
            end: 11,
        }, {
            stringify: '11:30',
            hour: 11,
            end: 12,
        }, {
            stringify: '12:30',
            hour: 12,
            end: 13,
        }, {
            stringify: '13:30',
            hour: 13,
            end: 14,
        }, {
            stringify: '14:30',
            hour: 14,
            end: 15,
        }, {
            stringify: '15:30',
            hour: 15,
            end: 16,
        }, {
            stringify: '16:30',
            hour: 16,
            end: 17,
        }, {
            stringify: '17:30',
            hour: 17,
            end: 18,
        }
    ],
    days: {
        Sat: {
            label: 'شنبه',
            command: '/res_sat',
            name: 'Sat',
            longname: 'Saturday'
        },
        Sun: {
            label: 'یکشنبه',
            command: '/res_sun',
            name: 'Sun',
            longname: 'Sunday'
        },
        Mon: {
            label: 'دوشنبه',
            command: '/res_mon',
            name: 'Mon',
            longname: 'Monday'
        },
        Tue: {
            label: 'سه شنبه',
            command: '/res_tue',
            name: 'Tue',
            longname: 'Tuesday'
        },
        Wed: {
            label: 'چهارشنبه',
            command: '/res_wed',
            name: 'Wed',
            longname: 'Wednesday'
        },
        Thu: {
            label: 'پنجشنبه',
            command: '/res_thu',
            name: 'Thu',
            longname: 'Thursday'
        },
        Fri: {
            label: 'جمعه',
            command: '/res_fri',
            name: 'Fri',
            longname: 'Friday'
        }
    },
    time_errors: "time_errors",
};


module.exports = info;