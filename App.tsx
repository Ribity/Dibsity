import React from 'react';
import { AppNavigator } from './navigation';

import { Provider } from 'react-redux';
import { rootReducer } from './reducers/RootReducer'
import { createStore } from 'redux';
import { RootSiblingParent } from 'react-native-root-siblings';

const store = createStore(rootReducer);

const App = () => {
   // To get rid of Timer Settings warning on Android
   // Go to node_modules/react-native/Libraries/Core/Timer/JSTimers.js
   // Look for the variable MAX_TIMER_DURATION_MS
   // Change 60 * 1000 to 10000 * 1000

    return (
                <Provider store={store}>
                    <RootSiblingParent>
                        <AppNavigator/>
                    </RootSiblingParent>
                </Provider>
    );



    // return (
    //
    //     <Provider store={ store }>
    //         <View style={styles.container}>
    //
    //             <Toast
    //                 ref="toast"
    //                 style={myStyles.myBigToastStyle}
    //                 position='top'
    //                 positionValue={0}
    //                 fadeOutDuration={5000}
    //                 opacity={.9}
    //                 textStyle={myStyles.myBigToast}
    //             />
    //
    //             {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
    //             {(this.state.isAuthenticated) ? <AppContainer uriPrefix={prefix}/> : <LoginApp/> }
    //         </View>
    //     </Provider>
    // );




};

export default App;