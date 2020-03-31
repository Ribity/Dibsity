import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import myfuncs from "../services/myFuncs";

export const DepartParkedIcon = ({onPress} ) => {
    try {
        myfuncs.myBreadCrumbs('DepartParkedIcon', 'DepartParkedIcon');

        return (
            <TouchableOpacity style={styles.floatingParkedIcon}
                              onPress={onPress}
                              hitSlop={styles.hitSlop}>
                <Text style={{fontSize: 19}}>Alert others that I'm leaving soon</Text>
            </TouchableOpacity>

        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};


const styles = StyleSheet.create({
    floatingParkedIcon: {
        position: 'absolute',
        // opacity: .8,
        backgroundColor: '#AFC0AB',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'green',
        top: 70,
        right: 10,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
});