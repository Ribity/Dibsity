import React from 'react';
import {
    View,
    ScrollView, StyleSheet, Text
} from 'react-native';
import {SafeAreaView} from "react-navigation";

import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";

import {ScreenTitle} from "../components/screenTitle";

export default class AboutScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AboutScreen');
            return {
                headerTitle: () => <ScreenTitle title={"About"}/>,
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

            <SafeAreaView style={myStyles.container}>
                <View style={{flex: 1, alignItems: 'center'}}>

					<View style={{padding: 20}}>

						<ScrollView
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: 'space-between'
						}}>

						<View>

						<Text style={styles.aboutText}>
							Welcome to Dibsity.
							{"\n"}
							{"\n"}
                            Dibsity = Inclusive crowd-sourced parking.
                            {"\n"}
                            {"\n"}
							EMail:  Parking@dibsity.com
							{"\n"}
							{"\n"}
							We sincerely hope you enjoy Dibsity.

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

    aboutText: {
        color: 'green',

        fontSize: 20,
        lineHeight: 22,

        // fontWeight: "bold",
        paddingTop: 15
    },

});