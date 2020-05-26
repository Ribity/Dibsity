export const SET_REFRESH_MAP = 'SET_REFRESH_MAP';
export const SET_PANNED_MAP = 'SET_PANNED_MAP';
export const SET_PANNED_COORDS = 'SET_PANNED_COORDS';

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


