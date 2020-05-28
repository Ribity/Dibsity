import React from 'react';
import {View} from 'react-native';

import myfuncs from '../services/myFuncs';
import helpStyles from "./helpModals/helpStyles";
import {HelpMap} from './helpModals/HelpMap';
import {HelpMyVehicle} from './helpModals/HelpMyVehicle';
import {HelpSettings} from './helpModals/HelpSettings';
import {HelpSettingsDefaultMap} from './helpModals/HelpSettingsDefaultMap';
import {HelpSettingsCommunal} from './helpModals/HelpSettingsCommunal';
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
            {screen === "SettingsDefaultMap" &&
            <HelpSettingsDefaultMap/>
            }
            {screen === "SettingsCommunal" &&
            <HelpSettingsCommunal/>
            }
        </View>
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};
