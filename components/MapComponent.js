import React from 'react';
import {Alert, Text, StyleSheet, Dimensions, Platform, View, Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Constants from 'expo-constants';
import {MyButton} from "./MyButton";

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
import {updateParkedLocation} from "../actions/ParkedLocationActions";
import {setPannedMap, setRecalculateSpaces} from "../actions/TasksActions";

const GEOLOCATION_OPTIONS = {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 1000,
    distanceInterval: 15,
};

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
            this.timeoutId_pan = -1;
            this.intervalId_animate = -1;
            this.redispTrackerId = -1;
            this.recalc = -1;
            this.fire_interval = -1;
            this.userHasControl = false;

            this.tenMins = 0;
            this.listenerTenMinutes = [0, 0];

            this.state = {
                hasLocationPermissions: false,
                locationResult: null,
                spaces: [],
                parkedLocation: null,
                iconOpacity: 1.0,
                bDisplayParkedIcon: false,

                showTracker: true,

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

            this.intervalId_animate = setInterval(this.handleAnimation,1500); // every 1.5 seconds

            this.recalc = setInterval(this.recalculate_spaces,3000); // every 3 seconds

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
            if (myfuncs.isLocationValid(this.props.parkedLocation) === true)
                this.setState({bDisplayParkedIcon: true});
            else
                this.setState({bDisplayParkedIcon: false});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    componentWillUnmount() {
        try {
            myfuncs.myBreadCrumbs('Willmount', this.props.navigation.state.routeName);

            for (let idx=0; idx<2; idx++) {
                if (this.geoSubscription[idx]) {
                    // console.log("Cancelling old Listener", idx, ":", this.listenerTenMinutes[idx], " (unMount)");
                    this.geoSubscription[idx]();
                    this.geoSubscription[idx] = false;
                }
            }
            if (this.watchId) {
                // console.log("remove watchPosition callback");
                this.watchId.remove();  // Remove the watchPosition callback
            }
            this.subs.forEach(sub => sub.remove());  // removes the componentWillFocus listener

            if (this.intervalId_animate !== -1)
                clearInterval(this.intervalId_animate);
            if (this.redispTrackerId !== -1)
                clearInterval(this.redispTrackerId);
            if (this.recalc !== -1)
                clearInterval(this.recalc);
            if (this.fire_interval !== -1)
                clearInterval(this.fire_interval);
            if (this.timeoutId_pan !== -1)
                clearTimeout(this.timeoutId_pan);
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
                            latitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
                    }
                });
            }
            this.userHasControl = false;
            this.props.setPannedMap(false);

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
                    useNativeDriver: false,
                };
                let region = {
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                    latitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
                    longitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
                };

                let heading = 0;
                if (this.props.settings.map_orients_to_users_bearing === 2 ||
                    this.props.settings.map_orients_to_users_bearing === '2') {
                    heading = this.props.location.coords.heading;
                    // console.log("heading1:", heading);
                }

                // console.log("props.settings:",this.props.settings );
                if ( this.map !=null ) {    // Added the IF because I had one exception in myRepo:  undefined is not an object (evaluating 'u.map.animateCamera'). I think this got called before it rendered the map
                    this.map.animateCamera(
                        {
                            center: region,
                            heading: heading,
                            pitch: 0,
                        }, 1000);
                }

                // this.state.coordinate.timing(spaceCoord, 1000).start();
                this.state.coordinate.timing(spaceCoord, 1000).start();
                if (this.props.settings.map_orients_to_users_bearing !== 2 &&
                    this.props.settings.map_orients_to_users_bearing !== '2')
                    this.setState({bearing: this.props.location.coords.heading});
                else {
                    if (this.state.bearing !== 0)
                        this.setState({bearing: 0})
                }
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    fakeLocationChange = () => {
        // if (MyDefines.detail_logging)
        //     console.log("fakeLocationChange");
            if (this.fakeCount % 30 === 0) {
                this.fakeLocation.coords.latitude = 35.91057;
                this.fakeLocation.coords.longitude = -78.69085;
            } else {
                let lat = this.fakeLocation.coords.latitude + .001;
                let lon = this.fakeLocation.coords.longitude + .001;
                this.fakeLocation.coords.latitude = (Math.round(lat * 100000) / 100000);
                this.fakeLocation.coords.longitude = (Math.round(lon * 100000) / 100000);
                if (this.fakeLocation.coords.heading < 344)
                    this.fakeLocation.coords.heading += 15;
                else
                    this.fakeLocation.coords.heading -= 345;
            }
            this.fakeCount++;
            // console.log("FakeCount:", this.fakeCount);

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
            // if (prevState.settings !== nextProps.settings) {
            //     update.settings = nextProps.settings;
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
                        // console.log("Mins changed by ten:", this.tenMins, ":", this.listenerTenMinutes[idx]);
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
            let myTen = this.tenMins;
            let myCollection = myfuncs.getCollectionName(0);
            if (this.listenerTenMinutes[(idx+1)%2] === myTen) {
                myTen--;
                myCollection = myfuncs.getCollectionName(-1);
            }

            const geoCollectionRef = geoFirestore.collection(ApiKeys.firebase_collection).
                doc(myCollection).collection(myTen.toString());

            if (this.geoSubscription[idx]) {
                // console.log("Cancelling old Listener", idx, ":", this.listenerTenMinutes[idx]);
                this.geoSubscription[idx]();
                this.geoSubscription[idx] = false;
            }
            this.listenerTenMinutes[idx] = myTen;

            firestoreListenerLocation[idx] = _.cloneDeep(location);

            let query = geoCollectionRef.near({
                center: new firebase.firestore.GeoPoint(location.coords.latitude,
                    location.coords.longitude),
                radius: kilometers,  // Radius is kilometers.  .6 would be 600 meters
            });
            this.geoSubscription[idx] = query.onSnapshot((snapshot) => {
                // console.log(snapshot.docChanges());
                snapshot.docChanges().forEach((change) => {
                    switch (change.type) {
                        case 'added':
                            // console.log("New firestore" + idx, change.doc.data());
                            this.addSpace(change.doc.id, change.doc.data(), idx);
                            // console.log("New firestore" + idx + " key_entered done");
                            break;
                        case 'modified':
                            // console.log("New firestore", idx, " key_moved:", change.doc.data());
                                if (MyDefines.logStateSpacesOnTouch)
                                    console.log("geoSub modified state:", this.state.spaces);
                            this.removeSpace(change.doc.id, idx);
                            this.addSpace(change.doc.id, change.doc.data(), idx);
                            // console.log("New firestore" + idx + " key_moved done");
                            break;
                        case 'removed':
                            // console.log("firestore", idx, " key_exited", change.doc.id);
                            this.removeSpace(change.doc.id, idx);
                            // console.log("New firestore", idx, " key_exited done");
                            break;
                        default:
                            break;
                    }
                });
            });
            // console.log("Firestore Listener", idx, ":", myTen);

        } catch (error) {
            console.log("catch geoFirestoreListener", idx, ": " + error);
            myfuncs.myRepo(error);
        }
    }
    recalculate_spaces = async () => {
        let bModified = false;
        let bRefresh = false;
        let tSpaces = [...this.state.spaces];
        let minsRemaining;
        let bMakeIconOpaque = false;
        let bDisplayParkedIcon;
        if (myfuncs.isLocationValid(this.props.parkedLocation) === true)
            bDisplayParkedIcon = true;
        else
            bDisplayParkedIcon = false;

        if (this.props.tasks.recalculate_spaces === true) {
            bRefresh = true;
            this.props.setRecalculateSpaces(false);
        }

        for (let i=tSpaces.length-1; i>=0; i--) {
            minsRemaining = this.calcRemainingMinutes(tSpaces[i].secsDeparting, 9999);
            if (minsRemaining >= 0) {
                if (minsRemaining !== tSpaces[i].minsRemaining || bRefresh) {
                    tSpaces[i].minsRemaining = minsRemaining;
                    this.setMinutesRemainingIcon(tSpaces[i]);
                    bModified = true;
                }
                let distance = myfuncs.calcDistance(
                    {"latitude": tSpaces[i].latitude, "longitude": tSpaces[i].longitude},
                    this.props.location.coords);
                if (distance < 300) {
                    bMakeIconOpaque = true;
                }
                if (bDisplayParkedIcon === true) {
                    distance = myfuncs.calcDistance(
                        {"latitude": tSpaces[i].latitude, "longitude": tSpaces[i].longitude},
                        this.props.parkedLocation.coords);
                    if (distance < 3) { // If one of the spaces is MY parked space, don't show parked Icon
                        bDisplayParkedIcon = false;
                    }
                }
            } else {
                if (MyDefines.log_details)
                    console.log("splice out space");
                tSpaces.splice(i, 1);
                bModified = true;
            }
            // bModified = true;
        }
        if (bModified) {
            if (MyDefines.log_details)
                console.log("bModified");
            await this.setState({spaces: tSpaces});
            this.props.parentSpaces(tSpaces);
        }
        if (bMakeIconOpaque)
            this.setState({iconOpacity: 0.4});
        else
            this.setState({iconOpacity: 1.0});
        if (bDisplayParkedIcon !== this.state.bDisplayParkedIcon)
            this.setState({bDisplayParkedIcon: bDisplayParkedIcon});
    };
    setMinutesRemainingIcon = (spaceRcd) => {

        let mins = spaceRcd.minsRemaining;
        let addition = (10-mins)*3;
        let base = 12;

        if (mins === 0)
            addition = 9;

        if (spaceRcd.dibs) {    // If someone has it reserved, show as yellow
            if (spaceRcd.dibsDevId === Constants.deviceId) {
                addition = 27;
                spaceRcd.fColor = "green";
                spaceRcd.bgColor = "silver";
            } else {
                spaceRcd.fColor = "tan";
                spaceRcd.bgColor = "gold";
                // addition = 15;
            }
        } else {
            spaceRcd.fColor = "orange";
            if (mins > 5)
                spaceRcd.bgColor = "green";
            else
                spaceRcd.bgColor = "green";
        }

        if (this.props.settings.dynamic_icons === false) {
            addition = 9;
            if (spaceRcd.dibsDevId === Constants.deviceId)
                addition = 15;
        }
        if (this.props.settings.large_icons === false) {
            if (spaceRcd.dibsDevId === Constants.deviceId)
                addition /= 2;
            else
                addition /= 3;
        }
        if (addition > 9)   // if not a tiny icon, shift numeral up just a bit.
            spaceRcd.top = -3;
        else
            spaceRcd.top = -1;
        spaceRcd.fSize = base+addition;
        spaceRcd.width = base+addition;
        spaceRcd.height = base+addition;
    };
    calcRemainingMinutes = (secsDeparting, rcdMins) => {
        let mySecs = new Date().getTime() / 1000;
        // mySecs = Math.trunc(mySecs);
        secsDeparting = Math.trunc(secsDeparting);
        let minsRemaining = ((secsDeparting - mySecs) / 60) + 1;

        // console.log("departingSec:", secsDeparting);
        // console.log("nowSec:", mySecs);

        // console.log("rcdMins:", rcdMins, " minsRemaininbg:", minsRemaining);
        // if (minsRemaining > rcdMins) {   // This prevents a potential quick display of mins that is greater than what user entered.
        //     minsRemaining = rcdMins;
            // console.log("Minus one");
        // }
        if (minsRemaining === 10)
            minsRemaining = 9;

        // console.log("MinsRemaing:", minsRemaining);
        return(Math.trunc(minsRemaining));
    };
    addSpace = async (devId, rcd, idx) => {
        try {
            myfuncs.myBreadCrumbs('addSpace', this.props.navigation.state.routeName);
            let bAddIt = true;
            let bModified = false;
            let secsDeparting = rcd.dateTime.seconds + rcd.departingMinutes*60;
            // secsDeparting = Math.trunc(secsDeparting);
            let minsRemaining = this.calcRemainingMinutes(secsDeparting, rcd.departingMinutes);
            if (MyDefines.logStateSpacesOnTouch)
                console.log("addSpace rcd:", rcd);
            if (MyDefines.log_details)
                console.log("addSpace Listener", idx, ":RCD:", rcd);
            // console.log("addSpace Listener", idx, ":ID:", devId);
            // console.log("addSpace Listener", idx, ":TEN", this.listenerTenMinutes[idx]);

            // if (!myfuncs.isEmpty(rcd.timestamp)) {
            //     console.log("addSpace timeStamp true");
            // }
            let bCanceling = false;
            if (rcd.departingMinutes === -1)
                bCanceling = true;

            let joined = Array.from(this.state.spaces);
            if (MyDefines.logStateSpacesOnTouch) {
                console.log("Incoming Joined:", joined);
                console.log("Incoming state:", this.state.spaces);
            }
            let index = joined.findIndex(space => space.key === devId);
            if (index >= 0) {
                // console.log("found previous devId space tenMinutes:", joined[index].tenMinutes);
                if (joined[index].tenMinutes < this.listenerTenMinutes[idx] ) {
                    joined.splice(index, 1);
                    if (MyDefines.logStateSpacesOnTouch)
                        console.log("delete previous devId index:", index);
                    bModified = true;
                } else {
                    if (MyDefines.logStateSpacesOnTouch)
                        console.log("keep previous devid space:", index);

                    if (bCanceling === true) {
                        if (MyDefines.logStateSpacesOnTouch)
                            console.log("canceling:", index);
                        joined.splice(index, 1);
                        bModified = true;
                    }
                    bAddIt = false;
                }
            } else {
                bAddIt = true;
            }
            if (bCanceling === true)
                bAddIt = false;

            if (MyDefines.logStateSpacesOnTouch)
                console.log("bAddit:", bAddIt, "|minsRemaining:", minsRemaining);

            if (bAddIt && minsRemaining >= 0) {
                bModified = true;
                let newSpace = {};

                newSpace.tenMinutes = this.listenerTenMinutes[idx];
                newSpace.key = devId;
                // newSpace.id = rcd.id;
                newSpace.latitude = rcd.coordinates.latitude;
                newSpace.longitude = rcd.coordinates.longitude;
                newSpace.vehicle = rcd.vehicle;
                newSpace.minsRemaining = minsRemaining;
                newSpace.secsDeparting = secsDeparting;
                newSpace.dibs = rcd.dibs;
                newSpace.dibsDevId = rcd.dibsDevId;
                newSpace.communalIds = rcd.communalIds;
                newSpace.note = rcd.note;
                newSpace.dateTime = rcd.dateTime;
                this.setMinutesRemainingIcon(newSpace);

                if (MyDefines.logStateSpacesOnTouch) {
                    console.log("PreJoin: ", joined);
                    console.log("Concatting it: ", newSpace);
                }
                joined = joined.concat(newSpace);
            }
            if (bModified) {
                if (MyDefines.logStateSpacesOnTouch)
                    console.log("bModified:", joined);
                await this.setState({spaces: joined});
                this.props.parentSpaces(joined);
            }
            // console.log("Spaces:", joined);

            if (MyDefines.log_details)
                console.log("Spaces:", joined);
        } catch (error) {
            console.log(error);
            myfuncs.myRepo(error);
        }
    };
    removeSpace = async (devId, idx) => {
        try {
            myfuncs.myBreadCrumbs('removeSpace', this.props.navigation.state.routeName);
            // console.log("removeSpace Listener", idx, ":", this.listenerTenMinutes[idx]);

            let nextSpaces = Array.from(this.state.spaces);
            let index = nextSpaces.findIndex(space => space.key === devId);

            if (index >= 0) {
                nextSpaces.splice(index, 1);
                await this.setState({spaces: nextSpaces});
                this.props.parentSpaces(nextSpaces);
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    clearSpaces = async (idx) => {
        if (idx === -1) {
            this.setState({spaces: []});
            this.props.parentSpaces([]);

        } else {
            let tMins = this.listenerTenMinutes[idx];
            let tSpaces = [...this.state.spaces];
            for (let i=tSpaces.length-1; i>=0; i--) {
                if (tSpaces[i].tenMinutes <= tMins) {
                    tSpaces.splice(i, 1);
                }
            }
            if (tSpaces.length !== this.state.spaces.length) {
                await this.setState({spaces: tSpaces});
                this.props.parentSpaces(tSpaces);
            }
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
                            latitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
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
                            latitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
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
                Alert.alert("Enable Location Services", null);
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
                            latitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
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
                            latitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
                            longitudeDelta: .0005 * Math.pow(this.props.settings.zoom_multiplier, 2),
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
    setTrackerDisplay = (bTrueFalse) => {
        this.setState({showTracker: bTrueFalse});
        if (bTrueFalse === false) {
            if (this.redispTrackerId) {
                clearTimeout(this.redispTrackerId)
            }
           this.redispTrackerId = setInterval(this.redisplayTracker,5000);
        }
    };
    redisplayTracker = () => {
        this.setState({showTracker: true})
    };
    onPressSpace = (space) => {
        try {
            myfuncs.myBreadCrumbs('onPressMarker', this.props.navigation.state.routeName);
            // console.log("Space pressed");
            let distance = myfuncs.calcDistance({"latitude": space.latitude, "longitude": space.longitude},
                this.props.location.coords);
            // console.log("Distance from space: ", distance);
            let myNote = "";
            if (space.note !== undefined && space.note !== null && space.note.length > 0)
                myNote = " - " + space.note;
            if (space.key === Constants.deviceId) {
                Alert.alert(space.vehicle + myNote, "This is your parking space",
                    [
                        {text: 'Ok'},
                        {
                            text: 'Modify departure time?', onPress: () => {
                                this.props.onDepartingShortly()
                            }
                        },
                    ]);
                return;
            }

            if (space.dibs === true) {
                if (space.dibsDevId === Constants.deviceId) {
                    Alert.alert(space.vehicle + myNote, "You currently have this space reserved",
                        [
                            {text: 'OK, My turn signal is on'},
                            {
                                text: 'Release this Spot?', onPress: () => {
                                    this.reserveThisSpot(space, false)
                                }
                            },
                        ]);
                } else {
                    Alert.alert(space.vehicle + myNote, "Someone already reserved this spot");
                }
            } else if (distance < 35) {
                Alert.alert(space.vehicle + myNote, "Activate your vehicle's turn signal, and reserve it ...",
                    [
                        {text: 'Cancel'},
                        {
                            text: 'Reserve This Spot', onPress: () => {
                                this.reserveThisSpot(space, true)
                            }
                        },
                    ]);
            } else {
                Alert.alert(space.vehicle + myNote, 'You must be within 35 meters to reserve this spot');
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    reserveThisSpot = (space, bDibs) => {
        // console.log("Reserve this spot:", space.tenMinutes);
        try {
            if (bDibs === true) {
                let tSpaces = [...this.state.spaces];
                for (let i = 0; i < tSpaces.length; i++) {
                    if (tSpaces[i].dibs && tSpaces[i].dibsDevId === Constants.deviceId) {
                        if (tSpaces[i].dateTime !== space.dateTime || tSpaces[i].vehicle !== space.vehicle) {
                            Alert.alert("You already have dibs on another space", "Please cancel the other dibs");
                            return;
                        }
                    }
                }
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }

        myfuncs.updateFirestoreReservedRcd(space, bDibs, this.props.settings);
    };
    onPressMyParkingSpot = () => {
        try {
            myfuncs.myBreadCrumbs('onPressMyParkingSpot', this.props.navigation.state.routeName);
            Alert.alert("Current parked location. ","You also may drag the Park icon to a new location",
                [
                    {text: 'Ok'},
                    {text: 'Clear saved location', onPress: () => {this.props.onSaveParkedLocation(0)} },
                ]);

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onUserParkingDragged = (e) => {
        let newCoord = {};
        newCoord.coords = e.nativeEvent.coordinate;
        // console.log("New:", newCoord);
        // console.log("Old:", this.props.parkedLocation);

        let distance = myfuncs.calcDistance(newCoord.coords, this.props.parkedLocation.coords);
        if (MyDefines.log_details)
            console.log("Moved it ", distance, " meters");
        if (distance > 3) {
            this.props.showParkDialog(true, newCoord);
            // Alert.alert("Save your new parked location?",null,
            //     [
            //         {text: 'Cancel', onPress: () => {this.refreshParkedIcon()} },
            //         {text: 'Yes', onPress: () => {this.props.onSaveParkedLocation(newCoord)}},
            //     ]);
        } else {
            this.refreshParkedIcon();
        }
    };
    refreshParkedIcon = () => {
        try {
            myfuncs.myBreadCrumbs('refreshParkedIcon', this.props.navigation.state.routeName);
            let tLocation = {...this.props.parkedLocation};
            if (tLocation !== null && tLocation !== 0 && (typeof tLocation.coords !== "undefined") ) {
                tLocation.coords.latitude += 0.00000000001; // This forces render to move icon back to original
                this.props.updateParkedLocation(tLocation);
                this.setState({parkedLocation: this.props.parkedLocation});
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    userPannedMap = () => {
        try {
            myfuncs.myBreadCrumbs('userPannedMap', this.props.navigation.state.routeName);
            // console.log("mk1a user panned");

            this.setUserPanned(true);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    setUserPanned = (bSetPanned) => {
        this.userHasControl = true;
        if(bSetPanned)
            this.props.setPannedMap(true);
        if (this.timeoutId_pan !== -1) {
            clearTimeout(this.timeoutId_pan);
        }
        this.timeoutId_pan = setTimeout(this.giveControlBackToMap,
            this.props.settings.refocus_seconds * 1000);
    };
    userPannedNewRegion = (e) => {
        try {
            myfuncs.myBreadCrumbs('userPannedNewRegion', this.props.navigation.state.routeName);

            // if (this.userHasControl) {  mk1
            //     this.props.setPannedCoords(e);
            // }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    giveControlBackToMap = () => {
        this.userHasControl = false;
        this.props.setPannedMap(false);
    };
    dispSpace = (space) => {
        try {
            myfuncs.myBreadCrumbs('dispSpace', this.props.navigation.state.routeName);
            let bDisp = true;
            let bCommunalOnly = false;
            let bMatchedMyCommunalList = false;

            // console.log("dispSpace:", space);
            // console.log("dispSpace Setting.communal_ids:", this.props.settings.communal_id);

            if (space.communalIds !== undefined && space.communalIds !== null) {
                // console.log("space has communalId field");
                for (let i = 0; i < 5; i++) {
                    if (space.communalIds[i] !== undefined && space.communalIds[i] !== null && space.communalIds[i].length > 0) {
                        // console.log("space.communalIds", i, " : ", space.communalIds[i]);
                        bCommunalOnly = true;
                        for (let j=0; j<5; j++) {
                            if (space.communalIds[i].toUpperCase() === this.props.settings.communal_id[j].toUpperCase()) {
                                // console.log("space.CommunalIds", j, " : ", "matched");
                                bMatchedMyCommunalList = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (bCommunalOnly === true && bMatchedMyCommunalList === false)
                bDisp = false;
            return bDisp;
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onPressMap = (event) => {
        if (MyDefines.logStateSpacesOnTouch)
            console.log("onPressMap state:", this.state.spaces);

        this.setTrackerDisplay(false);
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', "MapComponent");
            let userIcon;
            userIcon = userIcon1;
            // console.log("settings:", this.props.settings);
            if ( (this.props.settings.map_user_icon === 2) ||
                 (this.props.settings.map_user_icon === '2') ) {
                if (this.state.bearing < 180)
                    userIcon = userIcon2e;
                else
                    userIcon = userIcon2w;
            }
            let myNote;
            let rWidth  = 23;
            let rHeight = 23;
            if (this.state.iconOpacity < 1) {
                rWidth = 12;
                rHeight = 12;
            }
            // if (Platform.OS === 'android') {
            //     rWidth = 15;
            //     rHeight = 15;
            // }

            rWidth  *= this.props.settings.map_user_size;
            rHeight *= this.props.settings.map_user_size;

            // console.log("state.parkedLocation:", this.state.parkedLocation);
            // console.log("bDPicon:", this.state.bDisplayParkedIcon);
            // console.log("parkedLocation:", this.state.parkedLocation);
            // console.log("rendSpaces:", this.state.spaces);

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
                            <Text style={myStyles.myText}>Dibsity heavily depends on obtaining your location.</Text>
                            <View style={{paddingTop: 30}}/>
                            <Text style={myStyles.myText}>Many Dibsity functionalities are disabled.</Text>
                            <View style={{paddingTop: 30}}/>
                            <Text style={myStyles.myText}>Note, we will NOT sell your data</Text>
                            <View style={{paddingTop: 30}}/>
                            <Text style={myStyles.myText}>Please go to Settings on your device and allow the Dibsity app access your location</Text>

                            <View style={{paddingTop: 30}}/>

                            <MyButton onPress={this._getLocationAsync}
                                      title={"  Try again  "}
                            />
                        </View>
                    :
                    (this.state.initRegion === null) ?
                        <Text style={myStyles.myText}>Map region doesn't exist.</Text>
                        :
                        <MapView
                            style={styles.bigMap}
                            ref={map => this.map = map}
                            initialRegion={this.state.initRegion}
                            onMoveShouldSetResponder={this.userPannedMap}
                            onPanDrag={this.userPannedMap}
                            onRegionChange={this.userPannedNewRegion}
                            showsMyLocationButton={true}
                            loadingEnabled
                            showsScale={true}
                            showsCompass={true}
                            onPress={(e) => this.onPressMap(e)}
                        >
                            {this.state.showTracker &&
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
                                           opacity: this.state.iconOpacity,
                                       }}
                                />
                            </MapView.Marker.Animated>
                            }

                            {this.state.spaces.map((space, index) => {
                                if (space.note !== undefined && space.note !== null && space.note.length > 0)
                                    myNote = space.vehicle + " - " + space.note;
                                else
                                    myNote = space.vehicle;
                                if (this.dispSpace(space) === true)
                                    return (
                                            <MapView.Marker
                                                key={index}
                                                coordinate={{longitude: space.longitude, latitude: space.latitude}}
                                                title={myNote}
                                                // description={"Headed"}
                                                onPress={() => this.onPressSpace(space)}
                                                anchor={{x: 0.5, y: 0.5}}   // This puts the Android image in center.
                                            >
                                                <Image style={[styles.imageContainer,
                                                    {width: space.width, height: space.height, resizeMode: 'contain'}]}
                                                />
                                                <View style={[styles.overlay, {backgroundColor: space.bgColor}]}/>
                                                <View style={[styles.rectText, {top: space.top}]}>
                                                    <Text style={{
                                                        color: space.fColor,
                                                        fontWeight: 'bold',
                                                        fontSize: space.fSize
                                                    }}>{space.minsRemaining}</Text>
                                                </View>
                                            </MapView.Marker>
                                )
                            })}
                            {(this.state.bDisplayParkedIcon && myfuncs.isLocationValid(this.state.parkedLocation)) &&
                            <MapView.Marker
                                draggable
                                onDragEnd={this.onUserParkingDragged}
                                coordinate={{
                                    longitude: this.state.parkedLocation.coords.longitude,
                                    latitude: this.state.parkedLocation.coords.latitude
                                }}
                                title={"Current parked location"}
                                description={"You may drag the Parked icon to a new location"}
                                onPress={() => this.onPressMyParkingSpot()}
                                anchor={{x: 0.5, y: 0.5}}   // This puts the Android image in center.
                            >
                                <Image source={parkIcon}
                                       style={{
                                           width: 20,
                                           height: 20,
                                       }}
                                />
                            </MapView.Marker>
                            }
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
        ...StyleSheet.absoluteFillObject,   // This allows the spaces Icons to be displayed on top of the little frog tracker.
    },
    rectText: {
        position: 'absolute',
        top: -3,    // Needed to better center the numeral
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1,
        width: null,
        height: null,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 5,
        // backgroundColor: 'lightgreen',
    }
});

const mapStateToProps = (state) => {
    const { location } = state;
    const { tasks } = state;
    const { fakeLocations } = state;
    const { parkedLocation } = state;
    const { settings } = state;
    return { location, tasks, fakeLocations, parkedLocation, settings}
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateLocation,
        updateParkedLocation,
        setPannedMap,
        setRecalculateSpaces,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
