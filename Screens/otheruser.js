import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getActivity, getFollowing, getUser } from '../api/getdata';
import { getToken } from '../api/getstorage';
import { getUserID } from '../Components/storagehooks';
import { RenderActivity, RenderFavorite, RenderFollowing } from './userinfo';
import { updateFollow } from '../api/updatedata';

const Tabs = createMaterialTopTabNavigator();

export const OtherUser = ({ route }) => {
    const { colors } = useTheme();
    const { name, routeName } = route.params;
    const [data, setData] = useState({});
    const [followingUser, setFollowingUser] = useState({});
    const [activity, setActivity] = useState({});
    const [loading, setLoading] = useState(true);
    const [authID, setAuthID] = useState(false);
    const [token, setToken] = useState(false);
    const [follow, setFollow] = useState();

    const fetchUser = async () => {
        const auth = await getToken();
        const content = await getUser(name, (typeof auth === 'string') ? auth : undefined);
        const following = await getFollowing(content.id, (typeof auth === 'string') ? auth : undefined, 1);
        const activities = await getActivity(content.id, 1);
        const AuthID = await getUserID();
        setToken(auth);
        setFollow(content.isFollowing);
        setFollowingUser(following);
        setAuthID(AuthID);
        setData(content);
        setActivity(activities);
        setLoading(false);
    }

    const Activities = () => {
        const [act, setAct] = useState(activity.activities);
        const [page, setPage] = useState(activity.pageInfo);
        const [refresh, setRefresh] = useState(false);

        const onRefresh = async () => {
            setRefresh(true);
            const activ = await getActivity(data.id, 1);
            setAct(activ.activities);
            setPage(activ.pageInfo);
            setRefresh(false);
        }

        const fetchMore = async () => {
            if (page.hasNextPage === true) {
                const more = await getActivity(data.id, page.currentPage + 1);
                setAct([...act, ...more.activities]);
                setPage(more.pageInfo);
            }
        }

        return (
            <View>
                <FlatList
                    data={act}
                    renderItem={({ item }) => <RenderActivity item={item} routeName={routeName} />}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={onRefresh}
                    refreshing={refresh}
                    onEndReached={fetchMore}
                    onEndReachedThreshold={.3} />
            </View>
        );
    }

    const toggleFollow = async() => {
        const followings = await updateFollow(token, data.id);
        setFollow(followings);
    }

    const UserOptions = () => {
        return (
            <View>
                <Button title={(follow === false) ? 'Follow' : 'Unfollow'} onPress={toggleFollow} type='outline' titleStyle={{color:colors.text}} buttonStyle={{borderWidth:1, borderColor: (follow === false) ? colors.primary : 'red'}} />
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
            const info = await getUser(name, token, 1);
            setCharacter(info.favourites.characters.edges);
            setPage(info.favourites.characters.pageInfo);
            setRefresh(false);
        }

        const getMore = async() => {
            if (page.hasNextPage === true) {
                const info = await getUser(name, (typeof token === 'string') ? token : undefined, page.currentPage + 1);
                setCharacter([...character, ...info.favourites.characters.edges]);
                setPage(info.favourites.characters.pageInfo);
            }
        }
        
        return(
            <FlatList 
            data={character} 
            renderItem={({item}) => <RenderFavorite item={item} routeName={(typeof routeName !== 'string') ? 'SearchPage' : routeName} />} 
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
        const [following, setFollowing] = useState(followingUser.following);
        const [page, setPage] = useState(followingUser.pageInfo);
        const [refresh, setRefresh] = useState(false);

        const onRefresh = async() => {
            setRefresh(true);
            const userFollowing = await getFollowing(userId, 1);
            setFollowing(userFollowing.following);
            setPage(userFollowing.pageInfo);
            setRefresh(false);
        }

        return(
            <FlatList 
            data={following}
            renderItem={({item}) => <RenderFollowing item={item} routeName={routeName} isAuth={(token !== false) ? true : false} /> } 
            keyExtractor={(item, index) => index.toString()} 
            numColumns={3}
            contentContainerStyle={{margin:10}}
            onRefresh={onRefresh}
            refreshing={refresh}
            />
        );
    }

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color={colors.primary} /></View>

    return (
        <View style={{ flex: 1 }}>
            {(data.id !== Number(authID) && typeof token === 'string') ? <UserOptions /> : null}
            <Tabs.Navigator screenOptions={{ tabBarStyle: { backgroundColor: colors.background }, tabBarPressColor: colors.primary, tabBarScrollEnabled: true }} >
                <Tabs.Screen name='ActivitiesOther' component={Activities} options={{ title: 'Activity' }} />
                <Tabs.Screen name='FavoritesOther' component={Favorites} options={{ title: 'Favorites' }} />
                <Tabs.Screen name='FollowingOther' component={Following} options={{ title: 'Following' }} />
            </Tabs.Navigator>
        </View>
    );
}