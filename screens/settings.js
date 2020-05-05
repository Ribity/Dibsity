import React from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native'
import {SafeAreaView} from "react-navigation";
import myfuncs from "../services/myFuncs";
import MyDefines from "../constants/MyDefines";
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";
import {ScreenTitle} from "../components/screenTitle";
import {MyButton} from "../components/MyButton";
import SettingsList from 'react-native-settings-list';

const {height, width} = Dimensions.get('window');

class SettingsScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'SettingsScreen');
            return {
                headerLeft: () => <MyButton onPress={() => navigation.navigate("About")}
                                            title={"About"}
                                            buttonStyle={null}
                                            textStyle={null} />,
                headerTitle: () => <ScreenTitle title={"Settings"} privacy={() => navigation.navigate("PrivacySettings")}/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.settings,
        };
    };
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('Did mount', this.props.navigation.state.routeName);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState){
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "Settings");
            let update = {};

            // if (prevState.settings !== nextProps.settings) {
            //     update.settings = nextProps.settings;
            // }
            return Object.keys(update).length ? update: null;
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            return (
                <View style={{backgroundColor:'#EFEFF4',flex:1}}>


                    <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>


                        <SettingsList.Item
                            hasSwitch={true}
                            switchState={this.state.settings.keep_awake}
                            switchOnValueChange={(bEvent) => this.updateSettings({keep_awake: bEvent})}
                            hasNavArrow={false}
                            title='Keep screen awake'
                            titleStyle={{fontSize:20}}
                        />

                        <SettingsList.Item
                            title='Map settings'
                            titleInfo='Snap-back secs'
                            titleInfoStyle={styles.titleInfoStyle}
                            titleStyle={{fontSize:20}}
                            onPress={() => this.props.navigation.navigate("SettingsDefaultMap")}
                        />

                    </SettingsList>

                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"Settings"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>
                </View>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    updateSettings = async (new_prop) => {
        try {
            myfuncs.myBreadCrumbs('updateSettings', this.props.navigation.state.routeName);
            let new_settings = {...this.state.settings, ...new_prop};

            // Note, no need to update state, because state auto-updates in getDerivedState
            this.setState({settings: new_settings});
            await this.props.updateSettings(new_settings);
            await this.updateStorage();

            if (new_prop.keep_awake !== undefined) {
                myfuncs.setAwakeorNot(new_prop.keep_awake);
            }
        } catch (error) {
            console.log(error);
            myfuncs.myRepo(error);
        }
    };
    updateStorage = async () => {
        try {
            myfuncs.myBreadCrumbs('updateStorage', this.props.navigation.state.routeName);
            await myfuncs.writeUserDataToLocalStorage("user_settings", this.props.settings);
            // console.log("storage updated NewSettings:", this.props.settings);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
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
};
const styles = StyleSheet.create({
    titleInfoStyle: {
        fontSize: 20,
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
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);



