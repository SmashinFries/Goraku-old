import React, { memo, useState } from 'react';
import { View, ActivityIndicator, StatusBar, useWindowDimensions, FlatList, Linking, Pressable } from 'react-native';
import { Text, Image, Button } from 'react-native-elements';
import { useTheme, useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getActivity, getDateDiff, getAuthUserData, getFollowing } from '../api/getdata';
import { InfoNav } from './infopage';
import { getToken, storeToken } from '../api/getstorage';
import { checkUserID } from '../Components/storagehooks';
import { Character } from './character';
import { OtherUser } from './otheruser';
import { VA_Page } from './voiceactor';

const Tabs = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export const Login = () => {
    const { colors } = useTheme();
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text h3 style={{color:colors.text}}>{`Login to Anilist`}</Text>
            <Button title='Login' buttonStyle={{backgroundColor:colors.primary, width:100}} onPress={() => Linking.openURL('https://anilist.co/api/v2/oauth/authorize?client_id=6419&response_type=token')} />
        </View>
    );
}

export const RenderActivity = ({item, routeName}) => {
    const created = new Date(item.createdAt*1000);
    const {daysDif, hoursDif, minutesDif, secondsDif} = getDateDiff(created);
    const { colors } = useTheme();
    const navigation  = useNavigation();
    return(
        <View style={{flex:1, alignItems:'center'}}>
            <View style={{flex:1, flexDirection:'row', borderWidth:1, borderRadius:8, alignItems:'center', margin:10, maxHeight:110, borderColor:colors.border}}>
                <Image source={{uri:item.media.coverImage.extraLarge}} resizeMode='cover' style={{width:70, height:100, borderBottomLeftRadius:8, borderTopLeftRadius:8}} 
                onPress={() => {navigation.push((routeName !== 'SearchPage') ? 'UserContent' : 'InfoSearch', {screen: 'Info', params: {id:item.media.id, title:{romaji: item.media.title.romaji, native: item.media.title.native, english:item.media.title.english}},});}} />
                <View style={{flex:1, flexDirection:'column', alignItems:'flex-start', paddingBottom:10, marginLeft:20}}>
                    <Text style={{color:colors.text, fontSize:16, textTransform:'capitalize'}}>{`${item.status} ${(item.progress !== null) ? item.progress : ''}`}</Text>
                    <Text style={{color:colors.text, fontSize:16,}} numberOfLines={1}>{item.media.title.romaji}</Text>
                </View>
                {/* <View style={{flex:1, flexDirection:'row', position:'absolute', bottom:0, right:0}}>
                    <Chip icon={{name:'chat-bubble-outline', type:'material', size:20, color:colors.text}} iconRight title={item.replyCount} containerStyle={{backgroundColor:'rgba(0,0,0,0)'}} buttonStyle={{backgroundColor:'rgba(0,0,0,0)'}} titleStyle={{color:colors.text}} />
                    <Chip icon={{name:'favorite-border', type:'material', size:20, color: (item.isLiked === true) ? 'red' : colors.text }} iconRight title={item.likeCount} containerStyle={{backgroundColor:'rgba(0,0,0,0)'}} buttonStyle={{backgroundColor:'rgba(0,0,0,0)'}} titleStyle={{color:colors.text}} />
                </View> */}
                <Text style={{ position: 'absolute', margin: 5, top: 0, right: 0, color:colors.text }}>{
                    (hoursDif > 23) ? `${daysDif} ${(daysDif > 1) ? 'days' : 'day'} ago` :
                    (hoursDif < 24 && hoursDif > 0) ? `${hoursDif} ${(hoursDif > 1) ? 'hours' : 'hour'} ago` : 
                    (minutesDif > 1) ? `${minutesDif} minutes ago` : `Under a minute ago`}
                </Text>
            </View>
        </View>
    );
}

export const RenderFollowing = ({item, routeName, isAuth=true}) => {
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const handlePress = () => {
        if (routeName === 'UserPage') {
            navigation.push('UserFollow', {name: item.name, avatar: item.avatar.large, routeName:routeName});
        } else if (routeName === 'SearchPage' || routeName === undefined) {
            navigation.push('UserSearch', {name: item.name, avatar: item.avatar.large, routeName:routeName});
        }
    }
    return(
        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={handlePress}>
            <Image source={{ uri: item.avatar.large }} style={{ height: 130, width: 130, resizeMode: 'cover', borderRadius: 8 }} />
            <Text style={{ color: colors.text, width: 90, textAlign: 'center' }} numberOfLines={2}>{item.name}</Text>
            {((item.isFollowing !== false || item.isFollower !== false) && isAuth === true) ?
                <View style={{ position: 'absolute', width: 130, top: 0, alignItems: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: 'rgba(0,0,0,.6)' }}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{
                        (item.isFollowing !== false && item.isFollower !== false) ? 'Friends' : (item.isFollowing !== false) ? 'Following' : 'Follower'
                    }</Text>
                </View>
                : null}
        </Pressable>
    );
}

export const RenderFavorite = ({item, routeName}) => {
    const navigation  = useNavigation();
    return(
        <View style={{flex:1, alignItems:'center', marginVertical:5}}>
            <Image source={{uri:item.node.image.large}} onPress={() => {navigation.push((routeName === 'UserPage') ? 'UserFavorite' : 'SearchCharacter', {id: item.node.id, routeName:routeName})}} style={{height:210, width:160, resizeMode:'cover', borderRadius:8}} />
            <View style={{ backgroundColor: 'rgba(0,0,0,.6)', justifyContent:'center', position: 'absolute', width: 160, height: 30, bottom:0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                <Text style={{color:'#FFF', textAlign:'center'}}>{item.node.name.userPreferred}</Text>
            </View>
        </View>
    );
}

const UserHeader = ({data}) => {
    const { width, height } = useWindowDimensions();
    const { colors } = useTheme();
    const [header, setHeader] = useState(data);
    return(
        <View style={{flex:1, maxHeight:230}}>
            <View style={{flex: 1, width: width, height: 80, justifyContent: 'center', position: 'absolute', top:0}}>
                <Image source={{uri: header.bannerImage}} resizeMode='cover' style={{width:width, height:200}} />
            </View>
            <View style={{flex: 1, alignItems:'center', maxHeight:100, maxWidth:width, marginTop: StatusBar.currentHeight,}}>
                <Image source={{uri: header.avatar.large}} style={{ height: 140, width: 140, resizeMode: 'contain', borderRadius:15,}} />
                <Text h3 style={{color:colors.text}}>{header.name}</Text>
            </View>
            <View style={{flex:1, flexDirection:'row', position:'absolute', height:60, width:width, top:140, paddingHorizontal:20,}}>
                <View style={{flex:1, alignItems:'flex-start'}}>
                    <View>
                        <Text style={{textAlign:'center', fontSize:14, color:colors.text}}>{`Episodes${'\n'}Watched`}</Text>
                        <Text style={{textAlign:'center', fontWeight:'bold', color:colors.text}}>{header.statistics.anime.episodesWatched}</Text>
                    </View>
                </View>
                <View style={{flex:1, alignItems:'flex-end'}}>
                    <View>
                        <Text style={{textAlign:'center', fontSize:14, color:colors.text}}>{`Chapters${'\n'}Read`}</Text>
                        <Text style={{textAlign:'center', fontWeight:'bold', color:colors.text}}>{header.statistics.manga.chaptersRead}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const User = ({route}) => {
    const [data, setData] = useState({});
    const [initialFollowing, setInitialFollowing] = useState({});
    const [activity, setActivity] = useState({});
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState(false);
    const [userId, setUserId] = useState(false);
    const { colors } = useTheme();
    const routeName = useRoute();

    const fetchUser = async() => {
        if (typeof route.params.access_token !== false && login === false) {
            await storeToken(route.params.access_token);
        }
        const token = await getToken();
        setLogin(token);
        if (typeof token === 'string') {
            if (Object.keys(data).length === 0) {
                const info = await getAuthUserData(token);
                const act = await getActivity(info.id, 1);
                const userFollowing = await getFollowing(info.id, token, 1);
                setUserId(info.id);
                setInitialFollowing(userFollowing);
                checkUserID(info.id.toString());
                plannedAnime = info.statistics.anime.statuses.findIndex(item => item.status === 'PLANNING');
                setData(info);
                setActivity(act);
            }
        } 
        setLoading(false);
    }

    const grabIndex = (type) => {
        if (type === 'anime') {
            const pos = data.statistics.anime.statuses.findIndex(item => item.status === 'PLANNING');
            return pos;
        } else {
            const pos = data.statistics.manga.statuses.findIndex(item => item.status === 'PLANNING');
            return pos;
        }
    }

    const ActivityPage = () => {
        const [act, setAct] = useState(activity.activities);
        const [page, setPage] = useState(activity.pageInfo);
        const [refresh, setRefresh] = useState(false);

        const onRefresh = async() => {
            setRefresh(true);
            const activ = await getActivity(data.id, 1);
            setAct(activ.activities);
            setPage(activ.pageInfo);
            setRefresh(false);
        }

        const fetchMore = async() => {
            if (page.hasNextPage === true) {
                const more = await getActivity(data.id, page.currentPage + 1);
                setAct([...act, ...more.activities]);
                setPage(more.pageInfo);
            }
        }

        return(
            <View>
                <FlatList 
                data={act}
                renderItem={({item}) => <RenderActivity item={item} routeName={routeName.name} />} 
                keyExtractor={(item, index) => index.toString()} 
                onRefresh={onRefresh} 
                refreshing={refresh}
                onEndReached={fetchMore}
                onEndReachedThreshold={.3} />
            </View>
        );
    }

    const Favorites = () => {
        const initial = data.favourites;
        const [character, setCharacter] = useState(initial.characters.edges);
        const [page, setPage] = useState(initial.characters.pageInfo);
        const [refresh, setRefresh] = useState(false);

        const onRefresh = async() => {
            setRefresh(true);
            const info = await getAuthUserData(login);
            setCharacter(info.favourites.characters.edges);
            setPage(info.favourites.characters.pageInfo);
            setRefresh(false);
        }

        const getMore = async() => {
            if (page.hasNextPage === true) {
                const info = await getAuthUserData(login, page.currentPage + 1);
                setCharacter([...character, ...info.favourites.characters.edges]);
                setPage(info.favourites.characters.pageInfo);
            }
        }
        
        return(
            <FlatList 
            data={character} 
            renderItem={({item}) => <RenderFavorite item={item} routeName={routeName.name} />} 
            keyExtractor={(item, index) => index.toString()} 
            numColumns={2}
            columnWrapperStyle={{paddingHorizontal:15}}
            onRefresh={onRefresh}
            refreshing={refresh}
            onEndReached={getMore}
            onEndReachedThreshold={.3}
            />
        );
    }

    const Following = () => {
        const [following, setFollowing] = useState(initialFollowing.following);
        const [page, setPage] = useState(initialFollowing.pageInfo);
        const [refresh, setRefresh] = useState(false);

        const onRefresh = async() => {
            setRefresh(true);
            const userFollowing = await getFollowing(userId, login, 1);
            setFollowing(userFollowing.following);
            setPage(userFollowing.pageInfo);
            setRefresh(false);
        }

        return(
            <FlatList 
            data={following}
            renderItem={({item}) => <RenderFollowing item={item} routeName={routeName.name} isAuth={true}/> } 
            keyExtractor={(item, index) => index.toString()} 
            numColumns={3}
            contentContainerStyle={{margin:10}}
            onRefresh={onRefresh}
            refreshing={refresh}
            />
        );
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchUser();
        }, [route.params.access_token])
    );

    if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        (login !== false && Object.keys(data).length > 0) ? <View style={{flex: 1}}>
            <UserHeader data={data} />
            <Tabs.Navigator screenOptions={{tabBarStyle: { backgroundColor: colors.background }, tabBarPressColor:colors.primary, tabBarScrollEnabled: true }} >
                <Tabs.Screen name='Activity' component={ActivityPage} />
                <Tabs.Screen name='Favorites' component={Favorites} />
                <Tabs.Screen name='Following' component={Following} />
            </Tabs.Navigator>
        </View> : <Login />
    );
}

export const UserPage = () => {
    return (
        <Stack.Navigator initialRouteName={'UserPage'}>
            <Stack.Screen name='UserPage' component={User} options={{headerShown:false}} initialParams={{access_token: false}} />
            <Stack.Screen name='UserContent' component={InfoNav} options={{headerShown:false}} />
            <Stack.Screen name='UserFavorite' component={Character} options={{title:'Character'}} />
            <Stack.Screen name='UserVA' component={VA_Page} options={{title:'Staff'}} />
            <Stack.Screen name='UserFollow' component={OtherUser}
                options={({ route }) => ({ title: route.params.name, headerRight: () => (<Image source={{uri: route.params.avatar}} style={{height:50, width:50, resizeMode:'cover', marginRight:10}} />) })} />
        </Stack.Navigator>
    );
}