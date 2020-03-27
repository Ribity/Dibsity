import MyDefines from '../constants/MyDefines';
import {SET_SERVER_INFO_RETRIEVED,
        SET_RETRIEVE_RIBBON_TYPES,
        SET_RETRIEVE_ADMIN_EVENTS,
        SET_RETRIEVE_LOCAL_EVENTS,
        SET_RETRIEVE_AUDIO_EVENTS,
        SET_RETRIEVE_CLIENT_PARMS,
        SET_RETRIEVE_SERVER_PARMS,
        SET_CURR_RIBBON_ID,
        SET_LOCAL_EVENTS_LOCATION,
        SET_AUDIO_EVENTS_LOCATION,
        SET_RETRIEVE_USER_PROFILE,
        SET_SEND_HEARTBEAT,
        SET_REFRESH_MAP,
        SET_PANNED_MAP,
        SET_PANNED_COORDS} from '../actions/TasksActions';

import myFuncs from "../services/myFuncs";

const INITIAL_STATE = MyDefines.default_tasks;

let tasksReducer;
export default tasksReducer = (state = INITIAL_STATE, action) => {

    if (action.payload === null) {
        return state;
    }

    let temp_state = state;
    switch (action.type) {
        case SET_SERVER_INFO_RETRIEVED:
            temp_state.server_info_retrieved = action.payload;
            return temp_state;
        case SET_RETRIEVE_RIBBON_TYPES:
            temp_state.retrieve_ribbon_types = action.payload;
            if (action.payload === true)
                myFuncs.tasksTrigger();
            return temp_state;
        case SET_RETRIEVE_ADMIN_EVENTS:
            temp_state.retrieve_admin_events = action.payload;
            if (action.payload === true)
                myFuncs.tasksTrigger();
            return temp_state;
        case SET_RETRIEVE_LOCAL_EVENTS:
            temp_state.retrieve_local_events = action.payload;
            if (action.payload === true)
                myFuncs.tasksTrigger();
            return temp_state;
        case SET_RETRIEVE_AUDIO_EVENTS:
            temp_state.retrieve_audio_events = action.payload;
            if (action.payload === true)
                myFuncs.tasksTrigger();
            return temp_state;
        case SET_RETRIEVE_CLIENT_PARMS:
            temp_state.retrieve_client_parms = action.payload;
            if (action.payload === true)
                myFuncs.tasksTrigger();
            return temp_state;
        case SET_RETRIEVE_SERVER_PARMS:
            temp_state.retrieve_server_parms = action.payload;
            if (action.payload === true)
                myFuncs.tasksTrigger();
            return temp_state;
        case SET_RETRIEVE_USER_PROFILE:
            temp_state.retrieve_user_profile = action.payload;
            if (action.payload === true)
                myFuncs.tasksTrigger();
            return temp_state;
        case SET_SEND_HEARTBEAT:
            temp_state.send_heartbeat = action.payload;
            if (action.payload === true)
                myFuncs.tasksTrigger();
            return temp_state;
        case SET_CURR_RIBBON_ID:    // I can't remember why I put this in this reducer? (Not that it matters)
            temp_state.curr_ribbon_id = action.payload;
            return temp_state;
        case SET_LOCAL_EVENTS_LOCATION:
            temp_state.localEventsLocation = action.payload;
            return temp_state;
        case SET_AUDIO_EVENTS_LOCATION:
            temp_state.localEventsLocation = action.payload;
            return temp_state;
        case SET_REFRESH_MAP:
            temp_state.refresh_map = action.payload;
            return temp_state;
        case SET_PANNED_MAP:
            temp_state.panned_map = action.payload;
            return temp_state;
        case SET_PANNED_COORDS:
            temp_state.panned_coords = action.payload;
            return temp_state;
        default:
            return state
    }
};
