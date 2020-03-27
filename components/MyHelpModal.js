import React from 'react';
import Modal from "react-native-modal";
import {MyHelpExit} from "./MyHelpExit";
import {HelpComponent} from './HelpComponent';
import myfuncs from "../services/myFuncs";

export const MyHelpModal = ( {isVisible, onExitPress, screen, parm1} ) => {
    try {
        myfuncs.myBreadCrumbs('MyHelpModal', 'MyHelpModal');
        return (
            <Modal style={{ margin: 5 }}
                   isVisible={isVisible}
                // backdropColor={'#AFC0AB'}
                   backdropColor={'mediumseagreen'}
                   backdropOpacity={.5}
                   onBackdropPress={onExitPress}
                   supportedOrientations={['portrait', 'landscape']}
            >
                <HelpComponent screen={screen} parm1={parm1}/>

                <MyHelpExit onPress={onExitPress}/>

            </Modal>
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};