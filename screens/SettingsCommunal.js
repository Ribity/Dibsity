import React from 'react';
import {
    Text,
    View,
    Alert,
    TextInput,
    Keyboard,
    Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';

import { connect } from 'react-redux';

import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";
import {MyHelpIcon} from '../components/MyHelpIcon';
import {MyHelpModal} from "../components/MyHelpModal";
import {MyButton} from "../components/MyButton";
import {bindActionCreators} from "redux";
import {ScreenTitle} from "../components/screenTitle";
import {updateSettings} from "../actions/settingsActions";

const {height, width} = Dimensions.get('window');

//***********************************************************************************
// The idea here is to NOT perform the reverseGeo often because each one cost money.
//***********************************************************************************

class SettingsCommunalScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'SettingsCommunal');

            return {
                headerTitle: () => <ScreenTitle title={"Communal Ids"} privacy={() => navigation.navigate("PrivacySettings")}/>,
            };

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            settings: {...this.props.settings},
        };
    }
    onSubmitPress = async () => {
        let resetMap = false;

        try {
            myfuncs.myBreadCrumbs('onSubmitPress', this.props.navigation.state.routeName);
            Keyboard.dismiss();

            let new_settings = {...this.state.settings};

            let bOneDefined = false;
            for (let i = 0; i < 5; i++) {
                if (new_settings.communal_id[i].length > 0) {
                    bOneDefined = true;
                    break;
                }
            }

            if (bOneDefined === false && this.props.settings.postCommunal === true) {
                new_settings.postCommunal = false;
                Alert.alert("Your Communal Id list is empty. Your departures will not be communal-only. " +
                    "Your departures will be posted to ALL Dibsity users",
                    "When arriving, you'll see ONLY soon-to-be-available 'public' spaces");
            }
            if (bOneDefined === true && this.props.settings.postCommunal === false) {
                new_settings.postCommunal = true;
                Alert.alert("Your departures will be posted ONLY to users that list at least one of your private Communal Ids. " +
                    "Your departures will NOT be posted to everyone", "When arriving, " +
                    "you will see soon-to-be-available 'public' spaces plus soon-to-be-available spaces of your fellow communal users");
            }
            await this.props.updateSettings( {...this.props.settings, ...new_settings} );
            this.updateStorage();
            this.refs.toast.show("Updated Successfully", 2000);

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);

            return (<KeyboardAwareScrollView
                    style={myStyles.firstContainer}
                    resetScrollToCoords={{x:0, y:0}}
                    onSubmitEditing={this.onSubmitPress}
                    blurOnSubmit={false}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={myStyles.container}
                >
                    <Text style={myStyles.infoTextTopMargin}>Each 'Communal ID' you enter will be used to
                        identify your communities. Any Dibsity user that also has one of your IDs listed will
                        see your posted departures when you post your departure</Text>


                    <View style={{paddingTop: 15}}/>

                    {this.state.settings.communal_id.map((communal, index) => (
                        <View key={index}>
                            <View style={{paddingTop: 5}}/>
                            <TextInput style={myStyles.iField}
                                       value={this.state.settings.communal_id[index]}
                                       onChangeText={(text) => this.updateState(index, text)}
                                       clearButtonMode='always'
                                       placeholder={"Id #" + (index+1).toString()}
                                       maxLength={25}
                                       returnKeyType="done"
                                       placeholderTextColor={"grey"}
                            />
                        </View>
                    ))}

                    <View style={{paddingTop: 5}}/>
                    <MyButton title={'Submit'} onPress={this.onSubmitPress}/>

                    <Toast
                        ref="toast"
                        style={{backgroundColor:'lightgreen',borderRadius: 20,padding: 10}}
                        position='center'
                        positionValue={0}
                        fadeOutDuration={2000}
                        opacity={.8}
                        textStyle={{color:'black',fontSize:21}}
                    />

                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"SettingsCommunal"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>
                    </KeyboardAwareScrollView>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    onHelpPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: true});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onHelpExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpExitPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: false});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    updateState = (index, text) => {
        try {
            for (let i=0; i<text.length; i++) {
                if (text[i] === ' ') {
                    Alert.alert("Communal Ids cannot contain spaces");
                    return;
                }
            }
            let new_settings = {...this.state.settings};
            new_settings.communal_id[index] = text;
            this.setState({settings: new_settings});
        } catch (error) {
            console.log(error);
            myfuncs.myRepo(error);
        }
    };
    updateStorage = () => {
        try {
            myfuncs.myBreadCrumbs('updateStorage', this.props.navigation.state.routeName);
            myfuncs.writeUserDataToLocalStorage("user_settings", this.props.settings);
            // console.log("storage updated NewSettings:", this.props.settings);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
};

const mapStateToProps = (state) => {
    const { settings } = state;
    return { settings }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateSettings,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsCommunalScreen);
