import axios, { AxiosResponse } from "axios";
import { MalCharactersType, MalCharImagesType, MalImages, MalNews, MALType } from "./types";

export const getMalData = async (id:number, type:string) => {
    try {
        const TYPE = type.toLowerCase();
        const url = `https://api.jikan.moe/v4/${TYPE}/${id}`;
        const response = await axios.get<MALType>(url);
        return response;
    } catch (error) {
        console.log('MalData Error:', error);
        return { data: {data: null}};
    }
}

export const getMalChar = async (id:number, name: string, type:string) => {
    try {
        const res = await axios.get<MalCharactersType>(`https://api.jikan.moe/v4/${type.toLowerCase()}/${id}/characters`);
        const char = res.data.data.filter(char => char.character.name === name);
        if (char.length > 0) {
            const images = await axios.get<MalCharImagesType>(`https://api.jikan.moe/v4/characters/${char[0].character.mal_id}/pictures`)
            return images.data;
        } else {
            return null;
        }
    } catch (error) {
        console.log('MalChar:', error);
    }
}

export const getNews = async(malId:number, page:number, type:string):Promise<MalNews|number> => {
    try {
        const res = await axios.get<MalNews>(`https://api.jikan.moe/v4/${type.toLowerCase()}/${malId}/news?page=${page}`);
        return res.data;
    } catch (error) {
        console.log('News Error:', error);
        return 500;
    }
}

type ImageResp = {data: MalImages[]}
export const getMalImages = async (malId:number, type:string) => {
    try {
        const res = await axios.get<ImageResp>(`https://api.jikan.moe/v4/${type.toLowerCase()}/${malId}/pictures`);
        return res.data.data;
    } catch (error) {
        console.log('Mal Images:', error);
        return null;
    }
}