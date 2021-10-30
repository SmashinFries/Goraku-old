/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import { BackgroundFetchHeadlessTask } from './Notifications/notifications';
import App from './App';
import {name as appName} from './app.json';

// Notification Setup
PushNotification.configure({
    onNotification: async(notification) => {
        global.NotifNav = true;
        PushNotification.cancelAllLocalNotifications();
    },
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    requestPermissions: Platform.OS === 'ios'
});
PushNotification.createChannel({channelId:'UserNotification', channelName:'UserNotif', channelDescription:'User Notifications'});

AppRegistry.registerComponent(appName, () => App);
BackgroundFetch.registerHeadlessTask(BackgroundFetchHeadlessTask);