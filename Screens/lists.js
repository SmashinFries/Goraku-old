import React, { useState, useLayoutEffect, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, FlatList } from 'react-native';
import { Text, Image, Button, Overlay, Badge } from 'react-native-elements';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getLists } from '../api/getdata';
import { InfoNav } from './infopage';
import { getToken } from '../api/getstorage';
import { _ContentTile } from '../Components/customtile';
import { Login } from './userinfo';

const Tabs = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const types = ['Current', 'Planning', 'Completed', 'Dropped', 'Paused'];

const UserList = ({navigation}) => {
    const [isVisible, setVisible] = useState(false);
    const [userId, setUserId] = useState(null);
    const [status, setStatus] = useState(types[0]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(false);
    const [anime, setAnime] = useState({});
    const [manga, setManga] = useState({});
    const { colors } = useTheme();

    const fetchData = async(type, stat, reset=false) => {
        const login = await getToken();
        const id = (userId !== null) ? userId : await AsyncStorage.getItem('@UserID');
        setUserId(Number(id));
        setToken(login);
        if (typeof login === 'string' && reset === true) {
            const info = await getLists(Number(id), 1, stat.toUpperCase(), type);
            (type === 'ANIME') ? setAnime(info) : setManga(info);
            return info;
        }
        setLoading(false);
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title={(typeof token === 'string') ? status : ''} type='clear' titleStyle={{ color: colors.primary }} onPress={() => setVisible(true)} />
            ),
        });
    }, [navigation, token, status]);

    useFocusEffect(
        React.useCallback(() => {
            fetchData('ANIME', status);
            fetchData('MANGA', status);
        }, [])
    );

    useEffect(() => {
        fetchData('ANIME', status, true);
        fetchData('MANGA', status, true);
    }, [token])

    const _renderItem = ({item}) => {
        return(
            <View style={{flex:1, alignItems:'center'}}>
                <Image source={{uri:item.media.coverImage.extraLarge}} style={{height:250, width:170, resizeMode:'cover', borderRadius: 8}} onPress={() => {navigation.push('UserListMedia', {screen: 'Info', params: {id:item.media.id, title:{romaji: item.media.title.romaji, native: item.media.title.native, english:item.media.title.english}},});}} />
                <Text numberOfLines={2} style={{textAlign:'center', width:170, fontSize:15, color:colors.text}}>{item.media.title.romaji}</Text>
                {(item.progress !== null) ? 
                <View style={{position:'absolute', borderTopRightRadius:8, borderTopLeftRadius:8, top:0, height:30, justifyContent:'center', width:170, backgroundColor:'rgba(0,0,0,.5)'}}>
                    <Text style={{color:'#FFF', textAlign:'center'}}>{
                        (status === 'Current' || status === 'Dropped' || status === 'Paused') ? (`${(item.media.type === 'ANIME') ? 'Episode' : 'Chapter'}: ${(item.media.episodes !== null || item.media.chapters !== null) ? `${item.progress}/${(item.media.type === 'ANIME') ? item.media.episodes : item.media.chapters}` : item.progress}`) 
                        : (status === 'Planning') ? (item.media.type === 'ANIME') ? ((item.media.episodes !== null) ? item.media.episodes + ' episodes' : `Start Date: ${item.media.startDate.month}/${item.media.startDate.year}`) : (item.media.chapters !== null) ? item.media.chapters + ' chapters' : `Start Date: ${item.media.startDate.month}/${item.media.startDate.year}` : `Rating: ${item.score}`
                    }</Text>
                </View> 
                : null}
                {(typeof item.media.meanScore === 'number') ? <Badge value={`${item.media.meanScore}%`}
                containerStyle={{ alignSelf: 'flex-end', position: 'absolute', elevation: 24, top:-5, right:8 }}
                badgeStyle={{ borderColor: 'rgba(0,0,0,0)' }}
                status={(item.media.meanScore >= 75) ? 'success'
                    : (item.media.meanScore < 75 && item.media.meanScore >= 65) ? 'warning'
                    : (item.media.meanScore < 65) ? 'error' : undefined
                }
                /> : null}
            </View>
        );
    }

    const StatusSelect = () => {
        const onPress = async(item) => {
            setStatus(item); 
            fetchData('ANIME', item, true); 
            fetchData('MANGA', item, true); 
            setVisible(false);
        }

        return(
            <Overlay isVisible={isVisible} onBackdropPress={() => setVisible(false)} overlayStyle={{backgroundColor:colors.card, position:'absolute', top:50, right:0, width:120}} backdropStyle={{backgroundColor:'rgba(0,0,0,0)'}} >
                {types.map((item, index) => 
                    (item !== status) ? <Button key={index} title={item} titleStyle={{color:colors.primary}} type='clear' onPress={() => onPress(item)} /> : null
                )}
            </Overlay>
        );
    }

    const AnimeList = () => {
        const [animes, setAnimes] = useState(anime.mediaList);
        const [page, setPage] = useState(anime.pageInfo);
        const [refresh, setRefresh] = useState(false);

        const fetchMore = async() => {
            if (page.hasNextPage !== false) {
                const info = await getLists(userId, page.currentPage + 1, status.toUpperCase(), 'ANIME');
                setAnimes([...animes, ...info.mediaList]);
                setPage(info.pageInfo);
            }
        }

        const onRefresh = async() => {
            setRefresh(true);
            const info = await getLists(userId, 1, status.toUpperCase(), 'ANIME');
            setAnimes(info.mediaList);
            setPage(info.pageInfo)
            setRefresh(false);
        }

        return(
            (loading) ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color={colors.primary} style={{ justifyContent: 'center' }} /></View> :
            <View style={{flex:1}}>
                <FlatList 
                data={animes} 
                renderItem={_renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={{marginVertical:10}}
                onEndReached={fetchMore}
                onEndReachedThreshold={.2}
                onRefresh={onRefresh}
                refreshing={refresh}
                />
                <StatusSelect />
            </View>
        );
    }

    const MangaList = () => {
        const [mangas, setMangas] = useState(manga.mediaList);
        const [page, setPage] = useState(manga.pageInfo);
        const [refresh, setRefresh] = useState(false);

        const fetchMore = async() => {
            if (page.hasNextPage !== false) {
                const info = await getLists(userId, page.currentPage + 1, status.toUpperCase(), 'MANGA');
                setMangas([...mangas, ...info.mediaList]);
                setPage(info.pageInfo);
            }
        }

        const onRefresh = async() => {
            setRefresh(true);
            const info = await getLists(userId, 1, status.toUpperCase(), 'MANGA');
            setMangas(info.mediaList);
            setPage(info.pageInfo)
            setRefresh(false);
        }

        return(
            (loading) ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color={colors.primary} style={{ justifyContent: 'center' }} /></View> :
            <View style={{flex:1}}>
                <FlatList 
                data={mangas} 
                renderItem={_renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={{marginVertical:10}}
                onEndReached={fetchMore}
                onEndReachedThreshold={.2}
                onRefresh={onRefresh}
                refreshing={refresh}
                />
                <StatusSelect />
            </View>
        );
    }

    return(
        (typeof token === 'string') ? <View style={{flex: 1}}>
            <Tabs.Navigator screenOptions={{tabBarStyle: { backgroundColor: colors.background }}} >
                <Tabs.Screen name='Anime' component={AnimeList} />
                <Tabs.Screen name='Manga' component={MangaList} />
            </Tabs.Navigator>
        </View> : <Login />
    );
}

export const ListPage = () => {
    return(
        <Stack.Navigator initialRouteName={'UserPage'}>
            <Stack.Screen name='UserList' component={UserList} options={{headerTitle:'Lists'}}/>
            <Stack.Screen name='UserListMedia' component={InfoNav} options={{headerShown:false}} />
        </Stack.Navigator>
    );
}