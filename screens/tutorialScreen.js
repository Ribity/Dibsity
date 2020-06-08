import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from "react-navigation";

import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";

import {ScreenTitle} from "../components/screenTitle";

export default class TutorialScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'TutorialScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Tutorial"} androidMoveLeft={20}/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            return (
            <SafeAreaView style={myStyles.container}>
                <View style={{flex: 1, alignItems: 'center'}}>

                    <View style={{padding: 20}}>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}>

                            <View>
                                <Text  style={{fontSize: 18}}>

                                    Dibsity users are thoughtful and proactive. A little effort when you park
                                    and again when you plan to depart provides the details required for other
                                    users as they are searching for an available parking spot.

                                    {"\n"}
                                    {"\n"}

                                    Finding an available parking spot using the app is easy.  The Dibsity map
                                    displays green icons representing other users soon to depart their parking space.
                                    The numeric value in the icon represents the
                                    approx number of minutes the other user has specified before departing
                                    and making the parking space available.
                                    Tap a green icon to display the description of the vehicle currently parked.
                                    Drive towards the spot. Once your vehicle is in position,
                                    tap the green icon to reserve.  Once reserved for you, your icon will turn silver.  The icon will turn
                                    yellow for all other Dibsity users indicating the space is currently reserved and
                                    unavailable to others.  You now have dibs for that spot. A thoughtful Dibsity user
                                    should be along shortly to depart the space.

                                    {"\n"}
                                    {"\n"}

                                    Dibsity users pay it forward.
                                    Once parked and before departing your vehicle, tap 'Save Parked Location' and
                                    'Submit'.  You have saved the location of your vehicle.  You are now ready to
                                    help others when you plan to depart.

                                    {"\n"}
                                    {"\n"}

                                    Minutes before you depart, two quick clicks on the app and your departure
                                    is posted to other Dibsity users.
                                    Once you post, a count-down icon displays on other users' maps at the exact
                                    location of your previously saved parked location. Other users now know your
                                    vehicle will soon depart.

                                    {"\n"}
                                    {"\n"}

                                    Upon downloading the app, please enter a brief description of your vehicle. This will
                                    help other users confirm they have located the correct vehicle when you're departing.
                                    You cannot post your departure to others until you enter a description of your vehicle.

                                    {"\n"}
                                    {"\n"}

                                    What is 'Communal Crowd Sourced parking'?  Communal = Shared by all members of a
                                    community. Once you activate 'Post your departures privately to your Communals',
                                    only the users that know/share your private
                                    communal codes will see that you are departing your parking spot.

                                    {"\n"}
                                    {"\n"}
                                        <Text  style={{fontWeight: 'bold'}}>
                                        Communal example:
                                            {"\n"}
                                        </Text>
                                    You live in an NYC aparment building with public parking surrounding
                                    your building. However, those public spaces are overwhelmingly used by people that are
                                    not part of your apartment communitity. Your apartment community decides to share a
                                    Dibsity Communal Code that each of you enter into your Comunnal Id list.
                                    Over time, with successful communal crowd-sourcing from all residents giving and claiming
                                    dibs, the parking around your aparment building will become only people that are
                                    Dibsity crowd sourcing in your communal group.
                                </Text>

                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

};
