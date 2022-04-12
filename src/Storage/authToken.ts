import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect, useState } from 'react';
import { getUserOptions } from '../Api/anilist/anilist';
import { AccountContext } from '../contexts/context';

export const getAuth = async(tokenString:string) => {
    const parsed = tokenString ? tokenString.match(/(?:[A-Za-z0-9-_.]+)/gm) : null;
    if (tokenString) {
        let currentDate = new Date();
        await SecureStore.setItemAsync('auth', parsed[1]);
        await AsyncStorage.setItem('@tokenExpire', `${currentDate.setFullYear(currentDate.getFullYear() + 1)}`);
        const userData = await getUserOptions();
        await AsyncStorage.setItem('@userID', userData.id.toString());
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
    const { isAuth, setIsAuth } = useContext(AccountContext);
    const [auth, setAuth] = useState(isAuth);

    useEffect(() => {
        setAuth(isAuth);
    },[isAuth]);
    return auth;
}

export const removeToken = async() => {
    await SecureStore.deleteItemAsync('auth');
    return true;
}

export const getIsAuth = () => {
    const [isAuth, setIsAuth] = useState<boolean>();

    let auth = isAuth ?? false;

    const checkAuth = async() => {
        const token = await getToken();
        if (token !== null) {
            auth = true;
            setIsAuth(true);
        } else {
            auth = false;
            setIsAuth(false);
        }
    }

    useEffect(() => {
        checkAuth();
    },[]);
    
    return {auth}
}