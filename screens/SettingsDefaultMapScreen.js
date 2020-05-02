import React from 'react';
import {
    Text,
    View,
    Alert,
    TextInput,
    Keyboard,
    Dimensions, TouchableHighlight, Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';

import { connect } from 'react-redux';

import myAx from './../services/myAxios.js'
import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";
import MyTouchableLogo from '../components/MyTouchableLogo';
import MyHelpIcon from '../components/MyHelpIcon';
import MyHelpModal from "../components/MyHelpModal";
import MyButton from "../components/MyButton";
import {bindActionCreators} from "redux";
import {ScreenTitle} from "../components/screenTitle";
// import {setRefreshMap, setPannedMap} from "../actions/TasksActions";

const {height, width} = Dimensions.get('window');

let resetMap = false;
//***********************************************************************************
// The idea here is to NOT perform the reverseGeo often because each one cost money.
//***********************************************************************************

class SettingsDefaultMapScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'SettingsDefaultMapScreen');

            return {
                headerTitle: () => <ScreenTitle title={"Map Settings"} privacy={() => navigation.navigate("PrivacySettings")}/>,
            };

        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            profile: this.props.user.profile,
            submitPressed: false,
            textIsFocused: false,
        };
    }
    onSubmitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onSubmitPress', this.props.navigation.state.routeName);
            Keyboard.dismiss();
            if ((this.state.profile.refocus_seconds < 1) ||
                (this.state.profile.refocus_seconds > 9999)) {
                Alert.alert("Invalid Snap-Back Seconds",
                    "Value must be between 1 and 9999");
                return;
            }
            if ((this.state.profile.zoom_multiplier < 1) ||
                (this.state.profile.zoom_multiplier > 500)) {
                Alert.alert("Invalid Zoom-Out Multiplier",
                    "Value must be between 1 and 500");
                return;
            }

            if ((this.state.profile.map_ribbon_size < 1) ||
                (this.state.profile.map_ribbon_size > 5)) {
                Alert.alert("Invalid Ribbon Size",
                    "Value must be between 1 and 5");
                return;
            }

            if (this.state.profile.map_user_size > 5) {
                Alert.alert("Invalid Tracker Icon Size",
                    "Value must be between 0 and 5");
                return;
            }

            if ((this.state.profile.map_user_icon < 1) ||
                (this.state.profile.map_user_icon > 2)) {
                Alert.alert("Invalid Tracker Icon",
                    "Value must be between 1 and 2");
                return;
            }

            if ((this.state.profile.map_orients_to_users_bearing < 1) ||
                (this.state.profile.map_orients_to_users_bearing > 2)) {
                Alert.alert("Invalid Map Orientation",
                    "Value must be between 1 and 2");
                return;
            }

            if (resetMap) {
                this.props.setRefreshMap(true);
                this.props.setPannedMap(false);
            }

            this.setState( {submitPressed: true});

            this.postTheUpdate(this.state.profile);
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    // resetMap = () => {
    //     console.log("PUT MAP BACK !!!");
    //     this.props.setRefreshMap(false);
    // };
    postTheUpdate = async (new_props) => {
        try {
            myfuncs.myBreadCrumbs('PostTheUpdate', this.props.navigation.state.routeName);
            // if (this.state.submitPressed === true)
            //     return;

            let axiosData = {
                "update_settings": new_props,
            };
            myAx.post("pingserver", axiosData,this.axiosCallbackSuccess, this.axiosCallbackFail);
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    axiosCallbackSuccess = () => {
        try {
            myfuncs.myBreadCrumbs('axiosCallbackSuccess', this.props.navigation.state.routeName);
            this.props.setRefreshMap(false);
            // Alert.alert("Updated Successfully");
            this.refs.toast.show("Updated Successfully", 2000);
            this.setState({submitPressed: false});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    axiosCallbackFail = () => {
        try {
            myfuncs.myBreadCrumbs('axiosCallbackFail', this.props.navigation.state.routeName);
            this.props.setRefreshMap(false);
            this.setState({submitPressed: false});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            // let topContentSpace = 140;
            // if (myfuncs.isAndroid())
            //     topContentSpace += 100;

            let androidPad = myfuncs.androidPadding(this.state.textIsFocused, 200);

            return (<KeyboardAwareScrollView
                    style={myStyles.firstContainer}
                    resetScrollToCoords={{x:0, y:0}}
                    onSubmitEditing={this.onSubmitPress}
                    blurOnSubmit={false}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={myStyles.container}
                >
                    <View style={{paddingTop: androidPad}}/>

                    <Text style={myStyles.iFieldLabel}>
                    <Text>Map Snap-Back Seconds</Text>
                </Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.profile.refocus_seconds.toString()}
                               onChangeText={(text) => this.updateState({refocus_seconds: text})}
                               clearButtonMode='always'
                               placeholder={"Refocus Seconds"}
                               maxLength={4}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />

                    <View style={{padding: 5}}/>


                    <Text style={myStyles.iFieldLabel}>
                        <Text>Map Zoom-Out multiplier</Text>
                    </Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.profile.zoom_multiplier.toString()}
                               onChangeText={(text) => this.updateState({zoom_multiplier: text})}
                               clearButtonMode='always'
                               placeholder={"zoom-out multiplier"}
                               maxLength={3}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />
                    <Text> 1=Max Zoom In, 500=Max Zoom Out</Text>

                    <View style={{padding: 5}}/>

                    <Text style={myStyles.iFieldLabel}>
                        <Text>Ribbon Size</Text>
                    </Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.profile.map_ribbon_size.toString()}
                               onChangeText={(text) => this.updateState({map_ribbon_size: text})}
                               clearButtonMode='always'
                               placeholder={"Ribbon Size"}
                               maxLength={1}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />
                    <Text> 1=Smallest, 5=Largest</Text>

                    <View style={{padding: 5}}/>

                    <Text style={myStyles.iFieldLabel}>
                        <Text>Tracker Icon Size</Text>
                    </Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.profile.map_user_size.toString()}
                               onChangeText={(text) => this.updateState({map_user_size: text})}
                               clearButtonMode='always'
                               placeholder={"Tracker Icon Size"}
                               maxLength={1}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />
                    <Text> 0=Invisible, 5=Largest</Text>

                    <View style={{padding: 5}}/>

                    <Text style={myStyles.iFieldLabel}>
                        <Text>Tracker Icon</Text>
                    </Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.profile.map_user_icon.toString()}
                               onChangeText={(text) => this.updateState({map_user_icon: text})}
                               clearButtonMode='always'
                               placeholder={"Tracker Icon"}
                               maxLength={1}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />
                    <Text> 1=Frogger, 2=Happy</Text>


                    <View style={{padding: 5}}/>

                    <Text style={myStyles.iFieldLabel}>
                        <Text>Map Orientation</Text>
                    </Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.profile.map_orients_to_users_bearing.toString()}
                               onChangeText={(text) => this.updateState({map_orients_to_users_bearing: text})}
                               clearButtonMode='always'
                               placeholder={"Map Orientation"}
                               maxLength={1}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />
                    <Text> 1=Points North, 2=Animates to Bearing</Text>


                    { (this.state.submitPressed === false) &&
                        <View>
                        <View style={{paddingTop: 5}}/>
                        <MyButton title={'Submit'} onPress={this.onSubmitPress}/>
                        </View>
                    }

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
                    <MyHelpModal screen={"SettingsDefaultMap"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>
                    </KeyboardAwareScrollView>
            );
        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
    handleInputFocus = () => this.setState({ textIsFocused: true });
    handleInputBlur = () => this.setState({ textIsFocused: false });
    onHelpPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: true});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    onHelpExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpExitPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: false});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    updateState = (new_prop) => {
        if (Platform.OS === 'android') {
            if (new_prop.map_ribbon_size !== "undefined" &&
                new_prop.map_ribbon_size !== this.state.map_ribbon_size) {
                resetMap = true;
                // console.log("resetMap1");
            }
            if (new_prop.map_user_size !== "undefined" &&
                new_prop.map_user_size !== this.state.map_user_size) {
                resetMap = true;
                // console.log("resetMap2");
            }
        }
        if (new_prop.zoom_multiplier !== undefined &&
            new_prop.zoom_multiplier !== this.state.zoom_multiplier) {
            resetMap = true;
            // console.log("resetMap3");
        }
        // if (new_prop.map_orients_to_users_bearing !== "undefined" &&
        //     new_prop.map_orients_to_users_bearing !== this.state.map_orients_to_users_bearing) {
        //     resetMap = true;
        //     console.log("resetMap3");
        // }
        this.setState({profile: {...this.state.profile, ...new_prop}});
    };
};

const mapStateToProps = (state) => {
    const { user } = state;
    return { user }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setRefreshMap,
        setPannedMap,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDefaultMapScreen);
