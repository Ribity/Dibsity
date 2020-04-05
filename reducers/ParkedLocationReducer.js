import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = null;

let parkedLocationReducer;
export default parkedLocationReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'UPDATE_PARKED_LOCATION':
            // console.log(action.payload);
            if (action.payload === null) {
                return {}
            }
            console.log("UpdateParkedLocation: ", action.payload);
            return action.payload;

        default:
            return state
    }
};
