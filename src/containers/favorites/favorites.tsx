import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Pressable, Text, FlatList } from "react-native";
import { Button, IconButton } from 'react-native-paper';
import FastImage from "react-native-fast-image";
import { FavoriteChar, FavoriteMedia, FavoriteStaff, FavoriteStudio, UserFavCharNode, UserFavMediaNode, UserFavStaffNode, UserFavStudioNode } from "../../Api/types";
import { getFavoriteContent } from "../../Api/anilist/anilist";
import { LoadingView } from "../../Components";
import { useListSearch } from "../../Storage/listStorage";
import { checkBD, dataTitleFilter, handleCopy, _openBrowserUrl } from "../../utils";
import { uniqueItems, uniqueNodes } from "../../utils/filters/uniqueItems";

const dataPersonFilter = (search:string, data:any[]) => {
    if (search.length === 0) return data;
    return data.filter((item, index) => {
        if (item.node.name.full?.toLowerCase().includes(search.toLowerCase())) {
            return item
        } else if (item.node.name.native?.toLowerCase().includes(search.toLowerCase())) {
            return item
        } else if (item.node.name.userPreferred?.toLowerCase().includes(search.toLowerCase())) {
            return item
        }
    })
}

const dataStudioFilter = (search:string, data:UserFavStudioNode[]) => {
    if (search.length === 0) return data;
    return data.filter((item, index) => {
        if (item.node.name.toLowerCase().includes(search.toLowerCase())) {
            return item
        }
    })
}

const StudioFav = ({navigation, route}) => {
    const [data, setData] = useState<FavoriteStudio>(route.params.data);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { colors, dark } = useTheme();
    const {search} = useListSearch();

    const renderItem = ({item}:{item:UserFavStudioNode}) => {
        return(
            <Button mode="outlined" color={colors.primary} onPress={() => _openBrowserUrl(item.node.siteUrl, colors.primary, colors.text)} style={{borderColor:colors.primary}}>{item.node.name}</Button>
        );
    }

    const fetchMore = async() => {
        if (data.pageInfo.hasNextPage) {
            const resp = await getFavoriteContent('STUDIO', 'studioPage', data.pageInfo.currentPage + 1);
            const unique = uniqueNodes([...data.edges, ...resp.data.Viewer.favourites.studios.edges]);
            setData({...data, edges: unique, pageInfo: resp.data.Viewer.favourites.studios.pageInfo});
        }
    }

    const onRefresh = async() => {
        const resp = await getFavoriteContent('STUDIO', 'studioPage', 1);
        setData(resp.data.Viewer.favourites.studios);
        setRefreshing(false);
    }

    if (loading) return <LoadingView colors={colors} />;

    return(
        <View style={{flex:1}}>
            <FlatList 
                key={10}
                data={(data) ? dataStudioFilter(search, data.edges) : []}
                renderItem={renderItem}
                keyExtractor={item => item.node.id.toString()}
                ItemSeparatorComponent={() => <View style={{height:10}} />}
                contentContainerStyle={{paddingBottom:50, paddingTop:10, paddingHorizontal:10}}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
}

const StaffFav = ({navigation, route}) => {
    const [data, setData] = useState<FavoriteStaff>(route.params.data);
    const [loading, setLoading] = useState<boolean>(false);
    const [selected, setSelected] = useState([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {search} = useListSearch();
    
    const { colors, dark } = useTheme();

    const onPress = (item:UserFavStaffNode) => {
        const isSelected = selected.includes(item.node.id);
        if (isSelected) {
            // setSelected(selected.filter(id => id !== item.node.id));
        } else {
            navigation.navigate('UserStaffDetail', {id:item.node.id, name:item.node.name.userPreferred, isList:true});
        }
    }

    const renderItem = ({item}:{item:UserFavStaffNode}) => {
        return(
            <Pressable onPress={() => onPress(item)} onLongPress={() => setSelected([...selected, item.node.id])} android_ripple={{color:colors.primary}} style={{padding:10, borderRadius:8, height:200, width:130, justifyContent:'center', alignItems:'center', backgroundColor: (selected.includes(item.node.id)) ? colors.primary : 'transparent'}}>
                <FastImage source={{uri:item.node.image.large}} style={{height:190, width:120, borderRadius:8,}} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,.5)']} locations={[0, 1]} style={{position:'absolute', height:190, width:120, borderRadius:8, justifyContent:'flex-end'}}>
                    <Text numberOfLines={3} style={{textAlign:'center', color:'#FFF', paddingBottom:5}}>{item.node.name.userPreferred}</Text>
                </LinearGradient>
            </Pressable>
        );
    }

    const fetchMore = async() => {
        if (data.pageInfo.hasNextPage) {
            const resp = await getFavoriteContent('STAFF', 'staffPage', data.pageInfo.currentPage + 1);
            const unique = uniqueNodes([...data.edges, ...resp.data.Viewer.favourites.staff.edges]);
            setData({...data, edges: unique, pageInfo: resp.data.Viewer.favourites.staff.pageInfo});
        }
    }

    const onRefresh = async() => {
        setRefreshing(true);
        const resp = await getFavoriteContent('STAFF', 'staffPage', 1);
        setData(resp.data.Viewer.favourites.staff);
        setRefreshing(false);
    }

    if (loading) return <LoadingView colors={colors} />;

    return(
        <View style={{flex:1}}>
            <FlatList 
                key={1}
                data={(data) ? dataPersonFilter(search, data.edges) : []}
                renderItem={renderItem}
                keyExtractor={item => item.node.id.toString()}
                ItemSeparatorComponent={() => <View style={{height:5}} />}
                columnWrapperStyle={{justifyContent:'space-evenly', paddingHorizontal:5}}
                contentContainerStyle={{paddingBottom:50, paddingTop:10}}
                numColumns={3}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
}

const CharacterFav = ({navigation, route}) => {
    const [data, setData] = useState<FavoriteChar>(route.params.data);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { colors, dark } = useTheme();
    const [selected, setSelected] = useState([]);
    const {search} = useListSearch();
    const date = new Date();

    const onPress = (item:UserFavCharNode) => {
        const isSelected = selected.includes(item.node.id);
        if (isSelected) {
            setSelected(selected.filter(id => id !== item.node.id));
        } else {
            navigation.navigate('UserCharDetail', {id:item.node.id, name:item.node.name.full, malId:item.node.media.nodes[0].idMal, type:item.node.media.nodes[0].type, inStack:false});
        }
    }

    // for onLongPress (selectable) -> setSelected([...selected, item.node.id])
    const renderItem = ({item}:{item:UserFavCharNode}) => {
        return(
            <View style={{borderRadius:8, overflow:'hidden'}}>
                <Pressable onPress={() => onPress(item)} android_ripple={{ color: colors.primary }} style={{ padding: 10, borderRadius: 8, height: 200, width: 130, justifyContent: 'center', alignItems: 'center', backgroundColor: (selected.includes(item.node.id)) ? colors.primary : 'transparent' }}>
                    <FastImage source={{ uri: item.node.image.large }} style={{ height: 190, width: 120, borderRadius: 8, }} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,.7)']} locations={[.65, .95]} style={{ position: 'absolute', height: 190, width: 120, justifyContent: 'flex-end', alignItems: 'center', borderRadius: 8 }}>
                        <Text numberOfLines={2} onLongPress={() => handleCopy(item.node.name.userPreferred)} style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold', paddingBottom: 5, paddingHorizontal: 5 }}>{item.node.name.userPreferred}</Text>
                        {(checkBD(date, item.node.dateOfBirth)) && <IconButton icon={'cake-variant'} style={{ position: 'absolute', top: -5, right: -10 }} color={colors.primary} />}
                    </LinearGradient>
                </Pressable>
            </View>
        );
    }

    const onRefresh = async() => {
        setRefreshing(true);
        const resp = await getFavoriteContent('CHARACTER', 'charPage', 1);
        setData(resp.data.Viewer.favourites.characters);
        setRefreshing(false);
    }

    const fetchMore = async() => {
        if (data.pageInfo.hasNextPage) {
            const resp = await getFavoriteContent('CHARACTER', 'charPage', data.pageInfo.currentPage+1);
            const unique = uniqueNodes([...data.edges, ...resp.data.Viewer.favourites.characters.edges]);
            setData({...data, edges: unique, pageInfo: resp.data.Viewer.favourites.characters.pageInfo});
        }
    }

    if (loading) return <LoadingView colors={colors} />

    return (
        <View style={{flex:1}}>
            <FlatList 
                key={1}
                data={(data) ? dataPersonFilter(search, data.edges) : []}
                renderItem={renderItem}
                keyExtractor={item => item.node.id.toString()}
                ItemSeparatorComponent={() => <View style={{height:5}} />}
                columnWrapperStyle={{justifyContent:'space-evenly', paddingHorizontal:5}}
                contentContainerStyle={{paddingBottom:50, paddingTop:10}}
                numColumns={3}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.7}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
}

const MediaFav = ({navigation, route}) => {
    const [data, setData] = useState<FavoriteMedia>(route.params.data);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { colors, dark } = useTheme();
    const {search} = useListSearch();
    const type:'ANIME'|'MANGA' = route.params.type;

    const renderItem = ({item}:{item:UserFavMediaNode}) => {

        return(
            <View style={{borderRadius:8, overflow:'hidden'}}>
                <Pressable onPress={() => navigation.navigate('UserListDetail', { id: item.node.id })} android_ripple={{ color: colors.primary }} style={{ padding: 10, borderRadius: 8, height: 200, width: 130, justifyContent: 'center', alignItems: 'center' }}>
                    <FastImage source={{ uri: item.node.coverImage.extraLarge }} style={{ height: 190, width: 120, borderRadius: 8, }} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,.7)']} locations={[.65, .95]} style={{ position: 'absolute', height: 190, width: 120, justifyContent: 'flex-end', alignItems: 'center', borderRadius: 8 }}>
                        <Text numberOfLines={2} onLongPress={() => handleCopy(item.node.title.userPreferred)} style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold', paddingBottom: 5, paddingHorizontal: 5 }}>{item.node.title.userPreferred}</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        );
    }

    const fetchMore = async() => {
        if (data.pageInfo.hasNextPage) {
            const resp = await getFavoriteContent(type, (type === 'ANIME') ? 'animePage' : 'mangaPage', data.pageInfo.currentPage + 1);
            let init_data = resp.data.Viewer.favourites.anime ?? resp.data.Viewer.favourites.manga;
            const unique = uniqueNodes([...data.edges, ...init_data.edges]);
            setData({...data, edges: unique, pageInfo: init_data.pageInfo});
        }
    }

    const onRefresh = async() => {
        setRefreshing(true);
        const resp = await getFavoriteContent(type, (type === 'ANIME') ? 'animePage' : 'mangaPage', 1);
        setData(resp.data.Viewer.favourites.anime ?? resp.data.Viewer.favourites.manga);
        setRefreshing(false);
    }

    if (loading) return <LoadingView colors={colors} />

    return(
        <View style={{flex:1}}>
            <FlatList 
                key={0}
                data={(data) ? dataTitleFilter(data.edges, search) : []}
                renderItem={renderItem}
                keyExtractor={item => item.node.id.toString()}
                ItemSeparatorComponent={() => <View style={{height:5}} />}
                columnWrapperStyle={{justifyContent:'space-evenly', paddingHorizontal:5}}
                contentContainerStyle={{paddingBottom:50, paddingTop:10}}
                numColumns={3}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.3}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
}

export { StudioFav, StaffFav, CharacterFav, MediaFav };