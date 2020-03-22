export const UPDATE_VEHICLE = 'UPDATE_VEHICLE';

export const updateVehicle = vehicle => (
    {
        type: UPDATE_VEHICLE,
        payload: vehicle,
    }
);