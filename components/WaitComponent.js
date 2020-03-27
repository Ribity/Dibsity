import React from 'react';
import { View, Text } from 'react-native';
import myStyles from "../myStyles";


export default class WaitComponent extends React.Component {

    render() {
            return (
                <View>
                    <View style={{paddingTop: 180}}/>

                    <Text style={myStyles.myText}>Just a moment ...</Text>
                </View>
            );
    }
}

