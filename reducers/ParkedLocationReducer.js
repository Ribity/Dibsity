import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_location;

let parkedLocationReducer;
export default parkedLocationReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'UPDATE_PARKED_LOCATION':
            // console.log(action.payload);
            if (action.payload === null) {
                return {}
            }

            return action.payload;

        default:
            return state
    }
};
