import React from 'react';
import Modal from "react-native-modal";
import {DepartingShortlyModalExit} from "./DepartingShortlyModalExit";
import {MyButton} from './MyButton';

import myfuncs from "../services/myFuncs";
import {StyleSheet, Text, View} from "react-native";
import helpStyles from "./helpModals/helpStyles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import myStyles from "../myStyles";

export const DepartingShortlyModal = ({isVisible, onExitPress, settings, onMinutesPressed} ) => {
    try {
        myfuncs.myBreadCrumbs('DepartingShortlyModal', 'DepartingShortlyModal');
        
        let padBetween = 10;
        let bCommunal = true;
        return (
            <Modal style={{ margin: 5 }}
                   isVisible={isVisible}
                // backdropColor={'#AFC0AB'}
                   backdropColor={'mediumseagreen'}
                   backdropOpacity={.7}
                   onBackdropPress={onExitPress}
                   supportedOrientations={['portrait', 'landscape']}
            >
                <View style={helpStyles.modalStyle}>

                    <KeyboardAwareScrollView
                        resetScrollToCoords={{x:0, y:0}}
                    >
                        {settings.postCommunal ?
                            <View>
                                <Text style={myStyles.infoTextTopMargin}>Your parking space departure will be privately posted to your Communals</Text>
                                <Text style={myStyles.infoText}>Go to Settings if you would like to post your departure to ALL Dibsity users</Text>
                            </View>
                            :
                            <View>
                                <Text style={myStyles.infoTextTopMargin}>Your parking space departure will be publicly posted to ALL Dibsity users</Text>
                                <Text style={myStyles.infoText}>Go to Settings if you would like to post your departure ONLY to your communals</Text>
                            </View>
                        }

                        <Text style={styles.helpBold}>My parking space will be available in ...</Text>

                        <View style={{paddingTop: 15}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(1)}
                                  title={"1 minute"}/>

                        <View style={{paddingTop: padBetween}}/>
                        
                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(2)}
                                  title={"2 minutes"}/>
                        
                        <View style={{paddingTop: padBetween}}/>
                        
                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(3)}
                                  title={"3 minutes"}/>

                        <View style={{paddingTop: padBetween}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(4)}
                                  title={"4 minutes"}/>

                        <View style={{paddingTop: padBetween}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(5)}
                                  title={"5 minutes"}/>

                        <View style={{paddingTop: padBetween}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(6)}
                                  title={"6 minutes"}/>
                        
                        <View style={{paddingTop: padBetween}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(7)}
                                  title={"7 minutes"}/>
                        
                        <View style={{paddingTop: padBetween}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(8)}
                                  title={"8 minutes"}/>
                        
                        <View style={{paddingTop: padBetween}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(9)}
                                  title={"9 minutes"}/>

                        <View style={{paddingTop: padBetween+10}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={onExitPress}
                                  title={"Just go Back to Map"}/>

                        <View style={{paddingTop: padBetween}}/>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.minutesButtonText}
                                  onPress={() => onMinutesPressed(-1)}
                                  title={"Cancel my departure"}/>


                        <View style={{paddingTop: padBetween}}/>


                    </KeyboardAwareScrollView>
                </View>
                <DepartingShortlyModalExit onPress={onExitPress}/>

            </Modal>
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
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

});
