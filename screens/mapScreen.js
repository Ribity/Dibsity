import React from 'react';
import {Alert, StyleSheet, View, Dimensions, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Layout, Text} from "@ui-kitten/components";
import MapComponent from '../components/MapComponent';

import Toast from 'react-native-easy-toast';
import MyDefines from '../constants/MyDefines';
import myStyles from "../myStyles";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";
import TasksComponent from '../components/TasksComponent';
import WaitComponent  from './../components/WaitComponent';
import myfuncs from "../services/myFuncs";
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import {LogoComponent} from "../components/LogoComponent";
import {ScreenTitle} from "../components/screenTitle";
import ApiKeys from "../constants/ApiKeys";
import * as firebase from "firebase";
import 'firebase/firestore';

import { decode, encode } from 'base-64'
import {ParkedIcon} from "../components/ParkedIcon";
import {MyButton} from "../components/MyButton";
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }

if (!global.btoa) { global.btoa = encode; }

if (!global.atob) { global.atob = decode; }


let willUnmount = false;
let dibsityLogo = require('../assets/images/DibsityFace_512x512.png');

const {height, width} = Dimensions.get('window');
const initialState = {
    welcomeTheUser: true,
    showInitMessage: true,
    readyToGo: false,
    isAuthenticated: false,
};

class MapScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'MapScreen');
            const { params = {} } = navigation.state;
            return {
                headerLeft: () => <LogoComponent/>,
                headerTitle: () => <ScreenTitle title={"Dibsity"}/>,

            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    constructor(props) {
        super(props);
        this.state = initialState;
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
    componentWillUnmount() {
        if (this.onAuthStateChangedUnsubscribe)
            this.onAuthStateChangedUnsubscribe();
    }
    getUserStoredData = async () => {
        try {
            myfuncs.myBreadCrumbs('getUserStoredData', this.props.navigation.state.routeName);
            let retObj = await myfuncs.init();

            await this.initFirebase();

            await this.props.updateSettings(retObj.settings);
            myfuncs.setAwakeorNot(this.props.settings.keep_awake);

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    initFirebase = async () => {
        try {
            let fbConfig;

            fbConfig = ApiKeys.FirebaseConfig;
            if (!firebase.apps.length) {
                console.log("initializing firebase");
                let app = await firebase.initializeApp(fbConfig);
            }
            // this.onAuthStateChangedUnsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
            // this.signInAnonymously();
            // this.storeHighScore(2, 1001);
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
            // if (prevState.stories_list !== nextProps.stories_list) {
            //     update.stories_list = nextProps.stories_list;
            // }
            // if (prevState.profiles !== nextProps.profiles) {
            //     update.profiles = nextProps.profiles;
            // }
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
    saveParkedLocation = () => {
        console.log("save parked button pressed");
    };

    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);


            return (
                <View style={myStyles.container}>
                       <TasksComponent/>

                       {this.state.readyToGo === false &&
                       <WaitComponent/>
                       }
                        {(this.state.readyToGo === true && MyDefines.default_tasks.refresh_map === false) &&
                        <MapComponent navigation={this.props.navigation}/>
                        }
                        {(this.state.readyToGo === true && MyDefines.default_tasks.refresh_map === false) &&
                        <ParkedIcon onPress={this.saveParkedLocation} />
                        }

                       {this.state.welcomeTheUser === true &&
                       <Text style={styles.WelcomeUser}>Welcome</Text>
                       }

                       <Toast
                           ref="toast"
                           style={{backgroundColor:'mediumseagreen',borderRadius: 20,padding: 10}}
                           position='top'
                           positionValue={0}
                           fadeOutDuration={1000}
                           opacity={.9}
                           textStyle={{color:'gold',fontSize:21}}
                       />

                       <MyHelpIcon onPress={this.onHelpPress}/>
                       <MyHelpModal screen={"Map"}
                                    onExitPress={this.onHelpExitPress}
                                    isVisible={this.state.isModalVisible}/>
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
    showToast = () => {
        this.refs.toast.show("We encourage you to write a story and send to:" +
            "\r\n\nStories@dibsity.com.com " +
            "\r\n\nWe will publish it on Dibsity and contact you when it is added to the Dibsity list of Write-In stories.", 2000);
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,

        // backgroundColor: 'white',
    },
    mapStyle: {
        width: width,
        height: height,
    },
    WelcomeUser: {
        position: 'absolute',
        bottom: (height/2 + height/5 - MyDefines.myStatusBarHeight),
        fontSize: 22,
        fontStyle: 'italic',
        fontWeight: 'bold',
        opacity: .6,
        color: 'green',
    },

    dibsityLogo: {
        justifyContent:'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 40,
        height: 40,
    },
    welcomeUser: {
        fontSize: 25,
        fontWeight: 'bold',
        lineHeight: 25,
        color: 'green',
        marginHorizontal: 20,
        textAlign: 'center'
    },
    bottom: {
        // position: 'absolute',
        // flexDirection: 'row',
        alignItems: 'center',
        // bottom: (MyDefines.myBottomTabBarHeight),
        marginBottom: 10,
    },

    bigText: {
        fontSize: 26,
        lineHeight: 28,
        fontWeight: 'bold',
        // textAlign: 'justify',
        color: 'green',
        marginHorizontal: 5,
        paddingTop: 10,
        fontStyle: 'italic',
    },
    smallText: {
        fontSize: 20,
        lineHeight: 22,
        fontWeight: 'bold',
        // textAlign: 'justify',
        color: 'green',
        marginHorizontal: 5,
        paddingTop: 10,
        fontStyle: 'italic',
    },
});

const mapStateToProps = (state) => {
    const { settings } = state;
    return { settings }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateSettings,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
