import React from 'react';
import {StyleSheet, Image} from 'react-native';
import myfuncs from '../services/myFuncs';

export const LogoComponent = ( {} ) => {
    try {
        myfuncs.myBreadCrumbs('LogoComponent', 'LogoComponent');
        return (
            <Image style={styles.dibsityImage}
                   source={require('./../assets/images/DibsityFace_512x512.png')}
                   opacity={1.0}
            />
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};

const styles = StyleSheet.create({
    dibsityImage: {
        width: 30,
        height: 30,
    },
});

