import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { Theme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { PressableAnim } from '../../../Components';
import { ProgressTag, StatusTag } from './tags';
import { MediaCollectionEntries } from '../../../Api/types';
import { getTime } from '../../../utils';

type RouteProp = {
    params: {
        data: MediaCollectionEntries[];
        colors: Theme;
        type: string;
        listStatus: string;
        layout: string;
    }
}
type TileProps = {
    item: any;
    colors: Theme;
    listStatus: string;
    navigation: MaterialTopTabNavigationProp<RouteProp>;
    tags: {statusTag: boolean | string, progressTag: boolean};
}
const ListTile = ({item, colors, listStatus, tags, navigation}:TileProps) => {
    const total = (item.media.format === 'NOVEL') ? item.media.volumes : item.media.episodes || item.media.chapters;
    const progressPerc = (((item.media.format === 'NOVEL' ? item.progress : item.progressVolumes ) /total)*100).toFixed(0);
    const statusString = ((item.media.status === 'RELEASING' && item.media.nextAiringEpisode?.timeUntilAiring) || (item.media.status === 'NOT_YET_RELEASED' && item.media.nextAiringEpisode?.timeUntilAiring)) ?
        getTime(item.media.nextAiringEpisode?.timeUntilAiring)
        : item.media.status
    
    if (item.media.isAdult) return null;
    return(
        // @ts-ignore
        <PressableAnim onPress={() => navigation.navigate('UserListDetail', {id: item.media.id, isList:true})} style={{ height: 280, width:190 }}>
            <FastImage fallback source={{ uri: item.media.coverImage.extraLarge }} resizeMode={'cover'} style={{ height: 280, width: 190, borderRadius: 8 }} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,.7)']} locations={[.65, .95]} style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center', borderRadius:8 }}>
                <Text numberOfLines={2} style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold', paddingBottom:10, paddingHorizontal:5 }}>{item.media.title.userPreferred}</Text>
                {/* {(item.progress > 0) ? <View style={{ position: 'absolute', bottom: .1, left: 0, height: 8, width: (item.media.episodes ?? item.media.chapters) ? `${progressPerc}%` : '50%', backgroundColor: colors.colors.primary, borderBottomLeftRadius: 8, borderBottomRightRadius: (progressPerc === '100') ? 8 : 0 }} /> : null} */}
                {((item.media.episodes || item.media.chapters || item.media.volumes) && listStatus !== 'Completed' && tags.progressTag && item.media.status !== 'NOT_YET_RELEASED') ? 
                    <View style={{position:'absolute', top:5, right:5}}>
                        <ProgressTag progress={(item.media.format === 'NOVEL') ? item.progressVolumes : item.progress} colors={colors} total={total} />
                    </View>
                : null}
                {(item.media.status && tags.statusTag) ? 
                    <View style={{position:'absolute', top:5, left:5}}>
                        <StatusTag mediaStatus={statusString} /> 
                    </View>
                : null}
            </LinearGradient>
        </PressableAnim>
    );
}

type RowTileProps = {
    item: any;
    colors: Theme;
    listStatus: string;
    navigation: MaterialTopTabNavigationProp<RouteProp>;
    tags: {
        statusTag: boolean;
        progressTag: boolean;
    }
}
const RowTile = ({item, colors, listStatus, navigation, tags}:RowTileProps) => {
    const total = item.media.episodes || item.media.chapters;
    const progressPerc = (total) ? ((item.progress/total)*100).toFixed(0) : '50';
    if (item.media.isAdult) return null;
    return(
        // @ts-ignore
        <Pressable pressRetentionOffset={{right:0}} onPress={() => navigation.navigate('UserListDetail', {id: item.media.id})} key={item.media.id}>
            <FastImage source={{uri:(item.media.bannerImage) ? item.media.bannerImage : item.media.coverImage.extraLarge}} style={{width:'100%', height:110}} resizeMode={'cover'} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,.8)']} start={{x:.8, y:.2}} end={{x:.4, y:1}} style={{position:'absolute', height:'100%', justifyContent:'center', width:'100%'}}>
                <Text numberOfLines={3} style={{paddingLeft:10, fontWeight:'bold', color:'#FFF', width:190}}>{item.media.title.userPreferred}</Text>
            </LinearGradient>
            <LinearGradient colors={['rgba(0,0,0,.2)', 'transparent']} start={{x:.9, y:.2}} end={{x:.6, y:1}} style={{position:'absolute', height:'100%', alignItems:'flex-end', justifyContent:'center', width:'100%'}}>
            </LinearGradient>

            {(item.progress > 0) ? <View style={{position:'absolute', bottom:0, width:progressPerc+'%', height:4, backgroundColor:colors.colors.primary}}>
                {(progressPerc !== '100' && tags.progressTag) ? <View style={{position:'absolute', right:-20, bottom:-4, alignItems:'center', width:40}}>
                    <Text style={{ color:'#FFF', textAlign:'right', paddingBottom:15}}>{item.progress}</Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color='#FFF' style={{position:'absolute', bottom:0,}}/>
                </View> : null}
            </View> : null}
            {((item.media.episodes ?? item.media.chapters) && listStatus === 'Planning' ) ? 
                <View style={{position:'absolute', top:5, right:5}}>
                    <ProgressTag progress={item.progress} colors={colors} total={item.media.episodes ?? item.media.chapters} />
                </View>
            : null}
            {(item.media.status && tags.statusTag) ?
                <View style={[{ position: 'absolute', top: 5, }, (listStatus === 'Planning') ? {left:5} : {right:5}]}>
                    <StatusTag mediaStatus={item.media.status} />
                </View>
            : null}
        </Pressable>
    );
}

export { ListTile, RowTile };