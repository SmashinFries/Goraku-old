// React
import React, { useEffect, useState } from 'react';
import { View, ScrollView, useWindowDimensions, Pressable, FlatList, Linking, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
// UI
import { Chip, Text, Avatar, Image, Icon, Button, Overlay } from 'react-native-elements';
// Navigation
import { useTheme, useNavigation } from '@react-navigation/native';
// Components
import DoubleClick from 'react-native-double-tap';
import { _ContentTile } from '../Components/customtile';
import Video from 'react-native-video';
import YoutubeIframe from 'react-native-youtube-iframe';
import FastImage from 'react-native-fast-image';
// Data
import { getOverview, getStudio } from '../Data Handler/getdata';
import { copyText } from '../Screens/character';
import { deleteEntry, updateFavorite, updateProgress, updateScore, updateStatus } from '../Data Handler/updatedata';
import Markdown from 'react-native-markdown-display';
import { md, rules } from '../Utils/markdown';

const scoring = Array.from({ length: (10 - 0) / .1 + 1}, (_, i) => (i * .1).toFixed(1).replace(/\.0/g, '')).reverse();

export const SectionInfo = ({header, info, style=null}) => {
    const { colors } = useTheme();
    const displayText = (info !== null) ? info : 'Unknown';
    return(
        <Pressable onLongPress={() => {copyText(displayText)}} style={{ justifyContent: 'center', margin: 5 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color:colors.text}}>{header}</Text>
            <Text style={(style === null) ? { textAlign: 'center', color:colors.text} : style}>{displayText}</Text>
        </Pressable>
    );
}

export const Studio = ({route}) => {
    const { id, token, routeName, name } = route.params;
    const [data, setData] = useState([]);
    const [page, setPage] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    
    useEffect(() => {
        let mounted = true;
        getStudio(id, token, 1).then(studio => {
            if(mounted) {
                setData(studio.media.nodes);
                setPage(studio.media.pageInfo);
                setLoading(false);
            }
        });
        return () => {mounted = false};
    },[]);

    const onRefresh = async() => {
        setRefresh(true);
        const studio = await getStudio(id, token, 1);
        setData(studio.media.nodes);
        setPage(studio.media.pageInfo);
        setRefresh(false);
    }

    const fetchMore = async() => {
        if (page.hasNextPage === true) {
            const newData = await getStudio(id, token, page.currentPage + 1);
            setData([...data, ...newData.media.nodes]);
            setPage(newData.media.pageInfo);
        }
    }

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        <View style={{flex:1}}>
            <FlatList
                data={data}
                renderItem={({item}) => <_ContentTile item={item} routeName={routeName} token={token} isSearch={true} />}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.4}
                refreshing={refresh}
                onRefresh={onRefresh}
                numColumns={2}
                columnWrapperStyle={{marginVertical:5}}
                contentContainerStyle={{paddingVertical:10}}
            />
        </View>
    );
}

export const OverView = ({route}) => {
    const {data, auth, id, tags, lang, routeName} = route.params;
    const types = ['Current', 'Planning', 'Completed', 'Repeating', 'Dropped', 'Paused', ... (data.mediaListEntry !== null) ? ['Remove'] : []];
    const [status, setStatus] = useState((data.mediaListEntry !== null) ? data.mediaListEntry.status : 'Not Added');
    const [progress, setProgress] = useState((data.mediaListEntry !== null) ? data.mediaListEntry.progress : '0');
    const [score, setScore] = useState((data.mediaListEntry !== null) ? data.mediaListEntry.score : '0');
    const [statusVis, setStatusVis] = useState(false);
    const [progressVis, setProgressVis] = useState(false);
    const [scoreVis, setScoreVis] = useState(false);
    const [entryID, setEntryID] = useState((data.mediaListEntry !== null) ? data.mediaListEntry.id : null);

    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();

    const syn = data.synonyms;
    syn.toString();

    const updateContent = async(item) => {
        if (item === 'Remove') {
            const removed = deleteEntry(auth, entryID);
            setStatus('Not Added');
            setStatusVis(false);
        } else {
            const newItem = await updateStatus(auth, id, item.toUpperCase()); 
            setEntryID(newItem.id);
            setStatus(item); 
            setStatusVis(false);
        }
        
    }
    const StatusOverlay = () => {
        if (status === 'Not Added') {
            const index = types.indexOf('Remove');
            if (index > -1) {
                types.splice(index, 1);
            }
        } else {
            if (types.indexOf('Remove') < 0) {
                types.push('Remove');
            }
        }
        return(
            <Overlay isVisible={statusVis} onBackdropPress={() => setStatusVis(false)} overlayStyle={{backgroundColor:colors.card, width:width/2}}>
                <View >
                    {types.map((item, index) =>
                        (item !== status) ? <Button key={index} title={item} titleStyle={{fontSize:20, color:colors.primary}} type='clear' containerStyle={{paddingVertical:5}} onPress={() => {updateContent(item)}} /> : null
                    )}
                </View>
            </Overlay>
        );
    }

    const ProgressOverlay = () => {
        const numbers = Array.from(new Array(data.type === 'ANIME' ? data.episodes + 1 : data.chapters + 1).keys());
        const random = Array.from(new Array((progress < 1500) ? 1500 : progress+100).keys());
        const _renderProgress = ({item}) => {
            return(
                <View style={{flex:1, justifyContent:'center', alignContent:'center', margin:5}}>
                    <Button 
                    title={(item !== 0) ? item : '0'} 
                    onPress={() => {updateProgress(auth,id,item); setProgress(item); setProgressVis(false);}} 
                    buttonStyle={{borderRadius:8, height:80, backgroundColor:(progress >= item) ? colors.primary : 'blue'}} 
                    />
                </View>
            );
        }

        return(
            <Overlay isVisible={progressVis} onBackdropPress={() => setProgressVis(false)} fullScreen={true} overlayStyle={{ backgroundColor: colors.card }}>
                <Text h3 style={{ color: colors.text }}>Progress</Text>
                <Button icon={{ name: 'close', type: 'material', size: 20, color: colors.text }} onPress={() => setProgressVis(false)} titleStyle={{ color: '#000' }} type='clear' containerStyle={{ position: 'absolute', top: 0, right: 0, padding: 8, borderRadius: 8 }} />
                <FlatList style={{ marginTop: 25 }} windowSize={3} data={(data.episodes === null && data.chapters === null) ? random : numbers} numColumns={3} renderItem={_renderProgress} keyExtractor={(item, index) => index.toString()} showsVerticalScrollIndicator={false} />
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
            <View style={{ paddingRight: 10,}}>
                <Pressable style={{width: 125, height: 180,}} onPress={() => {navigation.push('Info', {id:item.node.id, title:item.node.title})}} >
                    <FastImage source={{ uri: item.node.coverImage.extraLarge }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}/>
                </Pressable>
                <View style={{ backgroundColor: 'rgba(0,0,0,.6)', justifyContent:'center', position: 'absolute', width: 125, height: 30, bottom:0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                    <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.relationType}</Text>
                </View>
            </View>
        );
    }

    const _staff = ({ item }) => {
        return(
            <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 10}}>
                <Pressable style={{width: 125, height: 180,}} onPress={() => {navigation.push('VA', {id:item.node.id, role:item.role, routeName:routeName.name})}}>
                    <FastImage source={{ uri: item.node.image.large }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}/>
                </Pressable>
                <View style={{ backgroundColor: 'rgba(0,0,0,.6)', position: 'absolute', width: 125, height: 40, top: 145, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                    <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{(lang === 'Native') ? item.node.name.native : item.node.name.full}</Text>
                    <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.role}</Text>
                </View>
            </View>
        );
    }

    const navStudio = () => {
        navigation.push('Studio', {id:data.studios.nodes[0].id, token:auth, routeName:routeName, name:data.studios.nodes[0].name});
    }

    return(
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Pressable onLongPress={() => {copyText(data.title.romaji)}}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', flexWrap: 'wrap', color: colors.text, textAlign: 'center' }}>{(lang === 'Native') ? data.title.native : data.title.romaji}</Text>
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
                        {(data.duration !== null) ? <SectionInfo header='LENGTH' info={(data.duration < 60) ? `${data.duration} min` : `${(data.duration / 60).toFixed(1)} hrs`} /> : null}
                        {(data.source !== null) ? <SectionInfo header='SOURCE' info={data.source.replaceAll('_', ' ').toLowerCase()} style={{ textTransform:'capitalize', textAlign: 'center', color: colors.text }} /> : null}
                        <SectionInfo header='DATE' info={`${(data.startDate.month !== null) ? data.startDate.month : '?'}/${ (data.startDate.day !== null) ? data.startDate.day : '?'}/${(data.startDate.year !== null) ? data.startDate.year : '?'} - ${`${(data.endDate.year !== null) ? `${data.endDate.month}/${data.endDate.day}/${data.endDate.year}` : 'Present'}`}`} />
                        {(data.title.english !== null) ? <SectionInfo header='ENGLISH TITLE' info={data.title.english} /> : (data.title.english === null && syn.length > 0) ? <SectionInfo header='SYNONYMS' info={syn} /> : null}
                    </View>
                </ScrollView>
                <FlatList data={tags} horizontal={true} keyExtractor={(item, index) => index.toString()} renderItem={_tagInfo} showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginHorizontal: 5 }} />
                <View>
                    <FlatList
                        data={data.relations.edges}
                        windowSize={3}
                        horizontal={true}
                        maxToRenderPerBatch={3}
                        renderItem={_relatedMedia}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ alignSelf: 'center', marginLeft:5 }}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View>
                    <Text h3 style={{ color: colors.text, paddingLeft:5 }}>Staff</Text>
                    <FlatList data={data.staff.edges} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={_staff} contentContainerStyle={{marginLeft:5}} /> 
                </View>
                {(data.studios.nodes.length > 0) ? <Text h3 style={{ color: colors.text, paddingLeft:5 }}>Studio</Text> : null}
                {(data.studios.nodes.length > 0) ? <Button title={data.studios.nodes[0].name} onPress={navStudio} titleStyle={{fontWeight:'bold'}} buttonStyle={{borderRadius:8, backgroundColor:colors.primary}} containerStyle={{marginHorizontal:5}} /> : null}
                {(data.trailer !== null) ?
                <View>
                    <Text h3 style={{ color: colors.text, paddingLeft:5 }}>Trailer</Text>
                    {(data.trailer.site === 'youtube') ? <YoutubeIframe webViewStyle={{opacity:0.99}} play={false} height={250} videoId={data.trailer.id} /> : <Video source={{uri: `https://www.dailymotion.com/video/${data.trailer.id}`}} style={{height:250, width:width}} paused={true} />}
                </View> : null}
                {(data.externalLinks.length > 0) ? <Text h3 style={{ color: colors.text, paddingLeft:5 }}>External Sites</Text> : null}
                {(data.externalLinks.length > 0) ? <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {data.externalLinks.map((elem) => <Button key={elem.id} title={elem.site} containerStyle={{margin:4, borderRadius:8}} buttonStyle={{backgroundColor:'#E50914'}} onPress={() => {Linking.openURL(elem.url)}} />)}
                </ScrollView> : null }
                {(data.description !== null) ? <Text h3 style={{ color: colors.text, paddingLeft:5 }}>Description</Text> : null}
                {(data.description !== null) ? <Markdown rules={rules} style={{body: {color:colors.text, marginHorizontal:5}}}>{md(data.description)}</Markdown> : null}
            </ScrollView>
            <StatusOverlay />
            <ProgressOverlay />
            <ScoreOverlay />
        </View>
    );
}

export const CharacterItem = ({ item, auth, lang, routeName }) => {
    const [liked, setLiked] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        let mounted = true;
        if (mounted)
            if (item.node.isFavourite === true) {
                setLiked(true);
            } else {
                setLiked(false);
            };
        return () => mounted = false;
    }, []);

    const handleLike = async() => {
        if (liked === true && typeof auth === 'string') {
            updateFavorite(auth, item.node.id);
            setLiked(false);
        } else if (liked === false && typeof auth === 'string') {
            updateFavorite(auth, item.node.id);
            setLiked(true);
        }
    }

    return (
        <View style={{ margin:5 }}>
            <DoubleClick delay={300} singleTap={() => {navigation.push('Character', {id: item.node.id, routeName:routeName.name})}} doubleTap={handleLike} >
                <FastImage source={{ uri: item.node.image.large }} style={{ resizeMode: 'cover', width: 180, height: 230, borderRadius: 8 }}>
                    <View style={{ position:'absolute', backgroundColor: 'rgba(0,0,0,.5)', bottom:0, width: 180, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{(lang === 'Native') ? item.node.name.native : item.node.name.full}</Text>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.role}</Text>
                    </View>
                </FastImage>
            </DoubleClick>
            {(liked === true) ? <Icon name='favorite' color='red' type='material' size={26} containerStyle={{position:'absolute', top:0, right:0}} /> : null}
        </View>
    )
}

export const Characters = ({route}) => {
    const {data, id, auth, lang, routeName} = route.params;
    const [characters, setCharacters] = useState(data.characters.edges);
    const [page, setPage] = useState(data.characters.pageInfo);
    const [refresh, setRefresh] = useState(false);

    const { colors } = useTheme();
    const navigation = useNavigation();

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
        (characters.length > 0) ? <FlatList
            data={characters}
            numColumns={2}
            columnWrapperStyle={{paddingBottom:5}}
            windowSize={3}
            renderItem={({item}) => (<CharacterItem item={item} auth={auth} lang={lang} routeName={routeName}/>) }
            style={{flex:1, paddingBottom: 10, paddingTop: 10 }}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ alignSelf: 'center', paddingBottom:20 }}
            showsVerticalScrollIndicator={false}
            onEndReached={moreCharacters}
            onEndReachedThreshold={.2}
            onRefresh={onRefresh}
            refreshing={refresh}
        /> : <View style={{flex:1, justifyContent:'center'}}><Text style={{textAlign:'center', fontSize:35, fontWeight:'bold', color:colors.text}}>{`No characters yet!${'\n'}(◕︵◕)`}</Text></View>
);
}

export const Watch = ({route}) => {
    const { data } = route.params;
    const { width, height } = useWindowDimensions();
    const _episodeItem = ({item}) => {
        return (
            <View style={{paddingTop:10, paddingBottom:5}}>
                <Image transition={true} source={{uri:item.thumbnail}} style={{resizeMode:'cover', width:width-25, height: 150, borderRadius:8}} onPress={()=>{Linking.openURL(item.url)}}/>
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

export const Recommendation = ({route}) => {
    const { data, id, auth, routeName } = route.params;
    const [refresh, setRefresh] = useState(false);
    const [rec, setRec] = useState(data);

    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();

    const onRefresh = async() => {
        setRefresh(true);
        const content = await getOverview(id, auth);
        setRec(content.recommendations.edges);
        setRefresh(false);
    }

    return(
        (data.length > 0) ?
            <FlatList
                data={rec}
                numColumns={2}
                windowSize={3}
                renderItem={({item}) => <_ContentTile item={item} routeName={routeName} token={auth} isSearch={false} isNode={true} size={[width / 2, height / 2.9]} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingVertical:15}}
                columnWrapperStyle={{paddingBottom:10}}
                showsVerticalScrollIndicator={false}
                refreshing={refresh}
                onRefresh={onRefresh}
            />
        : <View style={{flex:1, justifyContent:'center'}}><Text style={{textAlign:'center', fontSize:30, fontWeight:'bold', color:colors.text}}>{`No recommendations yet!${'\n'}(◕︵◕)`}</Text></View>
    );
}

export const ReviewPage = ({route}) => {
    const body = route.params;
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const MarkedBody = () => {return(<Markdown rules={rules} style={{ body: { color: colors.text } }}>{md(body)}</Markdown>);}

    return(
        <View>
            <ScrollView contentContainerStyle={{ alignSelf: 'center', width: width - 10 }}>
                <MarkedBody />
            </ScrollView>
        </View>
    );
}

export const Reviews = ({route}) => {
    const { review } = route.params;

    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();

    const _reviewItem = ({item}) => {
        return (
            <View style={{paddingBottom:20, paddingTop:30, paddingLeft:10, width:width, alignItems:'center', elevation:8}}>
                <View style={{flex:1, justifyContent:'center', paddingLeft:20, borderStyle: 'solid', borderWidth: 1, borderRadius: 12, height:100, width:width-70, backgroundColor:'rgba(255, 255, 255, .15)', borderColor:colors.text}}>
                    <Text style={{paddingLeft:35, paddingRight:5, color:colors.text}} onPress={() => {navigation.navigate('Review', item.node.body)}}>{item.node.summary}</Text>
                    <Avatar rounded source={{uri:item.node.user.avatar.large}} size='large' containerStyle={{elevation:15, position:'absolute', bottom:45, left:-30, borderColor:colors.text, borderWidth:1, backgroundColor:colors.card}}/>
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