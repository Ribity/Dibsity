import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export const MyButton = ( {buttonStyle, textStyle, onPress, title} ) => {
    try {
        myfuncs.myBreadCrumbs('MyButton', 'MyButton');
        let bStyle = myStyles.regularButton;
        let tStyle = myStyles.regularButtonText;
        if (buttonStyle !== undefined && buttonStyle !== null) {
            bStyle = {...bStyle, ...buttonStyle};
        }
        if (textStyle !== undefined && textStyle !== null) {
            tStyle = {...tStyle, ...textStyle};
        }
        return (
            <View>
                <TouchableOpacity style={bStyle} onPress={onPress}>
                    <Text style={tStyle}>{title}</Text>
                </TouchableOpacity>
            </View>
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};