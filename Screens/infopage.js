// React
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, useWindowDimensions } from 'react-native';
// UI
import { Image } from 'react-native-elements';
// Navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, useRoute } from '@react-navigation/native';
// Components
import { Character } from './character';
import { VA_Page } from './voiceactor';
import { _ContentTile } from '../Components/customtile';
import { OverView, Watch, Characters, Recommendation, Reviews, ReviewPage, Studio } from '../Components/contentcomp';
import { OtherUser } from './otheruser';
import { FocusAwareStatusBar } from '../Utils/dataprocess';
// Data
import { getOverview, getReviews } from '../Data Handler/getdata';
import { getLanguage } from '../Storages/storagehooks';
import { getToken } from '../Storages/getstorage';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const InfoTabs = ({route}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [review, setReviews] = useState();
    const [tags, setTags] = useState([]);
    const [auth, setAuth] = useState(false);
    const [lang, setLang] = useState('Romaji');

    const { colors } = useTheme();
    const routeName = useRoute();
    const { width } = useWindowDimensions();
    const { id } = route.params;

    const getData = async() => {
        let temp = [];
        if (Object.keys(data).length === 0) {
            const token = await getToken();
            let content = await getOverview(id, token);
            const reviews = await getReviews(id);
            content.recommendations.edges.forEach((element, idx) => {if (element.node.mediaRecommendation === null) content.recommendations.edges.splice(idx, 1)});
            content.genres.forEach((genre, idx) => {temp = [...temp, {'name': genre}]});
            content.tags.forEach((item, index) => {temp = [...temp, {'name': item.name, 'rank': item.rank, 'description': item.description}]}); 
            return({token: token, data: content, reviews: reviews.reviews.edges, tags: temp});
        }
    }

    const fetchLang = async () => {
        const language = await getLanguage();
        return language;
    }

    useEffect(() => {
        let mounted = true;
        fetchLang().then((language) => {
            if (mounted) {
                setLang(language);
            }
        });
        getData().then(({token, data, reviews, tags}) => {
            if (mounted) {
                setAuth(token);
                setData(data);
                setReviews(reviews);
                setTags(tags);
                setLoading(false);
            }
        });
        return () => {mounted = false};
    }, []);

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color='#00ff00' /></View>

    return(
        <View style={{ flex:1 }}>
            <FocusAwareStatusBar barStyle='light-content' translucent={true} />
            {(data.bannerImage != null) ? <Image transition={true} source={{ uri: data.bannerImage }} style={{ resizeMode:'cover', width: 450, height: 180 }} /> : <Image source={{ uri: 'https://pbs.twimg.com/media/CpdHq3BXEAEFJL1.jpg:large' }} style={{ resizeMode:'cover', width: 450, height: 200 }} />}
            <TopTab.Navigator initialRouteName='Overview' initialLayout={{ width: width }} screenOptions={{
                tabBarStyle: { backgroundColor: colors.background }, tabBarScrollEnabled: true
            }} >
                <TopTab.Screen name='Overview' component={OverView} initialParams={{data:data, auth:auth, id:id, tags:tags, lang:lang, routeName:routeName}} />
                {(data.type === 'ANIME' && data.streamingEpisodes.length > 0) ? <TopTab.Screen name='Watch' component={Watch} initialParams={{data:data}} /> : null}
                <TopTab.Screen name='Characters' component={Characters} initialParams={{data:data, id:id, auth:auth, lang:lang, routeName:routeName}} />
                <TopTab.Screen name='Recommendations' component={Recommendation} initialParams={{data:data.recommendations.edges, id:id, auth:auth, routeName:routeName}} />
                <TopTab.Screen name='Reviews' component={Reviews} initialParams={{review: review}} />
            </TopTab.Navigator>
        </View>
    );
}

export const InfoNav = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name='Info' component={InfoTabs} options={{title:'', headerTransparent:true, headerMode:'float', headerTintColor:'#FFF', headerStyle:{height:70}, headerBackgroundContainerStyle:{backgroundColor:'rgba(0,0,0,.5)'}}}/>
            <Stack.Screen name='Review' component={ReviewPage} />
            <Stack.Screen name='Character' component={Character} options={{title:'Character'}} />
            <Stack.Screen name='VA' component={VA_Page} options={{title:'Staff'}}/>
            <Stack.Screen name='Studio' component={Studio} options={({ route }) => ({ title: route.params.name })}/>
            <Stack.Screen name='UserRev' component={OtherUser} options={{title:'User'}} />
        </Stack.Navigator>
    );
}