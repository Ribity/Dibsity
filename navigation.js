import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {Ionicons} from '@expo/vector-icons';
import MyDefines from './constants/MyDefines';


import MapScreen  from './screens/mapScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import MyVehicleScreen from './screens/myVehicle';
import SettingsScreen from './screens/settings';
import SettingsDefaultMapScreen from './screens/SettingsDefaultMap';
import SettingsCommunalScreen from './screens/SettingsCommunal';
import AboutScreen from './screens/about';

let defNav = {
    headerStyle: {backgroundColor: MyDefines.myTabColor},
    headerTitleStyle: {color: MyDefines.myHeaderTextColor},
    headerBackTitleStyle: {color: MyDefines.myHeaderTextColor},
    headerTintColor: MyDefines.myHeaderTextColor,
};

const MapStack = createStackNavigator({
        Map: MapScreen,
        PrivacyMap: PrivacyScreen,
    },
    {defaultNavigationOptions: () => (defNav)});

const MyVehicleStack = createStackNavigator({
        myVehicle: MyVehicleScreen,
    },
    {defaultNavigationOptions: () => (defNav)});

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
    PrivacySettings: PrivacyScreen,
    About: AboutScreen,
    SettingsDefaultMap: SettingsDefaultMapScreen,
    SettingsCommunal: SettingsCommunalScreen,
}, {defaultNavigationOptions: () => (defNav)});

MapStack.navigationOptions = {
    tabBarLabel: "Map",
};
MyVehicleStack.navigationOptions = {
    tabBarLabel: "Vehicle",
};
SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
};

const bottomTabNavigator = createBottomTabNavigator({
    MapStack,
    MyVehicleStack,
    SettingsStack,
}, {
     defaultNavigationOptions: ({ navigation }) => ({
         tabBarOptions: {
                activeTintColor: 'green',
                inactiveTintColor: 'gray',
                showIcon: true,
                labelStyle: {fontSize: 18},
                style: {
                    backgroundColor: MyDefines.myTabColor,
                    height: MyDefines.myBottomTabBarHeight,
                },
         },
         tabBarIcon: ({ focused, horizontal, tintColor }) => {
             const { routeName } = navigation.state;
             let iconName;
             if (routeName === 'MapStack') {
                 iconName = focused
                     ? 'ios-play'
                     : 'ios-play-circle';
             } else if (routeName === 'MyVehicleStack') {
                 iconName = 'ios-car';
             }  else if (routeName === 'SettingsStack') {
                 iconName = 'ios-settings';
             }

             // You can return any component that you like here!
             return <Ionicons name={iconName} size={20} color={tintColor} />;
             },
        }),
    });

export const AppNavigator = createAppContainer (bottomTabNavigator);