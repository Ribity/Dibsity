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
							<Text  style={{fontSize: 16}}>
								Dibsity = Dibs for parking.
                                {"\n"}
                                {"\n"}
								Playing with software is a hobby for me.
								I'm pleased to add Dibsity as my third mobile app to the App Stores.
                                {"\n"}
                                {"\n"}
								Regarding dibs, I hope you give as well as you take. Also, please spread the
								word, especially amongst a specific communal.  The more people in your communal,
								the more likely you'll find a parking space, and the more Karma you can spread
								by announcing your departure.
                                {"\n"}
                                {"\n"}
                                I hope communal parking via Dibsity helps bring your community together.
                                {"\n"}
                                {"\n"}
                                If you have any issues, please reach out me.
								I'm Mark in Raleigh, NC. I do this as a hobby, so please have patience.
								{"\n"}
								{"\n"}
								EMail:  mark@dibsity.com
								{"\n"}
								{"\n"}
								I sincerely hope you enjoy Dibsity.
                                {"\n"}
                                {"\n"}
								Regards - Mark
                                {"\n"}
                                {"\n"}
                                P.S., if you're interested to see all of my mobile apps, see the very bottom of dibsity.com
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