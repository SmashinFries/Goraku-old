import React from "react";
import { Pressable, View, Text } from "react-native";
import { ThemeColors } from "../types";
import { AntDesign, } from '@expo/vector-icons';

type SelectableType = {
    title:string;
    icon?: keyof typeof AntDesign.glyphMap | null;
    onPress: () => void;
    colors: ThemeColors;
    subText?: string;
    dark:boolean;
}
export const SelectableAccordian = ({title, icon, onPress, colors, dark, subText=undefined}:SelectableType) => {
    return(
        <Pressable onPress={onPress} android_ripple={{color:colors.primary}} style={{width:'100%', height:50, justifyContent:'center', backgroundColor:(dark) ? colors.background : colors.card}}>
            <View style={{flexDirection:'row'}}>
                {(icon) ? <AntDesign name={icon} size={24} color={colors.primary} style={{marginLeft:10}} /> : null}
                <Text style={{fontSize:16, marginLeft:20, color:colors.text}}>{title}</Text>
            </View>
            {(subText !== undefined) ? <Text style={{color:'#b8b8b8', marginLeft:(icon) ? 20+35 : 21, fontSize:12, textTransform:'capitalize'}}>{subText}</Text> : null}
        </Pressable>
    );
}