import { useTheme } from "@react-navigation/native";
import React from "react";
import { ScrollView, View, Text, StatusBar } from "react-native";
import { AntDesign, } from '@expo/vector-icons';
import { Divider, List } from 'react-native-paper';
import { MoreHomeScreenProps } from "../types";
import FastImage from "react-native-fast-image";

type SelectableType = {
    title:string;
    icon: keyof typeof AntDesign.glyphMap;
    onPress: () => void;
}
export const MoreScreen = ({navigation, route}:MoreHomeScreenProps) => {
    const { colors, dark } = useTheme();
    return (
        <ScrollView contentContainerStyle={{justifyContent:'flex-start'}} style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
            <View style={{ backgroundColor: (dark) ? colors.background : colors.card, paddingTop: StatusBar.currentHeight + 20 }}>
                <View style={{ justifyContent: 'flex-start' }}>
                    <Text style={{ fontSize: 20, marginLeft: 20, color: colors.text }}>More</Text>
                </View>
                <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <FastImage fallback source={{ uri: 'https://media.giphy.com/media/IcJ6n6VJNjRNS/giphy.gif' }} style={{ width: '100%', height: 150 }} resizeMode='contain' />
                </View>
            </View>
            <Divider style={{backgroundColor:colors.border}} />
            {/* @ts-ignore */}
            <List.Item title="Account" titleStyle={{color:colors.text}} rippleColor={colors.border} onPress={() => navigation.push('AccountStack')} left={props => <List.Icon {...props} icon="account-cog-outline" color={colors.primary} />} />
            <List.Item title="Settings" titleStyle={{color:colors.text}} rippleColor={colors.border} onPress={() => navigation.push('SettingsStack')} left={props => <List.Icon {...props} icon="cog-outline" color={colors.primary} />} />
            <List.Item title="About" titleStyle={{color:colors.text}} rippleColor={colors.border} onPress={() => navigation.push('About')} left={props => <List.Icon {...props} icon="information-outline" color={colors.primary} />} />
        </ScrollView>
    );
}