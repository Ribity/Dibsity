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
                                <Text style={styles.tutorialText}>
                                    With the help of other Dibsity users, this app may point you directly to a spot that is
                                    soon-to-become available.
                                </Text>

                                <Text style={styles.tutorialText}>
                                    Dibsity users are thoughtful and proactive. A little effort when you park
                                    and again when you plan to depart provides the details required for other
                                    users as they are searching for an available parking spot.
                                </Text>

                                <Text style={styles.tutorialText}>
                                    Finding an available parking spot using the app is easy.  The Dibsity map
                                    displays green icons representing other users soon to depart their parking space.
                                    The numeric value in the icon represents the
                                    approx number of minutes the other user has specified before departing
                                    and making the the parking space available.
                                    Tap a green icon to display the description of the vehicle which you'll be
                                    looking for.
                                    Drive towards the spot.
                                    Once within 25 meters of your desired parking spot, you may tap the green icon
                                    to reserve.  Once reserved for you, your icon will turn silver.  The icon will turn
                                    yellow for all other Dibsity users indicating the space is currently reserved and
                                    unavailable to others.  You now have dibs for that spot. A thoughtful Dibsity user
                                    should be along shortly to depart the space.
                                </Text>

                                <Text style={styles.tutorialText}>
                                    Thoughtful Dibsity users pay it forward.
                                    Once parked and before departing your vehicle, tap 'Save Parked Location' and
                                    'Submit'.  You have saved the location of your vehicle.  You are now ready to
                                    help others when you plan to depart.
                                </Text>

                                <Text style={styles.tutorialText}>

                                </Text>

                                <Text style={styles.tutorialText}>

                                </Text>

                                <Text style={styles.tutorialText}>

                                </Text>

                                <Text style={styles.tutorialText}>

                                </Text>

                                <Text style={styles.tutorialText}>

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
const styles = StyleSheet.create({

    tutorialText: {
        color: 'green',

        fontSize: 20,
        lineHeight: 22,

        fontWeight: "bold",
        paddingTop: 15
    },

});