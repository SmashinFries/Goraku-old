// React
import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, useWindowDimensions, FlatList, Linking } from 'react-native';
// UI
import { Text, Image, Divider } from 'react-native-elements';
// Navigation
import { useTheme, useNavigation } from '@react-navigation/native';
// Data
import { getVA } from '../Data Handler/getdata';
import { copyText } from './character';
import { getLanguage } from '../Storages/storagehooks';
import Markdown from 'react-native-markdown-display';
import { md, rules } from '../Utils/markdown';

export const VA_Page = ({route}) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState('Romaji');
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const {id, role, routeName} = route.params;
    const {width, height} = useWindowDimensions();

    const fetchLang = async () => {
        const language = await getLanguage();
        return(language);
    }

    const getData = async() => {
        await fetchLang();
        const info = await getVA(id);
        return(info);
        
    }

    useEffect(() => {
        let mounted = true;
        fetchLang().then((language) => {
            if (mounted) {
                setLang(language);
            }
        });
        getData().then((info) => {
            if (mounted) {
                setData(info);
                setLoading(false);
            }
        });
        return () => mounted = false;
    }, []);

    const grabGPS = (item) => {
        if (routeName === 'Info') {
            navigation.push('Info',{id:item.node.id});
        } else if ((routeName === 'UserPage')) {
            navigation.push('UserContent',{screen: 'Info', params:{id:item.node.id}}); 
        } else {
            navigation.push('InfoSearch',{screen: 'Info', params:{id:item.node.id}});
        }
    }

    const _characterItem = ({ item }) => {
        const language = (lang === 'Native' && typeof item.node.native === 'string') ? item.node.name.native : item.node.name.userPreferred;
        return (
            <View style={{ margin:5 }}>
                <Image source={{ uri: item.node.image.large }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}
                    onPress={() => {navigation.push((routeName === 'Info') ? 'Character' : (routeName === 'UserPage') ? 'UserFavorite' : 'SearchCharacter' ,{id: item.node.id, routeName: routeName})}} 
                >
                    <View style={{ position:'absolute', justifyContent:'center', backgroundColor: 'rgba(0,0,0,.5)', bottom:0, width: 125, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{language}</Text>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.role}</Text>
                    </View>
                </Image>
            </View>
        )
    };

    const _relatedMedia = ({ item }) => {
        return (
            <View style={{ margin:5 }}>
                <Image source={{ uri: item.node.coverImage.extraLarge }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}
                    onPress={() => grabGPS(item)}
                >
                    <View style={{ position:'absolute', justifyContent:'center', backgroundColor: 'rgba(0,0,0,.5)', bottom:0, width: 125, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={2}>{item.staffRole}</Text>
                    </View>
                    <View style={{ position:'absolute', justifyContent:'center', backgroundColor: 'rgba(0,0,0,.5)', top:0, width: 125, height: 40, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={2}>{(lang === 'Native') ? item.node.title.native : item.node.title.romaji}</Text>
                    </View>
                </Image>
            </View>
        )
    }

    const SectionInfo = ({header, info}) => {
        return(
            <View style={{ justifyContent: 'center', margin: 5 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color:colors.text }}>{header}</Text>
                <Text style={{ textAlign: 'center', fontSize: 16, color:colors.text}}>{(info !== null) ? info : 'Unknown'}</Text>
            </View>
        );
    }

    if (loading || data === undefined) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size='large' color={colors.primary} /></View>

    return(
        <View style={{flex:1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flex:1, flexDirection:'row'}}>
                    <View style={{flexBasis:100}}/>
                    <Image source={{uri: data.image.large}} style={{justifyContent:'center', height:300, width:210, resizeMode:'cover', borderRadius:15, borderWidth:2}} containerStyle={{alignSelf:'center', marginTop:10}} />
                    {(data.name.native !== null && data.languageV2 === 'Japanese') ? <View style={{flex:1, justifyContent:'center'}}>
                        <Text h2 style={{textAlignVertical:'center', color:colors.text}} onLongPress={() => {Linking.openURL(`https://jisho.org/search/${data.name.native}%20%23kanji`)}}>{data.name.native.split('').map(char => `${char}${'\n'}`)}</Text>
                    </View> : null}
                </View>
                <Text h2 style={{textAlign:'center', justifyContent:'center', color:colors.text}} onLongPress={() => {copyText(data.name.full)}}>{data.name.full}</Text>
                <View style={{borderWidth:1, minHeight:70, marginHorizontal:5, justifyContent:'space-evenly', borderColor:colors.border}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                        <View style={{flex:1, flexDirection:'row'}}>
                            <SectionInfo header='Gender' info={data.gender} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Age' info={data.age} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Language' info={data.languageV2} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='DOB' info={(data.dateOfBirth !== null) ? `${data.dateOfBirth.month}/${data.dateOfBirth.day}/${data.dateOfBirth.year}` : 'Unknown'} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Blood Type' info={data.bloodType} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Hometown' info={data.homeTown} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Main Job' info={(data.primaryOccupations.length > 0) ? data.primaryOccupations : null} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Active' info={(data.yearsActive.length > 0) ? data.yearsActive : null} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Favorited' info={data.favourites} />
                        </View>
                    </ScrollView>
                </View>
                {(data.characters.edges.length > 0 ) ? <View style={{flex:1}}>
                <Text h4 style={{paddingLeft:5, color:colors.text}}>{(data.characters.edges.length > 0) ? 'Characters' : 'Roles'}</Text>
                <FlatList
                    data={data.characters.edges}
                    windowSize={3}
                    horizontal={true}
                    maxToRenderPerBatch={3}
                    renderItem={_characterItem}
                    style={{ paddingBottom: 10, paddingTop: 5, paddingLeft:5 }}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ alignSelf: 'center' }}
                    showsHorizontalScrollIndicator={false}
                /></View> : null}
                {(data.staffMedia.edges.length > 0 ) ? <View style={{flex:1}}>
                <Text h4 style={{paddingLeft:5, color:colors.text}}>Roles</Text>
                <FlatList
                    data={data.staffMedia.edges}
                    windowSize={3}
                    horizontal={true}
                    maxToRenderPerBatch={3}
                    renderItem={_relatedMedia}
                    style={{ paddingBottom: 10, paddingTop: 5, paddingLeft:5 }}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ alignSelf: 'center' }}
                    showsHorizontalScrollIndicator={false}
                /></View> : null}
                {(data.description !== null) ? <View style={{flex:1}}>
                    <Text h4 style={{paddingLeft:5, color:colors.text}}>Description</Text>
                    <Markdown rules={rules} style={{body: {color:colors.text, paddingHorizontal:5}}}>{md(data.description)}</Markdown>
                </View> : null}
            </ScrollView>
        </View>
    );
}