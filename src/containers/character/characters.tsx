import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, Animated, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Shadow } from "react-native-shadow-2";
import { AniMalType } from "../../Api/types";
import { CharacterProps } from "../types";
import { MediaHeader } from "../../Components/header/mediaHeader";
import { useTheme } from "@react-navigation/native";
import { getMediaInfo } from "../../Api";
import FastImage from 'react-native-fast-image';
import { PressableAnim } from "../../Components/animated/AnimPressable";
import { toggleFav } from "../../Api/anilist/anilist";
import { HeaderBackButton, HeaderBackground, HeaderRightButtons } from "../../Components/header/headers";

const CharacterTab = ({navigation, route}:CharacterProps) => {
    const [data, setData] = useState<AniMalType>(route.params.data);
    const { colors, dark } = useTheme();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRightButtons navigation={navigation} colors={colors} drawer />,
            headerLeft: () => <HeaderBackButton navigation={navigation} colors={colors} style={{paddingLeft:3}} />,
            // headerBackground: () => <HeaderBackground colors={colors} />,
        });
    }, [navigation, dark]);

    const toCharDetail = (charID:number, name:string) => {
        // @ts-ignore
        navigation.navigate('CharDetail', {id:charID, name:name, malId:data.anilist.idMal, type: data.anilist.type, inStack: true});
    }

    const CharItem = ({jpnVoiceActor, isFavorited, charImage, id, role, fullName, name, index}) => {
        const [isLiked, setIsLiked] = useState<boolean>(isFavorited); 
        const SIZE = [180, 260];

        const toggleLike = () => {
            const status = toggleFav(id, 'CHARACTER')
            if (status) {
                setIsLiked(!isLiked);
                const newCharacterArray = data.anilist.characters.edges;
                newCharacterArray[index].node = {...data.anilist.characters.edges[index].node, isFavourite: !isLiked};
                setData({...data, anilist: {...data.anilist, characters: {...data.anilist.characters, edges: newCharacterArray}}});
            }
        }

        return(
            <Shadow offset={[10,10]} distance={8} startColor={(isFavorited) ? 'transparent' : 'transparent'} viewStyle={{margin:10, width:SIZE[0], borderRadius:12, backgroundColor:colors.card}}>
                <PressableAnim onLongPress={() => toggleLike()} onPress={() => toCharDetail(id, fullName)} style={{justifyContent:'center', alignItems:'center', borderColor:'#000', borderRadius:12, borderBottomRightRadius:(jpnVoiceActor.length > 0 && data.anilist.type === 'ANIME') ? 0 : 12, borderBottomLeftRadius: (jpnVoiceActor.length > 0 && data.anilist.type === 'ANIME') ? 0 : 12, width: SIZE[0], height:SIZE[1]}}>
                    <FastImage source={{uri:charImage}} style={{ borderRadius:12, borderBottomLeftRadius:(data.anilist.type !== 'ANIME') ? 12 : 0, borderBottomRightRadius:(data.anilist.type !== 'ANIME') ? 12 : 0, alignSelf:'center', width:SIZE[0], height:SIZE[1]}} resizeMode={'cover'} />
                    <LinearGradient locations={[.7, .96]} colors={['transparent', (isLiked) ? 'rgba(255, 0, 0,.85)' : 'rgba(0,0,0,0.85)']} style={{position:'absolute', bottom:0, alignSelf:'center', width:'100%', height:'100%', justifyContent:'flex-end', borderRadius:(data.anilist.type !== 'ANIME') ? 12 : 0}}>
                        <Text style={{textAlign:'center', color:'#FFF', fontSize:14}}>{role}</Text>
                        <Text style={{textAlign:'center', color:'#FFF', fontWeight:'bold', fontSize:16}} numberOfLines={2}>{name}</Text>
                    </LinearGradient>
                </PressableAnim>
                {(data.anilist.type === 'ANIME') ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Pressable onPress={() => navigation.navigate('StaffDetail', {id: jpnVoiceActor[0].voiceActor.id, name: jpnVoiceActor[0].voiceActor.name.full, inStack:true})} style={{ flexDirection: 'row', justifyContent: 'space-around', height: 80, width: SIZE[0], backgroundColor: colors.card, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderWidth: 1 }}>
                            {(jpnVoiceActor[0]) ? 
                            <FastImage source={{ uri: jpnVoiceActor[0].voiceActor.image.large }} style={{ height: 78, width: 50 }} />
                            : <View style={{height:78, width:50, justifyContent:'center'}}><AntDesign name="question" size={30} color="black" /></View>}
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', color: colors.text }}>{(jpnVoiceActor[0]) ? jpnVoiceActor[0].voiceActor.name.userPreferred : 'Unknown'}</Text>
                                {(jpnVoiceActor[0]) ? <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', color: colors.text }}>
                                        {jpnVoiceActor[0].voiceActor.language}
                                    </Text>
                                </View> : null}
                            </View>
                        </Pressable>
                    </View>
                </View> : null}
            </Shadow>
        );
    }

    const handleMore = async() => {
        const resp = await getMediaInfo(data.anilist.id, ['ROLE','RELEVANCE','ID'], undefined, data.anilist.characters.pageInfo.currentPage+1, 16);
        const newCharacters = resp.res.data.data.Media.characters;
        setData({...data, anilist:{...data.anilist, characters:{...data.anilist.characters, edges: [...data.anilist.characters.edges, ...newCharacters.edges], pageInfo: newCharacters.pageInfo}}});
    }

    const keyExtractor = ({id}) => id.toString();
    const renderItem = ({ item, index }) => <CharItem {...item} index={index} />;
    const flatlistData = data.anilist.characters.edges.map((item) => {
        const jpnVoiceActor = (data.anilist.type === 'ANIME') ? item.voiceActorRoles.filter(actor => actor.voiceActor.language === 'Japanese') : [];
        return {
            isFavorited:item.node.isFavourite, 
            charImage:item.node.image.large, 
            name:item.node.name.userPreferred, 
            fullName:item.node.name.full,
            role:item.role,
            id:item.node.id,
            jpnVoiceActor:jpnVoiceActor
        };
    });
    return (
        <View>
            <MediaHeader coverImage={data.anilist.coverImage.extraLarge} />
            <Animated.FlatList
            data={flatlistData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={2}
            contentContainerStyle={{justifyContent:'space-evenly', alignItems: 'center', paddingTop: 10,}}
            onEndReached={() => (data.anilist.characters.pageInfo.hasNextPage) ? handleMore() : null}
            onEndReachedThreshold={0.4}
        />
        </View>
        
    )
}

export default CharacterTab;