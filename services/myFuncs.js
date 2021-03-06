import hardStorage from "./deviceStorage";
import {Alert, Platform} from 'react-native'
import * as Sentry from "sentry-expo";
import MyDefines from '../constants/MyDefines';
import { Audio } from 'expo-av';
import * as Localization from 'expo-localization';
import ApiKeys from '../constants/ApiKeys';
import * as geolib from "geolib";
import * as Constants from 'expo-constants';
import * as Device from 'expo-device';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

import * as firebase from "firebase";
import 'firebase/firestore';
import {GeoFirestore} from "geofirestore";

const SOUNDS = {};
let SOURCES = {};
let bSoundsAreLoaded = false;
let bSoundIsPlaying = false;

let myfirestore = null;

class myFuncs  {
    init = async () => {
        let settings = MyDefines.default_settings;
        let vehicle = MyDefines.default_vehicle;
        let parkedLocation = null;
        let new_user = false;
        try {
            this.initRepo();
            this.myBreadCrumbs('init', "myfuncs");

            await this.initFirebase();

            if (MyDefines.clearAllStorage === true)
                await hardStorage.clearAll();

            new_user = await this.check_new_user();

            let user_settings = await hardStorage.getKey("user_settings");
            if (user_settings !== null) {
                settings = {...settings, ...user_settings};
                if (MyDefines.log_details)
                    console.log("Successfully retrieved settings from Storage:", settings)
            }

            let user_vehicle = await hardStorage.getKey("user_vehicle");
            if (user_vehicle !== null) {
                vehicle = {...vehicle, ...user_vehicle};
                if (MyDefines.log_details)
                    console.log("Successfully retrieved vehicle from Storage:", vehicle)
            }
            parkedLocation = await hardStorage.getKey("parkedLocation");

            // console.log("1st parkLoc from hardStorage:", parkedLocation);
            // if (typeof parkedLocation.location !== "undefined") {
            //     console.log("parkedLocation.location = undefined");
            //     parkedLocation.coords = {...parkedLocation.location.coords};
            //     delete parkedLocation.location;
            // }

            if (parkedLocation === null || parkedLocation === 0 ||
                (typeof parkedLocation.location === "undefined") ||
                (typeof parkedLocation.location.coords === "undefined") )
                parkedLocation = {};

            // console.log("2nd parkLoc from hardStorage:", parkedLocation);

            // console.log("init after");

        } catch (error) {
            this.myRepo(error);
        }
        return {settings: settings, vehicle: vehicle, new_user: new_user, parkedLocation: parkedLocation};
    };
    check_new_user = async () => {
        let new_user = false;
        try {
            this.myBreadCrumbs('check_new_user', "myfuncs");
            let registered_user = await hardStorage.getKey("dibsity_user");
            if (registered_user === null) {
                new_user = true;
                hardStorage.setKey("dibsity_user", true);
                // console.log("new user");
                if (MyDefines.disable_newUserSentry === true)
                    console.log("New user not sent to Sentry");
                else
                    Sentry.captureMessage("New Dibsity user", 'info');
            }
        } catch (error) {
            this.myRepo(error);
        }
        return new_user;
    };
    writeUserDataToLocalStorage = async (key, data) => {
        try {
            this.myBreadCrumbs('writeUserDataToLocalStorage', "myfuncs");

            await hardStorage.setKey(key, data);
            // console.log("storage updated ", key, ":", data );

            if (MyDefines.log_details)
                console.log("user_data written to Storage:", key, ":", data );
        } catch (error) {
            this.myRepo(error);
        }
    };
    initRepo = () => {
        try {
            Sentry.init({
                dsn: ApiKeys.sentry_dsn,
                enableInExpoDevelopment: true,
                debug: true,
                beforeSend(event) {
                    console.log("sending to Sentry");
                    return event;
                }
            });
            Sentry.setRelease("1.0.0");
            Sentry.configureScope(function (scope) {
                scope.setExtra("myExtraData", {
                    "local_timezone": Localization.timezone,
                });
            });
            Sentry.configureScope(function (scope) {
                scope.setExtra("expoConstants", {
                    // "releaseChannel": releaseChan,
                    "appOwnership": Constants.default.appOwnership,
                    "debugMode": Constants.default.debugMode,
                    "deviceId": Constants.default.deviceId,
                    "deviceName": Constants.default.deviceName,
                    "deviceYearClass": Constants.default.deviceYearClass,
                    "experienceUrl": Constants.default.experienceUrl,
                    "expoRuntimeVersion": Constants.default.expoRuntimeVersion,
                    "expoVersion": Constants.default.expoVersion,
                    "platform": Constants.default.platform,
                    "installationId": Constants.default.installationId,
                    "isDetached": Constants.default.isDetached,
                    "isDevice": Constants.default.isDevice,
                    "sessionId": Constants.default.sessionId,
                    "isHeadless": Constants.default.isHeadless,
                    "statusBarHeight": Constants.default.statusBarHeight,
                    "supportedExpoSdks": Constants.default.supportedExpoSdks,
                    // "releaseChannel": Constants.default.releaseChannel,
                });
            });
            Sentry.configureScope(function (scope) {
                scope.setExtra("deviceInfo", {
                    "brand": Device.brand,
                    "manufacturer": Device.manufacturer,
                    "modelId": Device.modelId,
                    "modelName": Device.modelName,
                    "osBuildId": Device.osBuildId,
                    "osInternalBuildId": Device.osInternalBuildId,
                    "osName": Device.osName,
                    "osVersion": Device.osVersion,
                    "osTotalMemory": Device.totalMemory,
                });
            });
        } catch (error) {
            console.log("Send myRepo");
            this.myRepo(error);
        }
    };
    myRepo = (error) => {
        try {
            if (MyDefines.myRepo_logging)
                Sentry.captureException(error);
            else
                console.log(error);
        } catch (error) {
            console.log(error);
        }
    };
    myBreadCrumbs = (message, category) => {
        try {
            if (MyDefines.myRepo_logging  && MyDefines.console_log_breadcrumbs) {
                    let bc_object = {
                    message: message,
                };
                if (category !== undefined) {
                    bc_object.category = category;
                }
                Sentry.addBreadcrumb(bc_object);
                if (MyDefines.console_log_breadcrumbs) {
                    if (category !== undefined)
                        console.log(message, ":", category);
                    else
                        console.log(message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    setAwakeorNot = (bKeepAwake) => {
        if (bKeepAwake) {
            activateKeepAwake();
        } else {
            deactivateKeepAwake();
        }
    };
    initFirebase = async () => {
        try {
            let fbConfig;

            fbConfig = ApiKeys.FirebaseConfig;
            if (!firebase.apps.length) {
                // console.log("initializing firebase");
                let app = await firebase.initializeApp(fbConfig);
            }
            myfirestore = firebase.firestore();

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };



    // Got a problem. If they are UPDATING their departure time, we need to see if the
    // existing spaces[] record for this device is in the previous tenMinutes or this
    // ten minjtes.  If previous, we need to preserve the dibs and dibsDeviId from
    // previous tenMinutes space. We can do this in the db.transaction by passing
    // a parm that says bPreservePreviousRecord. We will know bPreservePreviousRecord
    // true/false by searching state.spaces for this devId and if found and the
    // tenMinutes is NOT equal to this tenMinutes, set bPreservPreviousRecord to true
    // and then the db.transaction knows to read the previous tenMinutes.
    // Or have a small exposure and just preserve the dibs and devId from the state.spaces
    // which has the exposure of ships passing in the night.
    addFirestoreDepartingRcd = async (coords, note, vehicle, tenMins, departingMinutes, setOrUpdateOrPrevious,
                                      prevDibs, prevDibsDevId, settings, bPostCommunal) => {
        try {
            let geofirestore;

            this.myBreadCrumbs('addFirestoreDepartingRcd', "myfuncs");

            // console.log("addFirestoreDepartingRcd:", coords, ":", tenMins, ":", departingMinutes, ":",
            //     setOrUpdateOrPrevious, ":", prevDibs, ":", prevDibsDevId);
            if (myfirestore === null)   // This should never be null, because we init at init.
                this.initFirebase();
            try {
                geofirestore = new GeoFirestore(myfirestore);
            }  catch (error) {
                console.log("myFuncs geofireStore Exception. init'ing again");
                this.initFirebase();
                geofirestore = new GeoFirestore(myfirestore);
                this.myBreadCrumbs('Departing init again', "myfuncs");
                myfuncs.myRepo(error);
            }
            // console.log("myFuncs Settings:", settings);
            let vDesc = vehicle.description;
            if (vehicle.plate.length > 0)
                vDesc += " - Plate: " + vehicle.plate;
            let rcd = {
                vehicle: vDesc,
                note: note,
                dateTime: new Date(),
                departingMinutes: departingMinutes,
                communalIds: settings.communal_id,
                coordinates: new firebase.firestore.GeoPoint(coords.latitude, coords.longitude)
            };
            if (setOrUpdateOrPrevious === 2) {
                rcd.dibs = prevDibs;
                rcd.dibsDevId = prevDibsDevId;
            }
            if (bPostCommunal === true) {
                rcd.communalIds = settings.communal_id;
            } else {
                rcd.communalIds = null;
            }
            if (departingMinutes === -1) {  // If user is canceling, clear dibs in case user post a new departure time
                rcd.dibs = false;
                rcd.dibsDevId = 0;
            }
            let geocollection = geofirestore.collection(ApiKeys.firebase_collection).
                    doc(myfuncs.getCollectionName(0)).collection(tenMins.toString());
            if (setOrUpdateOrPrevious === 1) {
                await geocollection.doc(Constants.default.deviceId).update(rcd);
            } else {
                await geocollection.doc(Constants.default.deviceId).set(rcd);
            }
        } catch (error) {
            console.log("Firestore set error:", error);
            myfuncs.myRepo(error);
        }
    };
    updateFirestoreReservedRcd = async (space, bDibs, settings) => {
        try {
            let newFirestore;
            this.myBreadCrumbs('updateFirestoreReservedRcd', "myfuncs");
            // console.log("updateFirestore");
            if (myfirestore === null)   // This should never be null, because we init at init.
                this.initFirebase();
            try {
                newFirestore = new firebase.firestore();
            }  catch (error) {
                console.log("myFuncs geofireStore update Exception. init'ing again");
                this.initFirebase();
                newFirestore = new firebase.firestore();
                this.myBreadCrumbs('Update init again', "myfuncs");
                myfuncs.myRepo(error);
            }
            let cName = myfuncs.getCollectionName(0);
            let collection = newFirestore.collection(ApiKeys.firebase_collection).
            doc(cName).collection(space.tenMinutes.toString());

            // console.log(cName, "-", space.tenMinutes, "-", space.key,  ": updating Dibs:", bDibs);
            try {
                await this.doReservedTransaction(newFirestore, collection, space.key, bDibs, settings);
                    // await geocollection.doc(space.key).update({
                    //     dibs: bDibs,
                    //     dibsDevId: devId,
                    // });
            }  catch (error) {
                console.log("Caught the error:", error);
            }
        } catch (error) {
            console.log("Firestore update error:", error);
            myfuncs.myRepo(error);
        }
    };
    doReservedTransaction = async (firestore, collection, rKey, bDibs, settings) => {
        let devId = Constants.default.deviceId;
        let dMessage = null;
        let bDoTheUpdate = false;
        let retValue = 0;

        firestore.runTransaction(function(transaction) {
            return transaction.get(collection.doc(rKey)).then(function(existingDoc) {
                if (!existingDoc.exists) {
                    throw "Document does not exist!";
                }
                let eData = existingDoc.data().d;
                if (bDibs === true) {
                    if (eData.dibs !== true) {
                        eData.dibs = true;
                        eData.dibsDevId = devId;
                        bDoTheUpdate = true;
                    } else if (eData.dibsDevId !== devId) {
                        return "Sorry, someone else already has the space reserved";
                    } else {
                        if (settings.confirmation_popups)
                            return "This space is already reserved for you";
                        else
                            return null;
                    }
                } else if (bDibs === false) {
                    if ((eData.dibs === true) && (eData.dibsDevId === devId)) {
                        eData.dibs = false;
                        eData.dibsDevId = 0;
                        bDoTheUpdate = true;
                    }
                }
                if (bDoTheUpdate) {
                    transaction.update(collection.doc(rKey), {d: eData});
                    if (settings.confirmation_popups) {
                        if (bDibs === true)
                            return "Success. This space is currently reserved for you";
                        else
                            return "Space released for others";
                    } else {
                        return null;
                    }
                }
            });
        }).then(function(dMessage) {
            // console.log("Successful dMessage:", dMessage);

            if (dMessage !== null)
                Alert.alert(dMessage, null);
        }).catch(function(dMessage) {
            console.log("Error dMessage:", dMessage);
            Alert.alert("Error reserving space, sorry", null);
        });
    };

    getCollectionName = (offset) => {
        let d = new Date();
        let n = d.getMonth() + 1;
        let y = d.getFullYear();

        // If user wants the collection name for the previous tenMinutes, check for month and year roll-over
        if (offset === -1) {
            if ( (d.getDate() === 1) && (d.getHours() === 0) && (d.getMinutes() < 10) )  {
                if (n !== 1) {
                    n--;
                } else {
                    n = 12;
                    y--;
                }
            }
        }

        return(n.toString() + "_" + y.toString() );
    };
    isEmpty = (myObj) => {
        return !myObj || Object.keys(myObj).length === 0;
    };
    androidPadding = (textFocused, extraPad) => {
        let padLines = 0;
        if (Platform.OS === 'android' && textFocused === true)
            padLines = 100 + extraPad;
        return(padLines);
    };
    isAndroid = () => {
        if (Platform.OS === 'android')
            return true;
        else
            return false;
    };
    isLocationValid = (locObj) => {
        try {
            // this.myBreadCrumbs('isLocationValid', 'MyFuncs');

            if (locObj === 0 || locObj === null || locObj === undefined || locObj === {} ||
                // (typeof locObj.coords === "undefined" && typeof locObj.latitude === "undefined") )
                (typeof locObj.coords === "undefined") )
                return false;
            else
                return true;
        } catch (error) {
            this.myRepo(error);
        }
    };
    calcDistance = (coord1, coord2) => {
        try {
            // console.log("coord1:", coord1);
            // console.log("coord2:", coord2);
            let distance = geolib.getDistance(
                {
                    "latitude": coord1.latitude,
                    "longitude": coord1.longitude
                },
                {
                    "latitude": coord2.latitude,
                    "longitude": coord2.longitude
                },
                1);
            return distance;
        } catch (error) {
            this.myRepo(error);
            return 0;
        }
    };
    reviewChosen = async () => {
        await hardStorage.setKey("reviewedApp", true);
    };
    hasUserReviewed = async () => {
        let reviewedApp = await hardStorage.getKey("reviewedApp");
        if (reviewedApp !== null) {
            if (reviewedApp === true)
                return true;
        }
        return false;
    };
    getTenMinuteInterval = () => {
        let baseDate = new Date(2020, 2, 31, 0, 0);
        let currDate = new Date();
        if (MyDefines.oneMinuteIntervals) {
            let oneMinutes = (currDate - baseDate) / (1000 *  60);
            return Math.floor(oneMinutes);
        } else {
            let tenMinutes = (currDate - baseDate) / (1000 * 60 * 10);
            return Math.floor(tenMinutes);
        }
    };
    // getOneMinuteInterval = () => {
    //     let baseDate = new Date(2020, 2, 31, 0, 0);
    //     let currDate = new Date();
    //
    //     let oneMinutes = (currDate - baseDate) / (1000 *  60);
    //     return Math.floor(oneMinutes);
    // };
    clone = (obj) => {
        if (null == obj || "object" != typeof obj) return obj;
        let copy = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    };
}

const myfuncs = new myFuncs();
export default myfuncs;


