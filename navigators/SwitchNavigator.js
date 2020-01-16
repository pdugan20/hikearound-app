import { createSwitchNavigator } from 'react-navigation';
import TabNavigator from './TabNavigator';
import { AuthScreen } from '../screens/Index';

const SwitchNavigator = createSwitchNavigator(
    {
        Auth: AuthScreen,
        TabNavigator,
    },
    {
        initialRouteName: 'Auth',
    },
);

export default SwitchNavigator;