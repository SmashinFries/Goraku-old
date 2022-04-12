import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, ScrollView, RefreshControl } from "react-native";
import { getUserStats } from "../../../Api/anilist/anilist";
import { UserAnimeStats, UserMangaStats } from "../../../Api/types";
import { LoadingView } from "../../../Components";
import BarChartCard from "./components/barChart";
import LineChartCard from "./components/lineChart";
import { PieChartCard } from "./components/pieChart";
import StatMediaSelector from "./components/statMediaType";
import StatOverview from "./components/statOverview";

const StatisticsScreen = ({navigation, route}) => {
    const [animeData, setAnimeData] = useState<UserAnimeStats>();
    const [mangaData, setMangaData] = useState<UserMangaStats>();
    const [type, setType] = useState<'ANIME'|'MANGA'>('ANIME');
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const { colors, dark } = useTheme();
    const { width, height } = useWindowDimensions();

    const fetchStats = async() => {
        const resp = await getUserStats();
        setAnimeData(resp.anime);
        setMangaData(resp.manga);
        setLoading(false);
    }

    const onRefresh = async() => {
        setRefresh(true);
        await fetchStats();
        setRefresh(false);
    }

    const chapterSort = (a, b) => {
        if (a.length === null) return 1;
        if (b.length === null) return -1;
        return (Number(a.length.split('-')[0]) - Number(b.length.split('-')[0]))
    }

    useEffect(() => {
        if (!animeData && !mangaData) {
            console.log('ran');
            fetchStats();
        }
    },[]);

    if (loading) return <LoadingView colors={{colors, dark}} />
    
    return(
        <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />} contentContainerStyle={{paddingVertical:10}}> 
            <View style={{ flex:1, alignItems:'center', marginHorizontal:10}}>
                <StatMediaSelector defaultText={type} colors={colors} setType={setType} width={'85%'} />
                {/* @ts-ignore */}
                <StatOverview data={(type==='ANIME') ? animeData : mangaData} colors={colors} type={type} />
                <BarChartCard data={(type==='ANIME') ? animeData.scores.sort((a, b) => {return a.score - b.score}) : mangaData.scores.sort((a, b) => {return a.score - b.score})} title={'Scores'} itemTitle='score' colors={colors} />
                <BarChartCard data={(type==='ANIME') ? animeData.lengths.sort((a, b) => {return Number(a.length.split('-')[0]) - Number(b.length.split('-')[0])}) : mangaData.lengths.sort(chapterSort)} title={(type==='ANIME') ? 'Episode Count' : 'Chapter Count'} itemTitle='length' colors={colors} />
                <PieChartCard data={(type==='ANIME') ? animeData : mangaData} itemName='format' itemType='formats' title='Format' colors={colors} width={width-80} />
                <PieChartCard data={(type==='ANIME') ? animeData : mangaData} itemName='status' itemType='statuses' title='Statuses' colors={colors} width={width-80} />
                <PieChartCard data={(type==='ANIME') ? animeData : mangaData} itemName='country' itemType='countries' title='Countries' colors={colors} width={width-80} />
                <LineChartCard data={(type==='ANIME') ? animeData.releaseYears.sort((a, b) => {return a.releaseYear - b.releaseYear}) : mangaData.releaseYears.sort((a, b) => {return a.releaseYear - b.releaseYear})} colors={colors} />
            </View>
        </ScrollView>
    );
}

export default StatisticsScreen