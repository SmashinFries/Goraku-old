import React from "react";
import { View } from "react-native";
import { Caption, IconButton, Title } from "react-native-paper";
import { UserAnimeStats, UserMangaStats } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";

type StatOverviewProps = {
    data: UserAnimeStats & UserMangaStats;
    type: 'ANIME' | 'MANGA';
    colors: ThemeColors;
};

type DataBubbleProps = {
    value: string|number;
    description: string;
    icon: string;
}

const getDataBubbleObject = (icon:string, description:string, value:any) => {
    return {icon:icon, description:description, value:value};
}

const StatOverview = ({data, type, colors}:StatOverviewProps) => {
    const total = (type === 'ANIME') ? 
        getDataBubbleObject('television', 'Total Anime', data.count)
        : getDataBubbleObject('book', 'Total Manga', data.count);
    
    const amountViewed = (type === 'ANIME') ? 
        getDataBubbleObject('play', 'Episodes Seen', data.episodesWatched)
        : getDataBubbleObject('bookmark', 'Chapters Read', data.chaptersRead);
    
    const daysOrVolumes = (type === 'ANIME') ? 
        getDataBubbleObject('trash-can-outline', 'Days Wasted', (data.minutesWatched/1440).toFixed(1))
        : getDataBubbleObject('book-open-outline', 'Volumes Read', data.volumesRead);

    const plannedContent = (type === 'ANIME') ? 
        getDataBubbleObject('timer-sand', 'Days Planned', (data.statuses.find((item) => item.status === 'PLANNING').minutesWatched/1440).toFixed(2))
        // @ts-ignore
        : getDataBubbleObject('timer-sand', 'Chapters Planned', data.statuses.find((item) => item.status === 'PLANNING').chaptersRead)

    const meanScore = getDataBubbleObject('percent-outline', 'Mean Score', data.meanScore);
    const standardDev = getDataBubbleObject('division', 'Standard Deviation', data.standardDeviation);

    const overviewItems = [total, amountViewed, daysOrVolumes, plannedContent, meanScore, standardDev];
    
    const DataBubble = ({value, description, icon}:DataBubbleProps) => {
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center', width:150, height:100 }}>
                <IconButton icon={icon} size={30} style={{ backgroundColor: colors.primary }} />
                <View style={{ justifyContent: 'center' }}>
                    <Title style={{ color: colors.primary }}>{value}</Title>
                    <Caption style={{color:colors.text}}>{description}</Caption>
                </View>
            </View>
        );
    }
    
    return(
        <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-evenly'}}>
            {overviewItems.map((info, index) => <DataBubble key={index} icon={info.icon} value={info.value} description={info.description} />)}
        </View>
    );
}

export default StatOverview;