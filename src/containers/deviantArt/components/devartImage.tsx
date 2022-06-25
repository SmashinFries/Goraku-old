import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { PopularResult } from "../../../Api/deviantArt/types";
import { ThemeColors } from "../../../Components/types";

type DevArtImageType = {
    item:PopularResult;
    navigation: NavigationProp<any>;
    colors: ThemeColors;
}
export const DevArtImage = ({item, navigation, colors}:DevArtImageType) => {
    const size = {height: 260, width: 180};
    return(
        <Pressable onPress={() => navigation.navigate('DeviantArtDetail', {image:item})} style={{height:size.height+40, width:size.width, marginHorizontal:10}}>
            <FastImage fallback source={{uri:item.preview.src}} style={{height:size.height, width:size.width}} resizeMode='cover' />
            <Text numberOfLines={2} style={{textAlign:'center', color:colors.text}}>{item.title}</Text>
        </Pressable>
    );
}