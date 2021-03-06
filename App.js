import React from 'react';
import { Provider } from 'react-redux';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import { enableScreens } from 'react-native-screens';
import Splash from './components/Splash';
import store from './store/Store';
import Fire from './lib/Fire';
import { ignoreWarnings } from './utils/Warnings';
import { addTestDevice, enableAdTracking } from './utils/Ad';

enableScreens();
ignoreWarnings();

addTestDevice();
enableAdTracking();

class App extends React.Component {
    async componentDidMount() {
        await new Fire();
    }

    render() {
        return (
            <Provider store={store}>
                <Splash />
            </Provider>
        );
    }
}

Sentry.init({
    dsn: Constants.manifest.extra.sentry.dsn,
    enableInExpoDevelopment: false,
    debug: true,
});

export default App;
