import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { SearchBar, Chip, Text, Button, Divider, Overlay, ListItem, Icon, Tooltip, CheckBox } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, useRoute } from '@react-navigation/native';
import { getFilters, getSearch } from '../api/getdata';
import { height, width, _ContentTile } from '../Components/customtile';
import { InfoNav } from './infopage';
import { getNSFW } from '../Components/storagehooks';
import { cacheFilter } from '../Queries/query';
import { filterObj } from '../Queries/query';

const Stack = createStackNavigator();
const SORT_OPTIONS = ["Trending_DESC", "Popularity_DESC", "Score_DESC"]
const TYPE_OPTIONS = ["Anime", "Manga", "Novel"];
const ORIGIN = ["All", "Japanese", "Korean", "Chinese"];

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

    const getInitial = async() => {
        const nsfw = await getNSFW();
        const content = await getSearch(undefined, undefined, (nsfw === true) ? undefined : false);
        const filtering = await getFilters();
        setAdult(nsfw);
        setFilter(filtering);
        setData(content.media);
        setPage(content.pageInfo.currentPage);
        setInitLoad(false);
        setLoading(false);
    }

    if (initLoad) {<View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color='#00ff00' style={{justifyContent:'center'}} /></View>}

    const fetchSearch = async() => {
        setLoading(true);
        if (filterObj.type === 'Novel') {
            {const index = filterObj.format_not.indexOf("NOVEL"); if (index > -1) filterObj.format_not.splice(index, 1)};
            (filterObj.format_in.indexOf('NOVEL') === -1) ? filterObj.format_in = [...filterObj.format_in, "NOVEL"] : null;
            const content = await getSearch(
                (text.length > 0) ? text : undefined, 
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
            await setData(content.media);
            setLoading(false);
        } else {
            {const index = filterObj.format_in.indexOf("NOVEL"); if (index > -1) filterObj.format_in.splice(index, 1)};
            (filterObj.format_not.indexOf('NOVEL') === -1) ? filterObj.format_not = [...filterObj.format_not, "NOVEL"] : null;
            const content = await getSearch(
                (text.length > 0) ? text : undefined,
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
            await setData(content.media);
            setLoading(false);
        }
    }

    const fetchMore = async() => {
        const content = await getSearch(
            (text.length > 0) ? text : undefined,
            (filterObj.origin === 'All') ? undefined : filterObj.origin,
            (adult === false) ? false : undefined,
            page+1, 
            (filterObj.type !== 'Novel') ? filterObj.type.toUpperCase() : "MANGA", 
            filterObj.sort.toUpperCase(), 
            (filterObj.format_in.length > 0) ? filterObj.format_in : undefined,
            (filterObj.format_not.length > 0) ? filterObj.format_not : undefined,
            (filterObj.genre_in.length > 0) ? filterObj.genre_in : undefined,
            (filterObj.genre_not.length > 0) ? filterObj.genre_not : undefined,
            (filterObj.tags_in.length > 0) ? filterObj.tags_in : undefined,
            (filterObj.tags_not.length > 0) ? filterObj.tags_not : undefined,
            );
        await setData([...data, ...content.media]);
        await setPage(content.pageInfo.currentPage);
    }

    const TypeModal = () => {
        return(
            <Overlay isVisible={toggleType} onBackdropPress={() => setToggleType(false)} overlayStyle={{backgroundColor:colors.card}} >
                <Text h4 style={{color:colors.text}}>Select a format</Text>
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
        setPage(1);
        await fetchSearch();
        setRefresh(false);
    }

    useEffect(() => {
        getInitial();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <View style={{ flex: 1 }}>
                <View style={{ paddingTop: StatusBar.currentHeight, backgroundColor: colors.background }}>
                    <SearchBar containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomColor: 'rgba(0,0,0,0)', borderTopColor: 'rgba(0,0,0,0)' }}
                        round={true}
                        searchIcon={{ name: 'ramen-dining', type: 'material' }}
                        placeholder='Search the sauce...'
                        inputContainerStyle={{ backgroundColor: colors.card }}
                        autoCapitalize='words'
                        returnKeyType='search'
                        selectionColor={colors.primary}
                        onChangeText={(text) => setText(text)}
                        value={text}
                        onSubmitEditing={fetchSearch}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, borderRadius: 12 }}>
                        <Button title={filterObj.type} titleStyle={{ fontSize: 15, textTransform: 'capitalize' }} onPress={() => setToggleType(true)} type='clear' icon={{ name: 'play-arrow', type: 'material', color: colors.text }} raised={true} containerStyle={{ borderRadius: 12, flexGrow: 1 }} buttonStyle={{ borderRadius: 12 }} />
                        <Button title={(filterObj.origin === undefined) ? 'All' : filterObj.origin} type='clear' icon={{ name: 'emoji-people', type: 'material', color: colors.text }} onPress={() => setToggleOrigin(true)} raised={true} containerStyle={{borderRadius: 12, flexGrow:1}} buttonStyle={{ borderRadius: 12 }} />
                        <Button title={filterObj.sort.slice(0, -5)} titleStyle={{ textTransform: 'capitalize' }} type='clear' icon={{ name: 'sort', type: 'material', color: colors.text }} onPress={() => setToggleSort(true)} raised={true} containerStyle={{ borderRadius: 12, flexGrow: 1 }} buttonStyle={{ borderRadius: 12 }} />
                        <Button type='clear' icon={{ name: 'filter-list', type: 'material', color: colors.text }} onPress={() => setToggleFilter(true)} raised={true} containerStyle={{ borderRadius: 12, flexGrow: 1 }} buttonStyle={{ borderRadius: 12 }} />
                    </View>
                    <TypeModal />
                    <SortModal />
                    <FilterModal />
                    <OriginModal />
                </View>
                <View style={{ flex: 1 }}>
                    {(loading) ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color='#00ff00' style={{ justifyContent: 'center' }} /></View> :
                        (data.length > 0) ?
                            <FlatList
                                data={data}
                                renderItem={({ item }) => <_ContentTile item={item} routeName={routeName} />}
                                windowSize={3}
                                numColumns={2}
                                columnWrapperStyle={{ paddingTop: 15, paddingBottom: 20, justifyContent: 'center' }}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={fetchMore}
                                onEndReachedThreshold={.4}
                                showsVerticalScrollIndicator={false}
                                refreshing={refresh}
                                onRefresh={onRefresh}
                            />
                            : <View>
                                <Text h3 style={{ color: colors.text, textAlign: 'center' }}>{`No results!${'\n'}┏༼ ◉ ╭╮ ◉༽┓`}</Text>
                            </View>
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
        </Stack.Navigator>
    );
}