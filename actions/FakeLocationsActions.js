export const UPDATE_FAKE_LOCATIONS = 'UPDATE_FAKE_LOCATIONS';

export const updateFakeLocations = locations => (
    {
        type: 'UPDATE_FAKE_LOCATIONS',
        payload: locations,
    }
);