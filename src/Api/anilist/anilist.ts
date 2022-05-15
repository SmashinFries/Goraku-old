import axios, { AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { changeAdultContent_M, changeLanguage_M, changeNotifications_M, quickAdd_M, quickRemove_M, rateReview_M, removeActivity_M, saveRecommendation_M, toggleLike_M } from "./mutations";
import { account_options_q, activity_q, alsofollowing_media_q, character_search_q, charDetail_Q, favoriteAnime_q, favoriteCharacters_q, favoriteManga_q, favoriteStaff_q, favoriteStudio_q, fullInfo_Q, mediaListEntryFull_q, mediaTile_Q, notification_q, random_q, recommendations_full_q, reviewUserRating_q, staff_info_q, staff_search_q, studio_list_q, TagCollection_Q, user_list_q, user_statistics_q } from "./query";
import { ActivityData, ActivityPage, CharFullType, CharSearchType, HomePageFetchParams, MediaEntryInfoType, MediaFollowing, MediaListCollectionType, MediaQueryRoot, RandomContent, RecommendationsFullType, ReviewRating, StaffFullType, StudioListType, TagArrangedType, TagCollectionType, UserFavoritesType, UserNotificationData, UserOptions, userRatingReview, UserStats } from "../types";
import { useEffect, useState } from "react";
import { HomeType } from "../../Components/types";
import { ADULT_ALLOW } from "../../constants";
import { getNSFW, storeNSFW } from "../../Storage/nsfw";

const _URL = 'https://graphql.anilist.co';
const queryParams = `
$page: Int, $perPage: Int, 
$sort: [MediaSort], 
$format: MediaFormat, 
$format_in: [MediaFormat], 
$format_not_in:[MediaFormat], 
$genre_in:[String], 
$genre_not_in:[String], 
$tag_in:[String], 
$tag_not_in:[String], 
$licensedBy_in:[String],
$minimumTagRank: Int,
$countryOfOrigin: CountryCode,
$status:MediaStatus,
$type:MediaType, 
$season: MediaSeason, 
$seasonYear: Int, 
$averageScore_greater: Int,
$averageScore_lesser: Int,
$chapters_greater: Int,
$chapters_lesser: Int,
$volumes_greater: Int,
$volumes_lesser: Int,
$episodes_greater: Int,
$episodes_lesser: Int,
$duration_greater: Int,
$duration_lesser: Int,
$startDate_lesser:FuzzyDateInt, 
$startDate_greater:FuzzyDateInt,
$isAdult: Boolean,$search: String
$onList: Boolean,
`;

const getQuery = (query: string, params: string) => {
    const _QUERY = `
    query (${params}) {
        Page (page:$page, perPage:$perPage) {
            pageInfo {
                hasNextPage
                currentPage
                total
            }
            ${query}
        }
    }
    `;

    return _QUERY;
}

const getHeader = async () => {
    const token = await SecureStore.getItemAsync('auth');
    if (!token) return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}` 
    }
}

export const getHomeData = async ({
    sort, type, format = undefined, page = 1, perPage = 5, season = undefined, seasonYear = undefined, search = undefined,
    status = undefined, countryOfOrigin = undefined, format_in = undefined,
    format_not_in = undefined, genre_in = undefined, genre_not_in = undefined,
    minimumTagRank = undefined, tag_in = undefined, tag_not_in = undefined, licensedBy_in = undefined,
    averageScore_greater=undefined, averageScore_lesser=undefined,
    chapters_greater=undefined, chapters_lesser=undefined,
    episodes_greater=undefined, episodes_lesser=undefined,
    volumes_greater=undefined, volumes_lesser=undefined,
    startDate_lesser=undefined, startDate_greater=undefined, onList=undefined,
}: HomePageFetchParams) => {
    try{
        const header = await getHeader();
        const nsfw = await getNSFW();
        const variables = {
            page: page, perPage: perPage,
            sort: sort,
            startDate_lesser:startDate_lesser, startDate_greater:startDate_greater,
            format: format, format_in: format_in, format_not_in: format_not_in,
            genre_in: genre_in, genre_not_in: genre_not_in,
            tag_in: tag_in, tag_not_in: tag_not_in,
            minimumTagRank: minimumTagRank,
            countryOfOrigin: countryOfOrigin,
            type: type,
            onList: onList,
            status: status,
            season: season, seasonYear: seasonYear,
            licensedBy_in: licensedBy_in,
            averageScore_greater: averageScore_greater,
            averageScore_lesser: averageScore_lesser,
            isAdult: (ADULT_ALLOW && nsfw) ? undefined : false,
            search: search,
            chapters_greater: chapters_greater,
            chapters_lesser: chapters_lesser,
            episodes_greater: episodes_greater,
            episodes_lesser: episodes_lesser,
            volumes_greater: volumes_greater,
            volumes_lesser: volumes_lesser,
        }
        const res = await axios.post<HomeType>(_URL, {
            query: getQuery(mediaTile_Q, queryParams),
            variables: variables
        },
        {headers: header}
        );
        return res;
    } catch (err) {
        console.log('HomeData:', err);
        return null;
    }
}

export const getMediaInfo = async(id:number, sort_c = ['ROLE','RELEVANCE','ID'], role_c = undefined, page_c = 1, perPage_c = 16, page_rec = 1, perPage_rec = 12) => {
    const header = await getHeader();
    try {
        const res = await axios.post<MediaQueryRoot>(_URL, {
            query:`
            query ($id: Int, $sort_c: [CharacterSort], $role_c: CharacterRole, $page_c: Int, $perPage_c: Int, $page_rec: Int, $perPage_rec: Int) {
                ${fullInfo_Q}
            }
            `,
            variables: {
                id: id,
                sort_c: sort_c,
                role_c: role_c,
                page_c: page_c,
                perPage_c: perPage_c,
                page_rec: page_rec,
                perPage_rec: perPage_rec,
            }
        }, {headers: header});
        return {res, isAuth: (header.Authorization) ? true : false};
    } catch (e) {
        return null;
    }
}

export const getCharacterDetail = async(id:number, page:number, perPage:number) => {
    try {
        const header = await getHeader();
        const res = await axios.post<CharFullType>(_URL, {
            query:charDetail_Q,
            variables: {
                id: id,
                page: page,
                perPage: perPage,
            }
        }, {headers: header});
        return res;
    } catch (error) {
        console.log('AnilistCharacterDetail:', error);
    }
}

export const getCharacterSearch = async(type:'CHARACTER'|'STAFF', search:string, page=1, perPage:20, isBirthday=undefined) => {
    try {
        const header = await getHeader();
        const res = await axios.post<CharSearchType>(_URL, {
            query:(type === 'CHARACTER') ? character_search_q : staff_search_q,
            variables: {
                search: search,
                page: page,
                perPage: perPage,
                isBirthday:isBirthday
            }
        }, {headers: header});
        return res;
    } catch (error) {
        console.log('CharacterSearch:', error);
    }
}

export const getTagData = async (): Promise<TagArrangedType> => {
    const data: AxiosResponse<TagCollectionType> = await axios.post(_URL, {
        query: TagCollection_Q
    });
    const nsfw = await getNSFW();

    const collectedCats = [];
    let tagsCollection = data.data.data.MediaTagCollection;
    let genreCollection = data.data.data.GenreCollection;
    if (ADULT_ALLOW === false || nsfw === false) {
        tagsCollection = tagsCollection.filter(tag => tag.isAdult === false);
        genreCollection = genreCollection.filter(genre => genre.toLowerCase() !== 'hentai');
    }
    const filters: TagArrangedType = { tags: {}, genres: genreCollection };

    for (let tag in tagsCollection) {
        if (!(tagsCollection[tag].category in collectedCats)) {
            const header = tagsCollection[tag].category;
            const catData = tagsCollection.filter(cat => cat.category === tagsCollection[tag].category)
            filters.tags[header] = catData;
            collectedCats.push(header);
        }
    }
    return(filters);
}

export const getRecommendations = async(page=1, perPage=10, sort=['RATING_DESC'], onList=true, type='ANIME') => {
    try {
        const header = await getHeader();
        const res = await axios.post<RecommendationsFullType>(_URL, {
            query:recommendations_full_q,
            variables: {
                page: page,
                perPage: perPage,
                sort:sort,
                onList:onList
            }
        }, {headers: header});
        return res;
    } catch (error) {
        console.log('Recommendations:', error);
    }
}

type MediaListEntry = {
    data: {
        Media: {
            mediaListEntry: MediaEntryInfoType;
        }
    }
}
export const getMediaListEntry = async(id:number) => {
    const header = await getHeader();
    try {
        const res = await axios.post<MediaListEntry>(_URL, {
            query:mediaListEntryFull_q,
            variables: {
                id: id,
            }
        }, {headers: header});
        return res.data.data.Media;
    } catch (e) {
        console.log('MediaListEntry:', e);
        return null;
    }
}

export const getUserOptions = async() => {
    const header = await getHeader();
    try {
        const res = await axios.post<UserOptions>(_URL, {
            query:account_options_q,
        }, {headers: header});
        return res.data.data.Viewer;
    } catch (e) {
        console.log('UserOptions:', e);
        return null;
    }
}

export const getUserMediaList = async(type:string, sort:string[] = undefined) => {
    const header = await getHeader();
    const userID = await AsyncStorage.getItem('@userID');
    const variable = {userId: userID ?? undefined, type: type, sort:sort};
    try {
        const res = await axios.post<MediaListCollectionType>(_URL, {
            query:user_list_q,
            variables: variable
        }, {headers: header});
        return res.data;
    } catch (e) {
        console.log('UserMediaList:', e);
        return null;
    }
}

export const getStudioList = async(id:number, page:number, perPage:number = 20) => {
    const header = await getHeader();
    try {
        const res = await axios.post<StudioListType>(_URL, {
            query:studio_list_q,
            variables: {
                id: id,
                page: page,
                perPage: perPage,
            }
        }, {headers: header});
        return res;
    } catch (e) {
        console.warn('StudioError:', e);
        return null;
    }
}

export const getStaffData = async(id:number, characterPage:number, onList:boolean, withCharacterRoles:boolean, withStaffRoles:boolean) => {
    const header = await getHeader();
    try {
        const res = await axios.post<StaffFullType>(_URL, {
            query:staff_info_q,
            variables: {
                id: id,
                characterPage: characterPage,
                sort: "START_DATE_DESC",
                onList: onList,
                withCharacterRoles: true,
                withStaffRoles: true,
            }
        }, {headers: header});
        return res;
    } catch (e) {
        console.warn('StudioError:', e);
        return null;
    }
}

export const getMediaFollowing = async(id:number, page:number) => {
    const header = await getHeader();
    try {
        const res = await axios.post<MediaFollowing>(_URL, {
            query:alsofollowing_media_q,
            variables: {
                id: id,
                page: page
            }
        }, {headers: header});
        return res;
    } catch (e) {
        console.warn('StudioError:', e);
        return null;
    }
}

export const getFavoriteChar = async(page=1) => {
        const header = await getHeader();
        try {
            const res = await axios.post<UserFavoritesType>(_URL, {
                query:favoriteCharacters_q,
                variables: {
                    page: page
                }
            }, {headers: header});
            return res.data;
        } catch (e) {
            console.warn('User_Characters:', e);
            return null;
        }
}

export const getFavoriteMedia = async(page=1, type:string) => {
    const header = await getHeader();
        try {
            const res = await axios.post<UserFavoritesType>(_URL, {
                query:type === 'ANIME' ? favoriteAnime_q : favoriteManga_q,
                variables: {
                    page: page
                }
            }, {headers: header});
            return res.data;
        } catch (e) {
            console.warn('User_MediaFav:', e);
            return null;
        }
}

export const getFavoriteStaff = async(page=1) => {
    const header = await getHeader();
    try {
        const res = await axios.post<UserFavoritesType>(_URL, {
            query: favoriteStaff_q,
            variables: {
                page: page
            }
        }, { headers: header });
        return res.data;
    } catch (e) {
        console.warn('User_StaffFav:', e);
        return null;
    }
}

export const getFavoriteStudio = async(page=1) => {
    const header = await getHeader();
    try {
        const res = await axios.post<UserFavoritesType>(_URL, {
            query:favoriteStudio_q,
            variables: {
                page: page
            }
        }, {headers: header});
        return res.data;
    } catch (e) {
        console.warn('User_StudioFav:', e);
        return null;
    }
}

export const useActivities = (page=1) => {
    const [data, setData] = useState<ActivityPage>();
    const [userId, setUserId] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);

    const fetchActivity = async() => {
        const header = await getHeader();
        const nsfw = await getNSFW();
        if (!userId) {
            const userId = await AsyncStorage.getItem('@userID');
            setUserId(userId);
        }
        try {
            const res = await axios.post<ActivityData>(_URL, {
                query:activity_q,
                variables: {
                    isFollowing: true,
                    page:page,
                    userId: undefined,
                }
            }, {headers: header});
            if (nsfw === false || ADULT_ALLOW === false) {
                const filtered = res.data.data.Page.activities.filter(media => media.media.isAdult === false);
                res.data.data.Page.activities = filtered;
            }
            return res.data.data.Page;
        } catch (e) {
            console.warn('Activities:', e);
            return null;
        }
    }

    const onRefresh = async() => {
        setRefresh(true);
        const resp = await fetchActivity();
        setData(resp);
        setRefresh(false);
    } 

    useEffect(() => {
        if (!data) {
            setLoading(true);
            fetchActivity().then(data => {
                setData(data);
                setLoading(false);
            });
        }
    },[]);

    useEffect(() => {
        if (data && data.pageInfo.currentPage > 1 && !refresh) {
            fetchActivity().then(resp => {
                console.log('Adding content!');
                setData({...data, pageInfo: resp.pageInfo, activities: [...data.activities, ...resp.activities]})
            });
        }
    },[page]);

    return {data, setData, loading, refresh, onRefresh, userId};
}

export const getRandomMedia = async(random:number, perRandom:number, type:'ANIME'|'MANGA'|'CHARACTER') => {
    const header = await getHeader();
    const nsfw = await getNSFW();
    console.log('Random:', random);
    console.log('PerRandom:', perRandom);
    try {
        const res = await axios.post<RandomContent>(_URL, {
            query:random_q,
            variables: {
                random: random,
                perRandom: perRandom,
                type: type,
                isAdult: (ADULT_ALLOW && nsfw) ? undefined : false
            }
        }, {headers: header});
        return res.data;
    } catch (e) {
        console.warn('Random Content Fetch:', e);
        return null;
    }
}

export const getUserNotifications = async() => {
    const header = await getHeader();
    try {
        const res = await axios.post<UserNotificationData>(_URL, {
            query:notification_q,
            variables: {
                page:1,
                perPage:15
            }
        }, {headers: header});
        return res.data.data.Page.notifications;
    } catch (e) {
        console.warn('User_favorites:', e);
        return null;
    }
}

export const getUserStats = async() => {
    const header = await getHeader();
    try {
        const res = await axios.post<UserStats>(_URL, {
            query:user_statistics_q
        }, {headers: header});
        return res.data.data.Viewer.statistics;
    } catch (e) {
        console.warn('User_favorites:', e);
        return null;
    }
}

export const getReviewUserRating = async(id:number) => {
    const header = await getHeader();
    try {
        const res = await axios.post<ReviewRating>(_URL, {
            query:reviewUserRating_q,
            variables: {
                id: id
            }
        }, {headers: header});
        return res.data.data.Review.userRating;
    } catch (e) {
        console.warn('getReviewUserRating:', e);
        return null;
    }
}

// Mutations
type ToggleFav = 'ANIME' | 'MANGA' | 'CHARACTER' | 'STAFF' | 'STUDIO';
export const toggleFav = async(id:number, type:ToggleFav) => {
    const header = await getHeader();
    try {
        const res = await axios.post(_URL, {
            query:toggleLike_M,
            variables: {
                animeId: (type === 'ANIME') ? id : undefined,
                mangaId: (type === 'MANGA') ? id : undefined,
                characterId: (type === 'CHARACTER') ? id : undefined,
                staffId: (type === 'STAFF') ? id : undefined,
                studioId: (type === 'STUDIO') ? id : undefined,
            }
        }, {headers: header});
        return res.status;
    } catch (e) {
        return null;
    }
}

type QuickAddResp = {
    id: number;
	status: string;
}
export const quickAdd = async(mediaId:number, status='PLANNING'):Promise<QuickAddResp> => {
    const header = await getHeader();
    try {
        const res = await axios.post(_URL, {
            query:quickAdd_M,
            variables: {
                mediaId: mediaId,
                status: status
            }
        }, {headers: header});
        return res.data.data.SaveMediaListEntry;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const updateMediaListEntry = async(mediaId:number = undefined, entryId:number = undefined, status:string = undefined, score:number = undefined, progress:number = undefined, repeat:number=undefined, startedAt=undefined, completedAt=undefined, notes:string=undefined, progressVolumes:number=undefined) => {
    const header = await getHeader();
    try {
        const res = await axios.post(_URL, {
            query:quickAdd_M,
            variables: {
                id: entryId,
                mediaId: mediaId,
                status: status,
                score: score,
                progress: progress,
                progressVolumes: progressVolumes,
                repeat: repeat,
                startedAt: startedAt,
                completedAt: completedAt,
                notes: notes
            }
        }, {headers: header});
        return res.data.data.SaveMediaListEntry;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const quickRemove = async(entry_id:number) => {
    const header = await getHeader();
    try {
        const res = await axios.post(_URL, {
            query:quickRemove_M,
            variables: {
                id: entry_id
            }
        }, {headers: header});
        return res.data.data.DeleteMediaListEntry.deleted;
    } catch (e) {
        return null;
    }
}

export const changeLanguage = async(titleLanguage:string = undefined, staffNameLanguage:string = undefined) => {
    const header = await getHeader();
    const variable = (titleLanguage !== undefined) ? {titleLanguage: titleLanguage} : {staffNameLanguage: staffNameLanguage};
    try {
        const res = await axios.post(_URL, {
            query:changeLanguage_M,
            variables: variable
        }, {headers: header});
        return res.status;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const changeNotifOptions = async(type:string, isEnabled:boolean) => {
    const header = await getHeader();
    const variable = {type: type, enabled: isEnabled};
    try {
        const res = await axios.post(_URL, {
            query:changeNotifications_M,
            variables: {
                notificationOptions: [variable]
            }
        }, {headers: header});
        console.log(res);
        return res.status;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const changeNSFW = async(isEnabled:boolean) => {
    const header = await getHeader();
    try {
        const res = await axios.post(_URL, {
            query:changeAdultContent_M,
            variables: {
                displayNSFW: isEnabled
            }
        }, {headers: header});
        await storeNSFW(isEnabled);
        return res.status;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const saveRecommendation = async(mediaBaseId:number, mediaRecId:number, rating:'NO_RATING'|'RATE_UP'|'RATE_DOWN') => {
    const header = await getHeader();
    try {
        const res = await axios.post(_URL, {
            query:saveRecommendation_M,
            variables: {
                mediaId: mediaBaseId,
                mediaRecommendationId: mediaRecId,
                rating: rating
            }
        }, {headers: header});
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const removeActivity = async(id:number) => {
    const header = await getHeader();
    try {
        const res = await axios.post(_URL, {
            query:removeActivity_M,
            variables: {
                id: id
            }
        }, {headers: header});
        return (res.data) ? true : false;
    } catch (e) {
        console.log('removeActivity:', e);
        return null;
    }
}

export const rateReview = async(id:number, rating:userRatingReview) => {
    const header = await getHeader();
    try {
        const res = await axios.post(_URL, {
            query:rateReview_M,
            variables: {
                id: id,
                rating: rating
            }
        }, {headers: header});
        return res.data;
    } catch (e) {
        console.log('rateReview:', e);
        return null;
    }
}