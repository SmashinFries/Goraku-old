import React from "react";
import { Animated, Pressable, StyleProp, ViewStyle, Text } from "react-native";
import { ThemeColors } from "../types";
import { AntDesign } from '@expo/vector-icons';
import { NavigationProp } from "@react-navigation/native";
import { IconButton } from 'react-native-paper';
import { handleShare } from "../../utils";

export const HeaderBackground = ({colors, opacity}:{colors:ThemeColors, opacity?: Animated.AnimatedInterpolation}) => {
    return(
        <Animated.View
            style={{
                backgroundColor: colors.card,
                justifyContent: 'flex-end',
                height: '100%',
                width:'100%',
                opacity: opacity ?? 1,
            }}
        />
    );
}

export const HeaderBackButton = ({navigation, colors, style}:{colors:ThemeColors, navigation:NavigationProp<any>, style?:ViewStyle}) => {
    return(
        <Animated.View style={[style,{ marginRight: 10 }]}>
            {/* <Pressable onPress={() => navigation.goBack()} android_ripple={{ color: colors.primary, borderless: true }}>
                <AntDesign name="arrowleft" size={24} color={colors.text} />
            </Pressable> */}
            <IconButton icon={'arrow-left'} size={26} rippleColor={colors.primary} color={colors.text} onPress={() => navigation.goBack()} />
        </Animated.View>
    );
}

type RightButtonProps = {
    colors:ThemeColors;
    navigation:NavigationProp<any>;
    share?:boolean;
    qrCode?:boolean;
    drawer?:boolean;
    favorites?:boolean;
    list?:boolean;
    style?:StyleProp<ViewStyle>;
    qrOnPress?: () => void;
    onShare?: () => void;
    onLongShare?: () => void;
    id?:number;
}
export const HeaderRightButtons = ({navigation, colors, share, drawer, qrCode, qrOnPress, onShare, onLongShare, favorites, list, style, id}:RightButtonProps) => {
    return (
        <Animated.View style={[style,{ flexDirection: 'row', }]}>
            {(qrCode) && <IconButton icon={'qrcode'} size={26} rippleColor={colors.primary} color={colors.text} onPress={qrOnPress} /> }
            {(share) && <IconButton icon={'share-variant'} size={26} rippleColor={colors.primary} color={colors.text} onLongPress={(onLongShare) ? onLongShare: undefined } onPress={(onShare) ? onShare : () => handleShare(`goraku://info/${id}`)} /> }
            {/* @ts-ignore */}
            {(drawer) && <IconButton icon={'menu'} size={26} rippleColor={colors.primary} color={colors.text} onPress={() => navigation.toggleDrawer()} /> }
            {/* @ts-ignore */}
            {(list) && <IconButton icon={'view-list-outline'} size={26} rippleColor={colors.primary} color={colors.text} onPress={() => navigation.replace('UserList')} />}
            {/* @ts-ignore */}
            {(favorites) && <IconButton icon={'heart-outline'} size={26} rippleColor={colors.primary} color={colors.text} onPress={() => navigation.replace('FavList')} />}
        </Animated.View>
    );
}

export const HeaderTitle = ({title, colors, opacity}:{title:string, colors:ThemeColors, opacity?:Animated.AnimatedInterpolation}) => {
    return(
        <Animated.Text style={{opacity:opacity ?? 1, color:colors.text, fontSize:20}}>{title}</Animated.Text>
    );
}
