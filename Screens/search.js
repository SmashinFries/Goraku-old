// React
import React, { useEffect, useState, useRef, memo } from 'react';
import { View, ScrollView, ActivityIndicator, FlatList, StatusBar } from 'react-native';
// UI
import { SearchBar, Chip, Text, Button, Image, Overlay, ListItem, Icon, Tooltip, CheckBox } from 'react-native-elements';
// Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, useRoute, useFocusEffect } from '@react-navigation/native';
// Components
import { RenderFollowing } from '../Components/useritems';
import { OtherUser } from './otheruser';
import { Character } from './character';
import { VA_Page } from './voiceactor';
import { InfoNav } from './infopage';
// Data
import { getFilters, getSearch, getUserSearch } from '../Data Handler/getdata';
import { height, width, _ContentTile } from '../Components/customtile';
import { getNSFW } from '../Storages/storagehooks';
import { cacheFilter, filterObj } from '../Queries/query';
import { getToken } from '../Storages/getstorage';

const Stack = createStackNavigator();
const SORT_OPTIONS = ["Trending_DESC", "Popularity_DESC", "Score_DESC"]
const TYPE_OPTIONS = ["Anime", "Manga", "Novel", "Users"];
const ORIGIN = ["All", "Japanese", "Korean", "Chinese"];
const LISTHIDE = {hide: false};

const FilterList = ({id, tag}) => {
    const [color, setColor] = useState((filterObj.genre_in.indexOf(tag.tag) > -1 || filterObj.tags_in.indexOf(tag.tag) > -1) ? 'green' : (filterObj.genre_not.indexOf(tag.tag) > -1 || filterObj.tags_not.indexOf(tag.tag) > -1) ? 'red' : 'blue');
    const tooltipRef = useRef(null);
    const { colors } = useTheme();

    const handlePress = () => {
        if (cacheFilter[0].data.findIndex(x => x.tag === tag.tag) > -1) {
            if (filterObj.genre_in.indexOf(tag.tag) === -1 && filterObj.genre_not.indexOf(tag.tag) === -1) {
                filterObj.genre_in = [...filterObj.genre_in, tag.tag];
                setColor('green');
            } else if (filterObj.genre_in.indexOf(tag.tag) > -1 && filterObj.genre_not.indexOf(tag.tag) === -1) {
                const pos = filterObj.genre_in.indexOf(tag.tag);
                filterObj.genre_in.splice(pos, 1);
                filterObj.genre_not = [...filterObj.genre_not, tag.tag];
                setColor('red');
            } else {
                const pos = filterObj.genre_not.indexOf(tag.tag);
                filterObj.genre_not.splice(pos, 1);
                setColor('blue');
            }
        } else {
            if (filterObj.tags_in.indexOf(tag.tag) === -1 && filterObj.tags_not.indexOf(tag.tag) === -1) {
                filterObj.tags_in = [...filterObj.tags_in, tag.tag];
                setColor('green');
            } else if (filterObj.tags_in.indexOf(tag.tag) > -1 && filterObj.tags_not.indexOf(tag.tag) === -1) {
                const pos = filterObj.tags_in.indexOf(tag.tag);
                filterObj.tags_in.splice(pos, 1);
                filterObj.tags_not = [...filterObj.tags_not, tag.tag];
                setColor('red');
            } else {
                const pos = filterObj.tags_not.indexOf(tag.tag);
                filterObj.tags_not.splice(pos, 1);
                setColor('blue');
            }
        }
    }

    return(
        <Tooltip skipAndroidStatusBar={true} width={200} height={125}  overlayColor='rgba(0,0,0,0)' backgroundColor={colors.background} popover={<Text style={{color:colors.text}}>{tag.description}</Text>} ref={tooltipRef}>
            <Chip key={id} title={tag.tag} containerStyle={{margin:2}} buttonStyle={{backgroundColor:color}} onLongPress={() => tooltipRef.current.toggleTooltip()} onPress={handlePress} />
        </Tooltip>
    );
}

const HideList = () => {
    const { colors } = useTheme();
    const [checked, setChecked] = useState(LISTHIDE.hide);
    return(
        <CheckBox size={30} title='Hide your list' checked={checked} textStyle={{color:colors.primary}} containerStyle={{backgroundColor:colors.card, borderWidth:0}} onPress={() => {setChecked(!checked); LISTHIDE.hide = !checked;}} iconType='material' checkedIcon='check-box' uncheckedIcon='check-box-outline-blank' checkedColor={colors.primary}/>
    );
}

const SearchPage = React.memo(() => {
    const { colors } = useTheme();
    const routeName = useRoute();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [toggleType, setToggleType] = useState(false);
    const [toggleFilter, setToggleFilter] = useState(false);
    const [toggleSort, setToggleSort] = useState(false);
    const [toggleOrigin, setToggleOrigin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initLoad, setInitLoad] = useState(true);
    const [text, setText] = useState('');
    const [adult, setAdult] = useState(false);
    const [token, setToken] = useState(false);

    const getInitial = async() => {
        const login = await getToken();
        setToken(login);
        const nsfw = await getNSFW();
        const content = (filterObj.type !== 'Users') ? await getSearch((login !== false) ? login : undefined, (LISTHIDE.hide === true) ? false : undefined, undefined, undefined, (nsfw === true) ? undefined : false) : await getUserSearch(text, token);
        const filtering = await getFilters();
        return({nsfw:nsfw, filtering:filtering, datas:(filterObj.type !== 'Users') ? content.media : content.users, pageInfo:content.pageInfo, login:login });
    }

    const fetchToken = async() => {
        const login = await getToken();
        if (login === false) {
            setToken(login);
        }
    }

    if (initLoad) {<View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color={colors.primary} style={{justifyContent:'center'}} /></View>}

    const fetchSearch = async(texts=text) => {
        setLoading(true);
        if (filterObj.type === 'Novel') {
            {const index = filterObj.format_not.indexOf("NOVEL"); if (index > -1) filterObj.format_not.splice(index, 1)};
            (filterObj.format_in.indexOf('NOVEL') === -1) ? filterObj.format_in = [...filterObj.format_in, "NOVEL"] : null;
            const content = await getSearch(
                token,
                (LISTHIDE.hide === true) ? false : undefined,
                (texts.length > 0) ? texts : undefined, 
                filterObj.origin,
                (adult === false) ? false : undefined,
                1, 
                "MANGA", 
                filterObj.sort.toUpperCase(),
                (filterObj.format_in.length > 0) ? filterObj.format_in : undefined,
                (filterObj.format_not.length > 0) ? filterObj.format_not : undefined,
                (filterObj.genre_in.length > 0) ? filterObj.genre_in : undefined,
                (filterObj.genre_not.length > 0) ? filterObj.genre_not : undefined,
                (filterObj.tags_in.length > 0) ? filterObj.tags_in : undefined,
                (filterObj.tags_not.length > 0) ? filterObj.tags_not : undefined,
                );
            setData(content.media);
            setPage(content.pageInfo);
            setLoading(false);
        } else if (filterObj.type.toUpperCase() === 'ANIME' || filterObj.type.toUpperCase() === 'MANGA') {
            {const index = filterObj.format_in.indexOf("NOVEL"); if (index > -1) filterObj.format_in.splice(index, 1)};
            (filterObj.format_not.indexOf('NOVEL') === -1) ? filterObj.format_not = [...filterObj.format_not, "NOVEL"] : null;
            const content = await getSearch(
                token,
                (LISTHIDE.hide === true) ? false : undefined,
                (texts.length > 0) ? texts : undefined,
                filterObj.origin,
                (adult === false) ? false : undefined,
                1, 
                filterObj.type.toUpperCase(), 
                filterObj.sort.toUpperCase(),
                (filterObj.format_in.length > 0) ? filterObj.format_in : undefined,
                (filterObj.format_not.length > 0) ? filterObj.format_not : undefined,
                (filterObj.genre_in.length > 0) ? filterObj.genre_in : undefined,
                (filterObj.genre_not.length > 0) ? filterObj.genre_not : undefined,
                (filterObj.tags_in.length > 0) ? filterObj.tags_in : undefined,
                (filterObj.tags_not.length > 0) ? filterObj.tags_not : undefined,
                );
            setData(content.media);
            setPage(content.pageInfo);
            setLoading(false);
        } else if (filterObj.type === 'Users') {
            const content = await getUserSearch(texts, token, 1, 20);
            setData(content.users);
            setPage(content.pageInfo);
            setLoading(false);
        }
    }

    const fetchMore = async() => {
        if (page.hasNextPage === true) {
            const content = (filterObj.type !== 'Users') ? await getSearch(
                token,
                (LISTHIDE.hide === true) ? false : undefined,
                (text.length > 0) ? text : undefined,
                (filterObj.origin === 'All') ? undefined : filterObj.origin,
                (adult === false) ? false : undefined,
                page.currentPage + 1,
                (filterObj.type !== 'Novel') ? filterObj.type.toUpperCase() : "MANGA",
                filterObj.sort.toUpperCase(),
                (filterObj.format_in.length > 0) ? filterObj.format_in : undefined,
                (filterObj.format_not.length > 0) ? filterObj.format_not : undefined,
                (filterObj.genre_in.length > 0) ? filterObj.genre_in : undefined,
                (filterObj.genre_not.length > 0) ? filterObj.genre_not : undefined,
                (filterObj.tags_in.length > 0) ? filterObj.tags_in : undefined,
                (filterObj.tags_not.length > 0) ? filterObj.tags_not : undefined,
            ) : await getUserSearch(text, token, page.currentPage + 1);
            setData((filterObj.type !== 'Users') ? [...data, ...content.media] : [...data, ...content.users]);
            setPage(content.pageInfo);
        }
    }

    const TypeModal = () => {
        return(
            <Overlay isVisible={toggleType} onBackdropPress={() => setToggleType(false)} overlayStyle={{backgroundColor:colors.card}} >
                <Text h4 style={{color:colors.text}}>Select Type</Text>
                {
                    TYPE_OPTIONS.map((item, i) => (
                        <ListItem key={i} containerStyle={{width:200, backgroundColor:colors.card}} onPress={() => { filterObj['type'] = item; setToggleType(false); setPage(1); fetchSearch();}}>
                            <Icon name={item.icon} type='material' color={colors.text} />
                            <ListItem.Content>
                                <ListItem.Title style={{color:colors.text}}>{item}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    ))
                }
            </Overlay>
        );
    }

    const OriginModal = () => {
        const handleOrigin = async(item) => {
            filterObj['origin'] = (item === 'Japanese') ? 'JP' : (item === 'Korean') ? 'KR' : (item === 'Chinese') ? 'CN' : undefined;
            setPage(1);
            await fetchSearch();
        }
        return(
            <Overlay isVisible={toggleOrigin} onBackdropPress={() => setToggleOrigin(false)} overlayStyle={{backgroundColor:colors.card}} >
                <Text h4 style={{color:colors.text}}>Select an Origin</Text>
                {
                    ORIGIN.map((item, i) => (
                        <ListItem key={i} containerStyle={{width:200, backgroundColor:colors.card}} onPress={() => {handleOrigin(item); setToggleOrigin(false);}}>
                            <ListItem.Content>
                                <ListItem.Title style={{color:colors.text}}>{item}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))
                }
            </Overlay>
        );
    }

    const SortModal = () => {
        return(
            <Overlay isVisible={toggleSort} onBackdropPress={() => setToggleSort(false)} overlayStyle={{backgroundColor:colors.card}} >
                <Text h4 style={{color:colors.text}}>Sorts</Text>
                {
                    SORT_OPTIONS.map((item, i) => (
                        <ListItem key={i} containerStyle={{width:200, backgroundColor:colors.card}} onPress={() => {filterObj['sort'] = item; setToggleSort(false); setPage(1); fetchSearch();} }>
                            <ListItem.Content>
                                <ListItem.Title style={{color:colors.text}}>{item.slice(0, -5)}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))
                }
            </Overlay>
        );
    }

    const FilterModal = () => {
        return(
            <Overlay animationType='fade' isVisible={toggleFilter} onBackdropPress={() => setToggleFilter(false)} overlayStyle={{backgroundColor:colors.card, width:width - 50, height:height-65}}>
                <Text h2 style={{color:colors.text}}>Filters</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {(typeof token === 'string') ? <HideList /> : null}
                    {filter.map((elem, index) => { return(
                        <View key={index}>
                            <Text h3 style={{color:colors.text}}>{elem.title}</Text>
                            <View style={{flex:1, flexDirection:'row', flexWrap:'wrap'}}> 
                                {elem.data.map((tag, indx) => <FilterList key={indx} id={tag.id} tag={tag} /> )}
                            </View>
                        </View>
                    );})}
                </ScrollView>
                <Button title='Apply' containerStyle={{borderRadius:15}} buttonStyle={{backgroundColor:'green'}} onPress={() => {setPage(1); fetchSearch(); setToggleFilter(false);}} />
                <Button icon={{name:'close', type:'material', color:colors.text, size:20}} onPress={() => setToggleFilter(false)} containerStyle={{position:'absolute', right:0, borderRadius:100}} buttonStyle={{backgroundColor:'rgba(0,0,0,0)'}} />
            </Overlay>
        );
    }

    const onRefresh = async() => {
        setRefresh(true);
        const filtering = await getFilters();
        const nsfw = await getNSFW();
        setAdult(nsfw);
        setFilter(filtering);
        setData([]);
        await fetchSearch();
        setRefresh(false);
    }

    useFocusEffect(
        React.useCallback(() => {
            if (token === false) {
                fetchToken();
            }
        }, [])
    );

    useEffect(() => {
        let mounted = true;
        getInitial().then(({nsfw, filtering, datas, pageInfo}) => {
            if (mounted) {
                setAdult(nsfw);
                setFilter(filtering);
                setData(datas);
                setPage(pageInfo);
                setInitLoad(false);
                setLoading(false);
            }
        });
        return () => mounted = false;
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingTop: StatusBar.currentHeight, backgroundColor: colors.card }}>
                        <SearchBar containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomColor: 'rgba(0,0,0,0)', borderTopColor: 'rgba(0,0,0,0)', marginTop: 5 }}
                            round={true}
                            searchIcon={{ name: 'ramen-dining', type: 'material', color: colors.primary }}
                            placeholder='Search the sauce...'
                            inputContainerStyle={{ backgroundColor: colors.background }}
                            autoCapitalize='words'
                            returnKeyType='search'
                            selectionColor={colors.primary}
                            onChangeText={(text) => setText(text)}
                            value={text}
                            onClear={() => fetchSearch('')}
                            onSubmitEditing={() => fetchSearch()}
                        />
                        <View style={{ flexDirection: 'row', backgroundColor:colors.card, justifyContent: 'space-around', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, borderRadius: 12 }}>
                            <Button title={filterObj.type} titleStyle={{ fontSize: 15, textTransform: 'capitalize', color: colors.text }} onPress={() => setToggleType(true)} type='clear' icon={{ name: 'play-arrow', type: 'material', color: colors.primary }} raised={true} containerStyle={{ borderRadius: 12, flexGrow: 1 }} buttonStyle={{ borderRadius: 12 }} />
                            <Button title={(filterObj.origin === undefined) ? 'All' : filterObj.origin} titleStyle={{ color: colors.text }} type='clear' icon={{ name: 'emoji-people', type: 'material', color: colors.primary }} onPress={() => setToggleOrigin(true)} raised={true} containerStyle={{ borderRadius: 12, flexGrow: 1 }} buttonStyle={{ borderRadius: 12 }} />
                            <Button title={filterObj.sort.slice(0, -5)} titleStyle={{ textTransform: 'capitalize', color: colors.text }} type='clear' icon={{ name: 'sort', type: 'material', color: colors.primary }} onPress={() => setToggleSort(true)} raised={true} containerStyle={{ borderRadius: 12, flexGrow: 1 }} buttonStyle={{ borderRadius: 12 }} />
                            <Button type='clear' icon={{ name: 'filter-list', type: 'material', color: colors.primary }} onPress={() => setToggleFilter(true)} raised={true} containerStyle={{ borderRadius: 12, flexGrow: 1 }} buttonStyle={{ borderRadius: 12 }} />
                        </View>
                        <TypeModal />
                        <SortModal />
                        <FilterModal />
                        <OriginModal />
                    </View>
                    {(loading) ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color={colors.primary} style={{ justifyContent: 'center' }} /></View> :
                        <FlatList
                            data={data}
                            renderItem={({ item }) => (filterObj.type !== 'Users') ? <_ContentTile item={item} routeName={routeName} token={token} isSearch={true} size={[width / 2, height / 3]} /> : <RenderFollowing item={item} routeName={routeName.name} isAuth={(token !== false) ? true : false} />}
                            windowSize={3}
                            numColumns={(filterObj.type !== 'Users') ? 2 : 3}
                            ListEmptyComponent={() => <View style={{ flex: 1, justifyContent: 'center' }}><Text h3 style={{ color: colors.text, textAlign: 'center' }}>{`No results!${'\n'}┏༼ ◉ ╭╮ ◉༽┓`}</Text></View>}
                            columnWrapperStyle={{ paddingBottom: 10, justifyContent: 'center' }}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingVertical: 15 }}
                            onEndReached={fetchMore}
                            onEndReachedThreshold={.4}
                            showsVerticalScrollIndicator={false}
                            refreshing={refresh}
                            onRefresh={onRefresh}
                        />
                    }
                </View>
            </View>
        </View>
    );
});

export const SearchNav = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name='SearchPage' component={SearchPage} options={{headerShown:false}}/>
            <Stack.Screen name='InfoSearch' component={InfoNav} options={{headerShown:false}} />
            <Stack.Screen name='UserSearch' component={OtherUser} options={({ route }) => ({ title: route.params.name, headerRight: () => (<Image source={{uri: route.params.avatar}} style={{height:50, width:50, resizeMode:'cover', marginRight:10}} />) })} />
            <Stack.Screen name='SearchCharacter' component={Character} options={{title: 'Character'}} />
            <Stack.Screen name='SearchStaff' component={VA_Page} options={{title: 'Staff'}} />
        </Stack.Navigator>
    );
}