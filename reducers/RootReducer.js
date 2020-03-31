import { combineReducers } from 'redux'
import settingsReducer from './SettingsReducer'
import vehicleReducer from './VehicleReducer'
import fakeLocationsReducer from './FakeLocationsReducer'
import locationReducer from './LocationReducer'
import parkedLocationReducer from './ParkedLocationReducer'
import tasksReducer from './TasksReducer'

export const rootReducer = combineReducers({
    settings: settingsReducer,
    vehicle: vehicleReducer,

    location: locationReducer,
    parkedLocation: parkedLocationReducer,
    tasks: tasksReducer,
    fakeLocations: fakeLocationsReducer,

});