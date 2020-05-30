import React from 'react';
import {
    StyleSheet,
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

import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";
import {MyHelpIcon} from '../components/MyHelpIcon';
import {MyHelpModal} from "../components/MyHelpModal";
import {MyButton} from "../components/MyButton";
import {bindActionCreators} from "redux";
import {setRefreshMap, setPannedMap} from "../actions/TasksActions";
import {ScreenTitle} from "../components/screenTitle";
import {updateSettings} from "../actions/settingsActions";

const {height, width} = Dimensions.get('window');

//***********************************************************************************
// The idea here is to NOT perform the reverseGeo often because each one cost money.
//***********************************************************************************

class SettingsDefaultMapScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'SettingsDefaultMap');

            return {
                headerTitle: () => <ScreenTitle title={"Map Settings"} privacy={() => navigation.navigate("PrivacySettings")}/>,
            };

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            settings: {...this.props.settings}
        };
    }
    onSubmitPress = async () => {
        let resetMap = false;

        try {
            myfuncs.myBreadCrumbs('onSubmitPress', this.props.navigation.state.routeName);
            Keyboard.dismiss();
            if ((this.state.settings.refocus_seconds < 1) ||
                (this.state.settings.refocus_seconds > 9999)) {
                Alert.alert("Invalid Snap-Back Seconds",
                    "Value must be between 1 and 9999");
                return;
            }
            if ((this.state.settings.zoom_multiplier < 1) ||
                (this.state.settings.zoom_multiplier > 500)) {
                Alert.alert("Invalid Zoom-Out Multiplier",
                    "Value must be between 1 and 500");
                return;
            }

            if (this.state.settings.map_user_size > 5) {
                Alert.alert("Invalid Tracker Icon Size",
                    "Value must be between 0 and 5");
                return;
            }

            if ((this.state.settings.map_user_icon < 1) ||
                (this.state.settings.map_user_icon > 2)) {
                Alert.alert("Invalid Tracker Icon",
                    "Value must be between 1 and 2");
                return;
            }

            if ((this.state.settings.map_orients_to_users_bearing < 1) ||
                (this.state.settings.map_orients_to_users_bearing > 2)) {
                Alert.alert("Invalid Map Orientation",
                    "Value must be between 1 and 2");
                return;
            }

            if (Platform.OS === 'android') {
                if (this.state.settings.map_user_size !== this.props.settings.map_user_size) {
                    resetMap = true;
                    // console.log("resetMap2");
                }
            }
            if (this.state.settings.zoom_multiplier !== this.props.settings.zoom_multiplier) {
                resetMap = true;
                // console.log("resetMap3");
            }

            if (resetMap) {
                this.props.setRefreshMap(true);
                this.props.setPannedMap(false);
            }
            await this.props.updateSettings( {...this.props.settings, ...this.state.settings} );
            this.updateStorage();
            this.refs.toast.show("Updated Successfully", 2000);

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            // let topContentSpace = 140;
            // if (myfuncs.isAndroid())
            //     topContentSpace += 100;

            return (<KeyboardAwareScrollView
                    style={myStyles.firstContainer}
                    resetScrollToCoords={{x:0, y:0}}
                    onSubmitEditing={this.onSubmitPress}
                    blurOnSubmit={false}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={myStyles.container}
                >

                    <Text style={myStyles.iFieldLabel}>Map Snap-Back Seconds</Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.settings.refocus_seconds.toString()}
                               onChangeText={(text) => this.updateState({refocus_seconds: text})}
                               clearButtonMode='always'
                               placeholder={"Refocus Seconds"}
                               maxLength={4}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                    />

                    <Text style={myStyles.iFieldLabel}>Map Zoom-Out multiplier</Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.settings.zoom_multiplier.toString()}
                               onChangeText={(text) => this.updateState({zoom_multiplier: text})}
                               clearButtonMode='always'
                               placeholder={"zoom-out multiplier"}
                               maxLength={3}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                    />
                    <Text> 1=Max Zoom In, 500=Max Zoom Out</Text>

                    <Text style={myStyles.iFieldLabel}>Tracker Icon Size</Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.settings.map_user_size.toString()}
                               onChangeText={(text) => this.updateState({map_user_size: text})}
                               clearButtonMode='always'
                               placeholder={"Tracker Icon Size"}
                               maxLength={1}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                    />
                    <Text> 0=Invisible, 5=Largest</Text>


                    <Text style={myStyles.iFieldLabel}>Tracker Icon</Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.settings.map_user_icon.toString()}
                               onChangeText={(text) => this.updateState({map_user_icon: text})}
                               clearButtonMode='always'
                               placeholder={"Tracker Icon"}
                               maxLength={1}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                    />
                    <Text> 1=Frogger, 2=Happy</Text>


                    <Text style={myStyles.iFieldLabel}>Map Orientation</Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.settings.map_orients_to_users_bearing.toString()}
                               onChangeText={(text) => this.updateState({map_orients_to_users_bearing: text})}
                               clearButtonMode='always'
                               placeholder={"Map Orientation"}
                               maxLength={1}
                               keyboardType={'numeric'}
                               returnKeyType="done"
                               placeholderTextColor={"grey"}
                    />
                    <Text> 1=Points North, 2=Animates to Bearing</Text>

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
                    <MyHelpModal screen={"SettingsDefaultMap"}
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
    updateState = (new_prop) => {
        try {
            let new_settings = {...this.state.settings, ...new_prop};
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
        setRefreshMap,
        setPannedMap,
        updateSettings,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDefaultMapScreen);
