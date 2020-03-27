import React from 'react';
import Modal from "react-native-modal";
import {MyOtherModalExit} from "./MyOtherModalExit";
import {MyButton} from './MyButton';

import myfuncs from "../services/myFuncs";
import {StyleSheet, Text, View} from "react-native";
import helpStyles from "./helpModals/helpStyles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import myStyles from "../myStyles";

export const MyOtherModal = ( {isVisible, onExitPress, onOtherPress} ) => {
    try {
        myfuncs.myBreadCrumbs('MyHelpModal', 'MyHelpModal');
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
                        <Text style={styles.helpBold}>Quick Filters</Text>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.ageButtonText}
                                  onPress={() => onOtherPress("Kibity")}
                                  title={"Kibity Originals"}/>

                        <View style={styles.addRow}>
                            <MyButton buttonStyle={styles.modalButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("classic")}
                                      title={"Classics"}/>

                            <MyButton buttonStyle={styles.modalButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("animal")}
                                      title={"Animals"}/>
                        </View>

                        <MyButton buttonStyle={styles.modalButton}
                                  textStyle={styles.ageButtonText}
                                  onPress={() => onOtherPress("write-in")}
                                  title={"Write-Ins"}/>

                        <View style={styles.addRow}>
                            <MyButton buttonStyle={styles.modalButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("Lullab")}
                                      title={"Lullabies"}/>

                            <MyButton buttonStyle={styles.modalButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("song")}
                                      title={"Songs"}/>
                        </View>

                        <View style={{paddingTop: 25}}/>
                        <Text style={styles.helpSmaller}>Ages</Text>
                        <View style={styles.addRow}>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("1#")}
                                      title={" 1 "}/>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("2#")}
                                      title={" 2 "}/>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("3#")}
                                      title={" 3 "}/>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("4#")}
                                      title={" 4 "}/>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("5#")}
                                      title={" 5 "}/>
                        </View>
                        <View style={styles.addRow}>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("6#")}
                                      title={" 6 "}/>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("7#")}
                                      title={" 7 "}/>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("8#")}
                                      title={" 8 "}/>
                            <MyButton buttonStyle={styles.ageButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("9#")}
                                      title={" 9+ "}/>

                        </View>


                        <View style={{paddingTop: 25}}/>
                        <Text style={styles.helpSmaller}>Authors</Text>

                        <View style={styles.addRow}>
                            <MyButton buttonStyle={styles.modalButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("Cricket")}
                                      title={"Cricket Allen"}/>

                            <MyButton buttonStyle={styles.modalButton}
                                      textStyle={styles.ageButtonText}
                                      onPress={() => onOtherPress("kibitya")}
                                      title={"Kibity"}/>
                        </View>


                    </KeyboardAwareScrollView>
                </View>
                <MyOtherModalExit onPress={onExitPress}/>

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
    ageButton: {
        marginVertical: 3,
        marginHorizontal: 5,
        backgroundColor: 'mediumseagreen',
        alignSelf: 'center',
        borderColor: 'goldenrod',
        borderWidth: 5,
    },
    ageButtonText: {
        color: 'goldenrod',
        fontWeight: 'bold',
        margin: 5,
    },
    helpBold: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    helpSmaller: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    addRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
