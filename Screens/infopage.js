import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, useWindowDimensions, Pressable, FlatList, Linking, StatusBar, ToastAndroid, Alert } from 'react-native';
import { Chip, Text, Avatar, Image, Icon, Button, Badge, Overlay } from 'react-native-elements';
import RenderHTML, {HTMLContentModel, HTMLElementModel} from 'react-native-render-html';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { getOverview, getReviews } from '../api/getdata';
import { CharacterPage, copyText } from './character';
import { VA_Page } from './voiceactor';
import { getLanguage } from '../Components/storagehooks';
import { getToken } from '../api/getstorage';
import { updateFavorite, updateProgress, updateScore, updateStatus } from '../api/updatedata';
import DoubleClick from 'react-native-double-tap';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const types = ['Current', 'Planning', 'Completed', 'Dropped', 'Paused'];
const scoring = Array.from({ length: (10 - 0) / .1 + 1}, (_, i) => (i * .1).toFixed(1).replace(/\.0/g, '')).reverse();

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
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [review, setReviews] = useState();
    const [tags, setTags] = useState([]);
    const [lang, setLang] = useState('Romaji');
    const [statusVis, setStatusVis] = useState(false);
    const [progressVis, setProgressVis] = useState(false);
    const [scoreVis, setScoreVis] = useState(false);
    const [auth, setAuth] = useState(false);
    const [status, setStatus] = useState(false);
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);

    StatusBar.setBarStyle('light-content');
    const navigation  = useNavigation();
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const {id, title} = route.params;

    const fetchLang = async () => {
        const language = await getLanguage();
        setLang(language);
    }

    const getData = async() => {
        let temp = [];
        await fetchLang();
        if (Object.keys(data).length === 0) {
            const token = await getToken();
            setAuth(token);
            const content = await getOverview(id, token);
            const reviews = await getReviews(id);
            content.genres.forEach((genre, idx) => {temp = [...temp, {'name': genre}]});
            content.tags.forEach((item, index) => {temp = [...temp, {'name': item.name, 'rank': item.rank, 'description': item.description}]}); 
            setTags(temp);
            (data.length === 0) ? setData(content) : null;
            setProgress((content.mediaListEntry !== null) ? content.mediaListEntry.progress : '0');
            setScore((content.mediaListEntry !== null) ? content.mediaListEntry.score : '0');
            setStatus((content.mediaListEntry !== null) ? content.mediaListEntry.status : 'Not Added');
            setReviews(reviews.reviews.edges);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color='#00ff00' /></View>

    const OverView = () => {
        const source = {html: data.description};

        const StatusOverlay = () => {
            return(
                <Overlay isVisible={statusVis} onBackdropPress={() => setStatusVis(false)} overlayStyle={{backgroundColor:colors.card, width:width/2}}>
                    <View >
                        {types.map((item, index) =>
                            (item !== status) ? <Button key={index} title={item} titleStyle={{fontSize:20, color:colors.primary}} type='clear' onPress={() => { updateStatus(auth, id, item.toUpperCase()); setStatus(item); ToastAndroid.show(`Updated to ${item}!`, ToastAndroid.SHORT); setStatusVis(false); }} /> : null
                        )}
                    </View>
                </Overlay>
            );
        }

        const ProgressOverlay = () => {
            const numbers = Array.from(new Array(data.type === 'ANIME' ? data.episodes + 1 : data.chapters + 1).keys());
            const random = Array.from(new Array(500).keys());
            const _renderProgress = ({item}) => {
                return(
                    <View style={{flex:1, justifyContent:'center', alignContent:'center', margin:5}}>
                        <Button 
                        title={(item !== 0) ? item : '0'} 
                        onPress={() => {updateProgress(auth,id,item); setProgress(item); setProgressVis(false);}} 
                        buttonStyle={{borderRadius:8, height:80, backgroundColor:colors.primary}} 
                        />
                    </View>
                );
            }

            return(
                <Overlay isVisible={progressVis} onBackdropPress={() => setProgressVis(false)} fullScreen={true} overlayStyle={{backgroundColor:colors.card}}>
                    <Text h3 style={{color:colors.text}}>Progress</Text>
                    <Button icon={{name:'close', type:'material', size:20}} onPress={() => setProgressVis(false)} titleStyle={{color:'#000'}} type='clear' containerStyle={{position:'absolute', top:0, right:0, padding:8, borderRadius:8}} />
                    <FlatList style={{marginTop:25}} windowSize={3} data={(data.episodes === null && data.chapters === null) ? random : numbers} numColumns={3} renderItem={_renderProgress} keyExtractor={(item, index) => index.toString()} showsVerticalScrollIndicator={false} />
                </Overlay>
            );
        }

        const ScoreOverlay = () => {
            return(
                <Overlay isVisible={scoreVis} onBackdropPress={() => setScoreVis(false)} overlayStyle={{backgroundColor:colors.card, width:width/2, height:180}}>
                    <FlatList data={scoring} renderItem={({item, index}) => <Button title={item} titleStyle={{color:colors.primary}} type='clear' buttonStyle={{borderRadius:width/2}} onPress={() => {updateScore(auth, id, Number(item)); setScore(item); setScoreVis(false);}} />} keyExtractor={(item, index) => index.toString()} showsVerticalScrollIndicator={false} />
                </Overlay>
            );
        }

        const _tagInfo = ({item}) => {
            return(
                <View style={{marginVertical:5}}>
                    <Chip 
                    title={`${item.name} ${item.rank !== undefined ? item.rank+'%' : '' }`} 
                    buttonStyle={{backgroundColor:colors.primary}} 
                    containerStyle={{ marginHorizontal: 2, marginVertical: 5, paddingTop: 5 }} 
                    onLongPress={() => (typeof item.description === 'string') ? Alert.alert('What\'\s this?', item.description) : null}
                    />
                </View>
            );
        }

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
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{(lang === 'Native') ? item.node.name.native : item.node.name.full}</Text>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.role}</Text>
                    </View>
                </View>
            );
        }

        return(
            <View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Pressable onLongPress={() => {copyText(title.romaji)}}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', flexWrap: 'wrap', color: colors.text, textAlign: 'center' }}>{(lang === 'Native') ? title.native : title.romaji}</Text>
                    </Pressable>
                    {(auth !== false) ? <ScrollView>
                        <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:5, borderRadius:10, borderColor:colors.border, height:65}}>
                            <View style={{flex:1, flexDirection:'column', marginHorizontal:5,}}>
                                <Text style={{textAlign:'center', color:colors.text}}>Status</Text>
                                <Button title={(status !== 'Not Added') ? status : 'Not Added'} onPress={() => setStatusVis(true)} titleStyle={{color:colors.text}} buttonStyle={{borderColor:colors.primary}} type='outline' />
                            </View>
                            <View style={{flex:1, flexDirection:'column', marginHorizontal:5,}}>
                                <Text style={{textAlign:'center', color:colors.text}}>Progress</Text>
                                <Button title={`${progress}/${(data.type === 'ANIME') ? ((data.episodes !== null) ? data.episodes : '?' ) : ((data.chapters !== null) ? data.chapters : '?' )}`} onPress={() => setProgressVis(true)} titleStyle={{color:colors.text}} buttonStyle={{borderColor:colors.primary}} type='outline' />
                            </View>
                            <View style={{flex:1, flexDirection:'column', marginHorizontal:5,}}>
                                <Text style={{textAlign:'center', color:colors.text}}>Score</Text>
                                <Button title={(score !== 0) ? score : '0'} titleStyle={{color:colors.text}} buttonStyle={{borderColor:colors.primary}} type='outline' onPress={() => setScoreVis(true)} />
                            </View>
                        </View>
                    </ScrollView> : null}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginHorizontal:5, borderWidth:1, borderColor: colors.border, marginTop:5}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', height: 60 }}>
                            <SectionInfo header='FORMAT' info={data.format} style={{ textTransform: (data.format !== 'TV') ? 'capitalize' : 'none', textAlign: 'center', color: colors.text }} />
                            {(data.meanScore !== null) ? <SectionInfo header='SCORE' info={`${data.meanScore}%`} style={{ textAlign: 'center', color: (data.meanScore >= 75) ? 'green' : (data.meanScore < 75 && data.meanScore >= 65) ? 'orange' : 'red' }} /> : null}
                            {(data.status !== null) ? <SectionInfo header='STATUS' info={(data.status === 'NOT_YET_RELEASED') ? data.status.replaceAll('_', ' ') : data.status} style={{ textTransform: 'capitalize', textAlign: 'center', color: colors.text }} /> : null}
                            {(data.nextAiringEpisode !== null) ?<SectionInfo header='NEXT EP' info={`${(data.nextAiringEpisode.timeUntilAiring / 86400).toFixed(1)} days`} /> : null}
                            {(data.type === 'MANGA') ? <SectionInfo header='VOLUMES' info={(data.volumes !== null) ? data.volumes : 'N/A'} /> : null}
                            {(data.type === 'MANGA') ? <SectionInfo header='CHAPTERS' info={(data.chapters !== null) ? data.chapters : 'N/A'} /> : null}
                            {(data.episodes !== null) ? <SectionInfo header='EPISODES' info={data.episodes} /> : null}
                            {(data.source !== null) ? <SectionInfo header='SOURCE' info={data.source.replaceAll('_', ' ').toLowerCase()} style={{ textTransform:'capitalize', textAlign: 'center', color: colors.text }} /> : null}
                            <SectionInfo header='DATE' info={`${(data.startDate.month !== null) ? data.startDate.month : '?'}/${ (data.startDate.day !== null) ? data.startDate.day : '?'}/${(data.startDate.year !== null) ? data.startDate.year : '?'} - ${`${(data.endDate.year !== null) ? `${data.endDate.month}/${data.endDate.day}/${data.endDate.year}` : 'Present'}`}`} />
                            {(data.studios.edges.length > 0) ? <SectionInfo header='STUDIO' info={data.studios.edges[0].node.name} /> : null}
                            {(title.english !== null) ? <SectionInfo header='ENGLISH TITLE' info={title.english} /> : null}
                        </View>
                    </ScrollView>
                    <FlatList data={tags} horizontal={true} keyExtractor={(item, index) => index.toString()} renderItem={_tagInfo} showsHorizontalScrollIndicator={false} contentContainerStyle={{marginLeft:5}}/>
                    <View>
                        <FlatList
                            data={data.relations.edges}
                            windowSize={3}
                            horizontal={true}
                            maxToRenderPerBatch={3}
                            renderItem={_relatedMedia}
                            style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 5 }}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ alignSelf: 'center', marginLeft:5 }}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    <View>
                        <Text h3 style={{ color: colors.text, paddingLeft:5 }}>Staff</Text>
                        <FlatList data={data.staff.edges} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={_staff} contentContainerStyle={{marginLeft:5}} /> 
                    </View>
                    {(data.trailer !== null) ?
                    <View>
                        <Text h3 style={{ color: colors.text, paddingLeft:5 }}>Trailer</Text>
                        <View>
                            <Image source={{uri:data.trailer.thumbnail}} resizeMode='cover' style={{height:250, width:width}} />
                            <Icon name='play-circle-filled' color='rgba(0,0,0,.7)' onPress={() => {(data.trailer.site === 'youtube') ? Linking.openURL(`vnd.youtube://${data.trailer.id}`) : Linking.openURL(`https://www.dailymotion.com/video/${data.trailer.id}`)}} type='material' size={70} containerStyle={{position:'absolute', alignSelf:'center', bottom:250/2 -40}}/>
                        </View>
                    </View> : null}
                    {(data.externalLinks.length > 0) ? <Text h3 style={{ color: colors.text, paddingLeft:5 }}>External Sites</Text> : null}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {data.externalLinks.map((elem) => <Button key={elem.id} title={elem.site} containerStyle={{margin:4, borderRadius:8}} buttonStyle={{backgroundColor:'#E50914'}} onPress={() => {Linking.openURL(elem.url)}} />)}
                    </ScrollView>
                    {(data.description !== '') ? <Text h3 style={{ color: colors.text, paddingLeft:5 }}>Description</Text> : null}
                    <RenderHTML baseStyle={{color:colors.text, paddingLeft:5}} contentWidth={width} source={source} />
                </ScrollView>
                <StatusOverlay />
                <ProgressOverlay />
                <ScoreOverlay />
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

    const CharacterItem = ({ item }) => {
        const [liked, setLiked] = useState(false);

        useEffect(() => {
            if (item.node.isFavourite === true) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }, []);

        const handleLike = async() => {
            if (liked === true) {
                updateFavorite(auth, item.node.id);
                setLiked(false);
            } else if (liked === false) {
                updateFavorite(auth, item.node.id);
                setLiked(true);
            }
        }

        return (
            <View style={{ margin:5 }}>
                <DoubleClick delay={300} singleTap={() => {navigation.navigate('Character', {id: item.node.id, actor: item.voiceActors})}} doubleTap={handleLike} >
                    <Image source={{ uri: item.node.image.large }} style={{ resizeMode: 'cover', width: 180, height: 230, borderRadius: 8 }}>
                        <View style={{ position:'absolute', backgroundColor: 'rgba(0,0,0,.5)', bottom:0, width: 180, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                            <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{(lang === 'Native') ? item.node.name.native : item.node.name.full}</Text>
                            <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.role}</Text>
                        </View>
                    </Image>
                </DoubleClick>
                {(liked === true) ? <Icon name='favorite' color='red' type='material' size={26} containerStyle={{position:'absolute', top:0, right:0}} /> : null}
            </View>
        )
    }

    const Characters = () => {
        const [characters, setCharacters] = useState(data.characters.edges);
        const [page, setPage] = useState(data.characters.pageInfo);
        const [refresh, setRefresh] = useState(false);
        const moreCharacters = async() => {
            if (page.hasNextPage === true) {
                const content = await getOverview(id, auth, page.currentPage + 1);
                setCharacters([...characters, ...content.characters.edges]);
                setPage(content.characters.pageInfo);
            }
        }

        const onRefresh = async() => {
            setRefresh(true);
            const content = await getOverview(id, auth, 1);
            setCharacters(content.characters.edges);
            setPage(content.characters.pageInfo);
            setRefresh(false);
        }

        return(
            <FlatList
                data={characters}
                numColumns={2}
                columnWrapperStyle={{paddingBottom:5}}
                windowSize={3}
                renderItem={({item}) => (<CharacterItem item={item}/>) }
                style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 10 }}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ alignSelf: 'center', paddingBottom:20 }}
                showsVerticalScrollIndicator={false}
                onEndReached={moreCharacters}
                onEndReachedThreshold={.2}
                onRefresh={onRefresh}
                refreshing={refresh}
            />
        );
    }

    const Recommendation = () => {
        const [refresh, setRefresh] = useState(false);
        const [rec, setRec] = useState(data.recommendations.edges);

        const onRefresh = async() => {
            setRefresh(true);
            const content = await getOverview(id, auth);
            setRec(content.recommendations.edges);
            setRefresh(false);
        }

        const _recommendedItem = ({ item }) => {
            return (
                <Pressable style={{ margin:5 }} onPress={() => {navigation.push('Info', {id:item.node.mediaRecommendation.id, title:item.node.mediaRecommendation.title})}}>
                    <Image source={{ uri: item.node.mediaRecommendation.coverImage.extraLarge }} style={{ resizeMode: 'cover', width: 180, height: 230, borderRadius: 8 }}>
                        <View style={{ position:'absolute', backgroundColor: 'rgba(0,0,0,.7)', justifyContent:'center', bottom:0, width: 180, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                            <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={2}>{(lang === 'Native') ? item.node.mediaRecommendation.title.native : item.node.mediaRecommendation.title.romaji}</Text>
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
                    {(item.node.mediaRecommendation.mediaListEntry !== null) ? 
                    <View style={{position:'absolute', top:0, left:0, borderRadius:8, backgroundColor:'rgba(0,0,0,.6)', justifyContent:'center', height:230, width:180}}>
                        <Text style={{color:'#FFF', textAlign:'center', fontWeight:'bold', fontSize:16}}>{item.node.mediaRecommendation.mediaListEntry.status}</Text>
                    </View> 
                    : null}
                </Pressable>
            )
        };

        return(
            <View style={{ flex: 1 }}>
                <FlatList
                    data={rec}
                    numColumns={2}
                    columnWrapperStyle={{paddingBottom:5}}
                    windowSize={3}
                    renderItem={_recommendedItem}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ alignSelf: 'center', paddingBottom:20 }}
                    showsVerticalScrollIndicator={false}
                    refreshing={refresh}
                    onRefresh={onRefresh}
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
            {(data.bannerImage != null) ? <Image source={{ uri: data.bannerImage }} style={{ resizeMode:'cover', width: 450, height: 180 }} /> : <Image source={{ uri: 'https://pbs.twimg.com/media/CpdHq3BXEAEFJL1.jpg:large' }} style={{ resizeMode:'cover', width: 450, height: 200 }} />}
            <TopTab.Navigator initialRouteName='Overview' screenOptions={{
                tabBarStyle: { backgroundColor: colors.background }, tabBarScrollEnabled: true}} >
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
            <Stack.Screen name='VA' component={VA_Page} options={{headerTitle:'Staff'}} />
        </Stack.Navigator>
    );
}