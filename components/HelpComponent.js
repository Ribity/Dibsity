import React from 'react';
import {View} from 'react-native';

import myfuncs from '../services/myFuncs';
import helpStyles from "./helpModals/helpStyles";
import {HelpMap} from './helpModals/HelpMap';
import {HelpMyVehicle} from './helpModals/HelpMyVehicle';
import {HelpSettings} from './helpModals/HelpSettings';
export const HelpComponent= ( {screen, parm1} ) => {
    try {
        myfuncs.myBreadCrumbs('HelpComponent', 'HelpComponent');
        return (

        <View style={helpStyles.modalStyle}>

            {screen === "Map" &&
            <HelpMap/>
            }
            {screen === "MyVehicle" &&
            <HelpMyVehicle/>
            }
            {screen === "Settings" &&
            <HelpSettings/>
            }
        </View>
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};
