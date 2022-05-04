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