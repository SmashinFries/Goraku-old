const _SEASONS = {
    'WINTER': [11, 0, 1],
    'SPRING': [2, 3, 4],
    'SUMMER': [5, 6, 7],
    'FALL': [8, 9, 10],
}

export const getYear = ():number => {
    const year = new Date().getFullYear();
    return year;
}

export const getSeason = ():string => {
    const month = new Date().getMonth();
    let current_season = '';
    for (let season in _SEASONS) {
        if (_SEASONS[season].includes(month)) {
            current_season = season
            break;
        }
    }
    return current_season;
}