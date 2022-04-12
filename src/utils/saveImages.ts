import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ToastAndroid } from 'react-native';
import * as Sharing  from 'expo-sharing';

export const saveImage = async(uri:string, title:string) => {
    const fileType = uri.split('.').pop();
    console.log(fileType);
    const isAllowed = await MediaLibrary.getPermissionsAsync();
    if (!isAllowed.granted) {
        await MediaLibrary.requestPermissionsAsync();
    }
    const result = await FileSystem.downloadAsync(uri, FileSystem.documentDirectory + title + '.' + fileType);
    await MediaLibrary.saveToLibraryAsync(result.uri);
    ToastAndroid.show('Image Saved', ToastAndroid.SHORT);
}

export const shareImage = async(uri:string, title:string) => {
    const image_uri = await FileSystem.downloadAsync(uri, FileSystem.documentDirectory + title + '.jpg');
    const shared = await Sharing.shareAsync(image_uri.uri, {dialogTitle: 'Share Image'});
    await FileSystem.deleteAsync(image_uri.uri, {idempotent:false});
}