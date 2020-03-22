import Constants from 'expo-constants';

export default {

    clearAllStorage: false,
    log_details: false,
    log_audio: false,
    log_server: false,
    console_log_breadcrumbs: false,

    // sentry_logging: true,

    myStatusBarHeight: Constants.statusBarHeight,
    myBottomTabBarHeight: 45,

    myTabColor: 'lavender',
    myHeaderTextColor: 'purple',

    default_settings: {
        keep_awake: true,
        retrieved_user_data: false,
    },

    default_vehicle: {
        color: "White",
        make: "Ford",
        model: "Prius",
        year: 2019,
    },

}

