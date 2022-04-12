import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ADULT_ALLOW } from '../constants';

const useNSFW = () => {
    const [isNSFW, setIsNSFW] = useState(false);

    useEffect(() => {

    },[]);
}

export const getNSFW = async() => {
    try {
        const isNSFW = await AsyncStorage.getItem('@nsfw');
        if (isNSFW === null) await storeNSFW(false);
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