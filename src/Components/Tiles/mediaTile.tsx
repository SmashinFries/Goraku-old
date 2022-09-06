import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { Shadow } from "react-native-shadow-2";
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerInfoNavProp } from "../../containers/types";
import { getDate, getTime, handleCopy } from "../../utils";
import { getScoreColor, listColor } from "../../utils/colors/scoreColors";
import { MediaTileProps } from "../types";

type ScoreTagProps = {score:number};
export const ScoreTag = ({score}:ScoreTagProps) => {
    const _SCORESIZE = 25
    const color = getScoreColor(score);
    if (score === null) return null;
    return(
            <View style={{ flex:1, position: 'absolute', justifyContent: 'center', height: _SCORESIZE, width: _SCORESIZE, right: 0, top:0, alignSelf: 'flex-start', borderRadius: _SCORESIZE / 2, }}>
                <Shadow startColor={color} >
                    <View style={{ justifyContent:'center', alignSelf:'center', height: _SCORESIZE, width: _SCORESIZE, borderRadius: _SCORESIZE / 2, borderTopRightRadius:8, backgroundColor: color}}>
                        <Text style={{ textAlign: 'center', fontWeight:'bold' }}>{score}</Text>
                    </View>
                </Shadow>
            </View>
    );
}

const onPress = (props, nav) => {
    props.sheetRef?.current?.close();
    props.route && nav.push(props.route, {id:props.data.id, title:props.data.title.userPreferred, banner:props.data.bannerImage, coverImage:props.data.coverImage.extraLarge, type:props.data.type});
    !props.route && nav.navigate('Info', {screen:'DrawerInfo', params: {id:props.data.id, title:props.data.title.userPreferred, banner:props.data.bannerImage, coverImage:props.data.coverImage.extraLarge, type:props.data.type}});
}

export const MediaTile = (props: MediaTileProps) => {
    const [status, setStatus] = useState((props.data.mediaListEntry) ? props.data.mediaListEntry.status : null);
    // const [visible, setVisible] = useState<boolean>(false);
    const score = (props.data.averageScore !== null) ? props.data.averageScore : props.data.meanScore;
    const {width, height } = props.size || {width:140, height:230};
    const { colors } = useTheme();
    const nav = useNavigation<DrawerInfoNavProp>();
    // onLongPress={() => {props.setActiveId({id:props.data.id, index:props.index}); console.log(props.data.id); props.sheetControl.current.present()}}
    return(
        <View style={{width:width, height:height+65, marginHorizontal:10, paddingTop:10, justifyContent:'flex-start',}}>
                <Shadow size={(props.isSearch) ? [width-10, height-10] : [width-8, height-8]} paintInside startColor={(status) ? listColor(props.data.mediaListEntry?.status) : 'transparent'} offset={(props.isSearch) ? ['3.5%',0] : [4,0]} viewStyle={{position:'absolute', width:(props.isSearch) ? width-10 : width-8, height:(props.isSearch) ? height-10 : height-8, alignItems:'center', alignSelf:'center', borderRadius:8, justifyContent:'center'}}>
                    <View style={{ borderRadius: 8, overflow: 'hidden', alignItems:'center' }}>
                        <Pressable  onPress={() => onPress(props, nav)} android_ripple={{color:colors.primary,}} style={{height:height, width:width, borderRadius:8, alignItems:'center', justifyContent:'center'}}>
                            <View style={{overflow: 'hidden', borderRadius:8}}>
                                <FastImage fallback source={{uri: props.data.coverImage.extraLarge}} style={{height:height-6, width:width-6, borderRadius:8, alignSelf:'center'}} resizeMode='cover' />
                                <ScoreTag score={score} />
                                {(props.data.nextAiringEpisode?.timeUntilAiring) ? 
                                <View style={{position:'absolute', flexDirection:'row', justifyContent:'center', bottom:0, width:'100%', backgroundColor:'rgb(60,180,242)'}}>
                                    <Text style={{}}>EP {props.data.nextAiringEpisode.episode} </Text>
                                    <MaterialIcons name="access-time" size={16} style={{ alignSelf: 'center' }} color={'#FFF'} />
                                    <Text style={{fontWeight:'bold'}}> {getTime(props.data.nextAiringEpisode.timeUntilAiring, false)}</Text>
                                </View> : null}
                            </View>
                        </Pressable>
                    </View>
                </Shadow>
            <Text style={{textAlign:'center', marginTop:height+5, width:width, color:colors.text, fontFamily:'Inter_900Black', fontSize:16}} onLongPress={() => handleCopy(props.data.title[props.titleType])} numberOfLines={2}>{props.data.title[props.titleType]}</Text>
        </View>
    );
}