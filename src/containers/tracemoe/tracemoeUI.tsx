import { useNavigation, useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { View, Text, useWindowDimensions, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import AwesomeButton from "react-native-really-awesome-button-fixed";
import { MoeData } from "../../Api/types";
import { ExploreScreenNavigationProp } from "../types";

type ItemProp = {
    anime: MoeData;
    dimensions: {
        width: number;
        height: number;
    }
}

type EpisodeProps = {
    episode: number;
    styles?: ViewStyle;
}
const EpisodeTag = ({episode, styles}:EpisodeProps) => {
    return(
        <View style={[styles,{height:25, paddingHorizontal:10, justifyContent:'center', alignItems:'center', borderRadius:8, flexDirection:'row'}]}>
            <MaterialIcons name="personal-video" size={18} color='#FFF' />
            <Text style={{color:'#FFF', fontSize:16, marginLeft:5}}>{episode}</Text>
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
        <View style={[styles,{height:25, width:80, backgroundColor:color, marginHorizontal:5, justifyContent:'center', alignItems:'center', borderRadius:8, flexDirection:'row'}]}>
            <Text style={{color:(color === 'yellow') ? 'black' : 'white', fontSize:16, marginLeft:5}}>~{percentage}</Text>
        </View>
    )
}

const MoeRenderItem = ({anime, dimensions}:ItemProp) => {
    const { width, height } = dimensions;
    const { colors } = useTheme();
    const nav = useNavigation<ExploreScreenNavigationProp>();
    if (anime.anilist.isAdult) return null;
    return(
        <View style={{marginBottom:10, marginHorizontal:'5%', borderRadius:12}}>
            {/* @ts-ignore */}
            <AwesomeButton onPress={() => nav.navigate('Info', {id:anime.anilist.id, type:'ANIME'})} backgroundDarker="#000" backgroundColor='rgba(0,0,0,.5)' borderRadius={8} width={(width*90)/100} height={190} style={{marginTop:10}} >
                <FastImage source={{uri: anime.image}} style={{width: '100%', height: '100%'}} resizeMode={'cover'} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,.85)']} locations={[.75, 1]} style={{position:'absolute', height:'100%', width:'100%', borderRadius:8, justifyContent:'flex-end'}}>
                    <Text numberOfLines={2} style={{textAlign:'center', fontWeight:'bold', fontSize:18, color:'#FFF'}}>{anime.anilist.title.romaji}</Text>
                    <View style={{position:'absolute', flexDirection:'row', top:0, right:0}}>
                        {(anime.episode) ? <EpisodeTag episode={anime.episode} styles={{backgroundColor:colors.primary}} /> : null}
                        <SimilarityTag percentage={(anime.similarity * 100).toPrecision(4) + '%'} color={(anime.similarity > .89) ? 'green' : (anime.similarity < .89 && anime.similarity > .79) ? 'yellow' : 'red'} />
                    </View>
                </LinearGradient>
            </AwesomeButton>
        </View>
    );
}

type MoeType = {
    data:MoeData[];
}
export const TraceMoeUI = ({data}:MoeType) => {
    const { width, height } = useWindowDimensions();
    const { colors } = useTheme();
    return(
        <View style={{marginTop:30}}>
            <Text style={{textAlign:'center', fontSize:32, fontWeight:'bold', color:colors.text}}>Search Results</Text>
            <View style={{borderWidth:1, borderRadius:12, marginHorizontal:20, height:60, backgroundColor:'yellow', flexWrap:'wrap', justifyContent:'center', alignItems:'center'}}>
                <AntDesign name="exclamationcircleo" size={24} color="black" style={{position:'absolute', left:10}} />
                <Text style={{flexWrap:'wrap', paddingHorizontal:20, paddingLeft:45}}>Results with similarity below 90% is likely incorrect.</Text>
            </View>
            {data.map((anime, index) => <MoeRenderItem anime={anime} dimensions={{width, height}} key={index}/>)}
        </View>
    );
}