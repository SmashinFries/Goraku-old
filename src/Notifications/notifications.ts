import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { getLatestNotif, getNotification, storeNotification } from '../Storage/notificationSetting';
import { getUserNotifications } from '../Api/anilist/anilist';
import { UserNotifications } from '../Api/types';
import { openURL } from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_FETCH_TASK = 'background-fetch';

const schedulePushNotification = async (title:string, body:string, link:string) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: {link: link},
        },
        trigger: { seconds: 5 },
    });
}

type NotifResponse = {
    title:string;
    body:string;
    url:string;
};
const sortNotificaiton = (data:UserNotifications):NotifResponse => {
    switch (data.type) {
        case 'AIRING':
            const airing = data.contexts[0] +  data.episode + data.contexts[2];
            return {title: `${data.media.title.userPreferred}`, body: airing, url:`goraku://info/${data.media.type.toLowerCase()}/${data.media.id}`}
        
        case 'FOLLOWING':
            const following = data.user.name + data.context;
            return {title: `Another fellow weeb followed you!`, body: following, url:`${data.user.siteUrl}`}
        
        case 'ACTIVITY_LIKE':
            return {title: `A fellow weeb liked your activity!`, body: data.user.name + data.context, url:`${data.user.siteUrl}`}
        
        case 'MEDIA_MERGE':
            return {title: `Media was merged`, body: data.media.title.userPreferred + data.context, url:`goraku://info/${data.media.type.toLowerCase()}/${data.media.id}`}
        
        case 'MEDIA_DELETION':
            return {title: `Media was removed from Anilist`, body: data.media.title.userPreferred + data.context, url:''}
        
        case 'MEDIA_DATA_CHANGE':
            return {title: `${data.media.title.userPreferred} ${data.context}`, body: data.reason, url:`goraku://info/${data.media.type.toLowerCase()}/${data.media.id}`}
        
        case 'RELATED_MEDIA_ADDITION':
            return {title: `New media added to Anilist`, body: data.media.title.userPreferred + data.context, url:`goraku://info/${data.media.type.toLowerCase()}/${data.media.id}`}
        
        default:
            break;
    }
}

// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//     const notifs = await getUserNotifications();
//     const latestId = await getLatestNotif(notifs[0].id);

//     console.log('Checking!');

//     for (let notif of notifs) {
//         if (notif.id === latestId) {
//             break;
//         } else {
//             const data = sortNotificaiton(notif);
//             await schedulePushNotification(data.title, data.body, data.url);
//         }
//     }
//     AsyncStorage.setItem('@latestNotif', notifs[0].id.toString());
//     return BackgroundFetch.BackgroundFetchResult.NewData;
// });

const registerBackgroundFetchAsync = async() => {
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 28800, // 8 hours,
        })
      } catch (err) {
        console.log("Task Register failed:", err)
      }
}

const unregisterBackgroundFetchAsync = async() => {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

const useNotification = (auth:boolean) => {
    const [isRegistered, setIsRegistered] = useState<boolean>();
    const [status, setStatus] = useState(null);

    const isAllowed = isRegistered ?? false;

    const receivedSubscription = Notifications.addNotificationReceivedListener(
        notification => {
            console.log("Notification Received!");
            console.log(notification.request.content.data.link);
            // @ts-ignore
            openURL(notification.request.content.data?.link);
        }
      )

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
        response => {
            console.log("Notification Clicked!")
        }
    );

    const checkStatusAsync = async () => {
        const status = await BackgroundFetch.getStatusAsync();
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
        const notificationAllowed = await getNotification();
        if (!isRegistered && notificationAllowed) {
            await registerBackgroundFetchAsync();
            setStatus(status);
            setIsRegistered(true);
        } else {
            setStatus(status);
            setIsRegistered(isRegistered);
        }
    };

    const toggleFetchTask = async () => {
        switch (auth) {
            case true:
                if (isRegistered) {
                    await unregisterBackgroundFetchAsync();
                    await storeNotification(false);
                } else {
                    await registerBackgroundFetchAsync();
                    await storeNotification(true);
                }
                break;
            case false:
                if (isRegistered) {
                    await unregisterBackgroundFetchAsync();
                }
                break;
        }
        checkStatusAsync();
    };

    useEffect(() => {
        checkStatusAsync();
    }, []);

    return {isAllowed, toggleFetchTask, receivedSubscription, responseSubscription};
}

export default useNotification;