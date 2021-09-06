import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StatusBar, useWindowDimensions } from 'react-native';
import { Text, Image } from 'react-native-elements';
import RenderHTML from 'react-native-render-html';
import { useTheme, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { getUser } from '../api/getdata';
import { SectionInfo } from './infopage';

const Tabs = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const User = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { width, height } = useWindowDimensions();
    const { colors } = useTheme();

    const fetchUser = async() => {
        const info = await getUser('smashinfries');
        plannedAnime = info.statistics.anime.statuses.findIndex(item => item.status === 'PLANNING');
        setData(info);
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

    const UserHeader = () => {
        return(
            <View style={{flex:1, maxHeight:270}}>
                <View style={{flex: 1, width: width, height: 175, justifyContent: 'center', position: 'absolute', top:0}}>
                    <Image source={{uri: data.bannerImage}} resizeMode='cover' style={{width:width, height:200}} />
                </View>
                <View style={{flex: 1, alignItems:'center', maxHeight:150, maxWidth:width, marginTop: StatusBar.currentHeight + 200/7,}}>
                    <Image source={{uri: data.avatar.large}} style={{ height: 150, width: 150, resizeMode: 'contain', borderRadius:15,}} />
                    <Text h3 style={{color:colors.text}}>{data.name}</Text>
                </View>
                <View style={{flex:1, flexDirection:'row', position:'absolute', height:60, width:width, top:190, paddingHorizontal:20,}}>
                    <View style={{flex:1, alignItems:'flex-start'}}>
                        <View>
                            <Text style={{textAlign:'center', fontSize:14, color:colors.text}}>{`Episodes${'\n'}Watched`}</Text>
                            <Text style={{textAlign:'center', fontWeight:'bold', color:colors.text}}>{data.statistics.anime.episodesWatched}</Text>
                        </View>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end'}}>
                        <View>
                            <Text style={{textAlign:'center', fontSize:14, color:colors.text}}>{`Chapters${'\n'}Read`}</Text>
                            <Text style={{textAlign:'center', fontWeight:'bold', color:colors.text}}>{data.statistics.manga.chaptersRead}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    const QuickStats = () => {
        return(
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row', maxHeight: 25, justifyContent: 'space-around' }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, color: colors.text }}>Anime</Text>
                        <Text style={{ textAlign: 'center', fontSize: 18, color: colors.text }}>Manga</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 5, justifyContent: 'space-evenly', borderWidth: 1, borderRadius: 15, maxHeight: 60, marginTop: 5, borderColor: colors.border }}>
                            <SectionInfo header={`Days${'\n'}Watched`} info={(data.statistics.anime.minutesWatched / 1440).toFixed(1)} />
                            <SectionInfo header={`Days${'\n'}Planned`} info={(data.statistics.anime.statuses[grabIndex('anime')].minutesWatched / 1440).toFixed(1)} />
                            <SectionInfo header={`Total${'\n'}Anime`} info={data.statistics.anime.count} />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 5, justifyContent: 'space-evenly', borderWidth: 1, borderRadius: 15, maxHeight: 60, marginTop: 5, borderColor: colors.border }}>
                            <SectionInfo header={`Total${'\n'}Manga`} info={data.statistics.manga.count} />
                            <SectionInfo header={`Volumes${'\n'}Read`} info={data.statistics.manga.volumesRead} />
                            <SectionInfo header={`Chapters${'\n'}Planned`} info={data.statistics.manga.statuses[grabIndex('manga')].chaptersRead} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    const Test = () => {
        return(
            <Text>Test</Text>
        );
    }

    const Test2 = () => {
        return(
            <Text>Test</Text>
        );
    }

    const Test3 = () => {
        return(
            <Text>Test</Text>
        );
    }

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) return <ActivityIndicator size='large' color='#00ff00' />

    return(
        <View style={{flex: 1}}>
            <UserHeader />
            <Tabs.Navigator screenOptions={{tabBarStyle: { backgroundColor: colors.background }, tabBarScrollEnabled: true }} >
                <Tabs.Screen name='UserOverview' component={QuickStats} options={{title:'Overview'}} />
                <Tabs.Screen name='Anime List' component={Test} />
                <Tabs.Screen name='Manga List' component={Test3} />
                <Tabs.Screen name='Stats' component={Test2} />
            </Tabs.Navigator>
          </View>
    );
}

export const UserPage = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='UserPage' component={User} options={{headerShown:false}} />
        </Stack.Navigator>
    );
}