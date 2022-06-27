import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ToastAndroid } from 'react-native';
import * as Sharing  from 'expo-sharing';
import { getSaveImgType } from '../Storage/generalSettings';

export const saveImage = async(uri:string, title:string) => {
    const isSavedLocal = (uri.split(':')[0] === 'file') ? true : false;
    const fileType = await getSaveImgType();
    const isAllowed = await MediaLibrary.getPermissionsAsync();
    if (!isAllowed.granted) {
        await MediaLibrary.requestPermissionsAsync();
    }
    try {
        if (!isSavedLocal) {
            const fileUri = FileSystem.documentDirectory + title + '.' + fileType;
            const result = await FileSystem.downloadAsync(uri, fileUri);
            await MediaLibrary.saveToLibraryAsync(result.uri);
        } else {
            await MediaLibrary.saveToLibraryAsync(uri);
        }
        ToastAndroid.show('Image Saved', ToastAndroid.SHORT);
    } catch (error) {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    }
    
}

export const shareImage = async(uri:string, title:string) => {
    const image_uri = await FileSystem.downloadAsync(uri, FileSystem.documentDirectory + title + '.jpg');
    const shared = await Sharing.shareAsync(image_uri.uri, {dialogTitle: 'Share Image'});
    await FileSystem.deleteAsync(image_uri.uri, {idempotent:false});
}