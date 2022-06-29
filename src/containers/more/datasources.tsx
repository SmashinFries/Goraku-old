import { useTheme } from "@react-navigation/native";
import { openURL } from "expo-linking";
import React, { ReactComponentElement } from "react";
import { FlatList, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { PressableAnim } from "../../Components";
import { AnilistSVG, AnimeThemesSVG, MalSVG, } from "../../Components/svg/svgs";

type Source = {
    id: number;
    source: string;
    description: string;
    url: string;
    color: string;
    logo?: ReactComponentElement<any>;
    license?: string;
}
const Sources:Source[] = [
    {
        id:1,
        source: 'Anilist',
        description: 'Majority of data comes from Anilist. It is likely that this is the source if the content in question is not listed below.',
        url: 'https://anilist.co',
        color: 'rgb(60,180,242)',
        logo: <AnilistSVG color={'#FFF'} />
    },
    {
        id:2,
        source: 'MyAnimeList',
        description: 'Scores, extra images, and background info are all fetched from MAL using the Jikan API.\n\nNOTE: Sometimes data is not found due to not having a provided MAL ID. Character images could be missing due to this.',
        url: 'https://myanimelist.net',
        color: '#2A50A3',
        license: 'https://github.com/jikan-me/jikan-rest/blob/master/LICENSE',
        logo: <MalSVG color={'#FFF'} height={24} width={24} />
    },
    {
        id:3,
        source: 'trace.moe',
        description: 'trace.moe provides a way to search anime by image.',
        color: '#000',
        url: 'https://trace.moe/',
        logo: <FastImage source={{uri:'https://trace.moe/favicon128.png'}} style={{height:20, width:20}} />
    },
    {
        id:4,
        source: 'AnimeThemes.moe',
        description: 'AnimeThemes.moe provides anime openings and endings.',
        color: 'red',
        url: 'https://staging.animethemes.moe/wiki',
        logo: <FastImage source={{ uri: 'https://staging.animethemes.moe/wiki/favicon-32x32.png'}} style={{height:20, width:20}} />
    }
]


const DataSources = () => {
    const { colors, dark } = useTheme();
    const renderItem = ({item}:{item:Source}) => {
        return(
            <View style={{paddingVertical:20, borderRadius:12, borderColor:colors.border, paddingLeft:15, backgroundColor:colors.card}}>
                <View style={{position:'absolute', flexDirection:'row', justifyContent:'center', alignSelf:'center', top:-10, alignItems:'center', borderRadius:16, backgroundColor:item.color, borderWidth:(item.color === '#000') ? 1 : 0, width:220}}>
                    {item.logo ?? null}
                    <Text style={{color:(item.color === '#000') ? '#FFF' : colors.text, fontSize:18, paddingLeft:(item.logo) ? 10 : 0}}>{item.source}</Text>
                </View>
                <Text style={{color:colors.text, paddingTop:20}}>
                    {item.description}
                </Text>
                <PressableAnim onPress={() => openURL(item.url)} style={{backgroundColor: colors.background, borderColor:(item.color === '#000' && dark) ? '#FFF' : item.color, borderWidth:1, alignSelf:'center', marginTop:20, justifyContent:'center', width:150, height:30, borderRadius:12}}>
                    <Text style={{textAlign:'center', fontSize:16, color:(item.color === '#000' && dark) ? '#FFF' : colors.text}}>Visit Site</Text>
                </PressableAnim>
            </View>
        );
    }
    return(
        <FlatList 
            data={Sources}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={{height:20}}/>}
            contentContainerStyle={{marginHorizontal:25, paddingVertical:25}}
        />
    );
}

export default DataSources;