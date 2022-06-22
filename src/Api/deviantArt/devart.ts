import axios, { AxiosRequestConfig } from "axios";
import { PopularDevArtData } from "./types";
import { DEVART_KEY, DEVART_ID} from '@env';
import * as SecureStore from 'expo-secure-store';
import { getNSFW } from "../../Storage/nsfw";

const DEVART_URL = 'https://www.deviantart.com/api/v1/oauth2/';
const PLACEBO = 'https://www.deviantart.com/api/v1/oauth2/placebo';

export const fetchDevArtToken = async () => {
    type DevArtToken = {access_token:string}
    try {
        const token = await axios.post<DevArtToken>(`https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=${DEVART_ID}&client_secret=${DEVART_KEY}`);
        return token.data.access_token;
    } catch(e) {
        console.log('Token Fetch:', e);
    }
}

export const getDAToken = async() => {
    let token = await SecureStore.getItemAsync('authDevArt');
    console.log('First:', token);
    if (token) {
        try {
            const valid = await axios.post('https://www.deviantart.com/api/v1/oauth2/placebo?access_token=' + token);
            console.log(valid.data);
            if (valid.status === 200 && valid.data.status === 'success') {
                return token;
            }
        } catch(e) {
            const newToken = await fetchDevArtToken();
            SecureStore.setItemAsync('authDevArt', newToken)
            return newToken;
        }
    } else {
        const newToken = await fetchDevArtToken();
        console.log(newToken);
        SecureStore.setItemAsync('authDevArt', newToken)
        return newToken
    }
}

export const fetchPopular = async(search:string, page=1, limit=15) => {
    try {
        const allowNSFW = await getNSFW();
        const token = await getDAToken();
        const url = encodeURI(`${DEVART_URL}browse/popular?q=${search}&mature_content=true&timerange=alltime&offset=${page}&limit=${limit}&access_token=${token}`);
        let resp = await axios.post<PopularDevArtData>(url);
        const visual_art = (allowNSFW) ? resp.data.results.filter((item) => item.category === 'Visual Art' || item.category === 'Drawings') : resp.data.results.filter((item) => (item.category === 'Visual Art' || item.category === 'Drawings') && item.is_mature === false);
        resp.data = {...resp.data, results: visual_art};
        return resp.data;
    } catch (e) {
        console.log('Fetch Failed:', e);
    }
}