export const SET_SERVER_INFO_RETRIEVED = 'SET_SERVER_INFO_RETRIEVED';
export const SET_RETRIEVE_RIBBON_TYPES = 'SET_RETRIEVE_RIBBON_TYPES';
export const SET_RETRIEVE_ADMIN_EVENTS = 'SET_RETRIEVE_ADMIN_EVENTS';
export const SET_RETRIEVE_LOCAL_EVENTS = 'SET_RETRIEVE_LOCAL_EVENTS';
export const SET_RETRIEVE_AUDIO_EVENTS = 'SET_RETRIEVE_AUDIO_EVENTS';
export const SET_RETRIEVE_CLIENT_PARMS = 'SET_RETRIEVE_CLIENT_PARMS';
export const SET_RETRIEVE_SERVER_PARMS = 'SET_RETRIEVE_SERVER_PARMS';
export const SET_RETRIEVE_USER_PROFILE = 'SET_RETRIEVE_USER_PROFILE';
export const SET_SEND_HEARTBEAT        = 'SET_SEND_HEARTBEAT';
export const SET_CURR_RIBBON_ID = 'SET_CURR_RIBBON_ID';
export const SET_LOCAL_EVENTS_LOCATION = 'SET_LOCAL_EVENTS_LOCATION';
export const SET_AUDIO_EVENTS_LOCATION = 'SET_AUDIO_EVENTS_LOCATION';
export const SET_REFRESH_MAP = 'SET_REFRESH_MAP';
export const SET_PANNED_MAP = 'SET_PANNED_MAP';
export const SET_PANNED_COORDS = 'SET_PANNED_COORDS';

export const setServerInfoRetrieved = boolVal => (
    {
        type: SET_SERVER_INFO_RETRIEVED,
        payload: boolVal,
    }
);

export const setRetrieveRibbonTypes = boolVal => (
    {
        type: SET_RETRIEVE_RIBBON_TYPES,
        payload: boolVal,
    }
);
export const setRetrieveAdminEvents = boolVal => (
    {
        type: SET_RETRIEVE_ADMIN_EVENTS,
        payload: boolVal,
    }
);
export const setRetrieveLocalEvents = boolVal => (
    {
        type: SET_RETRIEVE_LOCAL_EVENTS,
        payload: boolVal,
    }
);
export const setRetrieveAudioEvents = boolVal => (
    {
        type: SET_RETRIEVE_AUDIO_EVENTS,
        payload: boolVal,
    }
);
export const setRetrieveClientParms = boolVal => (
    {
        type: SET_RETRIEVE_CLIENT_PARMS,
        payload: boolVal,
    }
);
export const setRetrieveServerParms = boolVal => (
    {
        type: SET_RETRIEVE_SERVER_PARMS,
        payload: boolVal,
    }
);
export const setRetrieveUserProfile = boolVal => (
    {
        type: SET_RETRIEVE_USER_PROFILE,
        payload: boolVal,
    }
);
export const setSendHeartbeat = boolVal => (
    {
        type: SET_SEND_HEARTBEAT,
        payload: boolVal,
    }
);
export const setCurrRibbonId = id => (
    {
        type: SET_CURR_RIBBON_ID,
        payload: id,
    }
);
export const setLocalEventsLocation= location => (
    {
        type: SET_LOCAL_EVENTS_LOCATION,
        payload: location,
    }
);
export const setAudioEventsLocation= location => (
    {
        type: SET_AUDIO_EVENTS_LOCATION,
        payload: location,
    }
);
export const setRefreshMap = boolVal => (
    {
        type: SET_REFRESH_MAP,
        payload: boolVal,
    }
);
export const setPannedMap = boolVal => (
    {
        type: SET_PANNED_MAP,
        payload: boolVal,
    }
);
export const setPannedCoords = coords => (
    {
        type: SET_PANNED_COORDS,
        payload: coords,
    }
);


