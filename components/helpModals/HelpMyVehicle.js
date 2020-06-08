import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpMyVehicle = ({} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpMyVehicle', 'HelpMyVehicle');
		return (<KeyboardAwareScrollView
			// style={helpStyles.container}
			resetScrollToCoords={{x:0, y:0}}
			// contentContainerStyle={helpStyles.container}
		>

			<Text  style={helpStyles.helpText}>
				Please specify any specifics that will assist other users when attempting to find
				your vehcile.
				{"\n"}
				{"\n"}
				For example, '2015 White Prius with tinted windows and a 13.1 sticker'
				{"\n"}
				{"\n"}
				Also, the first two digits of your license plate will help other users confirm
				your vehicle.

			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
}

