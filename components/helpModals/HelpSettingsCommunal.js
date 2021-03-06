import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpSettingsCommunal = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpSettingsCommunal', 'HelpSettingsCommunal');
		return (<KeyboardAwareScrollView
			resetScrollToCoords={{x:0, y:0}}
		>
                <Text  style={helpStyles.helpText}>
					Communal IDs are shared between users that want to exclusively inform each other
					of their departure times from a parking space.  This prevents users that are
					NOT part of their communal from being notified of available parking spots.
                    {"\n"}
                    {"\n"}
					You may be a member of up to five Communals. Share your Communal IDs privately.
                    {"\n"}
                    {"\n"}
					You may wish to change each specific Communal ID periodically in an attempt to
					keep it more private. Be sure to share it with your other communal members.
					For instance, your apartment building's Communal ID might
					change the 1st day of each month via an EMail or other communication that
					goes out to everyone in the apartment building (in the communal).
					Or maybe your apartment building will have two
					'rolling' Communal IDs, and the 1st one changes the first of each odd month, and the 2nd
					one changes the 1st of each even month.
					Therefore residents have 30 days to update their Dibsity app with the apartment's set of Communal IDs.
                    {"\n"}
                    {"\n"}
					If you do not have any Communal IDs listed, or you turn OFF 'Post your departures privately
					to your Communals', each of your departures will post publicly for ALL Dibsity users
					to view and act upon.
                </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
};
