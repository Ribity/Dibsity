import { combineReducers } from 'redux'
import settingsReducer from './SettingsReducer'
import vehicleReducer from './VehicleReducer'


export const rootReducer = combineReducers({
    settings: settingsReducer,
    vehicle: vehicleReducer,

});