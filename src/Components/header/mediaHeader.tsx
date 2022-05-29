import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Image, Text, useWindowDimensions } from "react-native";
import FastImage from "react-native-fast-image";

export const MediaHeader = ({coverImage, loc=[0, .95]}) => {
    
    const {colors,dark} = useTheme();
    const {width, height} = useWindowDimensions();
    return (
        <View style={{ position:'absolute', width:'100%', backgroundColor: 'transparent'}}>
            <View>
                <FastImage fallback source={{ uri: coverImage }} style={{ position: 'absolute', zIndex: -1, height: height, width: '100%' }} resizeMode='cover'/>
                <LinearGradient colors={(!dark) ? ['rgba(242, 242, 242, .4)', colors.background] : ['rgba(0, 0, 0, .4)', colors.background]} locations={loc} style={{ position: 'absolute', height: height, width: '100%' }} />
            </View>
        </View>
    );
}