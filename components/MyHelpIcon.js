import React from 'react';
import { TouchableOpacity,  StyleSheet, Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import myfuncs from "../services/myFuncs";

export const MyHelpIcon = ( {isAdmob, onPress, } ) => {
    try {
        myfuncs.myBreadCrumbs('myHelpIcon', 'MyHelpIcon');
        return (
                <TouchableOpacity style={[styles.floatingHelpIcon, isAdmob && {bottom: 80}]}
                                  onPress={onPress}
                                  hitSlop={styles.hitSlop}>
                        <Ionicons name="md-help-circle" size={30} color="green"/>
                </TouchableOpacity>
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};

const styles = StyleSheet.create({
    floatingHelpIcon: {
        position: 'absolute',
        opacity: .4,
        bottom:  20,
        right: 10,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
});
