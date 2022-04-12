import { getMusic } from "./animethemes";
import { getHomeData, getMediaInfo, getTagData, changeLanguage, changeNSFW, changeNotifOptions,
getCharacterDetail, getMediaListEntry, getRecommendations, getUserMediaList, getUserOptions, 
quickAdd, quickRemove, toggleFav, updateMediaListEntry } from "./anilist/anilist";
import { searchLocalImage } from "./tracemoe";
import { getMalData, getMalChar, getMalImages, getNews } from "./mal";

export { getMusic, getHomeData, getMediaInfo, getTagData, searchLocalImage, getMalData, changeLanguage, changeNSFW,
changeNotifOptions, getCharacterDetail, getMediaListEntry, getRecommendations, getUserMediaList, getUserOptions, 
quickAdd, quickRemove, toggleFav, updateMediaListEntry, getMalChar, getMalImages, getNews };