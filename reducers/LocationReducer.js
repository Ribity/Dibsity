import * as Sentry from "sentry-expo";
import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_location;

let locationReducer;
export default locationReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'UPDATE_LOCATION':
            // console.log(action.payload);
            if (action.payload === null) {
                return {}
            }

            // Sentry.setExtraContext({
            //     "coords": action.payload.coords,
            // });
            Sentry.configureScope(function (scope) {
                scope.setExtra({
                    "coords": action.payload.coords,
                });
            });

            // return Object.assign({}, state, action.payload);
            return action.payload;

        default:
            return state
    }
};
