import AsyncStorage from '@react-native-async-storage/async-storage';

const getLastUpdateCheck = async() => {
    try {
        const lastUpdateCheck = await AsyncStorage.getItem('@updateCheck');
        return lastUpdateCheck;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const setLastUpdateCheck = async(date:string) => {
    try {
        await AsyncStorage.setItem('@updateCheck', date);
    } catch (error) {
        console.log(error);
    }
}

export { getLastUpdateCheck, setLastUpdateCheck };