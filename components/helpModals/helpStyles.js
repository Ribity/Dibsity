import {StyleSheet} from "react-native";
import MyDefines from "../../constants/MyDefines";

const helpStyles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        borderRadius: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: MyDefines.myStatusBarHeight + 30,
        marginBottom: MyDefines.myStatusBarHeight,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        backgroundColor: 'lightgrey',
        padding: 5,
    },
    helpBold: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    helpText: {
        fontSize: 18,
    },
});

export default helpStyles;

