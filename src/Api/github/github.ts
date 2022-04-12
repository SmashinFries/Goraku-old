import axios from "axios";
import { useEffect, useState } from "react";
import { VERSION } from "../../constants";
import { Release } from "./types";

const RELEASE_URL = 'https://api.github.com/repos/smashinfries/goraku/releases';

export const useRelease = () => {
    const [release, setRelease] = useState<Release>();

    const fetchRelease = async () => {
        try {
            const res = await axios.get<Release[]>(RELEASE_URL);
            return res.data;
        } catch (e) {
            console.warn('Release:', e);
            return null;
        }
    }

    useEffect(() => {
        console.log('Checking for updates');
        fetchRelease().then((data) => setRelease(data[0]));
    },[]);

    return {release};
}