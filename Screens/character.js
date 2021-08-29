import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, useWindowDimensions, FlatList, Linking, Vibration } from 'react-native';
import { Text, Image, Divider } from 'react-native-elements';
import RenderHTML from 'react-native-render-html';
import { useTheme, useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { getCharacter } from '../api/getdata';

export const CharacterPage = ({route}) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const {id, actor} = route.params;
    const {width, height} = useWindowDimensions();

    const getData = async() => {
        const info = await getCharacter(id);
        setData(info);
        setLoading(false);
    }

    const copyText = async(text) => {
        await Clipboard.setString(text);
        Vibration.vibrate(200);
    }

    useEffect(() => {
        getData();
    }, []);

    const _voiceActor = ({ item }) => {
        return(
            <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 10}}>
                <Image source={{ uri: item.image.large }} onPress={() => {navigation.push('VA', {id:item.id})}} style={{ resizeMode: 'cover', width: 150, height: 200, borderRadius: 8 }}
                />
                <View style={{ backgroundColor: 'rgba(0,0,0,.6)', position: 'absolute', width: 150, height: 40, top: 165, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                    <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.name.full}</Text>
                    <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.languageV2}</Text>
                </View>
            </View>
        );
    }

    const _relatedMedia = ({ item }) => {
        return(
            <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 10}}>
                <Image source={{ uri: item.node.coverImage.extraLarge }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}
                    onPress={() => {navigation.push('Info', {id:item.node.id, title:item.node.title})}}
                />
                <View style={{ backgroundColor: 'rgba(0,0,0,.6)', position: 'absolute', width: 125, height: 30, top: 155, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
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

    if (loading || actor === undefined) return <ActivityIndicator size='large' color='#00ff00' />

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
                            <SectionInfo header='DOB' info={(data.dateOfBirth.month !== null) ? `${data.dateOfBirth.month}/${data.dateOfBirth.day}/${(data.dateOfBirth.year !== null) ? data.dateOfBirth.year : '????'}` : 'Unknown'} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Blood Type' info={(data.bloodType !== null) ? data.bloodType : 'Unknown'} />
                            <Divider orientation='vertical' />
                            <SectionInfo header='Favorited' info={data.favourites} />
                        </View>
                    </ScrollView>
                </View>
                <Text h4 style={{paddingLeft:5, color:colors.text}}>Voiced By</Text>
                <FlatList
                    data={actor}
                    windowSize={3}
                    horizontal={true}
                    maxToRenderPerBatch={3}
                    renderItem={_voiceActor}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 5, paddingLeft:5 }}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ alignSelf: 'center' }}
                    showsHorizontalScrollIndicator={false}
                />
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
                <Text h4 style={{paddingLeft:5, color:colors.text}}>Description</Text>
                <RenderHTML source={{html: data.description}} contentWidth={width} baseStyle={{paddingHorizontal:5, color:colors.text}}/>
            </ScrollView>
        </View>
    );
}