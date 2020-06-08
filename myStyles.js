import {Dimensions, StyleSheet} from "react-native";
import MyDefines from "./constants/MyDefines";
import React from "react";

const {height, width} = Dimensions.get('window');

// Note, 'honeydew' is a nice light mediumseagreen. See search/leaps list. Claimed ribbons
const myStyles = StyleSheet.create({
    myHeaderText: {
        fontSize: 17,
        opacity: 1.0,
        color: 'green',
        alignItems: 'center',
        padding: 2,
    },
    firstContainer: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: MyDefines.myTabColor,
    },
    infoText: {
        fontSize: 17,
        color: 'green',
        alignItems: 'center',
        padding: 5,
    },
    infoTextTopMargin: {
        fontSize: 17,
        color: 'green',
        alignItems: 'center',
        paddingTop: 20,
        padding: 5,
    },
    iFieldLabelNoTopMargin: {
        fontSize: 17,
        paddingLeft: 8,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'green',
        fontWeight: 'bold',
    },
    iFieldLabel: {
        fontSize: 17,
        paddingLeft: 8,
        textAlign: 'left',
        alignSelf: 'stretch',
        paddingTop: 15,
        color: 'green',
        fontWeight: 'bold',
    },
    iField: {
        width: width-20,
        height: 30,
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius: 10,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'green',
    },
    regularButton: {
        backgroundColor: 'green',
        opacity: 1.0,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'goldenrod',
    },
    regularButtonText: {
        fontSize: 17,
        opacity: 1.0,
        color: 'goldenrod',
        alignItems: 'center',
        padding: 2,
    },
    selectButton: {
        // marginVertical: 15,
        // marginHorizontal: 70,
        backgroundColor: 'green',
        alignSelf: 'center',
        borderColor: 'goldenrod',
        borderWidth: 2,
    },
    selectButtonText: {
        color: 'goldenrod',
        fontWeight: 'bold',
        margin: 5,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    },
    myCenter: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    myText: {
        fontSize: 20,
    },
});


export default myStyles;

