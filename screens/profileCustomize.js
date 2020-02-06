import React from 'react';
import {
    View,
    TextInput,
    Keyboard, StyleSheet,
} from 'react-native';
import {Layout, Text, Select} from '@ui-kitten/components';

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

//***********************************************************************************
// The idea here is to NOT perform the reverseGeo often because each one cost money.
//***********************************************************************************

class ProfileCustomize extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Profiles"} second={"Customize"}/>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            profiles: this.props.profiles,
            profileIdx: 0,
            submitPressed: false,
            textIsFocused: false,
        };
    }
    componentDidMount() {
        console.log("ProfileCustomize DidMount");
        this.checkProfileIdxdParm();
    }
    checkProfileIdxdParm = () => {
        let profileIdx = this.props.navigation.getParam('profileIdx', false);
        if (profileIdx) {
            this.setState({profileIdx: profileIdx});
        }
    };

    onSubmitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onSubmitPress', this.props.navigation.state.routeName);
            Keyboard.dismiss();


            // this.setState( {submitPressed: true});

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

        } catch (error) {
            myfuncs.mySentry(error);
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
                    <Layout style={myStyles.container}>
                    {/*<View style={{paddingTop: androidPad}}/>*/}


                        <Text style={myStyles.iFieldLabel}>Name of Main Character</Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.profiles.profile[this.state.profileIdx].mainChar}
                               onChangeText={(text) => this.updateState({mainChar: text})}
                               clearButtonMode='always'
                               placeholder={"Main Character"}
                               returnKeyType='done'
                               placeholderTextColor={"grey"}
                               maxLength={500}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />

                    <View style={{padding: 5}}/>

                    { (this.state.submitPressed === false) &&
                        <View>
                        <View style={{paddingTop: 5}}/>
                            <MyButton buttonStyle={styles.selectButton}
                                      textStyle={styles.selectButtonText}
                                      onPress={this.onSubmitPress}
                                      title={"Submit"}>
                            </MyButton>


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
                    <MyHelpModal screen={"ProfileCustomize"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>

                    </Layout>
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
        // this.setState({profiles: {...this.state.profiles.profile[0], ...new_prop}});
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,
    },

    buttonText: {textAlign: 'center', color: 'mediumpurple', fontSize: 20, fontWeight: 'bold'},
    selectButton: {
        // marginVertical: 15,
        marginHorizontal: 70,
        backgroundColor: 'purple',
        alignSelf: 'center',
        borderColor: 'goldenrod',
        borderWidth: 2,
    },
    selectButtonText: {
        color: 'goldenrod',
        fontWeight: 'bold',
        margin: 5,
    },

});

const mapStateToProps = (state) => {
    const { profiles } = state;
    return { profiles }
};

export default connect(mapStateToProps, )(ProfileCustomize);