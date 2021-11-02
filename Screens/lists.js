// React
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, FlatList, useWindowDimensions, Pressable, ToastAndroid, StatusBar } from 'react-native';
// UI
import { Text, Button, Overlay, Badge, BottomSheet, ListItem } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
// Components
import { _ContentTile } from '../Components/customtile';
import { InfoNav } from './infopage';
import { Login } from '../Components/useritems';
// Navigation
import { useTheme, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Data
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLists } from '../Data Handler/getdata';
import { updateStatus, deleteEntry, filterContent } from '../Data Handler/updatedata';
import { getToken } from '../Storages/getstorage';


const Stack = createStackNavigator();
const LISTS = ['Current', 'Planning', 'Completed', 'Repeating', 'Dropped', 'Paused'];
const TYPES = [{name: "Anime", icon:'movie'}, {name: "Manga", icon:'photo-album'}, {name: "Novel", icon:'book'}];
const SORTS = ['Updated', 'Score', 'Progress', 'Started', 'Added', 'Title', 'Popularity'];
const elevation = 8;

const RenderItem = ({item, list, sort, token, isSearch=false, isAuthUser=false}) => {
    const [isVisible, setVisible] = useState(false);
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const routeName = useRoute();
    const { width, height } = useWindowDimensions();

    const updateItem = async(newStatus) => {
        const newItem = await updateStatus(token, item.media.id, newStatus);
        ToastAndroid.show(`Updated!`, ToastAndroid.SHORT);
        // Add visual to media card?
    }

    const TopBar = () => {
        let textDisplay = '';
        switch (SORTS.indexOf(sort)) {
            case 0:
                textDisplay = `Progress: ${item.progress}`;
                break;
            case 1:
                textDisplay = `Your score: ${item.score}`;
                break;
            case 2:
                const total = (item.media.episodes !== null) ? item.media.episodes : (item.media.chapters !== null) ? item.media.chapters : null;
                textDisplay = `Progress: ${item.progress}${(total !== null) ? `/${total}` : ''}`;
                break;
            case 3:
                if (item.startedAt.month !== null) {
                    textDisplay = `Started ${item.startedAt.month}/${item.startedAt.day}/${item.startedAt.year}`
                } else {
                    textDisplay = ``;
                }
                break;
            case 4:
                const date1 = new Date(item.createdAt*1000);
                textDisplay = `${date1.toDateString()}`
                break;
            case 6:
                if (item.media.rankings !== null) {
                    for (let i in item.media.rankings) {
                        if (item.media.rankings[i].type === 'POPULAR' && item.media.rankings[i].allTime === true) {
                            textDisplay = `Rank: ${item.media.rankings[i].rank}`
                        }
                    }
                }
                break;
        }

        return(
            (textDisplay.length > 0) ? <View style={{ elevation:elevation, position: 'absolute', borderTopRightRadius: 8, borderTopLeftRadius: 8, top: 0, height: 30, justifyContent: 'center', width: 180, backgroundColor: 'rgba(0,0,0,.5)' }}>
                <Text style={{ color: '#FFF', textAlign: 'center', fontSize:16 }}>{textDisplay}</Text>
            </View> : null
        );
    }

    const deleteItem = async() => {
        const isDeleted = await deleteEntry(token, item.id);
        ToastAndroid.show(`Deleted!`, ToastAndroid.SHORT);
    }

    const Action = () => {
        const normalText = {color:'#FFF'};
        const normalContainer = {justifyContent:'center', backgroundColor:'rgba(0,0,0,.8)'};
        const list = [
            {
                title: (item.media.type === "ANIME") ? 'Plan to Watch' : 'Plan to Read',
                onPress: () => {updateItem('PLANNING'); setVisible(false);},
                containerStyle:normalContainer,
                titleStyle:normalText,
            },
            {
                title: (item.media.type === "ANIME") ? 'Watching' : 'Reading',
                onPress: () => {updateItem('CURRENT'); setVisible(false);},
                containerStyle:normalContainer,
                titleStyle:normalText,
            },
            {
                title: 'Completed',
                onPress: () => {updateItem('COMPLETED'); setVisible(false);},
                containerStyle:normalContainer,
                titleStyle:normalText,
            },
            {
                title: 'Repeating',
                onPress: () => {updateItem('REPEATING'); setVisible(false);},
                containerStyle:normalContainer,
                titleStyle:normalText,
            },
            {
                title: 'Dropped',
                onPress: () => {updateItem('DROPPED'); setVisible(false);},
                containerStyle:normalContainer,
                titleStyle:normalText,
            },
            {
                title: 'Delete',
                onPress: () => {deleteItem(); setVisible(false);},
                containerStyle:normalContainer,
                titleStyle:{color:'red', fontWeight:'bold'},
            },
            {
                title: 'Go Back',
                onPress: () => setVisible(false),
                containerStyle:normalContainer,
                titleStyle:{color:'#28c922', fontWeight:'bold'},
            },
        ];
        return (
            <BottomSheet isVisible={isVisible} containerStyle={{backgroundColor:'rgba(0,0,0,0)'}} >
                {list.map((l, i) => ( (l !== undefined) ?
                    <ListItem key={i} onPress={l.onPress} containerStyle={l.containerStyle}>
                        <ListItem.Content style={{alignItems:'center'}}>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                : null))}
            </BottomSheet>
        );
    }

    return(
        <Pressable style={{flex:1, alignItems:'center', marginVertical:5}} onLongPress={() => (typeof token === 'string') ? setVisible(true) : null} onPress={() => {navigation.push((routeName.name === 'OtherList' && isSearch == false) ? 'UserContent' : (routeName.name === 'UserList') ? 'UserListMedia' : 'InfoSearch', {screen: 'Info', params: {id:item.media.id, title:{romaji: item.media.title.romaji, native: item.media.title.native, english:item.media.title.english}},});}}>
            <View style={{elevation:elevation, backgroundColor:'#fff', borderRadius:8}}>
                <FastImage  source={{priority:'high', uri:item.media.coverImage.extraLarge}} style={{height:280, width:180, resizeMode:'cover', borderRadius: 8}} />
            </View>
            <Text numberOfLines={2} style={{textAlign:'center', width:170, fontSize:15, color:colors.text}}>{item.media.title.romaji}</Text>
            <TopBar />
            {(typeof item.media.meanScore === 'number') ? <Badge value={`${item.media.meanScore}%`}
            containerStyle={{ position: 'absolute', elevation: 11, top:-5, right:5 }}
            badgeStyle={{ borderColor: 'rgba(0,0,0,0)', transform:[{scale:1.20}] }}
            status={(item.media.meanScore >= 75) ? 'success'
                : (item.media.meanScore < 75 && item.media.meanScore >= 65) ? 'warning'
                : (item.media.meanScore < 65) ? 'error' : undefined
            }
            /> : null}
            {(typeof token === 'string' && isAuthUser === true) ? <Action /> : null}
        </Pressable>
    );
}

const fixSort = (sortData) => {
    const item = (sortData === 'Updated') ? sortData.toUpperCase() + '_TIME_DESC' : (sortData === 'Title') ? 'MEDIA_' + sortData.toUpperCase() + '_ROMAJI' : (sortData === 'Added') ? sortData.toUpperCase() + '_TIME_DESC' : (sortData === 'Started') ? sortData.toUpperCase() + '_ON_DESC' : (sortData === 'Popularity') ? 'MEDIA_' + sortData.toUpperCase() + '_DESC' : sortData.toUpperCase() + '_DESC';
    return(item);
}

export const UserList = ({userID=null, isSearch=false}) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [isListVisible, setListVisible] = useState(false);
    const [isTypeVisible, setTypeVisible] = useState(false);
    const [isSortVisible, setSortVisible] = useState(false);
    const [userId, setUserId] = useState(userID);
    const [list, setList] = useState(LISTS[0]);
    const [type, setType] = useState(TYPES[0].name);
    const [sort, setSort] = useState(SORTS[0]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const { colors } = useTheme();
    const {width, height} = useWindowDimensions();
    const routeName = useRoute();
    if (routeName.name === 'UserList') isSearch = false;

    const fetchData = async(typeM, list, sort='updated', page=1) => {
        const sortFixed = fixSort(sort);
        const typeFixed = (typeM === 'Novel' || typeM === 'NOVEL') ? 'MANGA' : typeM.toUpperCase();
        const id = (userId !== 0) ? userId : await AsyncStorage.getItem('@UserID');
        if (typeof token === 'string' || userID !== null) {
            const info = await getLists(Number(id), page, list.toUpperCase(), typeFixed, sortFixed);
            if (typeM.toUpperCase() === 'NOVEL') {
                const filterData = await filterContent(info.mediaList, 'NOVEL', null, true);
                return({id:Number(id), data:filterData, page:info.pageInfo});
            } else {
                return({id:Number(id), data:info.mediaList, page:info.pageInfo});
            }
        } else {
            return({id:Number(id), data:false});
        }
    }

    const fetchToken = async() => {
        const login = await getToken();
        return(login);
    }

    useFocusEffect(
        React.useCallback(() => {
            let mounted = true;
                fetchToken().then((login) => {
                    if (mounted && token === false) {
                        if (typeof login === 'string') setToken(login);
                    }
                });
            return () => mounted = false;
        }, [])
    );

    useEffect(() => {
        let mounted = true;
        fetchData(type.toUpperCase(), list, sort).then((meta) => {
            if (mounted) {
                setUserId(meta.id);
                if (meta.data !== false) {
                    setData(meta.data);
                    setPage(meta.page);
                }
                setLoading(false);
            }
        });
        return () => mounted = false;
    }, [token]);

    const ListSelect = () => {
        const onPress = async(item) => {
            setList(item);
            setLoading(true);
            fetchData(type.toUpperCase(), item, sort, 1).then((meta) => {
                setUserId(meta.id);
                if (meta.data !== false) {
                    setData(meta.data);
                    setPage(meta.page);
                }
                setLoading(false);
            }); 
            setListVisible(false);
        }

        return(
            <Overlay isVisible={isListVisible} onBackdropPress={() => setListVisible(false)} overlayStyle={{backgroundColor:colors.card, width:width/2, borderRadius:8}} backdropStyle={{backgroundColor:'rgba(0,0,0,.3)'}} >
                {LISTS.map((item, index) => 
                    (item !== list) ? <Button key={index} title={item} titleStyle={{color:colors.primary, fontSize:20}} type='clear' onPress={() => onPress(item)} /> : null
                )}
            </Overlay>
        );
    }

    const TypeSelect = () => {
        const onPress = async(item) => {
            setType(item);
            setLoading(true);
            fetchData(item.toUpperCase(), list, sort, 1).then((meta) => {
                setUserId(meta.id);
                if (meta.data !== false) {
                    setData(meta.data);
                    setPage(meta.page);
                }
                setLoading(false);
            }); 
            setTypeVisible(false);
        }

        return(
            <Overlay isVisible={isTypeVisible} onBackdropPress={() => setTypeVisible(false)} overlayStyle={{backgroundColor:colors.card, borderRadius:8, width:width/2}} backdropStyle={{backgroundColor:'rgba(0,0,0,.3)'}} >
                {TYPES.map((item, index) => 
                    (item.name !== list) ? <Button key={index} buttonStyle={{height:50}} icon={{name:item.icon, type:'material', color:colors.primary, containerStyle:{justifyContent:'flex-start'}}} title={item.name} titleStyle={{color:colors.primary, fontSize:20 }} type='clear' onPress={() => onPress(item.name)} /> : null
                )}
            </Overlay>
        );
    }

    const SortSelect = () => {
        const onPress = async(item) => {
            setSort(item);
            setLoading(true);
            fetchData(type.toUpperCase(), list, item, 1).then((meta) => {
                setUserId(meta.id);
                if (meta.data !== false) {
                    setData(meta.data);
                    setPage(meta.page);
                }
                setLoading(false);
            }); 
            setSortVisible(false);
        }

        return(
            <Overlay isVisible={isSortVisible} onBackdropPress={() => setSortVisible(false)} overlayStyle={{backgroundColor:colors.card, borderRadius:8, width:width/2}} backdropStyle={{backgroundColor:'rgba(0,0,0,.3)'}} >
                {SORTS.map((item, index) => 
                    (item !== list) ? <Button key={index} title={item} titleStyle={{color:colors.primary, fontSize:20 }} type='clear' onPress={() => onPress(item)} /> : null
                )}
            </Overlay>
        );
    }

    const listHeader = () => {
        return (
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly', marginVertical:10}}>
                <Button title={type} type='clear' icon={{ name: 'play-arrow', type: 'material', color: colors.primary }} titleStyle={{ color: colors.text }} onPress={() => setTypeVisible(true)} />
                <Button title={sort} type='clear' icon={{ name: 'sort', type: 'material', color: colors.primary }} titleStyle={{ color: colors.text }} onPress={() => setSortVisible(true)} />
                <Button title={list} type='clear' icon={{ name: 'ramen-dining', type: 'material', color: colors.primary }} titleStyle={{ color: colors.text }} onPress={() => setListVisible(true)} />
            </View>
        );
    }

    const refreshData = async(typeM, list, sort='updated') => {
        setRefresh(true);
        const sortFixed = fixSort(sort);
        const typeFixed = (typeM === 'Novel' || typeM === 'NOVEL') ? 'MANGA' : typeM.toUpperCase();
        const id = (Number(userId) !== 0) ? userId : await AsyncStorage.getItem('@UserID');
        setUserId(Number(id));
        if (typeof token === 'string' || userID !== null) {
            const info = await getLists(Number(id), 1, list.toUpperCase(), typeFixed, sortFixed);
            if (typeM.toUpperCase() === 'NOVEL') {
                const novelData = await filterContent(info.mediaList, 'NOVEL', null, true);
                setData(novelData);
                setPage(info.pageInfo);
            } else if (typeM.toUpperCase() === 'MANGA') {
                const mangaData = await filterContent(info.mediaList, 'MANGA', null, true);
                setData(mangaData);
                setPage(info.pageInfo);
            } else {
                setData(info.mediaList);
                setPage(info.pageInfo);
            }
        }
        setRefresh(false);
    }

    const onRefresh = async() => {
        setRefresh(true);
        await refreshData(type, list, sort);
        setRefresh(false);
    }

    const fetchMore = async () => {
        if (page.hasNextPage === true) {
            const sortFixed = fixSort(sort);
            const typeFixed = (type === 'Novel' || type === 'NOVEL') ? 'MANGA' : type.toUpperCase();
            const info = await getLists(userId, page.currentPage + 1, list.toUpperCase(), typeFixed, sortFixed, 30);
            const newData = await filterContent(info.mediaList, type.toUpperCase(), data, true);
            setData([...data, ...newData]);
            setPage(info.pageInfo);
        }
    }

    if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        <View style={{flex: 1, height:height, width:width}}>
            {((typeof token === 'string' || userID !== null) && showLogin === false) ?
            <View style={{flex:1}}>
                <FlatList 
                data={data} 
                renderItem={({item}) => <RenderItem item={item} status={list} sort={sort} token={token} isSearch={isSearch} isAuthUser={(userID === null) ? true : false} />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                ListHeaderComponent={listHeader}
                ListEmptyComponent={() => <View style={{flex:1, justifyContent:'center'}}><Text style={{textAlign:'center', fontSize:35, fontWeight:'bold', color:colors.text}}>{`No content yet!${'\n'}(◕︵◕)`}</Text></View>}
                onEndReached={fetchMore}
                onEndReachedThreshold={.4}
                onRefresh={onRefresh}
                refreshing={refresh}
                />
                <ListSelect />
                <TypeSelect />
                <SortSelect />
            </View> : <Login />}
        </View>
    );
}

export const ListPage = () => {
    return(
        <Stack.Navigator initialRouteName={'UserPage'}>
            <Stack.Screen name='UserList' component={UserList} options={{headerTitle:'List', headerStyle:{height:60}}}/>
            <Stack.Screen name='UserListMedia' component={InfoNav} options={{headerShown:false}} />
        </Stack.Navigator>
    );
}