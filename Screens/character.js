// React
import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, useWindowDimensions, FlatList, Linking, Vibration, ToastAndroid } from 'react-native';
// UI
import { Text, Image, Divider } from 'react-native-elements';
// Navigation
import { useTheme, useNavigation } from '@react-navigation/native';
// Data
import Markdown from 'react-native-markdown-display';
import Clipboard from '@react-native-clipboard/clipboard';
import { getCharacter } from '../Data Handler/getdata';
import { getLanguage } from '../Storages/storagehooks';
import { md, rules } from '../Utils/markdown';

export const copyText = async(text) => {
    await Clipboard.setString(text);
    ToastAndroid.show('Text copied!', ToastAndroid.SHORT);
    Vibration.vibrate(20);
}

export const Character = ({route}) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState('Romaji');
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const {id, routeName} = route.params;
    const {width, height} = useWindowDimensions();

    const fetchLang = async () => {
        const language = await getLanguage();
        return language;
    }

    const getData = async() => {
        await fetchLang();
        const info = await getCharacter(id);
        return info;
    }

    useEffect(() => {
        let mounted = true;
        fetchLang().then((language) => {
            if (mounted) {
                setLang(language);
            }
        });
        getData().then((info) => {
            if(mounted) {
                setData(info);
                setLoading(false);
            }
        });
        return () => {mounted = false};
    }, []);

    const _voiceActor = ({ item }) => {
        const language = (lang === 'Native' && item.name.native !== null) ? item.name.native : item.name.userPreferred;
        return(
            <View style={{ paddingTop: 5, paddingRight: 10}}>
                <Image source={{ uri: item.image.large }} onPress={() => {navigation.push((routeName === 'Info') ? 'VA' : (routeName === 'UserPage') ? 'UserVA' : 'SearchStaff', {id:item.id, role:undefined, routeName:routeName})}} style={{ resizeMode: 'cover', width: 150, height: 200, borderRadius: 8 }}
                />
                <View style={{ backgroundColor: 'rgba(0,0,0,.6)', justifyContent:'center', position: 'absolute', width: 150, height: 40, bottom:0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                    <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{language}</Text>
                    <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.languageV2}</Text>
                </View>
            </View>
        );
    }

    const _relatedMedia = ({ item }) => {
        return(
            <View style={{ paddingTop: 5, paddingRight: 10}}>
                <Image source={{ uri: item.node.coverImage.extraLarge }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}
                    onPress={() => {
                        navigation.push(
                            (routeName === 'Info') ? 'Info' : (routeName === 'UserPage') ? 'UserContent' : 'InfoSearch', 
                            (routeName === 'UserPage' || routeName === 'SearchPage') ? {screen:'Info', params: {id:item.node.id, title:item.node.title}} : {id:item.node.id, title:item.node.title})}}
                />
                <View style={{ backgroundColor: 'rgba(0,0,0,.6)', justifyContent:'center', position: 'absolute', width: 125, height: 30, bottom:-1, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                    <Text style={{ color: '#FFF', textAlign: 'center'}} numberOfLines={1}>{item.node.format}</Text>
                </View>
            </View>
        );
    }

    const SectionInfo = ({header, info, style=null}) => {
        return(
            <View style={{ justifyContent: 'center', margin: 5 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize:18, color:colors.text}}>{header}</Text>
                <Text style={(style === null) ? { textAlign: 'center', fontSize:16, color:colors.text} : style}>{(info !== null) ? info : 'Unknown'}</Text>
            </View>
        );
    }

    if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        <View style={{flex:1}}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flexBasis: 100 }} />
                    <Image source={{ uri: data.image.large }} style={{ justifyContent: 'center', height: 300, width: 210, resizeMode: 'cover', borderRadius: 15, borderWidth: 2 }} containerStyle={{ alignSelf: 'center', marginTop: 10 }} />
                    {(data.name.native !== null && data.name.native.length < 10) ? <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlignVertical: 'center', color:colors.text, fontWeight:'bold', fontSize:(data.name.native.length < 6) ? 34 : 18 }} onLongPress={() => { Linking.openURL(`https://jisho.org/search/${data.name.native}%20%23kanji`) }}>{data.name.native.split('').map(char => `${char}${'\n'}`)}</Text>
                    </View> : null}
                </View>
                <Text h2 style={{textAlign:'center', justifyContent:'center', color:colors.text}} onLongPress={() => copyText(data.name.full)}>{data.name.full}</Text>
                <View style={{borderWidth:1, minHeight:50, marginHorizontal:5, justifyContent:'space-evenly', borderColor:colors.border}}>
                    <ScrollView horizontal={true} showsVerticalScrollIndicator={false} >
                        <View style={{flex:1, flexDirection:'row'}}>
                            <SectionInfo header='Gender' info={(data.gender !== null) ? data.gender : 'N/A'} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Age' info={(data.age !== null) ? data.age : 'N/A'} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='DOB' info={(data.dateOfBirth.month !== null) ? `${(data.dateOfBirth.month !== null) ? data.dateOfBirth.month : '?' }/${(data.dateOfBirth.day !== null) ? data.dateOfBirth.day : '?' }/${(data.dateOfBirth.year !== null) ? data.dateOfBirth.year : '?'}` : 'Unknown'} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Blood Type' info={(data.bloodType !== null) ? data.bloodType : 'Unknown'} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Favorited' info={data.favourites} />
                        </View>
                    </ScrollView>
                </View>
                {(data.media.edges[0].voiceActors.length > 0) ? <Text h4 style={{paddingLeft:5, color:colors.text}}>Voiced By</Text> : null}
                {(data.media.edges[0].voiceActors.length > 0) ? <FlatList
                    data={data.media.edges[0].voiceActors}
                    windowSize={3}
                    horizontal={true}
                    maxToRenderPerBatch={3}
                    renderItem={_voiceActor}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 5, paddingLeft:5 }}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ alignSelf: 'center' }}
                    showsHorizontalScrollIndicator={false}
                /> : null}
                <Text h4 style={{paddingLeft:5, color:colors.text}}>Featured In</Text>
                <FlatList
                    data={data.media.edges}
                    windowSize={3}
                    horizontal={true}
                    maxToRenderPerBatch={3}
                    renderItem={_relatedMedia}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 5, paddingLeft:5 }}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ alignSelf: 'center' }}
                    showsHorizontalScrollIndicator={false}
                />
                {(typeof data.description === 'string') ? <Text h4 style={{paddingLeft:5, color:colors.text}}>Description</Text> : null}
                {(typeof data.description === 'string') ? <Markdown rules={rules} style={{body: {color:colors.text, marginHorizontal:5}}}>{md(data.description)}</Markdown> : null}
            </ScrollView>
        </View>
    );
}