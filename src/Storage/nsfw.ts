import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { getUserOptions } from '../Api';
import { ADULT_ALLOW } from '../constants';
import { getToken } from './authToken';

const useNSFW = () => {
    const [isNSFW, setIsNSFW] = useState(false);

    useEffect(() => {

    },[]);
}

export const getNSFW = async() => {
    try {
        const isNSFW = await AsyncStorage.getItem('@nsfw');
        const isAuth = await getToken();
        if (isNSFW === null && isAuth) {
            const results = await getUserOptions();
            await storeNSFW(results.options.displayAdultContent);
        } else if (isNSFW === null && !isAuth) {
            await storeNSFW(true);
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