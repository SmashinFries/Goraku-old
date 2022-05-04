import { openURL } from "expo-linking";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { IconButton, Button } from 'react-native-paper';
import FastImage from "react-native-fast-image";
import { Activities, UserBasic } from "../../../../Api/types";
import { AnilistSVG } from "../../../../Components/svg/svgs";
import { ThemeColors } from "../../../../Components/types";
import { NavigationProp } from "@react-navigation/native";
import { convertUnixTime } from "../../../../utils/time/getTime";

const statusText = (status: string, progress: number) => {
    if (progress) {
        return `${status} ${progress}`;
    } else {
        return status;
    }
}

const DeleteButton = ({onDelete}:{onDelete:() => void}) => {
    return (
        <IconButton icon='delete' size={24} color='red' onPress={onDelete} style={{marginTop:20}} />
    );
}

const DetailButton = ({ colors, onPress }: { colors: ThemeColors, onPress: () => void }) => {
    return (
        <View style={{ flex: 1, borderRadius: 12, flexDirection: 'row', width: '100%', justifyContent: 'center', marginBottom:5, marginLeft:5 }}>
            <View style={{flex:1, overflow:'hidden', marginTop: 20, borderRadius:12, maxWidth: '85%',}}>
                <Pressable onPress={onPress} style={{   height: 35, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.background, borderRadius: 12 }} android_ripple={{ color: colors.primary }}>
                    <Text style={{ color: colors.text }}>View</Text>
                </Pressable>
            </View>
        </View>
    );
}

const AnilistLink = ({ link, color }: { link: string, color:string }) => {
    return (
        <Pressable onPress={() => openURL(link)} style={{ marginTop: 20, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 35 / 2 }} android_ripple={{ color: color, borderless: true }}>
            <AnilistSVG color={'#07A9FF'} />
        </Pressable>
    );
}

const OtherUser = ({user, colors}:{user:UserBasic, colors:ThemeColors}) => {
    return(
        <Pressable onPress={() => openURL(user.siteUrl)} style={{flexDirection:'row', alignItems:'center'}}>
            <FastImage fallback source={{uri:user.avatar.large}} style={{height:35, width:35, borderRadius:35/2}} />
            <Text style={{color:colors.text, paddingLeft:10}}>{user.name}</Text>
        </Pressable>
    );
}

type Props = {
    item: Activities,
    colors: ThemeColors,
    navigation: NavigationProp<any>;
    deleteActivity: (id:number) => void;
    userId: number;
}
const ActivityTile = ({ item, colors, userId, navigation, deleteActivity }: Props) => {
    return (
        <View style={{ borderRadius: 8, flexDirection: 'row', backgroundColor: colors.card }}>
            <View style={{justifyContent:'center', paddingLeft:5}}>
                <FastImage fallback source={{ uri: item.media.coverImage.extraLarge }} style={{ borderRadius: 8, height: 168, width: 110 }} resizeMode='cover' />
            </View>
            <View style={{ flex: 1, paddingTop: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <OtherUser user={item.user} colors={colors} />
                <Text style={{ color: colors.text, marginTop: 20, textTransform: 'capitalize' }}>{statusText(item.status, item.progress)}</Text>
                <Text numberOfLines={2} style={{ color: colors.text, fontWeight: 'bold', paddingHorizontal: 5, fontSize: 16, height: 45, textAlign: 'center', textAlignVertical: 'center' }}>{item.media.title.userPreferred}</Text>
                
                <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%', paddingRight: 5, paddingBottom: 5 }}>
                    {(item.user.id === userId) && <DeleteButton onDelete={() => deleteActivity(item.id)} />}
                    {/* navigation.push doesn't jump to screen */}
                    {/* @ts-ignore */}
                    <DetailButton colors={colors} onPress={() => {navigation.push('Info', { id: item.media.id }); navigation.navigate('Info', { id: item.media.id })}} />
                    <AnilistLink link={item.siteUrl} color={colors.primary} />
                </View>
                <View style={{ position: 'absolute', top: -12, alignSelf: 'flex-end', justifyContent: 'center', paddingHorizontal:10, height: 22, borderRadius: 12, backgroundColor: colors.primary }}>
                    <Text style={{ color: '#FFF', textAlign: 'center' }}>{convertUnixTime(item.createdAt)}</Text>
                </View>
            </View>
        </View>
    );
}

export default ActivityTile;