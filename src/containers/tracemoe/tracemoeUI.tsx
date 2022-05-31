import { useNavigation, useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, useWindowDimensions, ViewStyle, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { MoeData } from "../../Api/types";
import { PressableAnim } from "../../Components/animated/AnimPressable";

type ItemProp = {
    anime: MoeData;
    dimensions: {
        width: number;
        height: number;
    }
}

type EpisodeProps = {
    episode: number|string;
    styles?: ViewStyle;
    color?: string;
}
const EpisodeTag = ({episode, color, styles}:EpisodeProps) => {
    return(
        <View style={[styles,{height:25, paddingHorizontal:10, justifyContent:'center', alignItems:'center', borderRadius:8, flexDirection:'row'}]}>
            <MaterialIcons name="personal-video" size={18} color={color ?? '#FFF'} />
            {(episode) ? <Text style={{color:'#FFF', fontSize:16, marginLeft:5}}>{episode}</Text> : null}
        </View>
    )
}

type SimProps = {
    percentage: string;
    color: string;
    styles?: ViewStyle;
}
const SimilarityTag = ({percentage, color, styles}:SimProps) => {
    return(
        <View style={[styles,{height:25, minWidth:80, backgroundColor:color, marginHorizontal:5, justifyContent:'center', alignItems:'center', borderRadius:8, flexDirection:'row'}]}>
            <MaterialCommunityIcons name="water-percent" size={22} color="#000" />
            {(percentage) ? <Text style={{color:(color === 'yellow') ? 'black' : 'white', fontSize:16}}>{percentage}</Text> : null}
        </View>
    )
}

type TimeTagProps = {
    from: number;
    to: number;
    color: string;
    styles?: ViewStyle;
}
const TimeTag = ({from, to, color, styles}:TimeTagProps) => {
    return(
        <View style={[styles,{height:25, paddingHorizontal:10, backgroundColor:color, justifyContent:'center', alignItems:'center', borderRadius:8, flexDirection:'row'}]}>
            <MaterialIcons name="access-time" size={18} color={'#FFF'} />
            {(from) ? <Text style={{color:'#FFF', fontSize:16, marginLeft:5}}>{(from / 60).toFixed(2)} - {(to / 60).toFixed(2)}</Text> : null}
        </View>
    );
}

const MoeRenderItem = ({anime, dimensions}:ItemProp) => {
    const { width, height } = dimensions;
    const { colors } = useTheme();
    const nav = useNavigation<any>();
    const borderRadius = {borderRadius:12};
    if (anime.anilist.isAdult) return null;
    return(
            <PressableAnim onPress={() => nav.navigate('Info', {id:anime.anilist.id, type:'ANIME'})} style={{ backgroundColor: 'rgba(0,0,0,.5)', ...borderRadius, marginVertical:10, marginHorizontal:'5%', width:(width*90)/100, height: 190 }} >
                <FastImage source={{uri: anime.image}} style={{width: '100%', height: '100%', ...borderRadius}} resizeMode={'cover'} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,.85)']} locations={[.75, 1]} style={{position:'absolute', height:'100%', width:'100%', ...borderRadius, justifyContent:'flex-end'}}>
                    <Text numberOfLines={2} style={{textAlign:'center', fontWeight:'bold', fontSize:18, color:'#FFF'}}>{anime.anilist.title.romaji}</Text>
                    <View style={{position:'absolute', flexDirection:'row', top:5, right:0}}>
                        {(anime.episode) ? <EpisodeTag episode={anime.episode} styles={{backgroundColor:colors.primary}} /> : null}
                        <SimilarityTag percentage={(anime.similarity * 100).toPrecision(4) + '%'} color={(anime.similarity > .89) ? 'green' : (anime.similarity < .89 && anime.similarity > .79) ? 'yellow' : 'red'} />
                    </View>
                    <View style={{position:'absolute', flexDirection:'row', top:5, left:5}}>
                        <TimeTag from={anime.from} to={anime.to} color={colors.primary} />
                    </View>
                </LinearGradient>
            </PressableAnim>
    );
}

type MoeType = {
    data:MoeData[];
}
export const TraceMoeUI = ({data}:MoeType) => {
    const { width, height } = useWindowDimensions();
    const { colors } = useTheme();

    const KeyDesc = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical:5 }}>
                <View style={{ alignItems: 'center' }}>
                    <MaterialIcons name="access-time" size={18} color={colors.primary} />
                    <Text style={{ color: colors.text }}>Timestamp</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <MaterialIcons name="personal-video" size={18} color={colors.primary} />
                    <Text style={{ color: colors.text }}>Episodes</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons name="water-percent" size={18} color={colors.primary} />
                    <Text style={{ color: colors.text }}>Accuracy</Text>
                </View>
            </View>
        );
    }

    return(
        <View style={{marginTop:30}}>
            <Text style={{textAlign:'center', fontSize:32, fontWeight:'bold', color:colors.text}}>Search Results</Text>
            <KeyDesc />
            {data.map((anime, index) => <MoeRenderItem anime={anime} dimensions={{width, height}} key={index}/>)}
        </View>
    );
}