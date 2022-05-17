import React from "react";
import { Pressable, Text, View, StyleSheet, ViewStyle, TextStyle, FlatList } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { Button, Chip, Surface } from "react-native-paper";
import { RandomMediaInfo } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import { getScoreColor } from "../../../../utils";
import { TagScroll } from "../../../mediadrawer/overview/components";

type Props = {
    item:RandomMediaInfo;
    colors: ThemeColors;
    navigation: any;
}
type Style = {
    surface: ViewStyle;
    bannerContainer: ViewStyle;
    banner: ImageStyle;
    coverContainer: ViewStyle;
    cover: ImageStyle;
    title: TextStyle;
    nsfwContainer: ViewStyle;
    nsfwText: TextStyle;
    statusContainer: ViewStyle;
    scoreContainer: ViewStyle;
    score: TextStyle;
}
const RandomTile = ({item, colors, navigation}:Props) => {

    const TileStyle = StyleSheet.create<Style>({
        surface: {
            flex:1,
            backgroundColor:colors.card,
            marginVertical:10,
            marginHorizontal:15,
            borderRadius:12,
        },
        bannerContainer: {
            borderTopLeftRadius:12,
            borderTopRightRadius:12,
        },
        banner: {
            width:'100%',
            height:80,
            borderTopLeftRadius:12,
            borderTopRightRadius:12,
        },
        coverContainer: {
            position:'absolute',
            alignSelf:'center',
            top:-60,
        },
        cover: {
            width:100,
            height:160,
            borderRadius:8,
            borderWidth:1,
        },
        title: {
            textAlign:'center',
            color:colors.text,
            fontSize:18,
            fontWeight:'bold',
            marginTop:30,
            paddingTop:10,
        },
        nsfwContainer: {
            position:'absolute',
            width:100,
            height:20,
            backgroundColor:'red',
            borderTopRightRadius:8,
            borderTopLeftRadius:8,
            alignSelf:'center'
        },
        nsfwText: {
            color:'#FFF',
            fontWeight:'bold',
            textAlign:'center',
        },
        statusContainer: {
            position:'absolute',
            flexDirection:'row',
            top:85,
            left:10,
            borderRadius:8,
            padding:3,
            borderColor:colors.primary,
            borderWidth:1,
        },
        scoreContainer: {
            position:'absolute',
            top:85,
            right:10,
            borderRadius:8,
            padding:5,
            backgroundColor:getScoreColor(item.averageScore ?? item.meanScore),
        },
        score: {
            color:'#000',
            fontWeight:'bold',
        }
    });

    return(
        <Surface style={TileStyle.surface}>
            <View style={TileStyle.bannerContainer}>
                <FastImage fallback source={{uri: item.bannerImage ?? item.coverImage.extraLarge}} style={TileStyle.banner} resizeMode='cover' />
            </View>
            <View style={TileStyle.coverContainer}>
                <FastImage fallback source={{uri: item.coverImage.extraLarge}} style={TileStyle.cover} resizeMode={'cover'} />   
                {(item.isAdult) ? 
                <View style={TileStyle.nsfwContainer}>
                    <Text style={TileStyle.nsfwText}>NSFW</Text>
                </View>
                : null}
            </View>
            <Text style={TileStyle.title}>{item.title.userPreferred}</Text>
            <View style={TileStyle.statusContainer}>
                <Text style={{color:colors.text, textTransform:(item.format === 'TV') ? undefined : 'capitalize'}}>{item.format.replace('_', ' ')} | </Text>
                <Text style={{color:colors.text, textTransform:'capitalize'}}>{item.status}</Text>
            </View>
            {(item.averageScore || item.meanScore) ? 
            <View style={TileStyle.scoreContainer}>
                <Text style={TileStyle.score}>{item.averageScore ?? item.meanScore}</Text>
            </View>
            : null}
            <TagScroll genres={item.genres} tags={item.tags} colors={colors} />
            <View style={{ alignSelf: 'center', paddingVertical:10 }}>
                <Button mode="outlined" onPress={() => navigation.navigate('Info', { id: item.id })} color={colors.primary} style={{ width: 200, borderColor: colors.primary }}>View</Button>
            </View>
            {/* 
                    {(item.averageScore || item.meanScore) ? <Text style={{color:getScoreColor(item.averageScore ?? item.meanScore), fontWeight:'bold'}}>{item.averageScore ?? item.meanScore}</Text> : null}
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center', flexWrap:'wrap'}}>
                        {item.genres?.map((genre, idx) => 
                            <Pressable key={idx} style={{ padding: 5, height: 30, alignSelf:'center', alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10, marginHorizontal: 5, marginVertical: 10, backgroundColor: colors.primary, borderRadius: 12 }}>
                                <Text style={{ color: '#FFF' }}>{genre}</Text>
                            </Pressable>
                        )}
                    </View>
                    <View style={{alignSelf:'center'}}>
                        <Button mode="outlined" onPress={() => navigation.navigate('Info', {id:item.id})} color={colors.primary} style={{width:200, borderColor:colors.primary}}>View</Button>
                    </View>
                </View>
            </View> */}
        </Surface>
    );
}

export default RandomTile;