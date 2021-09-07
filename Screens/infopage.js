import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, useWindowDimensions, Pressable, FlatList, Linking } from 'react-native';
import { Chip, Text, Avatar, Image, Icon, Button, Badge } from 'react-native-elements';
import RenderHTML, {HTMLContentModel, HTMLElementModel} from 'react-native-render-html';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { getOverview, getReviews } from '../api/getdata';
import { CharacterPage, copyText } from './character';
import { VA_Page } from './voiceactor';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export const SectionInfo = ({header, info, style=null}) => {
    const { colors } = useTheme();
    return(
        <View style={{ justifyContent: 'center', margin: 5 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color:colors.text}}>{header}</Text>
            <Text style={(style === null) ? { textAlign: 'center', color:colors.text} : style}>{(info !== null) ? info : 'Unknown'}</Text>
        </View>
    );
}

const ReviewPage = ({route}) => {
    const body = route.params;
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const customTagElement = {
        'center': HTMLElementModel.fromCustomModel({
            tagName: 'center',
            mixedUAStyles: {
                textAlign:'center'
            },
            contentModel: HTMLContentModel.block
        })
    };

    return(
        <View>
            <ScrollView contentContainerStyle={{alignSelf:'center', width:width-10}}>
                <RenderHTML baseStyle={{color:colors.text, paddingLeft:5, paddingRight:5}} contentWidth={width} source={{html: body}} customHTMLElementModels={customTagElement} />
            </ScrollView>
        </View>
    );
}

const InfoPage = ({route}) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [review, setReviews] = useState();
    const [tags, setTags] = useState([]);
    const [page, setPages] = useState();

    const navigation  = useNavigation();
    const routeName = useRoute();
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const {id, title} = route.params;

    const getData = async() => {
        let temp = [];
        if (Object.keys(data).length === 0) {
            const content = await getOverview(id);
            const reviews = await getReviews(id);
            content.genres.forEach((genre, idx) => {temp = [...temp, {'name': genre}]});
            content.tags.forEach((item, index) => {temp = [...temp, {'name': item.name, 'rank': item.rank}]}); 
            await setTags(temp);
            await setData(content);
            await setReviews(reviews.reviews.edges);
            await setPages(reviews.reviews.pageInfo);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color='#00ff00' /></View>

    const OverView = () => {
        const source = {html: data.description};

        const _relatedMedia = ({ item }) => {
            return(
                <View style={{ paddingRight: 10}}>
                    <Image source={{ uri: item.node.coverImage.extraLarge }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}
                        onPress={() => {navigation.push('Info', {id:item.node.id, title:item.node.title})}}
                    />
                    <View style={{ backgroundColor: 'rgba(0,0,0,.6)', justifyContent:'center', position: 'absolute', width: 125, height: 30, bottom:0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.relationType}</Text>
                    </View>
                </View>
            );
        }

        const _staff = ({ item }) => {
            return(
                <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 10}}>
                    <Image source={{ uri: item.node.image.large }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}
                        onPress={() => {navigation.push('VA', {id:item.node.id, role:item.role})}}
                    />
                    <View style={{ backgroundColor: 'rgba(0,0,0,.6)', position: 'absolute', width: 125, height: 40, top: 145, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.node.name.full}</Text>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.role}</Text>
                    </View>
                </View>
            );
        }

        return(
            <View style={{paddingRight:10, paddingLeft:10, paddingBottom:10}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Pressable onLongPress={() => {copyText(title.romaji)}}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', flexWrap: 'wrap', color: colors.text, textAlign: 'center' }}>{title.romaji}</Text>
                    </Pressable>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 1, height: 60, marginTop: 5, borderColor: colors.border }}>
                            <SectionInfo header='FORMAT' info={data.format} style={{ textTransform: (data.format !== 'TV') ? 'capitalize' : 'none', textAlign: 'center', color: colors.text }} />
                            <SectionInfo header='SCORE' info={`${data.meanScore}%`} style={{ textAlign: 'center', color: (data.meanScore >= 75) ? 'green' : (data.meanScore < 75 && data.meanScore >= 65) ? 'orange' : 'red' }} />
                            {(data.status !== null) ? <SectionInfo header='STATUS' info={data.status} style={{ textTransform: 'capitalize', textAlign: 'center', color: colors.text }} /> : null}
                            {(data.nextAiringEpisode !== null) ?<SectionInfo header='NEXT EP' info={`${(data.nextAiringEpisode.timeUntilAiring / 86400).toFixed(1)} days`} /> : null}
                            {(data.type === 'MANGA') ? <SectionInfo header='VOLUMES' info={(data.volumes !== null) ? data.volumes : 'N/A'} /> : null}
                            {(data.type === 'MANGA') ? <SectionInfo header='CHAPTERS' info={(data.chapters !== null) ? data.chapters : 'N/A'} /> : null}
                            {(data.episodes !== null) ? <SectionInfo header='EPISODES' info={data.episodes} /> : null}
                            <SectionInfo header='DATE' info={`${data.startDate.month}/${data.startDate.day}/${data.startDate.year} - ${`${(data.endDate.year !== null) ? `${data.endDate.month}/${data.endDate.day}/${data.endDate.year}` : 'Present'}`}`} />
                            {(data.studios.edges.length > 0) ? <SectionInfo header='STUDIO' info={data.studios.edges[0].node.name} /> : null}
                            <SectionInfo header='ENGLISH TITLE' info={title.english} />
                        </View>
                    </ScrollView>
                    <FlatList data={tags} horizontal={true} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => <View style={{marginVertical:5}}><Chip title={`${item.name} ${item.rank !== undefined ? item.rank+'%' : '' }`} buttonStyle={{backgroundColor:colors.primary}} containerStyle={{ marginHorizontal: 2, marginVertical: 5, paddingTop: 5 }} /></View>} showsHorizontalScrollIndicator={false}/>
                    <View>
                        <FlatList
                            data={data.relations.edges}
                            windowSize={3}
                            horizontal={true}
                            maxToRenderPerBatch={3}
                            renderItem={_relatedMedia}
                            style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 5 }}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ alignSelf: 'center' }}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    <View>
                        <Text h3 style={{ color: colors.text }}>Staff</Text>
                        <FlatList data={data.staff.edges} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={_staff} /> 
                    </View>
                    {(data.trailer !== null) ?
                    <View>
                        <Text h3 style={{ color: colors.text }}>Trailer</Text>
                        <View>
                            <Image source={{uri:data.trailer.thumbnail}} resizeMode='cover' style={{height:250, width:width}} />
                            <Icon name='play-circle-filled' color='rgba(0,0,0,.7)' onPress={() => {(data.trailer.site === 'youtube') ? Linking.openURL(`vnd.youtube://${data.trailer.id}`) : Linking.openURL(`https://www.dailymotion.com/video/${data.trailer.id}`)}} type='material' size={70} containerStyle={{position:'absolute', alignSelf:'center', bottom:250/2 -40}}/>
                        </View>
                    </View> : null}
                    {(data.externalLinks.length > 0) ? <Text h3 style={{ color: colors.text }}>External Sites</Text> : null}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {data.externalLinks.map((elem) => <Button key={elem.id} title={elem.site} containerStyle={{margin:4, borderRadius:8}} buttonStyle={{backgroundColor:'#E50914'}} onPress={() => {Linking.openURL(elem.url)}} />)}
                    </ScrollView>
                    {(data.description !== '') ? <Text h3 style={{ color: colors.text }}>Description</Text> : null}
                    <RenderHTML baseStyle={{color:colors.text}} contentWidth={width} source={source} />
                </ScrollView>
            </View>
        );
    }

    const Watch = () => {
        const _episodeItem = ({item}) => {
            return (
                <View style={{paddingTop:10, paddingBottom:5}}>
                    <Image source={{uri:item.thumbnail}} style={{resizeMode:'cover', width:width-25, height: 150, borderRadius:8}} onPress={()=>{Linking.openURL(item.url)}}/>
                    <View style={{backgroundColor:'rgba(0,0,0,.5)', justifyContent:'center', position:'absolute', width:width-25, height:30, top:130, borderBottomLeftRadius:8, borderBottomRightRadius:8}}>
                        <Text style={{color:'#FFF', textAlign:'center'}} numberOfLines={1}>{item.title}</Text>
                    </View>
                </View>
            )
        };

        return(
            <View style={{ flex: 1 }}>
                <FlatList
                    data={data.streamingEpisodes}
                    windowSize={3}
                    maxToRenderPerBatch={3}
                    renderItem={_episodeItem}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ alignSelf: 'center' }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    const Characters = () => {
        const _characterItem = ({ item }) => {
            return (
                <View style={{ margin:5 }}>
                    <Image source={{ uri: item.node.image.large }} style={{ resizeMode: 'cover', width: 180, height: 230, borderRadius: 8 }}
                        onPress={() => {navigation.navigate('Character', {id: item.node.id, actor: item.voiceActors})}} 
                    >
                        <View style={{ position:'absolute', backgroundColor: 'rgba(0,0,0,.5)', bottom:0, width: 180, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                            <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.node.name.full}</Text>
                            <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.role}</Text>
                        </View>
                    </Image>
                </View>
            )
        };

        return(
            <View style={{ flex: 1 }}>
                <FlatList
                    data={data.characters.edges}
                    numColumns={2}
                    columnWrapperStyle={{paddingBottom:5}}
                    windowSize={3}
                    renderItem={_characterItem}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ alignSelf: 'center', paddingBottom:20 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    const Recommendation = () => {
        const _recommendedItem = ({ item }) => {
            return (
                <View style={{ margin:5 }}>
                    <Image source={{ uri: item.node.mediaRecommendation.coverImage.extraLarge }} style={{ resizeMode: 'cover', width: 180, height: 230, borderRadius: 8 }}
                        onPress={() => {navigation.push('Info', {id:item.node.mediaRecommendation.id, title:item.node.mediaRecommendation.title})}}
                    >
                        <View style={{ position:'absolute', backgroundColor: 'rgba(0,0,0,.7)', justifyContent:'center', bottom:0, width: 180, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                            <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={2}>{item.node.mediaRecommendation.title.romaji}</Text>
                        </View>
                    </Image>
                    <Badge value={(typeof item.node.mediaRecommendation.meanScore == 'number') ? `${item.node.mediaRecommendation.meanScore}%` : '?'}
                        containerStyle={{ alignSelf: 'flex-end', position: 'absolute', elevation: 24, top: -4, transform:[{scale: 1.2}] }}
                        badgeStyle={{ borderColor: 'rgba(0,0,0,0)' }}
                        status={(item.node.mediaRecommendation.meanScore >= 75) ? 'success'
                            : (item.node.mediaRecommendation.meanScore < 75 && item.node.mediaRecommendation.meanScore >= 65) ? 'warning'
                                : (item.node.mediaRecommendation.meanScore < 65) ? 'error' : undefined
                        }
                        
                    />
                </View>
            )
        };

        return(
            <View style={{ flex: 1 }}>
                <FlatList
                    data={data.recommendations.edges}
                    numColumns={2}
                    columnWrapperStyle={{paddingBottom:5}}
                    windowSize={3}
                    renderItem={_recommendedItem}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ alignSelf: 'center', paddingBottom:20 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    const Reviews = () => {
        const _reviewItem = ({item}) => {
            return (
                <View style={{paddingBottom:20, paddingTop:30, paddingLeft:10, width:width, alignItems:'center', elevation:8}}>
                    <View style={{flex:1, justifyContent:'center', paddingLeft:20, borderStyle: 'solid', borderWidth: 1, borderRadius: 12, height:100, width:width-70, backgroundColor:'rgba(255, 255, 255, .15)', borderColor:colors.text}}>
                        <Text style={{paddingLeft:35, paddingRight:5, color:colors.text}} onPress={() => {navigation.navigate('Review', item.node.body)}}>{item.node.summary}</Text>
                        <Avatar rounded source={{uri:item.node.user.avatar.large}} size='large' containerStyle={{elevation:10, position:'absolute', bottom:45, left:-30, borderColor:colors.text, borderWidth:1}}/>
                        <Chip icon={{name:'thumb-up-off-alt', type:'material', size:20, color:colors.text}} title={`${item.node.rating}/${item.node.ratingAmount}`} containerStyle={{backgroundColor:'rgba(0,0,0,0)', position:'absolute', right:10, bottom:-10}} buttonStyle={{backgroundColor:'rgba(0,0,0,0)'}} titleStyle={{color:colors.text}} />
                        <Chip title={item.node.score} containerStyle={{backgroundColor:(item.node.score > 75) ? 'rgb(12, 184, 9)' : (item.node.score < 75 && item.node.score > 65) ? 'rgb(255, 145, 0)' : 'rgb(255, 0, 0)', position:'absolute', right:-5, top:-14, transform:[{scale:.85}], borderRadius:100}} buttonStyle={{backgroundColor:'rgba(255,255,255,0)'}} titleStyle={{color:colors.text, fontWeight:'bold'}} />
                        <Text style={{color:colors.text, position:'absolute', top:-20, left:50}}>{item.node.user.name}</Text>
                    </View>
                </View>
            )
        };

        return(
            <View style={{ flex: 1 }}>
                {(review.length > 0) ? 
                <FlatList
                    data={review}
                    windowSize={3}
                    renderItem={_reviewItem}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ alignSelf: 'center' }}
                    showsVerticalScrollIndicator={false}
                /> : <View style={{flex:1, justifyContent:'center'}}><Text style={{textAlign:'center', fontSize:35, fontWeight:'bold', color:colors.text}}>{`No reviews yet!${'\n'}(◕︵◕)`}</Text></View>}
            </View>
        );
    }

    return(
        <View style={{ flex: 1 }}>
            {(data.bannerImage != null) ? <Image source={{ uri: data.bannerImage }} style={{ resizeMode:'cover', width: 450, height: 200 }} /> : <Image source={{ uri: 'https://pbs.twimg.com/media/CpdHq3BXEAEFJL1.jpg:large' }} style={{ resizeMode:'cover', width: 450, height: 200 }} />}
            
            <TopTab.Navigator initialRouteName='Overview' style={{ paddingBottom: 10}} screenOptions={{
                tabBarStyle: { backgroundColor: colors.background }, tabBarScrollEnabled: true }} >
                <TopTab.Screen name='Overview' component={OverView} />
                {(data.type === 'ANIME' && data.streamingEpisodes.length > 0) ? <TopTab.Screen name='Watch' component={Watch} /> : null}
                <TopTab.Screen name='Characters' component={Characters} />
                <TopTab.Screen name='Recommendations' component={Recommendation} />
                <TopTab.Screen name='Reviews' component={Reviews} />
            </TopTab.Navigator>
        </View>
    );
}

export const InfoNav = () => {
    return(
        <Stack.Navigator screenOptions={{animationTypeForReplace:'pop', headerStyleInterpolator:HeaderStyleInterpolators.forFade}}>
            <Stack.Screen name='Info' component={InfoPage} options={{headerTransparent:true, headerMode:'float', headerTintColor:'#FFF', headerBackgroundContainerStyle:{backgroundColor:'rgba(0,0,0,.5)'}}}/>
            <Stack.Screen name='Review' component={ReviewPage} />
            <Stack.Screen name='Character' component={CharacterPage} />
            <Stack.Screen name='VA' component={VA_Page} options={{headerTitle:'Staff Info'}} />
        </Stack.Navigator>
    );
}