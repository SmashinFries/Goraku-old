import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, Image, Pressable, ScrollView, StatusBar } from "react-native";
import { useTheme } from "@react-navigation/native";
import { openURL } from "expo-linking";
import { DataSourcesProps } from "../types";
import { Divider, List, Dialog, Portal, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { VERSION } from "../../constants";
import FastImage from "react-native-fast-image";
import { Current, Release } from "../../Api/github/types";
import { fetchCurrent, fetchRelease } from "../../Api/github/github";
import { getLastUpdateCheck, setLastUpdateCheck } from "../../Storage/updates";
import DownloadDialog from "../../Components/dialogs/downloadDialog";

const MERCH_URL = 'https://kuzumerch.bigcartel.com';

const About = ({navigation}:DataSourcesProps) => {
    const [release, setRelease] = useState<Release>();
    const [current, setCurrent] = useState<Current>();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastChecked, setLastChecked] = useState<string>();
    const { colors, dark } = useTheme();
    const { width, height } = useWindowDimensions();

    const openDialog = () => setVisible(true);
    const closeDialog = () => setVisible(false);

    const checkForUpdates = async () => {
        setLoading(true);
        const latest = await fetchRelease();
        const date = new Date().toLocaleString();
        await setLastUpdateCheck(date);
        setLastChecked(date);
        setLoading(false);
        setRelease(latest);
        if (latest.tag_name !== VERSION) {
            openDialog();
        }
    }

    const kofi = 'https://cdn.ko-fi.com/cdn/kofi1.png?v=3';

    useEffect(() => {
        getLastUpdateCheck().then((time) => setLastChecked(time));
    },[]);

    return (
        <ScrollView style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
            <View style={{ backgroundColor: (dark) ? colors.background : colors.card, paddingTop: StatusBar.currentHeight + 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton style={{marginLeft:15}} onPress={() => navigation.goBack()} icon="arrow-left" size={24} color={colors.text} />
                    <Text style={{ fontSize: 20, marginLeft: 20, color: colors.text }}>About</Text>
                </View>
                <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Pressable style={{ width: '100%' }} onPress={() => openURL('https://www.deviantart.com/ueku/art/animated-transparent-anime-girl-gif-564321735')}>
                        <Image source={require('../../assets/logo.gif')} style={{ height: 180, width: '100%', }} resizeMode='contain' />
                    </Pressable>
                </View>
            </View>
            <Divider style={{backgroundColor:colors.border}} />
            {(release && release?.tag_name !== VERSION) && <List.Item title="New version available!" titleStyle={{color:colors.text}} rippleColor={colors.border} style={{borderWidth:2, borderColor:colors.primary}} onPress={openDialog} right={() => <IconButton icon='new-box' size={24} color={colors.primary} />} />}
            <List.Item 
                title="Version"
                titleStyle={{color:colors.text}}
                rippleColor={colors.border}
                description={`${VERSION}`}
                descriptionStyle={{color:colors.text}}
                onPress={openDialog}
            />
            {(!release || release?.tag_name === VERSION) && <List.Item title="Check for updates" description={lastChecked && `Last checked: ${lastChecked}`} descriptionStyle={{color:colors.text}} titleStyle={{color:colors.text}} rippleColor={colors.border} right={() => (loading) ? <ActivityIndicator/> :  <IconButton icon='autorenew' style={{alignSelf:'center'}} color={colors.primary} />} onPress={() => checkForUpdates()} />}
            <List.Item title="What's new" titleStyle={{color:colors.text}} rippleColor={colors.border} onPress={() => openURL(`https://github.com/SmashinFries/Goraku/releases/tag/${VERSION}`)} />
            <List.Item title="Data sources" titleStyle={{color:colors.text}} rippleColor={colors.border} onPress={() => navigation.push('DataSources')} />
            <View style={{flexDirection:'row', marginHorizontal:20, marginTop:15, justifyContent:'space-evenly'}}>
                <IconButton icon={'web'} color={colors.primary} size={36} onPress={() => openURL('https://kuzutech.com')} />
                <IconButton icon={'github'} color={colors.primary} size={36} onPress={() => openURL('https://github.com/SmashinFries')} />
                <IconButton icon={'instagram'} color={colors.primary} size={36} onPress={() => openURL('https://www.instagram.com/smashinfries/')} />
                <IconButton icon={'storefront-outline'} color={colors.primary} size={36} onPress={() => openURL(MERCH_URL)} />
            </View>
            <Pressable style={{marginTop:20}} onPress={() => openURL('https://ko-fi.com/C0C7C2AUX')}>
                <FastImage fallback source={{uri: kofi}} style={{alignSelf:'center', height:50, width:'90%'}} resizeMode='contain' />
            </Pressable>
            <DownloadDialog colors={colors} visible={visible} onDismiss={closeDialog} release={release} />
        </ScrollView>
    );
}

export default About;