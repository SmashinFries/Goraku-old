import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTheme = async(theme:string) => {
    try {
        await AsyncStorage.setItem('@theme', theme);
    } catch (error) {
        console.log(error);
    }
}

export const getTheme = async() => {
    try {
        const theme = await AsyncStorage.getItem('@theme');
        return theme;
    } catch (error) {
        console.log(error);
        return null;
    }
}