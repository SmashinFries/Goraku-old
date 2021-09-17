import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTheme = async() => {
    try {
        const themeSet = await AsyncStorage.getItem('@Theme');
        return(themeSet);
    } catch (error) {
        console.log(error);
    }
}

export const getLanguage = async() => {
    try {
        const lang = await AsyncStorage.getItem('@TitleLang');
        return(lang);
    } catch (error) {
        console.log(error);
    }
}

export const getNSFW = async() => {
    try {
        const nsfw = await AsyncStorage.getItem('@NSFW');
        return((nsfw === 'enabled' ? true : false));
    } catch (error) {
        console.log(error);
    }
}

export const checkUserID = async(userID) => {
    try {
        const id = await AsyncStorage.getItem('@UserID');
        if (typeof id !== 'string') {
            await AsyncStorage.setItem('@UserID', userID);
        }
    } catch (e) {
        console.log('Asyncstorage ERROR:', e);
    };
}