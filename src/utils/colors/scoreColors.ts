import { useTheme } from "@react-navigation/native";

const between = (score:number, min:number, max:number):boolean => {
    return score >= min && score <= max;
}

export const getScoreColor = (score:number):string => {
    if (between(score, 0, 64)) {
        return '#FF0000';
    } else if (between(score, 65, 74)) {
        return '#FFA500';
    } else if (between(score, 75, 100)) {
        return '#00d400';
    } else {
        return '#000000'; 
    }
}

// TODO: Combine functions into one
export const getMalScoreColor = (score:number):string => {
    if (between(score, 0, 6.49)) {
        return '#FF0000';
    } else if (between(score, 6.5, 7.49)) {
        return '#FFA500';
    } else if (between(score, 7.5, 10)) {
        return '#00d400';
    } else {
        return '#000000'
    }
}

export const getExternalLinkColor = (site:string):string => {
    const { colors } = useTheme();
    const LINKS = {
        'Official Site': colors.primary,
        'Amazon': '#FF9900',
        'Animax': '#00A3FB',
        'Animenetwork': '#9880FA',
        'Asian Crush': '#FD5C25',
        'Bomtoon': '#821BE6',
        'Comico': '#F40000',
        // 'ComicWalker'
        // 'CONtv'
        'Crunchyroll': '#F47520',
        // 'Dajiaochong Manhua'
        // 'Daum Webtoon'
        'Facebook':'#4267B2',
        // 'Fakku'
        'Funimation':'#5B0BB5',
        'HBO Max': '#7120D9',
        'Hidive': '#00AEEF',
        'Hulu': '#1CE783',
        // 'Japanese Film Archives'
        // 'Justoon'
        // 'KakaoPage'
        // 'KuaiKan Manhua'
        // 'Lezhin'
        // 'Lezhin'
        // 'Madman'
        'Manga Plus': '#E7240B',
        // 'Manga.Club'
        // 'Mangabox'
        // 'Manman Manhua'
        'Midnight Pulp': '#00D640',
        // 'Naver'
        'Netflix': '#E50914',
        // 'Nico Nico Seiga'
        // 'Piccoma'
        // 'Pixiv Comic'
        // 'Pixiv Novel'
        // 'Pocket Magazine'
        // 'QQ'
        'Shonen Jump Plus': '#E53935',
        // 'Sony Crackle'
        // 'Toomics'
        // 'Toomics'
        // 'Tubi TV'
        'Twitter': '#1D9BF0',
        // 'Viewster'
        'Vimeo': '#86c9ef',
        'Viz': '#FF0000',
        'VRV': '#FFDD00',
        // 'Web Comics'
        'Webtoons': '#00DC64',
        // 'Weibo Manhua'
        'Youtube': '#FF0000'
    }
    return LINKS[site];
}

export const listColor = (status: string) => {
    switch(status) {
        case 'COMPLETED':
            return '#00FF00';
        case 'PLANNING':
            return '#FFA500';
        case 'DROPPED':
        case 'CANCELLED':
        case 'PAUSED':
            return '#FF0000';
        case 'CURRENT':
        case 'REPEATING':
            return '#3AADE9';
    }
}