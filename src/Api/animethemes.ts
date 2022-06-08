import axios, { AxiosResponse } from "axios";
import { Music } from "./types";

export const getMusic = async (id:number):Promise<AxiosResponse<Music>> => {
    const res = await axios.get<Music>(`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=Anilist&filter[external_id]=${id}&include=animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists&fields[video]=id,basename,link,tags`);
    return res;
}