import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { cacheA, cacheM, cacheN } from '../Queries/query';
import { HomeDisplay } from '../Components/home';
import { getSeason, getNextSeason, getTrend, getPopular, getTop, getOverview } from '../api/getdata';
import { InfoNav } from './infopage';
import { getNSFW } from '../Components/storagehooks';

const Tabs = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
let nsfw = false;

const Animetab = () => {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const getAll = async(type) => {
        const isNsfw = await getNSFW();
        nsfw = (isNsfw === 'enabled') ? undefined : false;
        await getSeason(1, nsfw);
        await getNextSeason(1, nsfw);
        await getTrend(type, 1, undefined, nsfw);
        await getPopular(type, 1, undefined, nsfw);
        await getTop(type, 1, undefined, nsfw);
        setLoading(false);
    }

    const onRefresh = async() => {
        setRefresh(true);
        cacheA.Season.content = [];
        cacheA.Season.Page = {};
        cacheA.NextSeason.content = [];
        cacheA.NextSeason.Page = {};
        cacheA.Trending.content = [];
        cacheA.Trending.Page = {};
        cacheA.Popular.content = [];
        cacheA.Popular.Page = {};
        cacheA.Top.content = [];
        cacheA.Top.Page = {};
        await getAll("ANIME");
        setRefresh(false);
    }

    useEffect(() => {
        getAll("ANIME");
    }, []);

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color='#00ff00' /></View>

    return(
        <View>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl= {<RefreshControl refreshing={refresh} onRefresh={onRefresh} /> } >
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <HomeDisplay data={cacheA.Season.content} page={cacheA.Season.Page} type="ANIME" section='This Season' isAdult={nsfw} />
                    <HomeDisplay data={cacheA.NextSeason.content} page={cacheA.NextSeason.Page} type="ANIME" section='Next Season' isAdult={nsfw} />
                    <HomeDisplay data={cacheA.Trending.content} page={cacheA.Trending.Page} type="ANIME" section='Trending' isAdult={nsfw} />
                    <HomeDisplay data={cacheA.Popular.content} page={cacheA.Popular.Page} type="ANIME" section='Popular' isAdult={nsfw} />
                    <HomeDisplay data={cacheA.Top.content} page={cacheA.Top.Page} type="ANIME" section='Top Rated' isAdult={nsfw} />
                </View>
            </ScrollView>
        </View>
    );
}

const Mangatab = () => {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const getAll = async(type) => {
        await getTrend(type);
        await getPopular(type);
        await getTop(type);
        setLoading(false);
    }

    const onRefresh = async() => {
        setRefresh(true);
        cacheM.Trending.content = [];
        cacheM.Trending.Page = {};
        cacheM.Popular.content = [];
        cacheM.Popular.Page = {};
        cacheM.Top.content = [];
        cacheM.Top.Page = {};
        await getAll("MANGA");
        setRefresh(false);
    }

    useEffect(() => {
        getAll("MANGA");
    }, []);

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color='#00ff00' /></View>

    return(
        <View>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl= {<RefreshControl refreshing={refresh} onRefresh={onRefresh} /> }>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <HomeDisplay data={cacheM.Trending.content} page={cacheM.Trending.Page} type="MANGA" section='Trending' />
                    <HomeDisplay data={cacheM.Popular.content} page={cacheM.Popular.Page} type="MANGA" section='Popular' />
                    <HomeDisplay data={cacheM.Top.content} page={cacheM.Top.Page} type="MANGA" section='Top Rated' />
                </View>
            </ScrollView>
        </View>
    );
}

const Lntab = () => {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const getAll = async(type) => {
        await getTrend(type, 1, "NOVEL");
        await getPopular(type, 1, "NOVEL");
        await getTop(type, 1, "NOVEL");
        setLoading(false);
    }

    const onRefresh = async() => {
        setRefresh(true);
        cacheN.Trending.content = [];
        cacheN.Trending.Page = {};
        cacheN.Popular.content = [];
        cacheN.Popular.Page = {};
        cacheN.Top.content = [];
        cacheN.Top.Page = {};
        await getAll("MANGA");
        setRefresh(false);
    }

    useEffect(() => {
        getAll("MANGA");
    }, []);

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color='#00ff00' /></View>

    return(
        <View>
            {(loading === false) ?
            <ScrollView showsVerticalScrollIndicator={false} refreshControl= {<RefreshControl refreshing={refresh} onRefresh={onRefresh} /> }>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <HomeDisplay data={cacheN.Trending.content} page={cacheN.Trending.Page} type="MANGA" section='Trending' />
                    <HomeDisplay data={cacheN.Popular.content} page={cacheN.Popular.Page} type="MANGA" section='Popular' />
                    <HomeDisplay data={cacheN.Top.content} page={cacheN.Top.Page} type="MANGA" section='Top Rated' />
                </View>
            </ScrollView>
            : <Text style={{ textAlign: 'center' }}>RIP</Text>}
        </View>
    );
}

const TabScreen = () => {
    return(
        <Tabs.Navigator initialRouteName='Anime'>
            <Tabs.Screen name='Anime' component={Animetab} />
            <Tabs.Screen name='Manga' component={Mangatab} />
            <Tabs.Screen name='LN' component={Lntab} />
        </Tabs.Navigator>
    );
}

export const HomeStack = () => {
    return(
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={TabScreen} options={{headerTitle:'Explore'}} />
            <Stack.Screen name='InfoHome' component={InfoNav} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}