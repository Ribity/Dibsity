import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpSettings = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpSettings', 'HelpSettings');
		return (<KeyboardAwareScrollView
			resetScrollToCoords={{x:0, y:0}}
		>

			<Text  style={helpStyles.helpText}>
				When you modify a setting on this screen, you do not have to 'Save' it. It's automatically saved and
				persists.
				{"\n"}
				{"\n"}
                <Text  style={{fontWeight: 'bold'}}>
                    Keep Screen Awake:
                </Text>
                <Text> </Text>
				Turning ON 'Keep Screen Awake' will override your device settings
				and NOT go to sleep while the Dibsity app is in the foreground on your screen.
				We turn this ON by default
				{"\n"}
				{"\n"}
                <Text  style={{fontWeight: 'bold'}}>
                    Confirmation Pop-ups:
                </Text>
                <Text> </Text>
				You may turn off confirmation pop-ups. Once you become an experienced user, you'll likely
				turn this off.  'Off' eliminates several informational pop-ups, and therefore requires less
				user interaction to reserve, save and post parking spots.
				{"\n"}
				{"\n"}
                <Text  style={{fontWeight: 'bold'}}>
                    Dynamic Icons Sizes:
                </Text>
                <Text> </Text>
				By default, Icon sizes on the map are dynamic in size. As the scheduled departure for a
				parking spot counts down, the icon becomes bigger.  One minute remaining presents the
				largest icon. Turning this off, sets all icons to a fixed, equal size.
				{"\n"}
				{"\n"}
                <Text  style={{fontWeight: 'bold'}}>
                    Large Icon Sizes:
                </Text>
                <Text> </Text>
				Larger icons are displayed by default. You may turn this off to display smaller icons
				on the map.
                {"\n"}
                {"\n"}
                <Text  style={{fontWeight: 'bold'}}>
                    Communal Ids:
                </Text>
				<Text> </Text>
				are used to post and view parkings spots that are specific to your private Communal groups.
                {"\n"}
                {"\n"}

				<Text  style={{fontWeight: 'bold'}}>
                    Communal example,
                </Text>
                <Text> </Text>

                You live in an NYC apartment building with public parking surrounding
                your building. However, those public spaces are overwhelmingly used by people that are
                not part of your apartment communitity. Your apartment community decides to create and share a
                Dibsity Communal Code that each of you enter into your Communal Id list.
                Over time, with successful communal crowd-sourcing from all residents giving and claiming
                dibs, the parking around your apartment building will become only people that are
                Dibsity crowd sourcing in your communal group.

                {"\n"}
                {"\n"}
                <Text  style={{fontWeight: 'bold'}}>
                    Map Settings:
                </Text>
                <Text> </Text>
				This will take you to a new screen where you may specify specific map settings.

			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
};
