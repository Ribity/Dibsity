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
				<Text style={helpStyles.helpBold}>Vehicle: </Text>
				Vehicle Help Screen
				{"\n"}
				{"\n"}

			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
}

