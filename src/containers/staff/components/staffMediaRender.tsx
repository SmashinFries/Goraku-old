import { NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Pressable, Text, FlatList } from "react-native";
import FastImage from "react-native-fast-image";
import { StaffDataType, StaffMediaEdge } from "../../../Api/types";
import { ThemeColors } from "../../../Components/types";

type Props = {
    data: StaffDataType;
    colors: ThemeColors;
    navigation: NavigationProp<any>;
    isList?:boolean;
}
const StaffMediaRender = ({data, colors, isList, navigation}:Props) => {
    const anime = (data) ? data.staffMedia.edges.filter((edge) => edge.node.type === 'ANIME') : [];
    const manga = (data) ? data.staffMedia.edges.filter((edge) => edge.node.type === 'MANGA') : [];
    
    const contentRender = ({item}:{item:StaffMediaEdge}) => {
        return(
            // @ts-ignore
            <Pressable onPress={() => navigation.push((isList) ? 'DrawerInfo' : 'Info', {id: item.node.id})}>
                <FastImage source={{ uri: item.node.coverImage.extraLarge }} style={{ height: 180, width: 120, borderRadius:8 }} resizeMode={'cover'} />
                <LinearGradient 
                    colors={['transparent', 'rgba(0,0,0,.8)']} 
                    locations={[.4, 1]} 
                    style={{position:'absolute', height: 180, width: 120, justifyContent:'flex-end', alignItems:'center', borderRadius:8}}
                >
                    <Text numberOfLines={3} style={{color:'#FFF', paddingHorizontal:5, fontWeight:'bold', textAlign:'center'}}>
                        {item.node.title.userPreferred}
                    </Text>
                </LinearGradient>
                <View style={{height:35, width:120, alignItems:'center'}}>
                    <Text numberOfLines={2} style={{textAlign:'center', color:colors.text}}>{item.staffRole}</Text>
                </View>
            </Pressable>
        );
    }

    return(
        <View style={{flex:1}}>
            {anime.length > 0 && 
            <View>
                <Text style={{  marginBottom: 5, color: colors.text, fontSize: 30, fontWeight: 'bold', marginTop: 20, }}>Anime Roles</Text>
                <FlatList 
                    data={anime}
                    renderItem={contentRender}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{width: 10}} />}
                />
            </View>}
            {manga.length > 0 && 
            <View style={{marginBottom:10}}>
                <Text style={{ marginBottom: 5, color: colors.text, fontSize: 30, fontWeight: 'bold', marginTop: 20, }}>Manga Roles</Text>
                <FlatList 
                    data={manga}
                    renderItem={contentRender}
                    keyExtractor={(item) => item.node.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{width: 10}} />}
                />
            </View>}
        </View>
    );
}

export default StaffMediaRender;