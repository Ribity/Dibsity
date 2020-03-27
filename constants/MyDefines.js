import Constants from 'expo-constants';

export default {

    clearAllStorage: false,
    log_details: false,
    fakeLocation: false,    // Fakes location changes.

    console_log_breadcrumbs: false,
    sentry_logging: false,

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


    default_client_parms: {
        claim_meters: 500,
        delivery_meters: 500,
        claim_wandering_meters: 8000,
        goCheap: true,
        sentry_logging: false,
        admob_map_banner: false,
        console_log_breadcrumbs: true,
        claim_degrees: 75,
        claim_attempt_meters: 100,
        max_num_current_claims: 15,
        claim_attempt_degrees: 40,
        map_group_meters: 15,
        release_logic_interval: 20,
        unclaim_client_minutes: 15,
        refresh_client_data_minutes: 60,
        meters_to_last_redux_coord_min: 1000,
        create_screen_upd_start_address_interval_secs: 3,
        wandering_update_curr_loc_meters: 2000,
        release_task_frequency: 12,
    },
    default_server_parms: {
        max_ribbons_per_user_per_day: 5,
        auto_advance_minutes: 240,
        auto_unclaim_minutes: 45,
        auto_complete_wandering_days: 60,
        server_num_search_records: 100,
        max_event_ribbons: 1000,
        meters_step_list_response: 8000,
        max_ribbon_creates_for_points_per_day: 10,
        max_nonadmob_creates_per_day: 5,
        client_init_message: "",
        client_init_message2: "",
        client_init_message3: "",
        client_init_message4: "",
        client_init_message5: "",
        min_client_version_ios: 0,
        min_client_version_android: 0,
    },

    default_tasks: {
        server_info_retrieved: false,
        retrieve_ribbon_types: true,
        retrieve_admin_events: true,
        retrieve_local_events: true,
        retrieve_audio_events: true,
        retrieve_client_parms: true,
        retrieve_server_parms: true,
        retrieve_user_profile: true,
        send_heartbeat: false,
        refresh_map: false,
        panned_map: false,
        panned_coords: {},
        curr_ribbon_id: 0,
        localEventsLocation: {
            "coords": {
                "accuracy": -1,
                "altitude": -1,
                "altitudeAccuracy": -1,
                "heading": -1,
                "latitude": 35.91057,
                "longitude": -78.69085,
                "speed": -1,
            },
            "timestamp": 0,
        },
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
    default_user: {
        email: "",
        profile: {
            client_allow_confirmation_popups: true,
            client_allow_notifications: true,
            client_default_create_destination_address: "",
            client_default_create_ribbon_name: "",
            client_default_create_additional_message: "",
            client_default_leap_message: "",
            id: -1,
            number_ribbons_created_today: 0,
            ribity_wav_num: 2,
            total_number_events_created: 0,
            total_number_ribbons_claimed: 0,
            total_number_ribbons_created: 0,
            total_points: 0,
            user: -1,
            advanced_user: true,
            points_desc: "",
            refocus_seconds: 8,
            zoom_multiplier: 20,
            map_ribbon_size: 3,
            map_user_size: 3,
            map_user_icon: 1,
            map_orients_to_users_bearing: 1,
            push_token: "",
            notifications_ribbon_delivery: true,
            notifications_ribbon_following: true,
            notifications_ribbon_added_to_event: true,
            notifications_user_follows: true,
            trusted_user: false,
            keep_awake: true,
            audio_nearby_events: true,
            audio_day_of_event: true,
            audio_first_time: true,
            audio_events_distance_miles: 1, // Default to one mile
            last_seen_dt: {},

        },
        user_id: 1,
        username: "",
        is_superuser: false,
        is_staff: false,
    },
    default_ribbon_details: {
        id: 0,
        uuid: "",
        creator_id: 0,            // models.IntegerField(blank=True, null=True)
        creator_username: "",
        create_dt: {},            // models.DateTimeField(default=timezone.now, blank=True)
        carrier_id: 0,            // models.IntegerField(default=0, blank=True, null=True)
        carrier_username: "",
        last_upd_dt: {},          // models.DateTimeField(blank=True)
        bounds_ne_lat: 0,         // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        bounds_ne_lon: 0,         // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        bounds_sw_lat: 0,         // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        bounds_sw_lon: 0,         // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        start_lat: 0,             // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        start_lon: 0,             // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        start_address: "",        // models.TextField(blank=True, null=True)
        end_lat: 0,               // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        end_lon: 0,               // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        end_address: "",          // models.TextField(blank=True, default="")
        overview_polyline: "",    // models.TextField(blank=True, null=True)
        curr_lat: 0,              // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        curr_lon: 0,              // models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
        curstep_num: 0,           // models.IntegerField(blank=True, null=True)
        curhist_num: 0,           // models.IntegerField(blank=True, null=True)
        ribbon_type: 0,           // models.IntegerField(blank=True, null=True)
        event_type: 0,            // models.IntegerField(blank=True, null=True, default=-1)
        event_name: "",           // models.TextField(default="", blank=True, null=True)
        image: "",                // models.TextField(blank=True, null=True)
        status: 0,                // models.IntegerField(default=0, blank=True, null=True)
        mode: 0,                  // models.IntegerField(blank=True, null=True)
        name: "",                 // models.TextField(blank=True, null=True)
        public_message: "",       // models.TextField(blank=True, null=True)
        private_message: "",      // models.TextField(blank=True, null=True)
        distance: 0,              // models.IntegerField(blank=True, null=True)
        auto_advance: 0,          // models.IntegerField(default=0, blank=True, null=True)
        auto_unclaim: 0,          // models.IntegerField(default=0, blank=True, null=True)
        bearing: 0,               // models.IntegerField(default=-3, blank=True, null=True)
        bearing_desc: "",         // models.TextField(default="", blank=True, null=True)

        "history": Array [
            {
                "end_dt": "",
                "end_lat": 0,
                "end_lon": 0,
                "hist_num": 0,
                "id": 0,
                "message": "",
                "ribbon": 0,
                "start_dt": "",
                "start_lat": 0,
                "start_lon": 0,
                "user_id": 0,
                "username": "",
            }
            ],
    },

    default_ribbon_search: {
        id: 0,
        creator_username: "",
        create_date: {},
        start_address: "",        // models.TextField(blank=True, null=True)
        end_address: "",          // models.TextField(blank=True, default="")
        event_name: "",           // models.TextField(default="", blank=True, null=True)
        image: "",                // models.TextField(blank=True, null=True)
        status: 0,                // models.IntegerField(default=0, blank=True, null=True)
        mode: 0,                  // models.IntegerField(blank=True, null=True)
        name: "",                 // models.TextField(blank=True, null=True)
        carrier_id: "",
        carrier_username: "",
    },

    default_leaps: [
        {
            "end_dt": "",
            "end_lat": 0,
            "end_lon": 0,
            "hist_num": 0,
            "id": 0,
            "message": "",
            "ribbon": 0,
            "image": "",
            "name": "",
            "delivered": 0,
            "start_dt": "",
            "start_lat": 0,
            "start_lon": 0,
            "user_id": 0,
            "username": "",
        },
    ],

    default_claim_list: [
        {
            curstep_num: 0,
            curstep_coord_idx: 0,
            curr_lat: 0,
            curr_lon: 0,
            mode: 0,
            id: 0,
            tot_ribbon_steps: 0,
        },
    ],



}

