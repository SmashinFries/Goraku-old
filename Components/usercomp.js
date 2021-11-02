// React
import React, { useState } from 'react';
import { View, FlatList, Animated, useWindowDimensions, Pressable } from 'react-native';
// UI & components
import { Divider, Icon, Text } from 'react-native-elements';
import { RenderFavorite, RenderFollowing, RenderActivity } from '../Components/useritems';
// Navigation
import { useNavigation } from '@react-navigation/native';
// Data
import { getActivity, getAuthUserData, getFollowing, getUser } from '../Data Handler/getdata';
import { useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import FastImage from 'react-native-fast-image';

export const ActivityPage = ({route}) => {
    const { activity, userId, routeName, login} = route.params;
    const [act, setAct] = useState(activity.activities);
    const [page, setPage] = useState(activity.pageInfo);
    const [refresh, setRefresh] = useState(false);
    const { colors } = useTheme();

    const onRefresh = async() => {
        setRefresh(true);
        const activ = await getActivity(userId, 1);
        setAct(activ.activities);
        setPage(activ.pageInfo);
        setRefresh(false);
    }

    const fetchMore = async() => {
        if (page.hasNextPage === true) {
            const more = await getActivity(userId, page.currentPage + 1);
            setAct([...act, ...more.activities]);
            setPage(more.pageInfo);
        }
    }

    return( (act.length > 0) ?
        <View>
            <FlatList 
            data={act}
            renderItem={({item, index}) => {
            return(<Animated.View><RenderActivity item={item} routeName={routeName} token={login} /></Animated.View>);}} 
            keyExtractor={(item, index) => index.toString()} 
            onRefresh={onRefresh} 
            refreshing={refresh}
            showsVerticalScrollIndicator={false}
            onEndReached={fetchMore}
            onEndReachedThreshold={.3} />
        </View> : <Text style={{textAlign:'center', fontSize:35, fontWeight:'bold', color:colors.text, paddingTop:5}}>{`No activity yet!${'\n'}(◕︵◕)`}</Text>
    );
}

export const Favorites = ({route}) => {
    const { data, name, login, routeName} = route.params;
    const initial = data;
    const [character, setCharacter] = useState(initial.characters.edges);
    const [page, setPage] = useState(initial.characters.pageInfo);
    const [refresh, setRefresh] = useState(false);
    const { colors } = useTheme();

    const onRefresh = async() => {
        setRefresh(true);
        const info = (login.other === false) ? await getAuthUserData(login.token, 1, 15) : await getUser(name, login.token, 1);
        setCharacter(info.favourites.characters.edges);
        setPage(info.favourites.characters.pageInfo);
        setRefresh(false);
    }

    const getMore = async() => {
        if (page.hasNextPage === true) {
            const info = (login.other === false) ? await getAuthUserData(login.token, page.currentPage + 1, 15) : await getUser(name, login.token, page.currentPage + 1, 15);
            setCharacter([...character, ...info.favourites.characters.edges]);
            setPage(info.favourites.characters.pageInfo);
        }
    }
    
    return( (character.length > 0) ?
        <FlatList 
        data={character} 
        renderItem={({item}) => <RenderFavorite item={item} routeName={routeName} />} 
        keyExtractor={(item, index) => index.toString()} 
        numColumns={3}
        columnWrapperStyle={{justifyContent:'center'}}
        contentContainerStyle={{paddingBottom:10}}
        onRefresh={onRefresh}
        refreshing={refresh}
        onEndReached={getMore}
        onEndReachedThreshold={.3}
        /> : <Text style={{textAlign:'center', fontSize:35, fontWeight:'bold', color:colors.text, paddingTop:5}}>{`No favorites yet!${'\n'}(◕︵◕)`}</Text>
    );
}

export const Following = ({route}) => {
    const { initialFollowing, login, userId, routeName} = route.params;
    const [following, setFollowing] = useState(initialFollowing.following);
    const [page, setPage] = useState(initialFollowing.pageInfo);
    const [refresh, setRefresh] = useState(false);
    const { colors } = useTheme();

    const onRefresh = async() => {
        setRefresh(true);
        const userFollowing = await getFollowing(userId, login, 1);
        setFollowing(userFollowing.following);
        setPage(userFollowing.pageInfo);
        setRefresh(false);
    }

    const getMore = async() => {
        if (page.hasNextPage === true) {
            const more = await getFollowing(userId, login, page.currentPage + 1);
            setFollowing([...following, ...more.following]);
            setPage(more.pageInfo);
        }   
    }

    return( (following.length > 0) ?
        <View style={{flex:1}}>
            <FlatList 
            data={following}
            renderItem={({item}) => <RenderFollowing item={item} routeName={routeName} isAuth={true}/> } 
            keyExtractor={(item, index) => index.toString()} 
            numColumns={3}
            contentContainerStyle={{paddingTop:10}}
            onRefresh={onRefresh}
            refreshing={refresh}
            onEndReached={getMore}
            onEndReachedThreshold={.4}
            />
        </View> : <Text style={{textAlign:'center', fontSize:35, fontWeight:'bold', paddingTop:5, color:colors.text}}>{`Not following anyone!${'\n'}(◕︵◕)`}</Text>
    );
}

export const Statistics = ({route}) => {
    const { stats, routeName } = route.params;
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    const graphStatuses = (data) => {
        const statuses = [];
        // get primary color and replace opacity
        const colorCut = colors.primary.slice(0, -2);
        const colorGraph = [`${colorCut}1)`, `${colorCut}.8)`, `${colorCut}.6)`, `${colorCut}.4)`, `${colorCut}.2)`];
        for (let elem in data.statuses) {
            statuses.push({name: data.statuses[elem].status, count: data.statuses[elem].count, color:colorGraph[elem], legendFontColor: "#7F7F7F", legendFontSize: 15});
        }
        return statuses;
    }

    const ShowTagStats = ({data}) => {
        const colorCut = colors.primary.slice(0, -2);
        return(
            data.tags.map((tags, index) => (index <= 10) ? 
            <View key={index} style={{flex:1, alignItems:'center'}}>
                {(index === 0) ? <Icon name='crown' containerStyle={{position:'absolute', elevation:5, top:-27, right:0, transform:[{ rotate:'25deg'}]}} size={40} type='foundation' color='#ffd500' /> : null}
                {(index === 0) ? <View style={{flex:1, width:width-100, height:70, alignItems:'center', marginBottom:10, borderRadius:200, backgroundColor:`${colorCut}.5)`}}>
                    <NumberDisplay key={index} fontWeight='bold' fontsize={25} title={tags.tag.name} number={`${tags.count}`} />
                </View> : null}
                {(index !== 0) ? <NumberDisplay key={index} title={tags.tag.name} number={`${tags.count}`} /> : null}
            </View>
            : null)
        );
    }

    const _staffStats = ({item, isVoice=false}) => {
        const colorCut = colors.primary.slice(0, -2);
        const ocup = (isVoice === false) ? item.staff.primaryOccupations[0] : item.voiceActor.primaryOccupations[0];
        const name = (isVoice === false) ? item.staff.name.userPreferred : item.voiceActor.name.userPreferred;
        const image = (isVoice === false) ? item.staff.image.large : item.voiceActor.image.large;
        const id = (isVoice === false) ? item.staff.id : item.voiceActor.id;
        return(
            <Pressable onPress={() => {console.log(routeName); navigation.push((routeName === 'UserPage') ? 'UserVA' : 'SearchStaff', {id:id, role:undefined, routeName:routeName})}} style={{flex:1, alignItems:'center', marginHorizontal:8}}>
                <FastImage source={{uri: image}} style={{width:120, height:180, borderRadius:8, margin:5}} />
                <Text style={{color:colors.text, fontSize:15, textAlign:'center'}}>{name}</Text>
                <View style={{flex:1, justifyContent:'center', backgroundColor:`${colorCut}.8)`, borderRadius:15, alignItems:'center', position:'absolute', top:0, left:0, height:32, width:32}} >
                    <Text style={{color:'#000', fontWeight:'bold', fontSize:20}}>{item.count}</Text>
                </View>
                {(ocup !== undefined && isVoice === false) ? <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,.5)', position:'absolute', bottom:27, height:30, width:120, borderBottomLeftRadius:8, borderBottomRightRadius:8}}>
                    <Text style={{color:'#FFF', fontWeight:'bold'}}>{ocup}</Text>
                </View> : null}
            </Pressable>
        );
    }

    const NumberDisplay = ({title, number, fontsize=18, fontWeight='normal'}) => {
        return(
            <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                <Text style={{color:colors.text, fontSize:fontsize, fontWeight:fontWeight, textTransform:'capitalize'}}>{`${title}: `}</Text>
                <Text style={{color:colors.primary, fontWeight:'bold', fontSize:fontsize}}>{number}</Text>
            </View>
        );
    }

    const AnimeStats = ({data}) => {
        const statuses = graphStatuses(data);
        return(
            <View style={{flex:1, alignItems:'center', paddingVertical:10}}>
                <Text h1 style={{color:colors.text}}>Anime</Text>
                <Divider color={colors.text} style={{width:width-90, marginBottom:5}} orientation='horizontal' width={1} />
                <NumberDisplay title='Total Anime' number={data.count} />
                <NumberDisplay title='Episodes Watched' number={data.episodesWatched} />
                <NumberDisplay title='Minutes Wasted' number={data.minutesWatched} />
                <Text h3 style={{color:colors.text}}>Statuses</Text>
                <PieChart data={statuses} absolute={true} backgroundColor={colors.background} chartConfig={chartConfig} width={width} height={200} accessor={'count'} />
                <Text h3 style={{color:colors.text}}>Top 10 Tags</Text>
                <ShowTagStats data={data} />
                <Text h3 style={{color:colors.text, marginTop:10}}>Top 5 Voice Actors</Text>
                <FlatList 
                    data={data.voiceActors} 
                    renderItem={({item}) => <_staffStats item={item} isVoice={true} />} 
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingVertical:5}}
                />
                <Text h3 style={{color:colors.text, marginTop:10}}>Top 5 Staff</Text>
                <FlatList 
                    data={data.staff} 
                    renderItem={({item}) => <_staffStats item={item} />} 
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingVertical:5}}
                />
            </View>
        );
    }

    const MangaStats = ({data}) => {
        const statuses = graphStatuses(data);
        return(
            <View style={{flex:1, alignItems:'center', paddingVertical:10}}>
                <Text h1 style={{color:colors.text}}>Manga</Text>
                <Divider color={colors.text} style={{width:width-90, marginBottom:5}} orientation='horizontal' width={1} />
                <NumberDisplay title='Total Manga' number={data.count} />
                <NumberDisplay title='Chapters Read' number={data.chaptersRead} />
                <NumberDisplay title='Volumes Read' number={data.volumesRead} />
                <Text h3 style={{color:colors.text}}>Statuses</Text>
                <PieChart data={statuses} absolute={true} backgroundColor={colors.background} chartConfig={chartConfig} width={width} height={200} accessor={'count'} />
                <Text h3 style={{color:colors.text}}>Top 10 Tags</Text>
                <ShowTagStats data={data} />
                {/* {data.tags.map((tags, index) => <NumberDisplay key={index} title={tags.tag.name} number={`${tags.count}`} />)} */}
                <Text h3 style={{color:colors.text, marginTop:10}}>Top 5 Staff</Text>
                <FlatList 
                    data={data.staff} 
                    renderItem={({item}) => <_staffStats item={item} />} 
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingVertical:5}}
                />
            </View>
        );
    }

    return(
        <ScrollView style={{flex:1}} contentContainerStyle={{paddingHorizontal:8}}>
            <AnimeStats data={stats.anime} />
            <MangaStats data={stats.manga} />
        </ScrollView>
    );
}