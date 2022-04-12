import { Theme, useTheme } from "@react-navigation/native";
import React from "react";
import { Pressable, View, Text, ViewStyle } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton } from "react-native-paper";


type RadioButtonProps = {
    text: string | number;
    activeItem: string | number;
    colors: Theme;
    onPress: () => void;
    fontSize?: number;
    iconSize?: number;
    style?: ViewStyle;
}

const iconDecider = (active:string, title:string) => {
    switch (title) {
        case 'compact':
            if (active === 'compact') return 'view-grid'
            return 'view-grid-outline';
        case 'list':
            if (active === 'list') return 'view-sequential'
            return 'view-sequential-outline';
    }
}
export const RadioButton = ({text, activeItem, onPress, colors, fontSize=18, iconSize=30, style={}}:RadioButtonProps) => {
    const active = (activeItem) ? activeItem.toString().toLowerCase() : 'None' 
    const title = (typeof(text) === 'string') ? text.toLowerCase() : text.toString().toLowerCase();
    return(
            <View style={[style, {height:45, justifyContent:'center', borderRadius:12}]}>
                <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', borderRadius:12}}>
                    <IconButton onPress={onPress} icon={iconDecider(active, title)} size={iconSize} color={(active === title) ? colors.colors.primary : colors.colors.text} />
                    {/* <IconButton icon={(text === 'Compact') ? 'view-grid-outline' : 'view-sequential-outline'} size={iconSize} color={colors.colors.text} /> */}
                    <Text style={{ textTransform:'capitalize', fontSize:fontSize, paddingRight:5, color:colors.colors.text}}>{text}</Text>
                </View>
            </View>
    );
}