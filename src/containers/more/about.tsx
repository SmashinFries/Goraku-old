import React, { useState, version } from "react";
import { View, Text, useWindowDimensions, Image, Pressable, ScrollView, StatusBar } from "react-native";
import { useTheme } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { openURL } from "expo-linking";
import { useRelease } from "../../Api/github/github";
import { DataSourcesProps } from "../types";
import { Divider, List, Dialog, Portal, Button, IconButton } from 'react-native-paper';
import { VERSION } from "../../constants";
import RenderHTML from "react-native-render-html";
import FastImage from "react-native-fast-image";

const MERCH_URL = 'https://kuzumerch.bigcartel.com';

const About = ({navigation}:DataSourcesProps) => {
    const { colors, dark } = useTheme();
    const {release} = useRelease();
    const [visible, setVisible] = useState(false);
    const { width, height } = useWindowDimensions();

    const openDialog = () => setVisible(true);
    const closeDialog = () => setVisible(false);

    const kofi = 'https://cdn.ko-fi.com/cdn/kofi1.png?v=3';

    const DownloadDialog = () => {
        if (!release) return null;
        return(
            <Dialog style={{ backgroundColor: colors.card }} visible={visible} onDismiss={closeDialog}>
                <Dialog.Title style={{ color: colors.text }}>New Version Available!</Dialog.Title>
                <Dialog.Content>
                    <Text style={{color:colors.text}}>Version: {release.tag_name + '\n'}</Text>
                    <Text style={{color:colors.text}}>Created: {release.assets[0].created_at.split('T')[0]}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button color={colors.primary} onPress={closeDialog}>Close</Button>
                    <IconButton icon={'github'} onPress={() => openURL(release.html_url)} color={colors.primary} />
                    <IconButton icon={'download'} onPress={() => openURL(release.assets[0].browser_download_url)} color={colors.primary} />
                </Dialog.Actions>
            </Dialog>
        );
    }

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
            <List.Item 
                title="Version"
                titleStyle={{color:colors.text}}
                rippleColor={colors.border}
                description={`${VERSION}`} 
                descriptionStyle={{color:colors.text}} 
                onPress={() => (release?.tag_name !== VERSION) ? openDialog() : null}
                right={props => (release?.tag_name !== VERSION) ? <List.Icon {...props} icon="new-box" color={colors.primary} /> : null}
            />
            <List.Item title="What's new" titleStyle={{color:colors.text}} rippleColor={colors.border} onPress={() => openURL(`https://github.com/SmashinFries/Goraku/releases/tag/${VERSION}`)} />
            <List.Item title="Data sources" titleStyle={{color:colors.text}} rippleColor={colors.border} onPress={() => navigation.push('DataSources')} />
            <View style={{flexDirection:'row', marginHorizontal:20, marginTop:15, justifyContent:'space-evenly'}}>
                <IconButton icon={'web'} color={colors.primary} size={36} onPress={() => openURL('https://kuzutech.com')} />
                <IconButton icon={'github'} color={colors.primary} size={36} onPress={() => openURL('https://github.com/SmashinFries')} />
                <IconButton icon={'instagram'} color={colors.primary} size={36} onPress={() => openURL('https://www.instagram.com/smashinfries/')} />
                <IconButton icon={'storefront-outline'} color={colors.primary} size={36} onPress={() => openURL(MERCH_URL)} />
            </View>
            <Pressable style={{marginTop:20}} onPress={() => openURL('https://ko-fi.com/C0C7C2AUX')}>
                <FastImage source={{uri: kofi}} style={{alignSelf:'center', height:50, width:'90%'}} resizeMode='contain' />
            </Pressable>
            <Portal>
                <DownloadDialog />
            </Portal>
        </ScrollView>
    );
}

export default About;