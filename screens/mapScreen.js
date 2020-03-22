import React from 'react';
import {Alert, StyleSheet, View, Dimensions, Image, TouchableOpacity} from 'react-native';
import * as StoreReview from 'expo-store-review';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text} from "@ui-kitten/components";
import {Ionicons} from '@expo/vector-icons';
import Toast from 'react-native-easy-toast';
import MyDefines from '../constants/MyDefines';
import myStyles from "../myStyles";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";
import TasksComponent from '../components/TasksComponent';
import myfuncs from "../services/myFuncs";
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import {ThemeButton} from "../components/themeButton";
import {ScreenTitle} from "../components/screenTitle";
import {ProfileHeader} from "../components/ProfileHeader";
import {MyButton} from '../components/MyButton';

let willUnmount = false;
let dibsityLogo = require('../assets/images/PurpleFace_512x512.png');

const {height, width} = Dimensions.get('window');
const initialState = {
};

class MapScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'MapScreen');
            const { params = {} } = navigation.state;
            return {
                headerLeft: () => <ProfileHeader profile={params.myProfile} onPress={params.onPress}/>,
                headerTitle: () => <ScreenTitle title={"Audio"}
                                                androidMoveLeft={20}
                                                // privacy={() => navigation.navigate("Privacy")}
                />,
                headerRight: () => <ThemeButton/>,
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

            if (MyDefines.log_details)
                console.log("height:", height, " width:", width, "statusbar:", MyDefines.myStatusBarHeight);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    getUserStoredData = async () => {
        try {
            myfuncs.myBreadCrumbs('getUserStoredData', this.props.navigation.state.routeName);
            let retObj = await myfuncs.init();

            await this.props.updateSettings(retObj.settings);
            myfuncs.setAwakeorNot(this.props.settings.keep_awake);

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

    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);


            return (
               <SafeAreaView style={styles.container}>
                   <Layout style={{flex: 1, alignItems: 'center'}}>
                       <TasksComponent/>

                       <View>
                           <View style={{padding: 25}}/>
                           <TouchableOpacity onPress={this.showToast}>
                               <Text style={styles.welcomeUser}>Welcome to Dibsity</Text>
                               <Image style={styles.dibsityLogo} source={dibsityLogo}/>
                           </TouchableOpacity>

                           <View style={{padding: 15}}/>
                           <View>
                               <View style={{padding: 15}}/>
                               <MyButton buttonStyle={myStyles.selectButton}
                                         textStyle={myStyles.selectButtonText}
                                         onPress={this.goToStoriesScreen}
                                         title={"Select a Story, or\nBuild a PlayList"}/>
                           </View>

                       </View>


                       <Toast
                           ref="toast"
                           style={{backgroundColor:'mediumpurple',borderRadius: 20,padding: 10}}
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
                   </Layout>
               </SafeAreaView>
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
        color: 'mediumpurple',
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
        color: 'mediumpurple',
        marginHorizontal: 5,
        paddingTop: 10,
        fontStyle: 'italic',
    },
    smallText: {
        fontSize: 20,
        lineHeight: 22,
        fontWeight: 'bold',
        // textAlign: 'justify',
        color: 'mediumpurple',
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
