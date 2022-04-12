import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeNotification = async(isAllowed:boolean) => {
    try {
        await AsyncStorage.setItem('@allowNotif', isAllowed ? 'true' : 'false');
    } catch (error) {
        console.log(error);
    }
}

export const getNotification = async() => {
    try {
        const allowed = await AsyncStorage.getItem('@allowNotif');
        return allowed === 'true' ? true : false;
    } catch (error) {
        console.log('allowNotif Error:', error);
        return false;
    }
}


export const getLatestNotif = async(id:number) => {
    try {
        const latest = await AsyncStorage.getItem('@latestNotif');
        if (!latest) {
            await AsyncStorage.setItem('@latestNotif', id.toString());
            return id;
        } else {
            return Number(latest);
        }
    } catch (error) {
        console.log('latest notif error:', error);
        return null;
    }
}