import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import MyDefines from "../constants/MyDefines"
import myfuncs from "../services/myFuncs";

export const ScreenTitle = ( {title, second, privacy}) => {
    try {
        myfuncs.myBreadCrumbs('StoriesHeaderButton', 'StoriesHeaderButton');
        return (
            <View style={{alignItems: 'center'}}>
                <Text style = {{color: MyDefines.myHeaderTextColor, fontWeight: 'bold', fontSize: 20}}>
                    {title}
                </Text>
                {second ?
                    <View>
                        <Text style = {{color: MyDefines.myHeaderTextColor, fontWeight: 'bold', fontSize: 15}}>
                            {second}
                        </Text>
                    </View>
                    :
                    <View>
                        {privacy !== undefined &&
                            <View>
                                <TouchableOpacity onPress={() => privacy()} hitSlop={styles.hitSlop}>
                                    <Text style = {{color: 'blue', fontWeight: 'bold', fontSize: 15}}>
                                        Privacy Statement
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                }
            </View>
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};

const styles = StyleSheet.create({
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
});