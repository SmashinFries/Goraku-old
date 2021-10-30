// React
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
// UI
import { Button, Text } from 'react-native-elements';
// Navigation
import { useTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Components
import { UserList } from './lists';
import { ActivityPage, Favorites, Following, Statistics } from '../Components/usercomp';
import { FocusAwareStatusBar } from '../Utils/dataprocess';
// Data
import { getActivity, getFollowing, getUser } from '../Data Handler/getdata';
import { getToken } from '../Storages/getstorage';
import { getUserID } from '../Storages/storagehooks';
import { updateFollow } from '../Data Handler/updatedata';

const Tabs = createMaterialTopTabNavigator();

const ListMedium = ({route}) => {
    const { id, routeName } = route.params;
    return(
        <UserList userID={id} isSearch={(routeName !== 'SearchPage') ? false : true} />
    );
}

export const OtherUser = ({route}) => {
    const { name, routeName, id } = route.params;
    const { colors, dark } = useTheme();

    const [data, setData] = useState({});
    const [followingUser, setFollowingUser] = useState({});
    const [activity, setActivity] = useState({});
    const [loading, setLoading] = useState(true);
    const [authID, setAuthID] = useState(false);
    const [token, setToken] = useState(false);
    const [follow, setFollow] = useState();

    const UserOptions = () => {
        return (
            <View>
                <Button title={(follow === false) ? 'Follow' : 'Unfollow'} onPress={toggleFollow} type='outline' titleStyle={{color:colors.text}} buttonStyle={{borderWidth:1, borderColor: (follow === false) ? colors.primary : 'red'}} />
            </View>
        );
    }

    const toggleFollow = async() => {
        const followings = await updateFollow(token, data.id);
        setFollow(followings);
    }

    const fetchUser = async () => {
        const auth = await getToken();
        const content = await getUser(name, (typeof auth === 'string') ? auth : undefined);
        const following = await getFollowing(content.id, (typeof auth === 'string') ? auth : undefined, 1, 18);
        const activities = await getActivity(content.id, 1, 15, auth);
        const AuthID = await getUserID();
        return({auth:auth, isFollowing:content.isFollowing, following:following, content:content, activities:activities, AuthID:AuthID});
    }

    useEffect(() => {
        let mounted = true;
        fetchUser().then(({auth, isFollowing, following, content, activities, AuthID}) => {
            if (mounted) {
                setToken(auth);
                setFollow(isFollowing);
                setFollowingUser(following);
                setAuthID(AuthID);
                setData(content);
                setActivity(activities);
                setLoading(false);
            }
        });
        return () => mounted = false;
    }, []);

    if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        <View style={{ flex: 1 }}>
            <FocusAwareStatusBar barStyle={(dark === false) ? 'dark-content' : 'light-content'} translucent={true} />
            {(data.id !== Number(authID) && typeof token === 'string') ? <UserOptions /> : null}
            <Tabs.Navigator screenOptions={{ tabBarStyle: { backgroundColor: colors.background }, tabBarPressColor: colors.primary, tabBarScrollEnabled: true, swipeEnabled:true }} >
                <Tabs.Screen name='ActivitiesOther' component={ActivityPage} initialParams={{activity:activity, userId:data.id, routeName:routeName, login:token}} options={{ title: 'Activity' }} />
                <Tabs.Screen name='FavoritesOther' component={Favorites} initialParams={{data: data.favourites, login:{token:token, other:true}, name:name, routeName:routeName}} options={{ title: 'Favorites' }} />
                <Tabs.Screen name='OtherList' component={ListMedium} options={{title:'List'}} initialParams={{id:id, routeName:routeName}} />
                <Tabs.Screen name='FollowingOther' component={Following} options={{ title: 'Following' }} initialParams={{initialFollowing:followingUser, login:token, userId:id, routeName:routeName}} />
                <Tabs.Screen name='StatisticsOther' component={Statistics} options={{ title: 'Statistics' }} initialParams={{stats:data.statistics, routeName:routeName}} /> 
            </Tabs.Navigator>
        </View>
    );
}