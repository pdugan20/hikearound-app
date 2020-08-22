import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { openHikeScreen } from './Hike';
import { db } from '../lib/Fire';

export function getHikeIdFromUrl(url) {
    const re = new RegExp('/hike/(.*)');
    const hid = re.exec(url);
    if (hid) {
        return hid[1];
    }
    return null;
}

export function handleOpenURL(url, navigation) {
    const hid = getHikeIdFromUrl(url);
    if (hid && navigation) {
        openHikeScreen(hid, navigation);
    }
}

export async function checkInitialUrl(navigation) {
    const url = await Linking.getInitialURL();
    if (url) {
        handleOpenURL(url, navigation);
    }
}

export async function addUrlListener(navigation) {
    Linking.addEventListener('url', (event) =>
        handleOpenURL(event.url, navigation),
    );
}

export async function removeUrlListener(navigation) {
    Linking.removeEventListener('url', (event) =>
        handleOpenURL(event.url, navigation),
    );
}

export function handleOpenNotification(hid, navigation) {
    if (hid && navigation) {
        openHikeScreen(hid, navigation);
    }
}

export async function addNotificationListener(navigation, listenerRef) {
    listenerRef.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
            db.collection('notifications')
                .doc('test')
                .set(response, { merge: true });

            const { hid } = response.notification.request.content.data.body;
            handleOpenNotification(hid, navigation);
        },
    );
}

export async function removeNotificationListener(listenerRef) {
    Notifications.removeNotificationSubscription(listenerRef);
}
