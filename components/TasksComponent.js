import React from 'react';
import {View, AppState} from 'react-native';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import MyDefines from "../constants/MyDefines";
import myfuncs from "../services/myFuncs";

// import _ from 'lodash'


let sixtyMinute = null;
let appState = AppState.currentState;

class TasksComponent extends React.Component {
    constructor(props) {
        try {
            super(props);

            // this.loadStorageIntoRedux();

            AppState.addEventListener('change', this._handleAppStateChange);
        } catch (error) {
        }
    }
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('DidMount', "TasksComponent");

            sixtyMinute = setInterval(this.sixtyMinuteTask, 10 * 60 * 1000);
            // sixtyMinute = setInterval(this.sixtyMinuteTask, 10 * 1000);
            // myfuncs.setAwakeorNot(this.props.settings.keep_awake);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    componentWillUnmount() {
        try {
            myfuncs.myBreadCrumbs('WillUnMount', "TasksComponent");

            if (sixtyMinute !== null)
                clearInterval(sixtyMinute);

            AppState.removeEventListener('change', this._handleAppStateChange);

        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    _handleAppStateChange = (nextAppState) => {
        try {
            myfuncs.myBreadCrumbs('handleAppStateChange', "TasksComponent");
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                if (MyDefines.log_details)
                    console.log("App has come to foreground");
                if (this.props.keep_awake) {
                    myfuncs.setAwakeorNot(true);
                }
            } else {    // Else gone to the background
                // if (MyDefines.detail_logging)
                    console.log("App has gone to background");
                myfuncs.setAwakeorNot(false);
            }
            appState = nextAppState;
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    clone = (obj) => {
        if (null == obj || "object" != typeof obj) return obj;
        let copy = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    };
    sixtyMinuteTask = () => {
        try {
            myfuncs.myBreadCrumbs('sixtyMinuteTask', "TasksComponent");
            if (MyDefines.detail_logging)
                console.log("sixtyMinuteTask");
            this.getStoryListFromServer();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', "TasksComponent");
            return (
                <View style={{padding:0}} />
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
}

const mapStateToProps = (state) => {
    const { settings } = state;
    return { settings }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(TasksComponent);