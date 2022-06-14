import { openURL } from "expo-linking";
import React from "react";
import { View, Text, Pressable, Image, StatusBar } from "react-native";
import FastImage from "react-native-fast-image";
import { IconButton, List, ActivityIndicator, Button } from "react-native-paper";
import { ThemeColors } from "../../../../Components/types";
import { VERSION } from "../../../../constants";
import { _openBrowserUrl } from "../../../../utils";

type AboutHeaderProps = {
    navigation: any;
    colors: ThemeColors;
    dark: boolean;
}
const AboutHeaderButton = ({navigation, colors, dark}:AboutHeaderProps) => {
    const image_source = 'https://www.deviantart.com/ueku/art/animated-transparent-anime-girl-gif-564321735';
    const image_loc = '../../../../assets/logo.gif';
    return(
        <View style={{ backgroundColor: (dark) ? colors.background : colors.card, paddingTop: StatusBar.currentHeight }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton style={{ marginLeft: 15 }} onPress={() => navigation.goBack()} icon="arrow-left" size={24} color={colors.text} />
                <Text style={{ fontSize: 20, marginLeft: 20, color: colors.text }}>About</Text>
            </View>
            <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Pressable style={{ width: '100%' }} onPress={() => _openBrowserUrl(image_source, colors.primary, colors.text)}>
                    <Image source={require(image_loc)} style={{ height: 180, width: '100%', }} resizeMode='contain' />
                </Pressable>
            </View>
        </View>
    );
}

type VersionProps = {
    openDialog: () => void;
    colors: ThemeColors;
}
const NewVersionBanner = ({openDialog, colors}:VersionProps) => {
    return(
        <List.Item 
            title="New version available!"
            titleStyle={{color:colors.text}}
            rippleColor={colors.border}
            style={{borderWidth:2, borderColor:colors.primary}}
            onPress={openDialog}
            right={() => <IconButton icon='new-box' size={24} color={colors.primary} />} 
        />
    );
}

const VersionButton = ({openDialog, colors}:VersionProps) => {
    return(
        <List.Item
            title="Version"
            titleStyle={{ color: colors.text }}
            rippleColor={colors.border}
            description={`${VERSION}`}
            descriptionStyle={{ color: colors.text }}
            onPress={openDialog}
        />
    );
}

type UpdateButtonProps = {
    checkForUpdates: () => Promise<void>;
    lastChecked: string;
    loading: boolean;
    colors: ThemeColors;
}
const CheckUpdateButton = ({checkForUpdates, lastChecked, loading, colors}:UpdateButtonProps) => {
    return(
        <List.Item 
            title="Check for updates" 
            description={lastChecked && `Last checked: ${lastChecked}`} 
            descriptionStyle={{color:colors.text}} 
            titleStyle={{color:colors.text}} 
            rippleColor={colors.border} 
            right={() => (loading) ? <ActivityIndicator/> :  <IconButton icon='autorenew' style={{alignSelf:'center'}} color={colors.primary} />} 
            onPress={() => checkForUpdates()} 
        />
    );
}

type WhatsNewProps = {
    colors: ThemeColors;
}
const WhatsNewButton = ({colors}:WhatsNewProps) => {
    const url = `https://github.com/SmashinFries/Goraku/releases/tag/${VERSION}`;
    return(
        <List.Item 
            title="What's new" 
            titleStyle={{color:colors.text}} 
            rippleColor={colors.border} 
            onPress={() => _openBrowserUrl(url, colors.primary, colors.text)} 
        />
    );
}

const ShowDataSources = ({navigation, colors}:{navigation:any, colors:ThemeColors}) => {
    return(
        <List.Item 
            title="Data sources" 
            titleStyle={{color:colors.text}} 
            rippleColor={colors.border} 
            onPress={() => navigation.push('DataSources')} 
        />
    );
}

type MediaLinksProps = {
    colors:ThemeColors;
}
const MediaLinks = ({colors}:MediaLinksProps) => {
    const portfolio_url = 'https://kuzutech.com';
    const blog_url = 'https://blog.kuzutech.com';
    const github_url = 'https://github.com/SmashinFries';
    const merch_url = 'https://kuzumerch.bigcartel.com';
    const instagram_url = 'https://www.instagram.com/smashinfries/';

    return(
        <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 15, justifyContent: 'space-evenly' }}>
            <IconButton icon={'web'} color={colors.primary} size={36} onPress={() => openURL(portfolio_url)} />
            <IconButton icon={'book-open-page-variant'} color={colors.primary} size={36} onPress={() => _openBrowserUrl(blog_url, colors.primary, colors.text)} />
            <IconButton icon={'github'} color={colors.primary} size={36} onPress={() => openURL(github_url)} />
            <IconButton icon={'instagram'} color={colors.primary} size={36} onPress={() => openURL(instagram_url)} />
            {/* <IconButton icon={'storefront-outline'} color={colors.primary} size={36} onPress={() => openURL(merch_url)} /> */}
        </View>
    );
}

const AllLinksButton = ({colors}:{colors:ThemeColors}) => {
    const url = 'https://linktr.ee/kuzutech';
    return(
        <Button 
            mode='outlined' 
            color={colors.text} 
            style={{ borderColor: colors.primary, width: '60%', alignSelf: 'center' }} 
            onPress={() => openURL(url)}
        >
            All the Links
        </Button>
    );
}

const KofiButton = ({colors}:{colors:ThemeColors}) => {
    const kofi_url = 'https://ko-fi.com/C0C7C2AUX';
    const kofi_image = 'https://cdn.ko-fi.com/cdn/kofi1.png?v=3';

    const openLink = () => _openBrowserUrl(kofi_url, colors.primary, colors.text);
    return(
        <Pressable style={{ marginTop: 20 }} onPress={openLink}>
            <FastImage 
                fallback 
                source={{ uri: kofi_image }} 
                style={{ alignSelf: 'center', height: 50, width: '90%' }} 
                resizeMode='contain' 
            />
        </Pressable>
    );
}

export { AboutHeaderButton, NewVersionBanner, VersionButton, CheckUpdateButton, WhatsNewButton, ShowDataSources, MediaLinks, AllLinksButton, KofiButton };