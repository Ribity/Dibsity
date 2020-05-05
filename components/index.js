import MapComponent from './MapComponent';
import TasksComponent from './TasksComponent';
import {Text} from 'react-native';


Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// Text.defaultProps.maxFontSizeMultiplier = 30;

export {MapComponent};
export {TasksComponent};

// The following nine lines are to ignore a warning that Android receives about setting a timer for long periods.
// import { YellowBox } from 'react-native';
// import _ from 'lodash';
// YellowBox.ignoreWarnings(['Setting a timer']);
// const _console = _.clone(console);
// console.warn = message => {
//     if (message.indexOf('Setting a timer') <= -1) {
//         _console.warn(message);
//     }
// };
// console.disableYellowBox = true;
// console.ignoredYellowBox = ['Setting a timer']; // Ignore Firebase timer issues.