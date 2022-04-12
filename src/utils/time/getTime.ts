import { DateType } from "../../Api/types";

const HOUR = 60*60;
const DAY = HOUR*24;
const WEEK = DAY*7;
const MINUTE = 60;
const MONTH = WEEK*4;
const YEAR = MONTH*12;

export const getTime = (seconds:number):string => {
    const days = Math.floor(seconds/DAY);
    const hours = Math.floor((seconds/HOUR)%24);
    const minutes = Math.floor((seconds/MINUTE)%60);
    const timeUntil = `${(days > 0) ? days+'d ' : ' '}${(hours > 0) ? hours + 'h ' : ' '}${(minutes > 0) ? minutes + 'm ' : ' '}`;
    return timeUntil;
}

export const convertUnixTime = (unixTime:number) => {
    const currentDate = new Date();
    const date = new Date(unixTime*1000);
    const seconds = (currentDate.getTime() - date.getTime()) / 1000;
    
    const years = Math.floor(seconds/YEAR);
    const months = Math.floor(seconds/MONTH);
    const weeks = Math.floor(seconds/WEEK);
    const days = Math.floor(seconds/DAY);
    const hours = Math.floor((seconds/HOUR)%24);
    const minutes = Math.floor((seconds/MINUTE)%60);
    
    if (years >= 1) {
        return `${years} ${years > 1 ? 'years' : 'year'} ago`;
    } else if (months >= 1) {
        return `${months} ${months > 1 ? 'months' : 'month'} ago`;
    } else if (months < 1 && weeks >= 1) {
        return `${weeks} ${weeks > 1 ? 'weeks' : 'week'} ago`;
    } else if (weeks < 1 && days >= 1) {
        return `${days} ${days > 1 ? 'days' : 'day'} ago`;
    } else if (days < 1 && hours >= 1) {
        return `${hours} ${(hours > 1) ? 'hours' : 'hour'} ago`;
    } else if (hours < 1 && minutes >= 1) {
        return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`;
    } else {
        return 'Few seconds ago';
    }
}

export const getDate = (dates:DateType) => {
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (!dates.year) return `${months[dates.month]} ${dates.day}`;
    return `${dates.month}/${dates.day}/${dates.year}`;
}