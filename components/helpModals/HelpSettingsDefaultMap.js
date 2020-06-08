import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpSettingsDefaultMap = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpSettingsDefaultMap', 'HelpSettingsDefaultMap');
		return (<KeyboardAwareScrollView
			resetScrollToCoords={{x:0, y:0}}
		>

                <Text style={helpStyles.helpText}>
                    These fields allow you to customize how your main map is displayed.
                    {"\n"}
                    {"\n"}
                    <Text  style={{fontWeight: 'bold'}}>
                        Map Snap-Back:
                    </Text>
                    <Text> </Text>

                    When you pan/move the map, the map will remain at your newly specified
                    location for xx number of seconds.  After xx number of seconds, the map will snap back
                    to your current GPS location.
                    {"\n"}
                    {"\n"}
                    <Text  style={{fontWeight: 'bold'}}>
                        Map Zoom-Out:
                    </Text>
                    <Text> </Text>
                    This defines the zoom level for the map upon initialization.  A value of 1
                    specifies the map will zoom in so your screen shows about 100 feet or so. ie, very closely zoomed.
                    A value of 500 specifies to zoom WAY out, so you can see your entire continent on the map.
                    If you pinch the map (in or out) your map will remain your newly pinched size.
                    {"\n"}
                    {"\n"}
                    <Text  style={{fontWeight: 'bold'}}>
                        Tracker Icon Size:
                    </Text>
                    <Text> </Text>
                    This specifies the size of your little frog that indicates your position on
                    the map.  A value of zero totally removes the frog icon from the map. A value of 1 makes the frog icon
                    tiny.  A value of 5 and the frog icon is huge.
                    {"\n"}
                    {"\n"}
                    <Text  style={{fontWeight: 'bold'}}>
                        Tracker Icon:
                    </Text>
                    <Text> </Text>
                    You have several options to specify as your frog icon which indicates your
                    GPS position on the map. Try out each one to see which frog you wish to be.
                    {"\n"}
                    {"\n"}
                    <Text  style={{fontWeight: 'bold'}}>
                    Map Orientation:
                	</Text>
                    <Text> </Text>
                    A value of 1 indicates the map will always be oriented so NORTH is straight up.
                    With a value of 1, your frog icon turns as you change direction.
                    A value of 2 indicates your little frog icon will always point and move straight up.
                    With a vlue of 2, your map turns as you change direction.
                </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
};
