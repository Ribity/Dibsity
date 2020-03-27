import {UPDATE_FAKE_LOCATIONS} from '../actions/FakeLocationsActions';

const INITIAL_STATE = [];

let fakeLocationsReducer;
export default fakeLocationsReducer = (state = INITIAL_STATE, action = {}) => {
    switch(action.type){
        case UPDATE_FAKE_LOCATIONS:
            if (action.payload === null) {
                return state
            }
            return action.payload;

        default:
            return state
    }
}