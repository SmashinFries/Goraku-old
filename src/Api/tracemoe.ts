import axios, { AxiosRequestConfig } from "axios";
import * as ImagePicker from 'expo-image-picker';
import { TraceMoeType } from "./types";

const TRACE_MOE_API_URL = 'https://api.trace.moe/search?anilistInfo&cutBorders';

type Image = ImagePicker.ImageInfo | ImagePicker.ImagePickerCancelledResult;
export const searchLocalImage = async (setLoading, setImage, setMoeImage) => {
    const data = new FormData();
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: true,
    });
    if (!result.cancelled) {
        setLoading(true);
        const image: Image = result;
        // @ts-ignore
        setImage('data:image/jpeg;base64,' + image.base64)
        data.append('image', {
            // @ts-ignore
            name: 'image',
            type: 'image/jpeg',
            // @ts-ignore
            uri: image.uri,
        });
        const res = await fetch(TRACE_MOE_API_URL, {method: 'POST', body: data});
        const resjson = await res.json();
        setMoeImage(resjson);
    } else {
        return;
    }
}

export const searchCameraImage = async(imageUri:string) => {
    const data = new FormData();
    data.append('image', {
        // @ts-ignore
        name: 'image',
        type: 'image/jpeg',
        uri: imageUri,
    });
    try{
        const res = await fetch(TRACE_MOE_API_URL, {method: 'POST', body: data});
        const resjson = await res.json();
        return resjson;
    } catch (e) {
        console.log(e);
        return(null);
    }
}

export const getURLtrace = async(url:string):Promise<TraceMoeType> => {
    try {
        const response = await axios.get<TraceMoeType>(TRACE_MOE_API_URL+'&url='+encodeURIComponent(url));
        return response.data;
    } catch (error) {
        console.log(error);
    }
    
}