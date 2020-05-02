import React from 'react';
import {Alert, Text, StyleSheet, Dimensions, Platform, View, Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Constants from 'expo-constants';
import MyButton from "./MyButton";

import * as firebase from "firebase";
// import firebase from 'firebase';
import 'firebase/firestore';
import {GeoFirestore} from "geofirestore";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateLocation} from '../actions/LocationActions';
import myfuncs from '../services/myFuncs';
import MyDefines from '../constants/MyDefines';
import _ from 'lodash'
import myStyles from "../myStyles";
import ApiKeys from "../constants/ApiKeys";

const GEOLOCATION_OPTIONS = { accuracy: Location.Accuracy.Highest, interval: 1000, enableHighAccuracy: true};

const multiplier = 25;
const default_latitudeDelta = .0005 * Math.pow(multiplier, 2);
const default_longitudeDelta = .0005 * Math.pow(multiplier, 2);
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const {height, width} = Dimensions.get('window');

const parkIcon = require('../assets/images/park_60x60.png');
const userIcon1 = require('../assets/images/frog1.png');
const userIcon2e = require('../assets/images/frogEast.png');
const userIcon2w = require('../assets/images/frogWest.png');
const parkingSpotImage = require('../assets/images/frog1.png');

let firestoreListenerLocation = [{}, {}];

class MapComponent extends React.Component {

    constructor(props) {
        try {
            super(props);

            this.geoSubscription = [false, false];
            this.watchId = null;
            this.intervalId_animate = -1;
            this.fire_interval = -1;
            this.userHasControl = false;

            this.tenMins = 0;
            this.listenerTenMinutes = [0, 0];

            this.state = {
                hasLocationPermissions: false,
                locationResult: null,
                spaces: [],
                parkedLocation: null,

                bearing: 0,
                initRegion: null,
                coordinate: new MapView.AnimatedRegion({
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: default_latitudeDelta,
                    longitudeDelta: default_longitudeDelta,
                }),

            };
            this.componentWillFocus = this.componentWillFocus.bind(this);
            this.componentWillUnmount = this.componentWillUnmount.bind(this);

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('Did mount', this.props.navigation.state.routeName);
            this._getLocationAsync();

            this.subs = [
                this.props.navigation.addListener('willFocus', this.componentWillFocus),
            ];

            this.intervalId_animate = setInterval(this.handleAnimation,3000); // every 3 seconds

            this.fire_interval = setInterval(this.check_firestore_listener_distance_and_time,10000);  // every 10 seconds

            if (MyDefines.fakeLocation)
                setTimeout(this.fakeLocationChange, 5000);
            this.fakeLocation = {
                "coords": {
                    "accuracy": 5,
                    "altitude": -1,
                    "altitudeAccuracy": -1,
                    "heading": 270,
                    "latitude": 35.91057,
                    "longitude": -78.69085,
                    "speed": 20,
                },
            };
            this.fakeCount = 0;
            this.setState({parkedLocation: this.props.parkedLocation});

        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    componentWillUnmount() {
        try {
            myfuncs.myBreadCrumbs('Willmount', this.props.navigation.state.routeName);

            if (this.geoSubscription[0]) {
                this.geoSubscription[0]();
                this.geoSubscription[0] = false;
            }
            if (this.watchId) {
                // console.log("remove watchPosition callback");
                this.watchId.remove();  // Remove the watchPosition callback
            }
            this.subs.forEach(sub => sub.remove());  // removes the componentWillFocus listener

            if (this.intervalId_animate !== -1)
                clearInterval(this.intervalId_animate);
            if (this.fire_interval !== -1)
                clearInterval(this.fire_interval);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    componentWillFocus() {
        try {
            myfuncs.myBreadCrumbs('WillFocus', this.props.navigation.state.routeName);
            if (myfuncs.isLocationValid(this.props.location)) {
                if (this.state.initRegion === null)
                    this.setState({
                        initRegion: {
                            latitude: this.props.location.coords.latitude,
                            longitude: this.props.location.coords.longitude,
                            latitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                    }
                });
            }
            this.userHasControl = false;

        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    handleAnimation = () => {
        try {
            myfuncs.myBreadCrumbs('handleAnimation', this.props.navigation.state.routeName);
            if ((this.userHasControl === false) && (this.state.initRegion !== null) &&
                (myfuncs.isLocationValid(this.props.location)) ) {
                let coord = this.props.location.coords;
                let spaceCoord = {
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                };
                let region = {
                    ...spaceCoord,
                    latitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                    longitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                };

                // this.map.animateToRegion(region, 1000 * 2);

                let heading = 0;
                if (MyDefines.default_user.profile.map_orients_to_users_bearing === 2) // If orients to users bearing
                    heading = this.props.location.coords.heading;

                if ( this.map !=null ) {    // Added the IF because I had one exception in myRepo:  undefined is not an object (evaluating 'u.map.animateCamera'). I think this got called before it rendered the map
                    this.map.animateCamera(
                        {
                            center: region,
                            heading: heading,
                            pitch: 0,
                        }, 1000);
                }
                this.state.coordinate.timing(spaceCoord, 1000).start();
                if (MyDefines.default_user.profile.map_orients_to_users_bearing !== 2) // If map is always North
                    this.setState({bearing: this.props.location.coords.heading});
                else {
                    if (this.state.bearing !== 0)
                        this.setState({bearing: 0})
                }

                // console.log(this.props.location);        // mk1
                // this.setState({bearing: 0})              // mk1

            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    fakeLocationChange = () => {
        // if (MyDefines.detail_logging)
        //     console.log("fakeLocationChange");
        if (MyDefines.fakeRibbonId === 0) {
            if (this.fakeCount % 30 === 0) {
                this.fakeLocation.coords.latitude = 35.91057;
                this.fakeLocation.coords.longitude = -78.69085;
            } else {
                let lat = this.fakeLocation.coords.latitude + .0001;
                let lon = this.fakeLocation.coords.longitude + .0001;
                this.fakeLocation.coords.latitude = (Math.round(lat * 100000) / 100000);
                this.fakeLocation.coords.longitude = (Math.round(lon * 100000) / 100000);
                if (this.fakeLocation.coords.heading < 344)
                    this.fakeLocation.coords.heading += 15;
                else
                    this.fakeLocation.coords.heading -= 345;
            }
            this.fakeCount++;
        } else {
            // "fake_locations": [
            //     {
            //     "heading": 68,
            //     "latitude": 35.91078,
            //     "longitude": -78.69098,
            //      },
            // ]
            if (this.props.fakeLocations.length > 0) {
                this.fakeLocation.coords = this.props.fakeLocations[this.fakeCount];
                this.fakeCount++;
                if (this.fakeCount >= this.props.fakeLocations.length)
                    this.fakeCount = 0;
            }
        }

        // console.log(this.fakeLocation.coords);
        if (myfuncs.isLocationValid(this.fakeLocation)) {
            this.locationChanged(this.fakeLocation);
            this.props.updateLocation(this.fakeLocation);
        }

        setTimeout(this.fakeLocationChange, MyDefines.fakeSeconds * 1000);
    };
    static getDerivedStateFromProps(nextProps, prevState){
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "MapComponent");
            // console.log("MapComponenet GetDerivedStateFromProps");
            let update = {};
            if (prevState.parkedLocation !== nextProps.parkedLocation) {
                // console.log("MapComponenet GetDerivedStateFromProps new parkedLocationa: ", nextProps.parkedLocation);
                update.parkedLocation = nextProps.parkedLocation;
            }
            // if (prevState.profiles !== nextProps.profiles) {
            //     update.profiles = nextProps.profiles;
            // }
            return Object.keys(update).length ? update: null;
        } catch (error) {
            myfuncs.myRepo(error);
            return null;
        }
    };
    check_firestore_listener_distance_and_time = async () => {
        let reset_distance_meters = MyDefines.default_tasks.firestore_radius_meters / 2;
        let location = this.props.location;
        if (MyDefines.fakeLocation === true)
            location = this.fakeLocation;

        this.tenMins = myfuncs.getTenMinuteInterval();

        for (let idx=0; idx< 2; idx++) {
            if (myfuncs.isLocationValid(location) && myfuncs.isLocationValid(firestoreListenerLocation[idx])) {
                let distance = myfuncs.calcDistance(
                    {
                        "latitude": firestoreListenerLocation[idx].coords.latitude,
                        "longitude": firestoreListenerLocation[idx].coords.longitude
                    },
                    {
                        "latitude": location.coords.latitude,
                        "longitude": location.coords.longitude
                    });
                if (distance >= (reset_distance_meters)) {
                    console.log("Distance changed");
                    await this.clearSpaces(-1);   // clear all spaces
                    this.addGeoFirestoreListener(0);
                    this.addGeoFirestoreListener(1)
                } else {
                    // If ten minutes has changed, refresh one listener
                    if (this.tenMins - this.listenerTenMinutes[idx] > 1) {
                        console.log("Mins changed by two:", this.tenMins, ":", this.listenerTenMinutes[idx]);
                        await this.clearSpaces(idx);
                        this.addGeoFirestoreListener(idx);
                    }
                }
            }
        }
    };
    addGeoFirestoreListener(idx) {
        try {
            myfuncs.myBreadCrumbs('addGeoFirestoreListener', this.props.navigation.state.routeName);
            const firestore= firebase.firestore();
            const kilometers = MyDefines.default_tasks.firestore_radius_meters / 1000;

            let location = this.props.location;
            if (MyDefines.fakeLocation === true)
                location = this.fakeLocation;

            if (this.tenMins === 0)
                this.tenMins = myfuncs.getTenMinuteInterval();

            const geoFirestore = new GeoFirestore(firestore);

                // If the other listener is for THIS tenMins, set this listener to previous tenMins
            let myTen = this.tenMins
            if (this.listenerTenMinutes[(idx+1)%2] === myTen) {
                myTen--;
            }

            const geoCollectionRef = geoFirestore.collection(ApiKeys.firebase_collection).
                doc(ApiKeys.firebase_doc).collection(myTen.toString());

            if (this.geoSubscription[idx]) {
                console.log("cancelling old geoSubscription", idx);
                this.geoSubscription[idx]();
                this.geoSubscription[idx] = false;
            }
            this.listenerTenMinutes[idx] = myTen;
            console.log("Firestore Listener", idx, ": ", kilometers, "/", myTen);

            firestoreListenerLocation[idx] = _.cloneDeep(location);

            let query = geoCollectionRef.near({
                center: new firebase.firestore.GeoPoint(location.coords.latitude,
                    location.coords.longitude),
                radius: kilometers,  // Radius is kilometers.  .6 would be 600 meters
            });
            this.geoSubscription[idx] = query.onSnapshot((snapshot) => {
                console.log(snapshot.docChanges());
                snapshot.docChanges().forEach((change) => {
                    switch (change.type) {
                        case 'added':
                            console.log("New firestore" + idx, change.doc.data());
                            this.addSpace(change.doc.id, change.doc.data(), idx);
                            console.log("New firestore" + idx + " key_entered done");
                            break;
                        case 'modified':
                            console.log("New firestore", idx, " key_moved:", change.doc.data());
                            this.removeSpace(change.doc.id);
                            this.addSpace(change.doc.id, change.doc.data(), idx);
                            console.log("New firestore" + idx + " key_moved done");
                            break;
                        case 'removed':
                            console.log("firestore", idx, " key_exited", change.doc.id);
                            this.removeSpace(change.doc.id);
                            console.log("New firestore", idx, " key_exited done");
                            break;
                        default:
                            break;
                    }
                });
            });
            console.log("Firestore", idx, " listener added");

        } catch (error) {
            console.log("catch geoFirestoreListener", idx, ": " + error);
            myfuncs.myRepo(error);
        }
    }
    clearSpaces = async (idx) => {
        if (idx === -1)
            this.setState({spaces: []});
        else {
            let tMins = this.listenerTenMinutes[idx];
            let tSpaces = [...this.state.spaces];
            for (let i=tSpaces.length-1; i>=0; i--) {
                if (tSpaces[i].tenMinutes <= tMins) {
                    tSpaces.splice(i, 1);
                }
            }
            if (tSpaces.length !== this.state.spaces.length) {
                await this.setState({spaces: tSpaces});
            }
        }
    };

    addSpace = (id, rcd, idx) => {
        try {
            myfuncs.myBreadCrumbs('addSpace', this.props.navigation.state.routeName);
            let newSpace = {};
            console.log("addSpace: ", idx, ":", rcd);
            newSpace.tenMinutes = this.listenerTenMinutes[idx];
            newSpace.key = id;
            newSpace.id = rcd.id;
            newSpace.latitude = rcd.coordinates.latitude;
            newSpace.longitude = rcd.coordinates.longitude;
            // if (!myfuncs.isEmpty(rcd.timestamp)) {
            //     console.log("addSpace timeStamp true");
            // }

            let joined = this.state.spaces.concat(newSpace);
            this.setState({ spaces: joined });
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    removeSpace = (devId) => {
        try {
            myfuncs.myBreadCrumbs('removeMarker', this.props.navigation.state.routeName);
            console.log("removeSpace: ", devId);

            let index = this.state.spaces.findIndex(space => space.key === devId);
            let nextSpaces = this.state.spaces;
            nextSpaces.splice(index,1);

            this.setState({spaces: nextSpaces})
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    _getLocationAsync = async () => {
        try {
            myfuncs.myBreadCrumbs('getLocationAsync', this.props.navigation.state.routeName);
            // console.log("getLocationAsync");
            if ( (Platform.OS === 'android') && ( (!Constants.isDevice) || (MyDefines.androidTesting)) )
            {
                // console.log("Android emulator");
                await this.setState({locationResult: "Good"});
                await this.setState({hasLocationPermissions: true});
                if (this.state.initRegion === null) {
                    await this.setState({
                        initRegion: {
                            latitude: 35.910,
                            longitude: -78.692,
                            latitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                        }
                    });
                }
                this.props.updateLocation(
                    {
                        "coords": {
                            "accuracy": 5,
                            "altitude": -1,
                            "altitudeAccuracy": -1,
                            "heading": 90,
                            "latitude": 35.91057,
                            "longitude": -78.69085,
                            "speed": 20,
                        }
                    }
                );
            }
            else {
                let {status} = await Permissions.askAsync(Permissions.LOCATION);
                if (status !== 'granted') {
                    // console.log("Location Permission Not Granted");
                    this.setState({
                        locationResult: 'Permission to access location was denied',
                    });
                } else {
                    if (MyDefines.detail_logging)
                        console.log("Location Permission Granted");
                    this.setState({hasLocationPermissions: true});
                }

                let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
                this.setState({locationResult: JSON.stringify(location)});

                // console.log(location);
                this.props.updateLocation(location);

                if (this.state.initRegion === null)
                    await this.setState({
                        initRegion: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                        }
                    });
            }
            if (myfuncs.isLocationValid(this.props.location)) {
                await this.clearSpaces(-1);
                this.addGeoFirestoreListener(0);
                this.addGeoFirestoreListener(1);
                this._watchLocationAsync();
            }
        } catch (error) {
            let status = Location.getProviderStatusAsync();
            console.log("enableLoc:" + error);
            if (!status.locationServicesEnabled)
                alert("Enable Location Services");
            else {
                console.log("getProviderStatusAsync", status);
                myfuncs.myRepo(error);
            }
        }
    };
    _watchLocationAsync = async () => {
        try {
            myfuncs.myBreadCrumbs('watchLocationAsync', this.props.navigation.state.routeName);

            // console.log("entering _watchLocationAsync");
            if ( (Platform.OS === 'android') && ( (!Constants.isDevice) || (MyDefines.androidTesting)) ) {
                // console.log("Android emulator");
                // console.log(this.props.location);

                await this.setState({locationResult: "Good"});
                await this.setState({hasLocationPermissions: true});
                if (this.state.initRegion === null)
                    await this.setState({
                        initRegion: {
                            latitude: 35.910,
                            longitude: -78.692,
                            latitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                        }
                    });
            } else {
                if (MyDefines.detail_logging) {
                    if (Platform.OS === 'android')
                        console.log("Android device");
                    else
                        console.log("iOS");
                }
                if (this.state.hasLocationPermissions === true ) {
                    // console.log("calling watchPositionAsync");
                    this.watchId = await Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
                    if (MyDefines.detail_logging)
                        console.log("Done with watchPositionAsync");
                    }
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    locationChanged = async (location) => {
        try {
            myfuncs.myBreadCrumbs('locationChanged', this.props.navigation.state.routeName);

            this.props.updateLocation(location);    // Update our redux state location.

            // console.log(location);
            try {
                if (this.state.initRegion === null)
                    this.setState({
                        initRegion: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(MyDefines.default_user.profile.zoom_multiplier, 2),
                        }
                    });
            } catch(error) {
                console.log(' mapComponent.locationChanged caught', error);
                myfuncs.myRepo(error);
                // Handle exceptions
            }
            // console.log("LocationChanged lat/lon/deltas set");

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onPressParked = () => {
        console.log("Press Parked");
    };
    onPressSpace = (space) => {
        try {
            myfuncs.myBreadCrumbs('onPressMarker', this.props.navigation.state.routeName);

            // Loop thru all spaces. If other spaces withing 30 feet, show list of those spaces.
            // Else there's only one space at this location, so show it's pop-up
            let matchList = [];
            for (let spaceObj of this.state.spaces) {
                let distance = myfuncs.calcDistance(
                    {"latitude": space.latitude, "longitude": space.longitude},
                    {"latitude": spaceObj.latitude, "longitude": spaceObj.longitude});

                if (distance < MyDefines.default_client_parms.map_group_meters) {
                    matchList.push(spaceObj);
                }
            }


            let destination = "";
            let public_message = "";
            if (space.end_address !== "")
                destination = '\r\nDestination: ' + space.end_address;
            if (space.public_message !== "")
                public_message = '\r\n' + space.public_message;

            // console.log(e);
                Alert.alert(space.name, 'id:' + space.id + '   Headed: ' + space.bearing_desc +
                    destination + public_message,
                    [
                        {
                            text: 'Ribbon Details', onPress: () => {
                                this.goToRibbonDetails(space)
                            }
                        },
                        {text: 'Ok'},
                    ]);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onPressMyParkingSpot = () => {
        try {
            myfuncs.myBreadCrumbs('onPressMyParkingSpot', this.props.navigation.state.routeName);

            Alert.alert("You are currently parked here","Additional msg",
                [
                    { text: 'Alert others that I am leaving shortly', onPress: () => {this.leavingShortly()} },
                    {text: 'Ok'},
                ]);

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    leavingShortly = () => {
        console.log("perform Leaving shortly");
        myfuncs.addFirestoreLeavingRcd(this.props.location);
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', "MapComponent");
            let userIcon;
            userIcon = userIcon1;
            if (MyDefines.default_user.profile.map_user_icon === 2) {
                if (this.state.bearing < 180)
                    userIcon = userIcon2e;
                else
                    userIcon = userIcon2w;
            }
            let rWidth  = 20;
            let rHeight = 20;
            // if (Platform.OS === 'android') {
            //     rWidth = 15;
            //     rHeight = 15;
            // }

            rWidth  *= MyDefines.default_user.profile.map_user_size;
            rHeight *= MyDefines.default_user.profile.map_user_size;

                return (
                this.state.locationResult === null ?
                    <View>
                        <View style={{paddingTop: 180}}/>

                        <Text style={myStyles.myText}>Finding your current location...</Text>
                    </View>
                    :
                    (this.state.hasLocationPermissions === false) ?
                        <View style={{padding: 10}}>
                            <Text style={myStyles.myText}>Location permissions are not granted.</Text>
                            <View style={{paddingTop: 30}}/>
                            <Text style={myStyles.myText}>Ribity heavily depends on obtaining your location.</Text>
                            <View style={{paddingTop: 30}}/>
                            <Text style={myStyles.myText}>Many Ribity functionalities are disabled.</Text>
                            <View style={{paddingTop: 30}}/>
                            <Text style={myStyles.myText}>We will NOT sell your data</Text>
                            <View style={{paddingTop: 30}}/>

                            <Text style={myStyles.myText}>Please go to Settings on your device and allow the Ribity app access your location</Text>

                            <View style={{paddingTop: 30}}/>
                            <MyButton title={'  Try again  '}
                                      onPress={this._getLocationAsync}/>
                        </View>
                    :
                    (this.state.initRegion === null) ?
                        <Text style={myStyles.myText}>Map region doesn't exist.</Text>
                        :
                        <MapView
                            style={styles.bigMap}
                            ref={map => this.map = map}
                            initialRegion={this.state.initRegion}
                            showsMyLocationButton={true}
                            loadingEnabled
                            showsScale={true}
                            showsCompass={true}
                        >
                            {this.state.spaces.map((space, index) => (
                                <MapView.Marker
                                    key={index}
                                    coordinate={{longitude: space.longitude, latitude: space.latitude}}
                                    // title={space.name}
                                    // description={"(Headed: " + space.bearing_desc + ")  " + space.public_message}
                                    onPress={() => this.onPressSpace(space)}
                                >
                                </MapView.Marker>
                            ))}

                            {myfuncs.isLocationValid(this.state.parkedLocation) &&
                                <MapView.Marker
                                    coordinate={{
                                        longitude: this.state.parkedLocation.coords.longitude,
                                        latitude: this.state.parkedLocation.coords.latitude
                                    }}
                                    title={"You are parked here"}
                                    description={"More msgs data"}
                                    onPress={() => this.onPressMyParkingSpot()}
                                >
                                    <Image source={parkIcon}
                                           style={{
                                               width: 20,
                                               height: 20,
                                               resizeMode: 'contain',
                                               zIndex: 3,
                                           }}
                                    />

                                </MapView.Marker>
                            }

                            <MapView.Marker.Animated
                                coordinate={this.state.coordinate}
                                style={{
                                    transform: [
                                        {rotate: `${this.state.bearing}deg`}
                                    ],
                                }}
                                anchor={{x: 0.5, y: 0.5}}   // This puts the Android image in center.
                            >
                                <Image source={userIcon}
                                       style={{
                                           width: rWidth,
                                           height: rHeight,
                                           resizeMode: 'contain',
                                           zIndex: 3,
                                       }}
                                />
                            </MapView.Marker.Animated>
                        </MapView>

                );
            } catch (error) {
                if (error instanceof ReferenceError)
                    console.log("MapComponent referenceError. Probably Image issue. Don't send to myRepo");
                else
                    myfuncs.myRepo(error);
            }
        }
}

const styles = StyleSheet.create({
    bigMap: {
        alignSelf: 'stretch',
        height: (height - MyDefines.myStatusBarHeight),
    },
});

const mapStateToProps = (state) => {
    const { location } = state;
    const { tasks } = state;
    const { fakeLocations } = state;
    const { parkedLocation } = state;
    return { location, tasks, fakeLocations, parkedLocation}
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateLocation,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
