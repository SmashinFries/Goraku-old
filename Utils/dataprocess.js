import React from "react";
import { getDateDiff } from "../Data Handler/getdata";
import { useIsFocused } from "@react-navigation/core";
import { StatusBar } from "react-native";

export const textDecider = (data) => {
    const typename = data['__typename'];
    const {daysDif, hoursDif, minutesDif, secondsDif} = getDateDiff(data.createdAt * 1000);
    const time = (hoursDif > 23) ? `${daysDif} ${(daysDif > 1) ? 'days' : 'day'} ago` :
    (hoursDif < 24 && hoursDif > 0) ? `${hoursDif} ${(hoursDif > 1) ? 'hours' : 'hour'} ago` : 
    (minutesDif > 1) ? `${minutesDif} minutes ago` : `Under a minute ago`;

    let bottomText = '';
    let topText = '';
    let image = '';
    let notifData = {title:'', body:''};
    let rawTime = data.createdAt * 1000;
    
    // Notifications
    if (typename === 'AiringNotification') {
        topText = `${data.contexts[0]}${data.episode}${data.contexts[1]}${data.media.title.userPreferred}`;
        bottomText = `${data.contexts[2].replace(' ', '')}`;
        image = data.media.coverImage.extraLarge;
        notifData = {title:data.media.title.userPreferred, body:`${data.contexts[0]}${data.episode}${data.contexts[2]}`};
    } else if (typename === 'FollowingNotification') {
        topText = `${data.user.name}${data.context}`;
        image = data.user.avatar.large;
        notifData = {title:data.user.name, body:`${data.user.name}${data.context}`};
    } else if (typename === 'ActivityLikeNotification') {
        topText = `${data.user.name}${data.context}`;
        image = data.user.avatar.large;
        notifData = {title:data.user.name, body:`${data.user.name}${data.context}`};
    } else if (typename === 'RelatedMediaAdditionNotification') {
        topText = data.media.title.userPreferred;
        bottomText = `${data.context.slice(1)}`;
        image = data.media.coverImage.extraLarge;
        notifData = {title:data.media.title.userPreferred, body:`${data.context.slice(1)}`};
    }

    // Activity
    if (typename === 'ListActivity') {
        topText = `${data.status} ${(data.progress !== null) ? data.progress : ''}`;
        bottomText = `${data.media.title.userPreferred}`;
        image = data.media.coverImage.extraLarge;
    } else if (typename === 'TextActivity') {
        topText = ``;
        bottomText = `${data.text}`;
        image = data.user.avatar.large;
    } else if (typename === 'MessageActivity') {
        topText = `${data.messenger.name} wrote:`;
        bottomText = `${data.message}`;
        image = data.messenger.avatar.large;
    }

    return({bottomText, topText, time, image, rawTime, notifData});
}

export const FocusAwareStatusBar = (props) => {
    const isFocused = useIsFocused();
  
    return isFocused ? <StatusBar {...props} /> : null;
  }