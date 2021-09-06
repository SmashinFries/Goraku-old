import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, useWindowDimensions, FlatList, Linking } from 'react-native';
import { Text, Image, Divider } from 'react-native-elements';
import RenderHTML from 'react-native-render-html';
import { useTheme, useNavigation } from '@react-navigation/native';
import { getVA } from '../api/getdata';
import { copyText } from './character';

export const VA_Page = ({route}) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const {id, role} = route.params;
    const {width, height} = useWindowDimensions();

    const getData = async() => {
        const info = await getVA(id);
        setData(info);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    const _characterItem = ({ item }) => {
        return (
            <View style={{ margin:5 }}>
                <Image source={{ uri: item.node.image.large }} style={{ resizeMode: 'cover', width: 125, height: 180, borderRadius: 8 }}
                    onPress={() => {navigation.push('Character', {id: item.node.id, actor: [data]})}} 
                >
                    <View style={{ position:'absolute', justifyContent:'center', backgroundColor: 'rgba(0,0,0,.5)', bottom:0, width: 125, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={1}>{item.node.name.full}</Text>
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
                    onPress={() => {navigation.push('Info', {id:item.node.id, title:item.node.title})}}
                >
                    <View style={{ position:'absolute', justifyContent:'center', backgroundColor: 'rgba(0,0,0,.5)', bottom:0, width: 125, height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={2}>{item.staffRole}</Text>
                    </View>
                    <View style={{ position:'absolute', justifyContent:'center', backgroundColor: 'rgba(0,0,0,.5)', top:0, width: 125, height: 40, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                        <Text style={{ color: '#FFF', textAlign: 'center' }} numberOfLines={2}>{item.node.title.romaji}</Text>
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

    if (loading || data === undefined) return <ActivityIndicator size='large' color='#00ff00' />

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
                <Text h4 style={{paddingLeft:5, color:colors.text}}>{(role === undefined) ? 'Characters' : 'Roles'}</Text>
                <FlatList
                    data={(role === undefined) ? data.characters.edges : data.staffMedia.edges }
                    windowSize={3}
                    horizontal={true}
                    maxToRenderPerBatch={3}
                    renderItem={(role === undefined) ? _characterItem : _relatedMedia}
                    style={{ flexGrow: 0, paddingBottom: 10, paddingTop: 5, paddingLeft:5 }}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ alignSelf: 'center' }}
                    showsHorizontalScrollIndicator={false}
                />
                <Text h4 style={{paddingLeft:5, color:colors.text}}>Description</Text>
                <RenderHTML source={{html: data.description}} contentWidth={width} baseStyle={{paddingHorizontal:5, color:colors.text}} />
            </ScrollView>
        </View>
    );
}