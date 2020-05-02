import React from 'react';
import { AppNavigator } from './navigation';

// import { default as customMapping } from './custom-mapping.json'; // <-- import custom mapping

import { Provider } from 'react-redux';
import { rootReducer } from './reducers/RootReducer'
import { createStore } from 'redux';

const store = createStore(rootReducer);

const App = () => {
    return (
                <Provider store={store}>
                        <AppNavigator/>
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