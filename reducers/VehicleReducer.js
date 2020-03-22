import {UPDATE_VEHICLE} from '../actions/vehicleActions';
import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_vehicle;

let vehicleReducer;
export default vehicleReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case UPDATE_VEHICLE:
            if (action.payload === null) {
                return state;
            }
            return action.payload;

        default:
            return state
    }
};
