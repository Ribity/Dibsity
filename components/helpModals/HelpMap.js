import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpMap = ({} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpMap', 'HelpMap');
		return (<KeyboardAwareScrollView
			// style={helpStyles.container}
			resetScrollToCoords={{x:0, y:0}}
			// contentContainerStyle={helpStyles.container}
		>
				<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Green Numeric Icons </Text>
					indicate parking spots that are scheduled to become available from other users.
					The numbers indicate a count-down of minutes until the vehicle is
					scheduled to depart the spot. Tap the icon to see a description of the car or to
					reserve the parking spot for you.  When you reserve a spot the icon will
					change to silver for you, and yellow for everyone else.
					You must be within 35 meters to mark a spot as reserved

					{"\n"}
					{"\n"}

                    <Text style={helpStyles.helpBold}>Yellow Icons </Text>
                    indicate parking spots that are currently reserved
                    by other users.  In theory, these spots are not available to you

                    {"\n"}
                    {"\n"}

                    <Text style={helpStyles.helpBold}>Silver Icon </Text>
                    indicates the parking spot that you currently have marked as reserved
					for you.  Out of respect to other users, please reserve only one spot at a time

                    {"\n"}
                    {"\n"}

                    <Text style={helpStyles.helpBold}>Green P Icon </Text>
					When you're at the exact location that your car is parked, tap the
					'Save Parked Location' button. The 'P' icon
                    marks your currently saved parking spot. You may drag the icon to move
					your currently marked spot.  When saving your parked location, you may specify
					addtional info that may assist users attempting to locate your spot.  For example,
					'3rd level of parking garage'. Or, 'Compact vehicles only'
                    {"\n"}
                    {"\n"}

					You may specify your preferred map settings via the 'Settings' tab.

                    {"\n"}
                    {"\n"}

                    You will see icons for parking spaces that have been publicly posted, as well as
					icons posted by people that are part of your communals list.

                    {"\n"}
                    {"\n"}


                    {"\n"}
                    {"\n"}


                    {"\n"}
                    {"\n"}




			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
}

