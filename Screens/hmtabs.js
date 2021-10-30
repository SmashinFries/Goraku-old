// React
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
// Navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
// Data
import { cacheA, cacheM, cacheN } from '../Queries/query';
import { getSeason, getNextSeason, getTrend, getPopular, getTop } from '../Data Handler/getdata';
import { getNSFW } from '../Storages/storagehooks';
import { getToken } from '../Storages/getstorage';
// Components
import { HomeDisplay } from '../Components/home';
import { InfoNav } from './infopage';

const Tabs = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
let nsfw = false;

const Animetab = () => {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [isAuth, setAuth] = useState(false);
    const { colors } = useTheme();

    const getAll = async(type) => {
        const isNsfw = await getNSFW();
        const token = await fetchToken();
        nsfw = (isNsfw === 'enabled') ? undefined : false;
        await getSeason(1, nsfw, token, false);
        await getNextSeason(1, nsfw, token, false);
        await getTrend(type, 1, undefined, nsfw, token, false);
        await getPopular(type, 1, undefined, nsfw, token, false);
        await getTop(type, 1, undefined, nsfw, token, false);
        setLoading(false);
    }

    const fetchToken = async() => {
        const login = await getToken();
        setAuth(login);
        return login;
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

    // if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        <View>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />} >
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <HomeDisplay data={cacheA.Season.content} page={cacheA.Season.Page} type="ANIME" section='This Season' isAdult={nsfw} token={isAuth} />
                    <HomeDisplay data={cacheA.NextSeason.content} page={cacheA.NextSeason.Page} type="ANIME" section='Next Season' isAdult={nsfw} token={isAuth} />
                    <HomeDisplay data={cacheA.Trending.content} page={cacheA.Trending.Page} type="ANIME" section='Trending' isAdult={nsfw} token={isAuth} />
                    <HomeDisplay data={cacheA.Popular.content} page={cacheA.Popular.Page} type="ANIME" section='Popular' isAdult={nsfw} token={isAuth} />
                    <HomeDisplay data={cacheA.Top.content} page={cacheA.Top.Page} type="ANIME" section='Top Rated' isAdult={nsfw} token={isAuth} />
                </View>
            </ScrollView>
        </View>
    );
}

const Mangatab = () => {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [isAuth, setAuth] = useState(false);
    const { colors } = useTheme();

    const fetchToken = async() => {
        const login = await getToken();
        setAuth(login);
        return login;
    }

    const getAll = async(type) => {
        const token = await fetchToken();
        await getTrend(type, 1, 'MANGA', nsfw, token, false);
        await getPopular(type, 1, 'MANGA', nsfw, token, false);
        await getTop(type, 1, 'MANGA', nsfw, token, false);
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

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        <View>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <HomeDisplay data={cacheM.Trending.content} page={cacheM.Trending.Page} type="MANGA" section='Trending' token={isAuth} />
                    <HomeDisplay data={cacheM.Popular.content} page={cacheM.Popular.Page} type="MANGA" section='Popular' token={isAuth} />
                    <HomeDisplay data={cacheM.Top.content} page={cacheM.Top.Page} type="MANGA" section='Top Rated' token={isAuth} />
                </View>
            </ScrollView>
        </View>
    );
}

const Lntab = () => {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [isAuth, setAuth] = useState(false);
    const { colors } = useTheme();

    const fetchToken = async() => {
        const login = await getToken();
        setAuth(login);
        return login;
    }

    const getAll = async(type) => {
        const token = await fetchToken();
        await getTrend(type, 1, "NOVEL", nsfw, token, false);
        await getPopular(type, 1, "NOVEL", nsfw, token, false);
        await getTop(type, 1, "NOVEL", nsfw, token, false);
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

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        <View>
            {(loading === false) ?
            <ScrollView showsVerticalScrollIndicator={false} refreshControl= {<RefreshControl refreshing={refresh} onRefresh={onRefresh} /> }>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <HomeDisplay data={cacheN.Trending.content} page={cacheN.Trending.Page} type="NOVEL" section='Trending' token={isAuth} />
                    <HomeDisplay data={cacheN.Popular.content} page={cacheN.Popular.Page} type="NOVEL" section='Popular' token={isAuth} />
                    <HomeDisplay data={cacheN.Top.content} page={cacheN.Top.Page} type="NOVEL" section='Top Rated' token={isAuth} />
                </View>
            </ScrollView>
            : <Text style={{ textAlign: 'center' }}>RIP</Text>}
        </View>
    );
}

const TabScreen = () => {
    const { colors } = useTheme();
    return(
        <Tabs.Navigator initialRouteName='Anime' screenOptions={{tabBarPressColor:colors.primary, swipeEnabled:true}} >
            <Tabs.Screen name='Anime' component={Animetab} />
            <Tabs.Screen name='Manga' component={Mangatab} />
            <Tabs.Screen name='LN' component={Lntab} />
        </Tabs.Navigator>
    );
}

export const HomeStack = () => {
    return(
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={TabScreen} options={{headerTitle:'Explore', headerStyle:{height:60}}} />
            <Stack.Screen name='InfoHome' component={InfoNav} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}