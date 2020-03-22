import React from 'react';
import {
    View,
    ScrollView, StyleSheet,
} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Layout, Text} from "@ui-kitten/components";

import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";

import {ScreenTitle} from "../components/screenTitle";
import {ThemeButton} from "../components/themeButton";

export default class PrivacyScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'PrivacyScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Privacy"} androidMoveLeft={20}/>,
                headerRight: () => <ThemeButton/>,
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
                <Layout style={{flex: 1, alignItems: 'center'}}>

                    <View style={{padding: 20}}>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}>

                            <View>
                            <Text style={styles.privacyText}>
                                Dibsity does not transfer any data from your device. We do not
                                collect, share or sell your data.
                            </Text>
                            <Text style={styles.privacyText}>
                                You have total privacy.
                            </Text>
                            <Text style={styles.privacyText}>
                               We do not upload or transfer the profile data
                                you enter. It is stored only on your local, private device.
                            </Text>
                            <Text style={styles.privacyText}>
                                We will never ask for your EMail address.
                            </Text>

                            <Text style={styles.privacyText}>
                                We do not know who you are, where you are, or what you're listening to.
                            </Text>
                            </View>
                        </ScrollView>
                    </View>
                </Layout>
            </SafeAreaView>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

};
const styles = StyleSheet.create({

    privacyText: {
        color: 'mediumpurple',

        fontSize: 20,
        lineHeight: 22,

        fontWeight: "bold",
        paddingTop: 15
    },

});