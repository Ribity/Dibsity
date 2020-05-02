import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    Text
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';

import { connect } from 'react-redux';

import myStyles from "../myStyles";

import myfuncs from "../services/myFuncs";
import {MyHelpIcon} from '../components/MyHelpIcon';
import {MyHelpModal} from "../components/MyHelpModal";
import {MyButton} from "../components/MyButton";
import {ScreenTitle} from "../components/screenTitle";
import MyDefines from "../constants/MyDefines";
import {bindActionCreators} from "redux";
import {updateVehicle} from "../actions/vehicleActions";

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

class MyVehicleScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            const { params = {} } = navigation.state;
            return {
                headerTitle: () => <ScreenTitle title={"My Vehicle"}/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            // profiles: this.props.profiles,
            vehicle: JSON.parse(JSON.stringify(this.props.vehicle)),
            submitPressed: false,
            textIsFocused: false,
        };
    }
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('Did Mount', this.props.navigation.state.routeName);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    onSubmitPress = async (test) => {
        try {
            myfuncs.myBreadCrumbs('onSubmitPress', this.props.navigation.state.routeName);
            let myVehicle = this.state.vehicle;

            if (myVehicle.make.indexOf(' ') === 0) {
                Alert.alert("Error with input for Make",
                    "First character cannot be a space");
                return;
            }
            if (myVehicle.model.indexOf(' ') === 0) {
                Alert.alert("Error with input for model",
                    "First character cannot be a space");
                return;
            }
            if (myVehicle.year.length < 1) {
                Alert.alert("Error with input for year",
                    "Please ensure the year actually contains a value");
                return;
            }

            this.refs.toast.show("Saved", 1000);
            this.refs.toast_bottom.show("Saved", 1000);
            this.props.updateVehicle(this.state.vehicle);
            await myfuncs.writeUserDataToLocalStorage("user_vehicle", this.state.vehicle);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);

            // let androidPad = myfuncs.androidPadding(this.state.textIsFocused, 200);

            return (
                <KeyboardAwareScrollView
                    style={myStyles.firstContainer}
                    resetScrollToCoords={{x:0, y:0}}
                    keyboardShouldPersistTaps={'handled'}
                    blurOnSubmit={false}
                    onSubmitEditing={this.onSubmitPress}
                    contentContainerStyle={myStyles.container}
                >
                    <View style={myStyles.container}>

                    <View style={{marginTop: 20}}/>

                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.onSubmitPress(false)}
                                  title={"Save"}/>

                        <Text style={myStyles.iFieldLabel}>Make:</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.vehicle.make}
                                   onChangeText={(text) => this.updateState({make: text})}
                                   clearButtonMode='always'
                                   placeholder={"Make"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={100}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />

                        <View style={{paddingTop: 15}}/>
                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.onSubmitPress(false)}
                                  title={"Save"}/>

                        <Toast
                        ref="toast"
                        style={{backgroundColor:'mediumseagreen',borderRadius: 20,padding: 10}}
                        position='top'
                        positionValue={0}
                        fadeOutDuration={1000}
                        opacity={.8}
                        textStyle={{color:'gold',fontSize:21}}
                        />
                        <Toast
                            ref="toast_bottom"
                            style={{backgroundColor:'mediumseagreen',borderRadius: 20,padding: 10}}
                            position='bottom'
                            positionValue={0}
                            fadeOutDuration={1000}
                            opacity={.8}
                            textStyle={{color:'gold',fontSize:21}}
                        />

                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"MyVehicle"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>

                        <View style={{marginBottom: 50}}/>


                    </View>
                </KeyboardAwareScrollView>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    handleInputFocus = () => this.setState({ textIsFocused: true });
    handleInputBlur = () => this.setState({ textIsFocused: false });
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
            myfuncs.myBreadCrumbs('updateState', this.props.navigation.state.routeName);
            let newVehicle = {...this.state.vehicle};
            newVehicle =
                {...newVehicle, ...new_prop};
            this.setState({vehicle: newVehicle});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,
    },
});

const mapStateToProps = (state) => {
    const { vehicle } = state;
    return { vehicle }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateVehicle,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MyVehicleScreen);

