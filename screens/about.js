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
							Welcome to Kibity.
							{"\n"}
							{"\n"}
                            Kibity was originally developed as the 'Magical Adventures' skill on the Alexa Echo device.
							The participation and feedback from the Alexa users led to the development of the Kibity Mobile Application
							for iOS and Android devices.
							The phone application allows us to display the words as they are spoken.
                            We are pleased Kibity has advanced to become a tool to engage kids while learning to read.
                            {"\n"}
                            {"\n"}
                            As we receive new stories we will add them to the library of stories as time permits. We will also
							add public domain stories periodically.
							{"\n"}
							{"\n"}
							We love when users send us their own stories they have written to be published on Kibity.
							You simply write the story with regular characters' names as you normally would write a story.
							Once you email your story to us we will modify it into the correct format.
							The Kibity logic will then insert other users' customized parameters.
							Your story will be presented to other users with their own specified characters' names.
							Your story may be as long or as short as you desire.
							Please mail your stories to Stories@kibity.com
							{"\n"}
							{"\n"}
							Ribity LLC was formed to protect us from liabilities. We hope to never do anything
							that would trigger a liability, but we were advised to create Ribity LLC just in case.
                            {"\n"}
                            {"\n"}
                            We value your privacy. We do not collect any data from your device. We are not
                            interested in your data. We are just a couple of normal people with a hobby.
                            We will never ask for you EMail or any other data.
                            Please enjoy the stories with no worries of your data being breached. We do not have servers
                            or anything to be hacked. Your data is safe, as it resides only on your device
							{"\n"}
							{"\n"}
							Also, to protect your privacy we never collect data and we removed all third-party analytics.
							Long story short: This means we do not have the means to collect application crashes
							or similar programming issues.
							This tremendously reduces our debugging capabilities.
							It was a tough call to remove these tools, but we truly value
							your privacy.
							If you have an issue please send an EMail explaining the details.
							{"\n"}
							{"\n"}
							EMail:  Stories@kibity.com
							{"\n"}
							{"\n"}
							We sincerely hope you enjoy Kibity.

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
        color: 'mediumpurple',

        fontSize: 20,
        lineHeight: 22,

        // fontWeight: "bold",
        paddingTop: 15
    },

});