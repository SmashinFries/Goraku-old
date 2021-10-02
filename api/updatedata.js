import axios from 'axios';
import { DELETE_MEDIA_ENTRY, FAVORITE_MODIFY, PROGRESS_UPDATE, SCORE_UPDATE, STATUS_UPDATE, TOGGLE_FOLLOW } from '../Queries/mutations';

const url = 'https://graphql.anilist.co';

export const updateStatus = async(token, mediaId, status) => {
    try {
        const data = await axios.post(url, {query: STATUS_UPDATE, variables:{mediaId:mediaId, status:status}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.SaveMediaListEntry;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const updateProgress = async(token, mediaId, progress) => {
    try {
        const data = await axios.post(url, {query: PROGRESS_UPDATE, variables:{mediaId:mediaId, progress:progress}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.SaveMediaListEntry;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const updateScore = async(token, mediaId, score) => {
    try {
        const data = await axios.post(url, {query: SCORE_UPDATE, variables:{mediaId:mediaId, score:score}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.SaveMediaListEntry;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const updateFavorite = async(token, characterId) => {
    try {
        const data = await axios.post(url, {query: FAVORITE_MODIFY, variables:{characterId: characterId}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.ToggleFavourite;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const updateFollow = async(token, userId) => {
    try {
        const data = await axios.post(url, {query: TOGGLE_FOLLOW, variables:{userId: userId}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.ToggleFollow.isFollowing;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const deleteEntry = async(token, id) => {
    const data = await axios.post(url, {query: DELETE_MEDIA_ENTRY, variables:{id:id}},
        {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
    const updatedInfo = await data.data.data.DeleteMediaListEntry;
    return updatedInfo;
}