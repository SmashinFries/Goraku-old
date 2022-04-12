const sort_anime = {
    'Popularity': 'POPULARITY_DESC',
    'Trending': 'TRENDING_DESC',
    'Score': 'SCORE_DESC',
    'Episodes': 'EPISODES_DESC',
    'Duration': 'DURATION_DESC',
    'Status': 'STATUS_DESC',
    'Updated': 'UPDATED_AT_DESC',
    'Search Match': 'SEARCH_MATCH',
    'Favorites': 'FAVOURITES_DESC',
    'ID': 'ID_DESC',
    'Romaji': 'TITLE_ROMAJI_DESC',
    'English': 'TITLE_ENGLISH_DESC', 
    'Native': 'TITLE_NATIVE_DESC',
    'Type': 'TYPE_DESC',
    'Format': 'FORMAT_DESC',
    'Start Date': 'START_DATE_DESC',
    'End Date': 'END_DATE_DESC',
}

const sort_manga = {
    'ID': 'ID_DESC',
    'Romaji': 'TITLE_ROMAJI_DESC',
    'English': 'TITLE_ENGLISH_DESC',
    'Native': 'TITLE_NATIVE_DESC',
    'Type': 'TYPE_DESC',
    'Format': 'FORMAT_DESC',
    'Score': 'SCORE_DESC',
    'Popularity': 'POPULARITY_DESC',
    'Trending': 'TRENDING_DESC',
    'Chapters': 'CHAPTERS_DESC',
    'Volumes': 'VOLUMES_DESC',
    'Status': 'STATUS_DESC',
    'Updated': 'UPDATED_AT_DESC',
    'Search Match': 'SEARCH_MATCH',
    'Favorites': 'FAVOURITES_DESC'
}

const streaming_services = {
    'Any': '',
    'Netflix': 'netflix',
    'Crunchyroll': 'crunchyroll',
    'Funimation': 'funimation',
    'Hidive': 'hidive',
    'VRV': 'vrv',
    'Hulu': 'hulu',
    'Amazon': 'amazon',
    'Animelab': 'animelab',
    'Viz': 'viz',
    'Midnight Pulp': 'midnightpulp.com',
    'Tubi TV': 'tubitv.com',
    'CONtv': 'contv.com',
}

const formats_anime = {
    'Any': '',
    'TV': 'TV',
    'TV Short': 'TV_SHORT',
    'Movie': 'MOVIE',
    'Special': 'SPECIAL',
    'OVA': 'OVA',
    'ONA': 'ONA',
    'Music': 'MUSIC',
}

const formats_manga = {
    'Any': '',
    'Manga': 'MANGA',
    'Novel': 'NOVEL',
    'One Shot': 'ONE_SHOT',
}

const status_anime = {
    'Any': '',
    'Airing' : 'RELEASING',
    'Finished': 'FINISHED',
    'Not Yet Aired' : 'NOT_YET_RELEASED',
    'Cancelled' : 'CANCELLED', 
}

const status_manga = {
    'Any': '',
    'Releasing': 'RELEASING',
    'Finished': 'FINISHED',
    'Not Yet Released': 'NOT_YET_RELEASED',
    'Hiatus': 'HIATUS',
    'Cancelled': 'CANCELLED',
}

const onList = {
    'false': 'Hide List',
    'true': 'Only Show List',
}

const countryOrigins = {
    'Any': '',
    'Japan': 'JP',
    'Korea': 'KR',
    'China': 'CN',
    'Taiwan': 'TW',
}

export { sort_anime, sort_manga, streaming_services, formats_anime, formats_manga, status_anime, status_manga, onList, countryOrigins }