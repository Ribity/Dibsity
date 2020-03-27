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

export default class AboutScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AboutScreen');
            return {
                headerTitle: () => <ScreenTitle title={"About"}/>,
                headerRight: () => <ThemeButton/>,
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
                <Layout style={{flex: 1, alignItems: 'center'}}>

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
				</Layout>
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