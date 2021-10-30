// Notification / Background
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
// Data
import { getToken } from '../Storages/getstorage';
import { fetchAiringNotification } from '../Data Handler/getdata';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { textDecider } from '../Utils/dataprocess';

const setNotifs = async(unreadNum, data, latest) => {
    let items = await data.slice(0, unreadNum);
    const newItems = items.sort((a, b) => a.createdAt - b.createdAt);
    for (let notifNum in newItems) {
        const { bottomText, topText, time, image, rawTime, notifData } = textDecider(newItems[notifNum]);
        const message = notifData.body;
        PushNotification.localNotification({
            channelId: 'UserNotification',
            title:notifData.title,
            id: notifNum,
            when: rawTime,
            message: message,
            largeIconUrl: image,
            color: '#28c922',
            group: 'Notif',
            vibrate: true,
            groupSummary: false
        });
    }
    await PushNotification.getDeliveredNotifications((notifs) => {
        if (notifs.length <= unreadNum) {
            PushNotification.localNotification({
                channelId:'UserNotification',
                group:'Notif',
                message:'',
                groupSummary:true,
            });
        }
    });
    await AsyncStorage.setItem('@LASTNOTIF', `${latest}`);
}

const sendNotification = async() => {
    const token = await getToken();
    // Only try to fetch notification if user is logged in
    if (typeof token === 'string') {
        try {
            const lastNotif = await AsyncStorage.getItem('@LASTNOTIF');
            const notifData = await fetchAiringNotification(token, undefined, 10);
            const unreadNum = Number(notifData.Viewer.unreadNotificationCount);
            const latest = notifData.Page.notifications[0].id;
            if (typeof lastNotif === 'string') {
                console.log(lastNotif);
                if (unreadNum > 0 && latest !== Number(lastNotif)) {
                    await setNotifs(unreadNum, notifData.Page.notifications, latest);
                } else if (unreadNum === 0 && latest !== Number(lastNotif)) {
                    await AsyncStorage.setItem('@LASTNOTIF', `${latest}`)
                }
            } else if (typeof lastNotif !== 'string') {
                if (unreadNum > 0) {
                    await setNotifs(unreadNum, notifData.Page.notifications, latest);
                } else {
                    await AsyncStorage.setItem('@LASTNOTIF', `${latest}`)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export let BackgroundFetchHeadlessTask = async (event) => {
    let taskId = event.taskId;
    let isTimeout = event.timeout;
    if (isTimeout) {
        BackgroundFetch.finish(taskId);
        return;
    }
    await sendNotification();
    BackgroundFetch.finish(taskId);
}