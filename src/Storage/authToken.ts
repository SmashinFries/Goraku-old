import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect, useState } from 'react';
import { getUserOptions } from '../Api/anilist/anilist';
import { fetchDevArtToken } from '../Api/deviantArt/devart';
import { AccountType } from '../containers/types';
import { AccountContext } from '../contexts/context';

export const getAuth = async(type:AccountType, tokenString:string) => {
    const parsed = (type === 'Anilist' && tokenString) ? tokenString.match(/(?:[A-Za-z0-9-_.]+)/gm) : null;
    const devArtParsed = (type === 'DeviantArt' && tokenString) ? tokenString.match(/[?#]([^=#]+)=([^&#]*)/gm)[0].split('=')[1] : null;
    if (tokenString) {
        if (type==='Anilist') {
            let currentDate = new Date();
            await SecureStore.setItemAsync('auth', parsed[1]);
            await AsyncStorage.setItem('@tokenExpire', `${currentDate.setFullYear(currentDate.getFullYear() + 1)}`);
            const userData = await getUserOptions();
            await AsyncStorage.setItem('@userID', userData.id.toString());
        }

        if (type==='DeviantArt') {
            await SecureStore.setItemAsync('authDevArt', devArtParsed);
        }

        return true
    } else {
        return false
    }
}

export const useUserId = () => {
    const [id, setId] = useState<number>();
    const getId = async() => {
        const userId = await AsyncStorage.getItem('@userID');
        setId(Number(userId));
    }

    useEffect(() => {
        getId();
    },[]);
    return id;
}

export const getToken = async() => {
    try {
        const token = await SecureStore.getItemAsync('auth');
        return token;
    } catch (error) {
        console.log(error);
        return null;
    } 
}

export const checkTokenExpiration = async() => {
    const currentDate = Date.now();
    const tokenExpire = await AsyncStorage.getItem('@tokenExpire');
    const timeLeft = new Date(Number(tokenExpire) - currentDate);
    const months = timeLeft.getMonth() + ' months';
    const days = timeLeft.getDay() + ' days';
    const hours = timeLeft.getHours() + ' hours';
    const minutes = timeLeft.getMinutes() + ' minutes';
    const seconds = timeLeft.getSeconds() + ' seconds';
    const timeUntilArray = [months, days, hours, minutes, seconds];

    if (Number(tokenExpire) - currentDate <= 0) return null;
    return timeUntilArray.join(', ');
}

export const getUserID = async() => {
    try {
        const userID = await AsyncStorage.getItem('@userID');
        return userID;
    } catch (error) {
        console.log(error);
        return null;
    } 
}

export const getAuthContext = () => {
    const { isAuth, setIsAuth, isDevArtAuth, setIsDevArtAuth } = useContext(AccountContext);
    const [auth, setAuth] = useState(isAuth);
    const [daAuth, setDaAuth] = useState(isDevArtAuth);

    useEffect(() => {
        setAuth(isAuth);
    },[isAuth]);

    useEffect(() => {
        setDaAuth(isDevArtAuth);
    },[isDevArtAuth]);
    return {auth, daAuth};
}

export const removeToken = async(type:AccountType) => {
    await SecureStore.deleteItemAsync((type==='Anilist') ? 'auth' : 'authDevArt');
    return true;
}

export const getIsAuth = () => {
    const [isAuth, setIsAuth] = useState<boolean>();
    const [isDevArtAuth, setIsDevArtAuth] = useState<boolean>();

    let auth = isAuth ?? false;
    let daAuth = isDevArtAuth ?? false;

    const checkAuth = async() => {
        const token = await getToken();
        // const daToken = await getDAToken();
        if (token) {
            auth = true;
            setIsAuth(true);
        } else {
            auth = false;
            setIsAuth(false);
        }

        // if (daToken) {
        //     daAuth = true;
        //     setIsDevArtAuth(true);
        // } else {
        //     daAuth = false;
        //     setIsDevArtAuth(false);
        // }
    }

    useEffect(() => {
        checkAuth();
    },[]);
    
    return {auth, daAuth}
}