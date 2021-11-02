// React
import React, { memo, useState } from 'react';
import { View, ActivityIndicator, StatusBar, useWindowDimensions, FlatList, Pressable } from 'react-native';
// UI
import { Text, Image, Badge } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
// Navigation
import { useTheme, useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// Components
import { InfoNav } from './infopage';
import { getActivity, getAuthUserData, getFollowing, fetchAiringNotification, clearNotifications } from '../Data Handler/getdata';
import { Character } from './character';
import { OtherUser } from './otheruser';
import { VA_Page } from './voiceactor';
import { Login } from '../Components/useritems';
import { ActivityPage, Favorites, Following, Statistics } from '../Components/usercomp';
// Data / Other
import { getToken, storeToken } from '../Storages/getstorage';
import { checkUserID } from '../Storages/storagehooks';
import { textDecider, FocusAwareStatusBar } from '../Utils/dataprocess';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const Tabs = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const UserHeader = ({data}) => {
    const { width, height } = useWindowDimensions();
    const { colors } = useTheme();
    const [header, setHeader] = useState(data);
    return(
        <View style={{flex:1, maxHeight:210}}>
            <View style={{flex: 1, width: width, height: 80, justifyContent: 'center', position: 'absolute', top:0}}>
                <FastImage source={{uri: header.bannerImage}} resizeMode='cover' style={{width:width, height:200}} />
            </View>
            <View style={{flex: 1, alignItems:'center', maxHeight:100, maxWidth:width, marginTop: StatusBar.currentHeight,}}>
                <FastImage source={{uri: header.avatar.large}} style={{ height: 140, width: 140, resizeMode: 'contain', borderRadius:15,}} />
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

const NotificationsTab = ({route}) => {
    const { notif, login, unRead, routeName } = route.params;
    const [notifData, setNotifData] = useState(notif.Page.notifications);
    const [unread, setUnread] = useState(unRead);
    const [page, setPage] = useState(notif.Page.pageInfo);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    const { colors } = useTheme();

    const cleanseNotif = async() => {
        try {
            if (unread > 0) {
                await AsyncStorage.setItem('@LASTNOTIF', `${notifData[0].id}`);
                const clear = await clearNotifications(login);
                navigation.setOptions({tabBarBadge: null})
                return clear;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            let mounted = true;
            cleanseNotif().then((clear) => {
                if (mounted) {
                    if (clear) setUnread(0);
                }
            });
            
            if (mounted && unread > 0) {
                cleanseNotif();
                PushNotification.removeAllDeliveredNotifications();
            }
            return () => mounted = false;
        }, [])
    );

    const getGPS = (type, data) => {
        if (type === 'AiringNotification' || type === 'RelatedMediaAdditionNotification') {
            navigation.push((routeName !== 'SearchPage') ? 'UserContent' : 'InfoSearch', { screen: 'Info', params: { id: data.media.id, title: { romaji: data.media.title.romaji, native: data.media.title.native, english: data.media.title.english } }, });
        } else {
            navigation.push('UserFollow', {name: data.user.name, avatar: data.user.avatar.large, routeName:routeName, id: data.user.id});
        }
    }

    const _renderNotif = ({item}) => {
        const {bottomText, topText, time, image} = textDecider(item);
        const MemoNotif = memo(() => {
            return (
                <View style={{ flex: 1, elevation: 5, backgroundColor: colors.card, flexDirection: 'row', borderWidth: 1, borderRadius: 8, alignItems: 'center', margin: 10, borderColor: colors.border }}>
                    <Pressable style={{width: 80, height: 119}} onPress={() => getGPS(item['__typename'], item)} >
                        <FastImage source={{ uri: image }} resizeMode='cover' style={{ width: 80, height: 119, borderBottomLeftRadius: 6, borderTopLeftRadius: 6 }}/>
                    </Pressable>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', paddingBottom: 10, marginLeft: 20 }}>
                        <Text style={{ color: colors.text, fontSize: 16, }} numberOfLines={(bottomText.length === 0) ? 2 : 1}>{topText}</Text>
                        {(bottomText.length > 0) ? <Text style={{ color: colors.text, fontSize: 16, textTransform: 'capitalize' }}>{bottomText}</Text> : null}
                    </View>
                    <Text style={{ position: 'absolute', margin: 5, top: -2, right: 0, color: colors.text }}>
                        {time}
                    </Text>
                </View>);
        }, []);

        return ( 
               <MemoNotif /> 
        );
    }

    const onRefresh = async() => {
        setRefresh(true);
        const notif = await fetchAiringNotification(login, undefined, 15);
        setNotifData(notif.Page.notifications);
        setPage(notif.Page.pageInfo);
        setRefresh(false);
    }

    const getMore = async() => {
        const moreNotif = await fetchAiringNotification(login, undefined, 15, page.currentPage+1);
        setNotifData([...notifData,...moreNotif.Page.notifications]);
        setPage(moreNotif.Page.pageInfo);
    }

    return(
        <FlatList 
            data={notifData}
            renderItem={_renderNotif}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={onRefresh}
            refreshing={refresh}
            onEndReached={getMore}
            onEndReachedThreshold={.3}
            showsVerticalScrollIndicator={false}
        />
    );
}

const User = ({route}) => {
    const [data, setData] = useState({});
    const [unread, setUnread] = useState(0);
    const [initialFollowing, setInitialFollowing] = useState({});
    const [activity, setActivity] = useState({});
    const [notif, setNotif] = useState({});
    const [login, setLogin] = useState(false);
    const [userId, setUserId] = useState(false);
    const [loading, setLoading] = useState(true);

    const { colors } = useTheme();
    const routeName = useRoute();
    const navigation  = useNavigation();

    const fetchUser = async() => {
        let token = false;
        const tokenMem = await getToken();
        if (typeof route.params.access_token === 'string' || typeof tokenMem !== 'string') {
            await storeToken(route.params.access_token);
            token = await getToken();
        } else {
            token = tokenMem;
        }
        if (typeof token === 'string') {
            if (Object.keys(data).length === 0) {
                const info = await getAuthUserData(token, 1, 15);
                const act = await getActivity(info.id, 1, 15, token);
                const notification = await fetchAiringNotification(token, undefined, 15);
                const userFollowing = await getFollowing(info.id, token, 1);
                checkUserID(info.id.toString());
                plannedAnime = info.statistics.anime.statuses.findIndex(item => item.status === 'PLANNING');
                return ({notif:notification, unread:info.unreadNotificationCount, userId:info.id, initialFollowing:userFollowing, activity:act, data:info, token:token});
            }
        } else {
            return (false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
        let mounted = true;
        fetchUser().then((result) => {
            if (mounted && result !== false) { 
                setNotif(result.notif);
                setUnread(result.unread);
                setUserId(result.userId);
                setInitialFollowing(result.initialFollowing);
                setActivity(result.activity);
                setData(result.data);
                setLogin(result.token);
            }
            setLoading(false);
        });
        return () => {mounted = false};
    }, [route.params]));

    if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        (login !== false && Object.keys(data).length > 0) ? <View style={{flex: 1}}>
            <UserHeader data={data} />
            <FocusAwareStatusBar barStyle='light-content' translucent={true} backgroundColor='rgba(0,0,0,.5)' />
            <Tabs.Navigator screenOptions={{ tabBarStyle: { backgroundColor: colors.background }, tabBarPressColor:colors.primary, tabBarScrollEnabled: true, swipeEnabled:true }} >
                <Tabs.Screen name='Activity' component={ActivityPage} initialParams={{activity:activity, userId:userId, routeName:routeName.name, login:login}} />
                <Tabs.Screen name='Notifications' component={NotificationsTab} initialParams={{notif:notif, login:login, unRead:unread, routeName:routeName.name}} options={{
                    tabBarLabel: (props) => 
                    <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:props.color}}>NOTIFICATIONS</Text>
                    </View>,
                    tabBarBadge: (props) => (unread > 0) ? <Badge value={unread} badgeStyle={{borderColor: 'rgba(0,0,0,0)'}} containerStyle={{marginHorizontal:5}} status='error' /> : null
                    }} />
                <Tabs.Screen name='Favorites' component={Favorites} initialParams={{data:data.favourites, login:{token:login, other:false}, routeName:routeName.name}} />
                <Tabs.Screen name='Following' component={Following} initialParams={{initialFollowing:initialFollowing, login:login, userId:userId, routeName:routeName.name}} options={{tabBarLabelStyle:{justifyContent:'center'}}} />
                <Tabs.Screen name='StatisticsUser' component={Statistics} options={{title:'Statistics'}} initialParams={{stats: data.statistics, routeName:routeName.name}} />
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