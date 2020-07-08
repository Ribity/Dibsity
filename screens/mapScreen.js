import React from 'react';
import {Alert, StyleSheet, View, Dimensions, Image, Text, TouchableOpacity, Platform, TextInput} from 'react-native';
import MapComponent from '../components/MapComponent';
import Toast from 'react-native-root-toast';

import DialogInput from "react-native-dialog-input";

import MyDefines from '../constants/MyDefines';
import myStyles from "../myStyles";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";
import {updateVehicle} from "../actions/vehicleActions";
import {updateParkedLocation} from "../actions/ParkedLocationActions";
import TasksComponent from '../components/TasksComponent';
import WaitComponent  from './../components/WaitComponent';
import myfuncs from "../services/myFuncs";
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import DepartingShortlyModal from "../components/DepartingShortlyModal";

import {MyTouchableLogo} from "../components/MyTouchableLogo";
import {ScreenTitle} from "../components/screenTitle";
import ApiKeys from "../constants/ApiKeys";

import {SaveParkedIcon} from "../components/SaveParkedIcon";
import {DepartParkedIcon} from "../components/DepartParkedIcon";
import * as Constants from "expo-constants";
import {setRefreshMap} from "../actions/TasksActions";

// The following code was added because the latest firestore has bugs/exceptions (crypto) with react native.
//  but expo 37 imports a previous version of firestore that is compatible, so no longer needed
// import { decode, encode } from 'base-64'
// global.crypto = require("@firebase/firestore");
// global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }
// if (!global.btoa) { global.btoa = encode; }
// if (!global.atob) { global.atob = decode; }

let willUnmount = false;
let myfirestore = null;
let mapScreenSpaces = [];
let myTitle = "";
let movedParkedLoc = null;

const {height, width} = Dimensions.get('window');
const initialState = {
    welcomeTheUser: true,
    showInitMessage: true,
    readyToGo: false,
    isAuthenticated: false,
    bUserSavedParkingLocation: false,
    refresh_map: false,
    dialogInputVisible: false,
    note: "",
    location: {},
};

class MapScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'MapScreen');
            const { params = {} } = navigation.state;
            return {
                headerLeft: () => <MyTouchableLogo onPress={() => navigation.navigate("TutorialMap")}/>,
                headerTitle: () => <ScreenTitle title={"Dibsity"} privacy={() => navigation.navigate("PrivacyMap")}/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = initialState;
        this.refreshMapId = -1;
        this.componentWillFocus = this.componentWillFocus.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    };
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('DidMount', this.props.navigation.state.routeName);
            setTimeout(() => {this.getUserStoredData();}, 1);

            this.subs = [
                this.props.navigation.addListener('willFocus', this.componentWillFocus),
            ];

            setTimeout(() => {
                this.areWeReadyToGo()
            }, 100);
            setTimeout(() => {
                this.setState({welcomeTheUser: false});
            }, 8000);

            if (MyDefines.log_details)
                console.log("height:", height, " width:", width, "statusbar:", MyDefines.myStatusBarHeight);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    // componentWillUnmount() {
    //     if (this.onAuthStateChangedUnsubscribe)
    //         this.onAuthStateChangedUnsubscribe();
    // }
    getUserStoredData = async () => {
        try {
            myfuncs.myBreadCrumbs('getUserStoredData', this.props.navigation.state.routeName);
            let retObj = await myfuncs.init();

            if (myfuncs.isLocationValid(retObj.parkedLocation.location)) {
                this.props.updateParkedLocation(retObj.parkedLocation.location);
                this.setState({note: retObj.parkedLocation.note});
                this.setState({bUserSavedParkingLocation: true});
            }

            // console.log("mk1a:", retObj);
            await this.props.updateSettings(retObj.settings);
            await this.props.updateVehicle(retObj.vehicle);
            myfuncs.setAwakeorNot(this.props.settings.keep_awake);
            // console.log("mk1aa vehicle:", this.props.vehicle);

            // await this.initFirebase();

            this.setState({isAuthenticated: true});

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    // signInAnonymously = () => {
    //     try {
    //         firebase.auth().signInAnonymously();
    //     } catch (error) {
    //         myfuncs.myRepo(error);
    //     }
    // };
    // storeHighScore = (userId, score) => {
    //     try {
    //         console.log("set user highScore");
    //
    //         const dbh = firebase.firestore();
    //
    //         dbh.collection("characters").doc("mario").set({
    //             employment: "plumber",
    //             outfitColor: "blue",
    //             specialAttack: "fireball"
    //         })
    //     } catch (error) {
    //         myfuncs.myRepo(error);
    //     }
    // };
    // onAuthStateChanged = (user) => {
    //     // this.setState({isAuthenticationReady: true});
    //     if (MyDefines.log_details)
    //         console.log("on Firebase Auth State changed: ", user);
    //     this.setState({isAuthenticated: !!user});
    //     this.storeHighScore(2, 1001);
    // };
    areWeReadyToGo = () => {
        try {
            myfuncs.myBreadCrumbs('areWeReadyToGo', this.props.navigation.state.routeName);
            if (this.state.isAuthenticated) {
                if (MyDefines.log_details)
                    console.log("ReadyTOGo");
                this.setState({readyToGo: true});
            } else {
                setTimeout(() => {this.areWeReadyToGo()}, 300);
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    static getDerivedStateFromProps(nextProps, prevState){
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "MapScreen");
            let update = {};

            // console.log("nextProps:", nextProps);
            if (prevState.refresh_map !== nextProps.tasks.refresh_map) {
                update.refresh_map = nextProps.tasks.refresh_map;
                // console.log("update.refresh_map:", update.refresh_map);
            }
            if (prevState.location !== nextProps.location) {
                update.location = nextProps.location;
                // console.log("update.location:", update.location);
            }
            return Object.keys(update).length ? update: null;
        } catch (error) {
            myfuncs.myRepo(error);
            return null;
        }
    };
    componentWillFocus() {
        try {
            myfuncs.myBreadCrumbs('WillFocus', this.props.navigation.state.routeName);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    componentWillUnmount() {
        try {
            myfuncs.myBreadCrumbs('WillUnMount', this.props.navigation.state.routeName);
            willUnmount = true;
            // AppState.removeEventListener('change', this._handleAppStateChange);
            if (MyDefines.log_details)
                console.log("mapScreen will unmount");
            this.subs.forEach(sub => sub.remove());  // removes the componentWillFocus listener
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    // leavingShortly = () => {
    //     try {
    //         myfuncs.myBreadCrumbs('leavingShortly', this.props.navigation.state.routeName);
    //
    //         let tenMins = myfuncs.getTenMinuteInterval();
    //         // let tenMins = myfuncs.getOneMinuteInterval();
    //         let geofirestore = new GeoFirestore(myfirestore);
    //         let geocollection = geofirestore.collection(ApiKeys.firebase_collection).
    //                             doc(myfuncs.getCollectionName()).collection(tenMins.toString());
    //
    //         console.log("save parked button pressed: ", tenMins);
    //
    //         // geocollection.add({     // This let's the database create a unique record, or I create unique record below
    //         let uniqueKey = Constants.default.deviceId;
    //         let myTemp = geocollection.doc(uniqueKey).set({
    //
    //             name: 'KingRcd3',
    //             score: 100,
    //             // coordinates: new firebase.firestore.GeoPoint(38,38)
    //             coordinates: new firebase.firestore.GeoPoint(this.props.location.coords.latitude, this.props.location.coords.longitude)
    //         });
    //
    //     } catch (error) {
    //         myfuncs.myRepo(error);
    //     }
    // };
    parkedLocation = () => {
        try {
            myfuncs.myBreadCrumbs('parkedLocation', this.props.navigation.state.routeName);
            // console.log("user clicked save parking location");
            this.showDialog(false, null);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    showDialog = (bUseMovedLoc, movedLoc) => {
        // this.setState({note: ""});
        if (bUseMovedLoc){
            myTitle = "Is this the exact location where your vehicle is parked?";
            movedParkedLoc = movedLoc;
        } else {
            myTitle = "Are you at the exact location where your vehicle is parked?";
            movedParkedLoc = null;
        }

        this.setState({ dialogInputVisible: true });
    };
    handleCancel = () => {
        this.setState({ dialogInputVisible: false });

        if (this.props.parkedLocation !== 0 && this.props.parkedLocation != null && this.props.parkedLocation != {} ) {
            let tLocation = {...this.props.parkedLocation};
            tLocation.coords.latitude += 0.00000000001;
            this.props.updateParkedLocation(tLocation);
        }
        movedParkedLoc = null;
    };
    handleDialogInput = async (text) => {
        this.setState({ dialogInputVisible: false });
        await this.setState({note: text});
        this.saveParkedLocation(false);
    };
    saveParkedLocation = (bClearIt) => {
        try {
            myfuncs.myBreadCrumbs('saveParkedLocation', this.props.navigation.state.routeName);
            if (bClearIt === 0) {
                console.log("Clearing parked location");
                this.saveParkedLocationToStorage({});
                this.setState({bUserSavedParkingLocation: false});

                let tMsg = "Parking Location Cleared";
                Toast.show(tMsg, {
                    duration: 4000,
                    position: Toast.positions.TOP,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    textColor: 'black',
                    backgroundColor: 'gold',
                    shadowColor: 'green',
                    opacity: 0.9,
                });
                Toast.show(tMsg, {
                    duration: 4000,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    textColor: 'black',
                    backgroundColor: 'gold',
                    shadowColor: 'green',
                    opacity: 0.9,
                });

            } else {
                if (MyDefines.log_details)
                    console.log("Saving park location");

                if (MyDefines.fakeParkedLocation === true) {
                    if (Platform.OS === 'android') {
                        console.log("Saving Android fake parked location");
                        this.saveParkedLocationToStorage(MyDefines.fake_parked_location_android);
                    } else {
                        this.saveParkedLocationToStorage(MyDefines.fake_parked_location);
                    }
                } else {
                    if (movedParkedLoc === null) {
                        // console.log("props.location:", this.props.location);
                        this.saveParkedLocationToStorage(this.props.location);
                    } else {
                        this.saveParkedLocationToStorage(movedParkedLoc);
                    }
                }
                this.setState({bUserSavedParkingLocation: true});
                let tMsg = "Parking Location Saved";
                Toast.show(tMsg, {
                    duration: 4000,
                    position: Toast.positions.TOP,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    textColor: 'black',
                    backgroundColor: 'gold',
                    shadowColor: 'green',
                    opacity: 0.9,
                });
                Toast.show(tMsg, {
                    duration: 4000,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    textColor: 'black',
                    backgroundColor: 'gold',
                    shadowColor: 'green',
                    opacity: 0.9,
                });
            }

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    saveParkedLocationToStorage = (location) => {
        this.props.updateParkedLocation(location);
        myfuncs.writeUserDataToLocalStorage("parkedLocation", {location: location, note: this.state.note});
    };
    mySpaces = (newSpaces)  => {
        mapScreenSpaces = myfuncs.clone(newSpaces);
        // console.log("mapScreenSpaces:", mapScreenSpaces);
    };
    timerRefreshMap = () => {
        this.props.setRefreshMap(false);
        this.setState({refresh_map: false});
        this.refreshMapId = -1;
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);

            if (this.state.refresh_map === true && this.refreshMapId === -1) {
                this.refreshMapId = setTimeout(() => {this.timerRefreshMap()}, 1000);
            }

            return (
                <View style={myStyles.container}>
                       <TasksComponent/>

                       {this.state.readyToGo === false &&
                       <WaitComponent/>
                       }

                        {this.state.refresh_map === true &&
                        <View style={myStyles.myCenter}>
                            <Text>You modified pertinent map parms</Text>
                            <View style={{padding: 10}}/>
                            <Text>Refreshing the map</Text>
                            <View style={{padding: 10}}/>
                            <Text>If map does not display after 20 seconds,</Text>
                            <View style={{padding: 1}}/>
                            <Text>Or if you experience map problems,</Text>
                            <View style={{padding: 1}}/>
                            <Text>you'll need to restart the app</Text>
                        </View>
                        }

                        {(this.state.readyToGo === true && this.state.refresh_map === false) &&
                        <MapComponent navigation={this.props.navigation}
                                      onSaveParkedLocation={this.saveParkedLocation}
                                      onDepartingShortly={this.onDepartingShortlyPress}
                                      parentSpaces={this.mySpaces}
                                      showParkDialog={this.showDialog}
                        />
                        }
                        {(this.state.readyToGo === true && this.state.refresh_map === false &&
                            myfuncs.isLocationValid(this.state.location) && this.state.location.timestamp !== 0) &&
                        <SaveParkedIcon onPress={this.parkedLocation} />
                        }
                        {(this.state.readyToGo === true &&
                            this.state.refresh_map === false &&
                            this.state.bUserSavedParkingLocation) &&
                        <DepartParkedIcon
                            onPress={this.onDepartingShortlyPress}
                            bCommunals={this.props.settings.postCommunal}
                        />
                        }

                       {this.state.welcomeTheUser === true &&
                       <Text style={styles.WelcomeUser}>Welcome</Text>
                       }
                    <DialogInput isDialogVisible={this.state.dialogInputVisible}
                                 title={myTitle}
                                 // title={"Are you at the exact location where your vehicle is parked?"}
                                 message={"Optional Additional Info:"}
                                 hintInput ={"Ground level"}
                                 dialogStyle={{marginTop:-300}}
                                 submitInput={ (text) => {this.handleDialogInput(text)} }
                                 closeDialog={() => {this.handleCancel()}}>
                    </DialogInput>

                       <MyHelpIcon onPress={this.onHelpPress}/>
                       <MyHelpModal screen={"Map"}
                                    onExitPress={this.onHelpExitPress}
                                    isVisible={this.state.isHelpModalVisible}/>
                        <DepartingShortlyModal onMinutesPressed={this.DepartingMinutesPressed}
                                               onExitPress={this.onDepartingShortlyExitPress}
                                               isVisible={this.state.isDepartingShortlyModalVisible}/>
                </View>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
//{(this.state.readyToGo === true && MyDefines.default_tasks.refresh_map === false) &&
//<MapComponent navigation={this.props.navigation}/>
//}

    onHelpPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpPress', this.props.navigation.state.routeName);
            this.setState({isHelpModalVisible: true});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onHelpExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpExitPress', this.props.navigation.state.routeName);
            this.setState({isHelpModalVisible: false});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onDepartingShortlyPress = () => {
        try {
            myfuncs.myBreadCrumbs('onDepartingShortlyPress', this.props.navigation.state.routeName);
            if (this.props.vehicle.description.length < 1) {
                Alert.alert("Please set your vehicle's desciption to assist others in finding your space", null);
                this.props.navigation.navigate("Vehicle");
                return;
            }

            if (myfuncs.isLocationValid(this.state.location) === false || this.state.location.timestamp === 0) {
                Alert.alert("Attempting to determine your current location",
                    "Please try again in a moment");
                return;
            }

            if (myfuncs.isLocationValid(this.props.parkedLocation) === false ) {
                Alert.alert("Invalid saved parked location",
                    "Please save your location the next time you park");
                return;
            }

            let distance = myfuncs.calcDistance(this.state.location.coords, this.props.parkedLocation.coords);
            // console.log("Distance: ", distance);
            // console.log("state.location:", this.state.location);
            // console.log("props.location:", this.props.parkedLocation);

            if (distance > 1610) {
                let miles = distance / 1609;
                miles = Math.trunc(miles);
                // console.log("miles: ", miles);
                let mileMsg = "1 mile";
                if (miles > 1)
                    mileMsg = miles + " miles";
                let msg1 = "You are more than " + mileMsg + " from your saved parked location";
                Alert.alert(msg1,
                    "Would you like to continue?",
                    [
                        {text: 'No'},
                        {
                            text: 'Yes', onPress: () => {
                                this.setState({isDepartingShortlyModalVisible: true})
                            }
                        },
                    ]);

                return;
            }

            this.setState({isDepartingShortlyModalVisible: true});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onDepartingShortlyExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onDepartingShortlyExitPress', this.props.navigation.state.routeName);
            this.setState({isDepartingShortlyModalVisible: false});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    DepartingMinutesPressed = (minutes, bPostCommunals) => {
        try {
            myfuncs.myBreadCrumbs('DepartingMinutesPressed', this.props.navigation.state.routeName);
            let bUpdate = false;
            let bPreservePreviousTen = false;
            let setOrUpdateOrPrevious = 0;
            let thisTenMins = myfuncs.getTenMinuteInterval();
            let prevDibs = 0;
            let prevDibsDevId = 0;

            this.setState({isDepartingShortlyModalVisible: false});

            // determine if space exists already for this devid, and is it this tenMins or last?
            // console.log("mapScreenSpaces:", mapScreenSpaces);
            for (let i=0; i<mapScreenSpaces.length; i++) {
                if (mapScreenSpaces[i].key === Constants.default.deviceId) {
                    // console.log("m:", mapScreenSpaces[i].tenMinutes, ",t:", thisTenMins);
                    if (mapScreenSpaces[i].tenMinutes === thisTenMins) {
                        bUpdate = true;
                    } else {
                        bPreservePreviousTen = true;
                        if (mapScreenSpaces[i].dibs !== undefined)
                            prevDibs = mapScreenSpaces[i].dibs;
                        if (mapScreenSpaces[i].dibsDevId !== undefined)
                            prevDibsDevId = mapScreenSpaces[i].dibsDevId;
                    }
                }
            }
            if (bPreservePreviousTen)
                setOrUpdateOrPrevious = 2;
                    // if we have an existing record, no need to preserve previousTenMins' dibs.
                    //  ie, prevTen dibs only needs to be preserved on a set, not an update.
            if (bUpdate === true)
                setOrUpdateOrPrevious = 1;

            if (myfuncs.isLocationValid(this.props.parkedLocation))
                myfuncs.addFirestoreDepartingRcd(this.props.parkedLocation.coords, this.state.note, this.props.vehicle,
                    thisTenMins, minutes, setOrUpdateOrPrevious, prevDibs, prevDibsDevId,
                    this.props.settings, bPostCommunals);
            else {
                    // setTimeout is needed because in iOS when closing a modal, it also closes the Alert.
                setTimeout( () =>
                    Alert.alert("Your departure was NOT posted to others",
                    "Your previously saved Parked Location is invalid"),
                    1000);
            }
        } catch (error) {
            console.log(error);
            myfuncs.myRepo(error);
        }
    };
};
const styles = StyleSheet.create({
    WelcomeUser: {
        position: 'absolute',
        top: (height/4),
        fontSize: 22,
        fontStyle: 'italic',
        fontWeight: 'bold',
        opacity: .6,
        color: 'green',
    },
});

const mapStateToProps = (state) => {
    const { settings } = state;
    const { location } = state;
    const { parkedLocation } = state;
    const { vehicle } = state;
    const { tasks } = state;
    return { settings, location, parkedLocation, vehicle, tasks}
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateSettings,
        updateVehicle,
        updateParkedLocation,
        setRefreshMap,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
