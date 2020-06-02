import MyDefines from '../constants/MyDefines';
import {
        SET_REFRESH_MAP,
        SET_PANNED_MAP,
        SET_PANNED_COORDS,
        SET_RECALCULATE_SPACES} from '../actions/TasksActions';

const INITIAL_STATE = MyDefines.default_tasks;

let tasksReducer;
export default tasksReducer = (state = INITIAL_STATE, action) => {

    if (action.payload === null) {
        return state;
    }

    let temp_state = state;
    switch (action.type) {
        case SET_REFRESH_MAP:
            temp_state.refresh_map = action.payload;
            return temp_state;
        case SET_PANNED_MAP:
            temp_state.panned_map = action.payload;
            return temp_state;
        case SET_PANNED_COORDS:
            temp_state.panned_coords = action.payload;
            return temp_state;
        case SET_RECALCULATE_SPACES:
            temp_state.recalculate_spaces = action.payload;
            return temp_state;
        default:
            return state
    }
};
