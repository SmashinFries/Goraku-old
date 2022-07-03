const _SEASONS = {
    'WINTER': [0, 1, 2],
    'SPRING': [3, 4, 5],
    'SUMMER': [6, 7, 8],
    'FALL': [9, 10, 11],
}

export const getYear = ():number => {
    const year = new Date().getFullYear();
    return year;
}

export const getSeason = (next = false):string => {
    const month = new Date().getMonth();
    const keys = Object.keys(_SEASONS);
    let current_season = '';
    for (let season in _SEASONS) {
        if (_SEASONS[season].includes(month)) {
            current_season = season
            break;
        }
    }
    if (next) {
        const idx = keys.indexOf(current_season);
        const newIdx = (idx > 3) ? idx : idx + 1
        current_season = keys[newIdx]
    }
    return current_season;
}