import React from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Button, Chip, Surface } from "react-native-paper";
import { RandomMediaInfo } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import { getScoreColor } from "../../../../utils";

type Props = {
    item:RandomMediaInfo;
    colors: ThemeColors;
    navigation: any;
}
const RandomTile = ({item, colors, navigation}:Props) => {
    return(
        <Surface style={{flex:1, backgroundColor:colors.card, marginVertical:10, marginHorizontal:15}}>
            <FastImage fallback source={{uri: item.bannerImage ?? item.coverImage.extraLarge}} style={{width:'100%', height:80}} resizeMode='cover' />
            <View style={{flex:1, marginVertical:5, width:'100%', paddingHorizontal:10, flexDirection:'row'}}>
                <FastImage fallback source={{uri: item.coverImage.extraLarge}} style={{width:110, height:170, borderRadius:8}} resizeMode={'cover'} />   
                <View style={{flex:1, paddingHorizontal:10, alignItems:'center'}}>
                    <Text numberOfLines={2} style={{color:colors.text, textAlign:'center', fontSize:18, fontWeight:'bold'}}>{item.title.userPreferred}</Text>
                    <Text style={{color:colors.text, textTransform:(item.format === 'TV') ? undefined : 'capitalize'}}>{item.format} | {item.status}</Text>
                    {(item.isAdult) ? <Text style={{color:'red', fontWeight:'bold'}}>NSFW</Text> : null}
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
            </View>
        </Surface>
    );
}

export default RandomTile;