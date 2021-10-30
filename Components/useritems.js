// React
import React, { memo, useEffect, useState } from 'react';
import { View, Linking, Pressable } from 'react-native';
// UI
import { Text, Button, Chip } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
// Navigation
import { useTheme, useNavigation } from '@react-navigation/native';
// Data
import { getToken } from '../Storages/getstorage';
import Markdown from 'react-native-markdown-display';
import { md, rules } from '../Utils/markdown';
import { toggleLike } from '../Data Handler/updatedata';
import { textDecider } from '../Utils/dataprocess';

export const RenderFollowing = ({item, routeName, isAuth=true}) => {
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const width = 120;
    const height = 120;
    const handlePress = () => {
        if (routeName === 'UserPage') {
            navigation.push('UserFollow', {name: item.name, avatar: item.avatar.large, routeName:routeName, id: item.id});
        } else if (routeName === 'SearchPage' || routeName === undefined) {
            navigation.push('UserSearch', {name: item.name, avatar: item.avatar.large, routeName:routeName, id: item.id});
        }
    }
    return(
        <Pressable style={{ flex: 1, alignItems: 'center' }} onPress={handlePress}>
            <View style={{elevation:8, backgroundColor:'#fff', borderRadius:8}}>
                <FastImage source={{ uri: item.avatar.large }} style={{ height: height, width: width, resizeMode: 'cover', borderRadius: 8 }} />
            </View>
            <Text style={{ color: colors.text, width: 90, textAlign: 'center' }} numberOfLines={2}>{item.name}</Text>
            {((item.isFollowing !== false || item.isFollower !== false) && isAuth === true) ?
            <View style={{ position: 'absolute', elevation:6, width: width, top: 0, alignItems: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: 'rgba(0,0,0,.6)' }}>
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
    const { colors } = useTheme();
    const width = 120;
    const height = 180;
    return(
        <View style={{flex:1, elevation:10, backgroundColor:colors.card, borderRadius:8, alignItems:'center', margin:8, maxHeight:height, maxWidth:width}}>
            <Pressable style={{height:height, width:width}} onPress={() => {navigation.push((routeName === 'UserPage' || routeName === 'UserFollow') ? 'UserFavorite' : 'SearchCharacter', {id: item.node.id, routeName:routeName})}}>
                <FastImage source={{uri:item.node.image.large}} style={{height:height, width:width, resizeMode:'cover', borderRadius:8}} />
            </Pressable>
            <View style={{ backgroundColor: 'rgba(0,0,0,.5)', justifyContent:'center', position: 'absolute', width: width, height: 38, bottom:0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                <Text style={{color:'#FFF', textAlign:'center', fontWeight:'bold', fontSize:14}}>{item.node.name.userPreferred}</Text>
            </View>
        </View>
    );
}

export const RenderActivity = ({item, routeName, token=null}) => {
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const {bottomText, topText, time, image} = textDecider(item);
    const [isLike, setIsLike] = useState(item.isLiked);
    const [likeNum, setLikeNum] = useState(item.likeCount);
    // const [showComments, setShowComment] = useState(false);

    const setLike = async() => {
        const like = await toggleLike(token, item.id);
        (like.isLiked === true) ? setIsLike(true) : setIsLike(false);
        setLikeNum(like.likeCount);
    }

    const activityGPS = () => {
        if (item.type === 'MANGA_LIST' || item.type === 'ANIME_LIST' || item.type === 'MEDIA_LIST') {
            const target = (routeName === 'UserPage') ? 'UserContent' : 'InfoSearch';
            navigation.push(target, {screen: 'Info', params: {id:item.media.id, title:{romaji: item.media.title.romaji, native: item.media.title.native, english:item.media.title.english}},});
        } else if (item.type === 'TEXT' || item.type === 'MESSAGE') {
            const target = (routeName === 'UserPage') ? 'UserFollow' : 'UserSearch';
            const data = (item.type === 'TEXT') ? item.user : item.messenger;
            navigation.push(target, {name: data.name, avatar: data.avatar.large, routeName:routeName, id: data.id})
        }
    }

    // const gottaReply = async() => {
    //     const reply = await addComment(token, item.id);
    // }

    // const Messages = () => {
    //     const replies = item.replies;
    //     return(
    //         (showComments === true) ? 
    //         <View>
    //             {replies.map((elem, index) => {return(
    //                 <View key={elem.id}>
    //                     <Text>{elem.text}</Text>
    //                 </View>
    //             )})}
    //         </View>
    //         : null
    //     );
    // }

    const RenderThis = memo(() => {
        return (
            <View style={{ flex: 1, elevation: 5, backgroundColor: colors.card, flexDirection: 'row', margin: 10, borderWidth: 1, borderRadius: 8, borderColor: colors.border }} >
                <Pressable style={{width: 80, height: 119,}} onPress={() => { activityGPS() }}>
                    <FastImage source={{ uri: image }} resizeMode='cover' style={{ width: 80, height: 119, alignSelf: 'flex-start', borderBottomLeftRadius: 6, borderTopLeftRadius: 6 }}
                         />
                </Pressable>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', paddingBottom: 10, marginLeft: 20, marginVertical: 25 }}>
                        {(topText.length > 0) ? <Text style={{ color: colors.text, fontSize: 16, textTransform: 'capitalize' }}>{topText}</Text> : null}
                        {(item['__typename'] !== 'MessageActivity' && item['__typename'] !== 'TextActivity') ? <Text style={{ color: colors.text, fontSize: 16, }} numberOfLines={1}>{bottomText}</Text> : <Markdown rules={rules} style={{ body: { color: colors.text,  }, }}>{md(bottomText)}</Markdown>}
                    </View>
                    {(typeof token === 'string') ? <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, right: 0 }}>
                        {/* <Chip icon={{ name: 'chat-bubble-outline', type: 'material', size: 20, color: colors.text }} iconRight title={item.replyCount} containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }} buttonStyle={{ backgroundColor: 'rgba(0,0,0,0)' }} titleStyle={{ color: colors.text }} /> */}
                        {(isLike === false)
                            ? <Chip icon={{ name: 'favorite-border', type: 'material', size: 20, color: colors.text }} iconRight onPress={() => setLike()} title={likeNum} containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }} buttonStyle={{ backgroundColor: 'rgba(0,0,0,0)' }} titleStyle={{ color: colors.text }} />
                            : <Chip icon={{ name: 'favorite', type: 'material', size: 20, color: 'red' }} iconRight onPress={() => setLike()} title={likeNum} containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }} buttonStyle={{ backgroundColor: 'rgba(0,0,0,0)' }} titleStyle={{ color: colors.text }} />
                        }
                    </View> : null}
                    <Text style={{ position: 'absolute', margin: 5, top: 0, right: 0, color: colors.text }}>{time}</Text>
                </View>
            </View>);
    },[]);

    return(
           <RenderThis /> 
    );
}

export const Login = () => {
    const [isToken, setToken] = useState(false);
    const { colors } = useTheme();
    const checkToken = async() => {
        const token = getToken();
        if (typeof token === 'string') setToken(token);
    }

    useEffect(() => {
        checkToken();
    },[])
    
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text h3 style={{color:colors.text}}>{`Login to Anilist`}</Text>
            <Button title='Login' buttonStyle={{backgroundColor:colors.primary, width:100}} onPress={() => {(isToken !== false) ? Linking.openURL('goraku://list') : Linking.openURL('https://anilist.co/api/v2/oauth/authorize?client_id=6419&response_type=token')}} />
        </View>
    );
}