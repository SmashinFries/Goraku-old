import { HeaderOptions } from "@react-navigation/elements";
import { Theme } from "@react-navigation/native";
import React from "react";
import { Animated, View, Text } from "react-native";

type HeaderAnimProps = {
    title: string;
    theme: Theme;
    yValue: Animated.Value | Animated.AnimatedInterpolation;
}
export const HeaderAnim = ({title, yValue, theme,  ...rest}:HeaderAnimProps&HeaderOptions) => {
    return(
        <Animated.View style={{position:'absolute', justifyContent:'center', height:80, width:'100%', transform:[{translateY:yValue}], backgroundColor:(theme.dark) ? theme.colors.background : theme.colors.card}}>
            <View style={{position:'absolute', alignItems:'center', paddingTop:30, marginLeft:30}}>
                <Text style={{fontSize:18}}>{title}</Text>
            </View>
        </Animated.View>
    );
}