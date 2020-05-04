import React from 'react';
import {
    Text,
    View,
} from 'react-native';

import myfuncs from "../services/myFuncs";
import {ScreenTitle} from "../components/screenTitle";

//***********************************************************************************
// The idea here is to NOT perform the reverseGeo often because each one cost money.
//***********************************************************************************

export default class SettingsDefaultMapScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'SettingsDefaultMapScreen');

            return {
                headerTitle: () => <ScreenTitle title={"Map Settings"} privacy={() => navigation.navigate("PrivacySettings")}/>,
            };

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    constructor(props) {
        super(props);
    }



    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);

            return (
                <View>
                    <Text> Map Settings Screen </Text>
                </View>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }

};
