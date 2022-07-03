import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
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


export const useDevArtEnabled = () => {
    const [devartState, setDevartState] = useState<boolean>(false);
    const {getItem, setItem} = useAsyncStorage('@devArtEnabled');
    
    const stringToBool = (text:string) => {return((text === 'true') ? true : false);}

    const checkDevArt = async() => {
        const item = await getItem();
        if (item !== null) {
            setDevartState(stringToBool(item));
        } else {
            await setItem('false');
            setDevartState(stringToBool('false'));
        }
    }

    const updateDevArt = async(isEnabled:boolean) => {
        await setItem((isEnabled === true) ? 'true' : 'false');
        setDevartState(isEnabled);
    }

    useEffect(() => {
        checkDevArt();
    },[]);

    return {devartState, updateDevArt};
}