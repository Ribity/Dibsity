import { combineReducers } from 'redux'
import settingsReducer from './SettingsReducer'
import vehicleReducer from './VehicleReducer'
import fakeLocationsReducer from './FakeLocationsReducer'
import locationReducer from './LocationReducer'
import tasksReducer from './TasksReducer'

export const rootReducer = combineReducers({
    settings: settingsReducer,
    vehicle: vehicleReducer,

    location: locationReducer,
    tasks: tasksReducer,
    fakeLocations: fakeLocationsReducer,

});