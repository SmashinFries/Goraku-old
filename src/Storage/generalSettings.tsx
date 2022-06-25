import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const storeSaveImgType = async(type:string) => {
    try {
        await AsyncStorage.setItem('@saveImgType', type);
    } catch (error) {
        console.log(error);
    }
}

export const getSaveImgType = async() => {
    try {
        const type = await AsyncStorage.getItem('@saveImgType');
        if (!type) {
            storeSaveImgType('jpg');
            return 'jpg';
        }
        return type;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getImgType = () => {
    const [type, setImgType] = useState<string>();

    let imgType = type ?? 'jpg';

    const checkAuth = async() => {
        const extention = await getSaveImgType();
        imgType = extention;
        setImgType(extention);
    }

    useEffect(() => {
        checkAuth();
    },[type]);
    
    return {imgType, setImgType};
}