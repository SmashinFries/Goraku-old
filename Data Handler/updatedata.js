import axios from 'axios';
import { DELETE_ACTIVITY, DELETE_ACTIVITY_REPLY, DELETE_MEDIA_ENTRY, FAVORITE_MODIFY, PROGRESS_UPDATE, SAVE_ACTIVITY_REPLY, SCORE_UPDATE, STATUS_UPDATE, TOGGLE_FOLLOW, TOGGLE_LIKE } from '../Queries/mutations';

const url = 'https://graphql.anilist.co';

// LISTS
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

export const deleteEntry = async(token, id) => {
    try {
        const data = await axios.post(url, {query: DELETE_MEDIA_ENTRY, variables:{id:id}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.DeleteMediaListEntry;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

// FAVORITING
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

// FOLLOW UPDATE
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

// ACTIVITY
export const toggleLike = async(token, id) => {
    try {
        const data = await axios.post(url, {query: TOGGLE_LIKE, variables:{id: id}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.ToggleLikeV2;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const addComment = async(token, activityId, id=undefined) => {
    try {
        const data = await axios.post(url, {query: SAVE_ACTIVITY_REPLY, variables:{id: id, activityId:activityId}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.SaveActivityReply;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const deleteComment = async(token, id) => {
    try {
        const data = await axios.post(url, {query: DELETE_ACTIVITY_REPLY, variables:{id: id}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.DeleteActivityReply;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const deleteActivity = async(token, id) => {
    try {
        const data = await axios.post(url, {query: DELETE_ACTIVITY, variables:{id: id}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const updatedInfo = await data.data.data.DeleteActivity;
        return updatedInfo;
    } catch (error) {
        console.error(error);
    }
}

export const filterContent = async(data, type, currentData=null, isList=false) => {
    let count = 0;
    let newData = [];

    const filterFun = () => {
        for (let i in data) {
            const item = (isList === true) ? data[i].media.format : data[i].format;
            if (item === type.toUpperCase() || type === 'ANIME') {
                count += 1;
                newData.push(data[i]);
            }
        }
        const uniqueNovels = (currentData !== null) ? newData.filter(i => currentData.every(j => ((isList === true) ? i.media.id : i.id) !== ((isList === true) ? j.media.id : j.id))) : newData;
        newData = uniqueNovels;
    }

    filterFun();
    return(newData);
}