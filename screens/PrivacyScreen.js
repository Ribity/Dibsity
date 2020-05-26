import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from "react-navigation";

import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";

import {ScreenTitle} from "../components/screenTitle";

export default class PrivacyScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'PrivacyScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Privacy"} androidMoveLeft={20}/>,
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

                            <Text style={styles.privacyText}>
                                Dibsity values preserves your total privacy.
                            </Text>
                                <Text style={styles.privacyText}>
                                    There is no sign-up or login-in.
                                </Text>
                            <Text style={styles.privacyText}>
                                Dibsity does not collect or sell your personal data.
                            </Text>

                            <Text style={styles.privacyText}>
                                We will never ask for your EMail address or phone number.
                                We provide Dibsity as a hobby.
                            </Text>

                            <Text style={styles.privacyText}>
                                We do not know who you are. When you download the the app, we are given
                                an arbitrary device-Id for your device.
                                We use your device-Id to save and reference your data in the
                                cloud database. The privacy we give, however, prevents us from persisting/preserving
                                your data when you use a different device or if you delete the Dibsity app and
                                download again.  This was a tough decision for us,
                                but we lean towards providing privacy.
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

    privacyText: {
        color: 'green',

        fontSize: 20,
        lineHeight: 22,

        fontWeight: "bold",
        paddingTop: 15
    },

});