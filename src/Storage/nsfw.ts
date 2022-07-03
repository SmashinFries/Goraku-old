import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserOptions } from '../Api';
import { ADULT_ALLOW } from '../constants';
import { getToken } from './authToken';

export const getNSFW = async() => {
    try {
        let isNSFW = await AsyncStorage.getItem('@nsfw');
        const isAuth = await getToken();
        if (isNSFW === null && isAuth) {
            const results = await getUserOptions();
            await storeNSFW(results.options.displayAdultContent);
            isNSFW = (results.options.displayAdultContent) ? 'true' : 'false';
        } else if (isNSFW === null && !isAuth) {
            await storeNSFW(false);
            isNSFW = 'false';
        }

        return isNSFW === 'true' ? true : false;
    } catch (error) {
        console.log('nsfw error:', error);
        return false;
    }
}

export const storeNSFW = async(allow:boolean) => {
    try {
        await AsyncStorage.setItem('@nsfw', (ADULT_ALLOW && allow) ? 'true' : 'false');
    } catch (error) {
        console.log(error);
    }
}