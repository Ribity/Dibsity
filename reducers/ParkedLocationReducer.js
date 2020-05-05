import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = 0;

let parkedLocationReducer;
export default parkedLocationReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'UPDATE_PARKED_LOCATION':
            if (action.payload === null) {
                return {}
            }
            // console.log("UpdateParkedLocation: ", action.payload);
            return action.payload;

        default:
            return state
    }
};
