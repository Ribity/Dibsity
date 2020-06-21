import React from 'react';
import Modal from "react-native-modal";
import {DepartingShortlyModalExit} from "./DepartingShortlyModalExit";
import {MyButton} from './MyButton';

import myfuncs from "../services/myFuncs";
import {StyleSheet, Text, View, Switch, Alert} from "react-native";
import helpStyles from "./helpModals/helpStyles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import myStyles from "../myStyles";
import {connect} from "react-redux";

class DepartingShortlyModal  extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.settings,
            bPostCommunal: this.props.settings.postCommunal,
        };
    };
    static getDerivedStateFromProps(nextProps, prevState){
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "DepartingShortlyModal");
            let update = {};

            if (prevState.settings !== nextProps.settings) {
                update.settings = nextProps.settings;
                if (prevState.settings.postCommunal !== nextProps.settings.postCommunal) {
                    update.bPostCommunal = nextProps.settings.postCommunal;
                }
                let bOneDefined = false;
                for (let i=0; i<5; i++) {
                    if (nextProps.settings.communal_id[i].length > 0) {
                        bOneDefined = true;
                        break;
                    }
                }
                if (bOneDefined === false) {
                    update.bPostCommunal = false;
                }
            }
            return Object.keys(update).length ? update: null;
        } catch (error) {
            myfuncs.myRepo(error);
            return null;
        }
    };
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('DidMount', DepartingShortlyModal);
            this.setState({bPostCommunal: this.props.settings.postCommunal});
            this.setState({settings: this.props.settings});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    setbCommunal = (bVal) => {
        if (bVal === true) {
            let bOneDefined = false;
            for (let i=0; i<5; i++) {
                if (this.props.settings.communal_id[i].length > 0) {
                    bOneDefined = true;
                    break;
                }
            }
            if (bOneDefined === false) {
                Alert.alert("You must define one or more Communal Ids", "Go to 'SETTINGS / Communal Ids' to defined your Communals");
                return;
            }
        }

        this.setState( {bPostCommunal: bVal});
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('DepartingShortlyModal', "DepartingShortlyModal");
            let padBetween = 10;
            return (
                <Modal style={{margin: 5}}
                       isVisible={this.props.isVisible}
                       backdropColor={'mediumseagreen'}
                       backdropOpacity={.7}
                       onBackdropPress={this.props.onExitPress}
                       supportedOrientations={['portrait', 'landscape']}
                >
                    <View style={helpStyles.modalStyle}>

                        <KeyboardAwareScrollView
                            resetScrollToCoords={{x: 0, y: 0}}
                        >
                            {this.state.bPostCommunal ?
                                <View>
                                    <Text style={myStyles.infoTextTopMargin}>Your parking space departure will be
                                        privately posted to your Communals</Text>
                                </View>
                                :
                                <View>
                                    <Text style={myStyles.infoTextTopMargin}>Your parking space departure will be
                                        publicly posted to ALL Dibsity users</Text>
                                </View>
                            }

                            <View style={{alignItems: 'center'}}>
                                <Switch
                                    value={this.state.bPostCommunal}
                                    onValueChange={(bVal) => {this.setbCommunal(bVal)}}
                                />
                            </View>
                            <View style={{paddingTop: padBetween + 10}}/>

                            <Text style={styles.helpBold}>My parking space will be available in ...</Text>

                            <View style={{paddingTop: 15}}/>

                            <View style={styles.addRow}>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(1, this.state.bPostCommunal)}
                                          title={"1 minute"}/>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(2, this.state.bPostCommunal)}
                                          title={"2 minutes"}/>
                            </View>

                            <View style={{paddingTop: padBetween}}/>

                            <View style={styles.addRow}>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(3, this.state.bPostCommunal)}
                                          title={"3 minutes"}/>

                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(4, this.state.bPostCommunal)}
                                          title={"4 minutes"}/>
                            </View>

                            <View style={{paddingTop: padBetween}}/>

                            <View style={styles.addRow}>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(5, this.state.bPostCommunal)}
                                          title={"5 minutes"}/>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(6, this.state.bPostCommunal)}
                                          title={"6 minutes"}/>
                            </View>

                            <View style={{paddingTop: padBetween}}/>

                            <View style={styles.addRow}>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(7, this.state.bPostCommunal)}
                                          title={"7 minutes"}/>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(8, this.state.bPostCommunal)}
                                          title={"8 minutes"}/>
                            </View>

                            <View style={{paddingTop: padBetween}}/>

                            <View style={styles.addRow}>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={() => this.props.onMinutesPressed(9, this.state.bPostCommunal)}
                                          title={"9 minutes"}/>
                                <MyButton buttonStyle={styles.modalButton}
                                          textStyle={styles.minutesButtonText}
                                          onPress={this.props.onExitPress}
                                          title={"Back to Map"}/>
                            </View>

                            <View style={{paddingTop: padBetween}}/>

                            <MyButton buttonStyle={styles.modalButton}
                                      textStyle={styles.minutesButtonText}
                                      onPress={() => this.props.onMinutesPressed(-1, this.state.bPostCommunal)}
                                      title={"Cancel my departure"}/>

                            <View style={{paddingTop: padBetween}}/>

                        </KeyboardAwareScrollView>
                    </View>
                    <DepartingShortlyModalExit onPress={this.props.onExitPress}/>

                </Modal>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
};

const styles = StyleSheet.create({
    modalButton: {
        marginVertical: 3,
        // marginHorizontal: 70,
        backgroundColor: 'mediumseagreen',
        alignSelf: 'center',
        borderColor: 'goldenrod',
        borderWidth: 2,
    },
    minutesButtonText: {
        color: 'black',
        fontWeight: 'bold',
        margin: 5,
    },
    helpBold: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    addRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
const mapStateToProps = (state) => {
    const { settings } = state;
    return { settings }
};
export default connect(mapStateToProps, null)(DepartingShortlyModal);