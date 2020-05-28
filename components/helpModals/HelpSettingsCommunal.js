import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpSettingsCommunal = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpSettingsCommunal', 'HelpSettingsCommunal');
		return (<KeyboardAwareScrollView
			// style={helpStyles.container}
			resetScrollToCoords={{x:0, y:0}}
			// contentContainerStyle={helpStyles.container}
		>

			<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Settings: </Text>
				When you modify a setting
				{"\n"}
				{"\n"}
				Turning ON
				{"\n"}
				{"\n"}
				xzzz
				{"\n"}
				{"\n"}
			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
};
