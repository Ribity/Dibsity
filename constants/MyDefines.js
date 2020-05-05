import Constants from 'expo-constants';

export default {
    expo_channel_prod: "dibsity-prod",

    clearAllStorage: false,
    log_details: false,
    fakeLocation: false,    // Fakes location changes.
    fakeParkedLocation: true,
    oneMinuteIntervals: false,

    fakeSeconds: 3,

    console_log_breadcrumbs: false,
    myRepo_logging: false,

    myStatusBarHeight: Constants.statusBarHeight,
    myBottomTabBarHeight: 45,

    myTabColor: 'lavender',
    myHeaderTextColor: 'green',

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

    default_tasks: {
        refresh_map: false,
        panned_map: false,
        panned_coords: {},
        firestore_radius_meters: 3000,
    },
    default_location: {
        "coords": {
            "accuracy": -1,
            "altitude": -1,
            "altitudeAccuracy": -1,
            "heading": -1,
            "latitude": 35.9,
            "longitude": -78.6,
            "speed": -1,
        },
        "timestamp": 0,
    },
    fake_parked_location: {
        "coords": {
            "accuracy": -1,
            "altitude": -1,
            "altitudeAccuracy": -1,
            "heading": -1,
            "latitude": 35.91115,
            "longitude": -78.69,
            "speed": -1,
        },
        "timestamp": 0,
    },
    default_user: {
        profile: {
            client_allow_confirmation_popups: true,
            total_points: 0,
            refocus_seconds: 8,
            zoom_multiplier: 3,
            map_user_size: 2,
            map_user_icon: 2,
            map_orients_to_users_bearing: 1,
            keep_awake: true,
            last_seen_dt: {},

        },
        is_superuser: false,
        is_staff: false,
    },




}

