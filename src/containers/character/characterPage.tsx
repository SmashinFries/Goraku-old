import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Animated, Pressable, ScrollView, FlatList, useWindowDimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { Button, IconButton, Portal } from 'react-native-paper';
import { getCharacterDetail, toggleFav } from "../../Api/anilist/anilist";
import { CharDetailShort, CharFullEdge, MalCharImagesShort } from "../../Api/types";
import { CharDetailProps } from "../types";
import { MediaHeader } from "../../Components/header/mediaHeader";
import { handleCopy, handleShare, saveImage, shareImage } from "../../utils";
import { LinearGradient } from "expo-linear-gradient";
import { getMalChar } from "../../Api/mal";
import { HeaderBackButton, HeaderRightButtons } from "../../Components/header/headers";
import { ImageViewer, LoadingView } from "../../Components";
import RenderHtml from "react-native-render-html";
import QrView from "../../Components/qrView";
import { getDate } from "../../utils/time/getTime";

const CharDetailScreen = ({ navigation, route }: CharDetailProps) => {
    const { id, name, malId, type, inStack } = route.params;
    const {width, height} = useWindowDimensions();
    const [data, setData] = useState<CharDetailShort>(null);
    const [favorite, setFavorite] = useState(data ? data.isFavourite : false);
    const [images, setImages] = useState<MalCharImagesShort[]>(null);
    const [loading, setLoading] = useState(true);
    const [loadingAni, setLoadingAni] = useState(true);
    const [loadingImages, setLoadingImages] = useState(true);
    const [showQr, setShowQr] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const [selectedImg, setSelectedImg] = useState<number>(0);
    const { colors, dark } = useTheme();
    const parNav = navigation.getParent();
    const imageSize = [120, 180];
    const date = new Date();

    const toggleLike = () => {
        const status = toggleFav(id, 'CHARACTER')
        setFavorite(!favorite);
    }

    const qrOpen = () => setShowQr(true);
    const qrClose = () => setShowQr(false);

    useEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: colors.card },
            title: name,
            headerRight: () => (!loading) && <HeaderRightButtons navigation={navigation} colors={colors} id={id} drawer={inStack ?? false} share qrCode qrOnPress={() => qrOpen()} onShare={() => handleShare(data?.siteUrl ?? 'None')} />,
            headerLeft: () => <HeaderBackButton style={{ paddingRight: 10 }} colors={colors} navigation={navigation} />,
        });
    }, [navigation, dark, route, loading]);

    const getData = async (page = 1) => {
        const res = await getCharacterDetail(id, page, 20);
        return res.data.data.Character;
    }

    const getMalCharImages = async (first: string, last: string) => {
        const fullName = (last) ? last + ', ' + first : first;
        const res = await getMalChar(malId, fullName, type);
        setLoadingImages(res?.data?.length > 0 ? false : null);
        setImages(res?.data ?? []);
        return res;
    }

    type imageProp = {
        image: MalCharImagesShort;
        index: number;
    }
    const ImageItem = ({ image, index }: imageProp) => {
        return (
            <Pressable onPress={() => { setSelectedImg(index); setVisible(true) }} style={{ flexDirection: 'row', height: imageSize[1], width: imageSize[0], marginHorizontal: 5, marginTop: 10, }}>
                <FastImage fallback source={{ uri: image.jpg.image_url }} style={{ height: imageSize[1], width: imageSize[0] }} resizeMode={'contain'} />
            </Pressable>
        );
    }

    const FeaturedItem = ({ relation }:{relation:CharFullEdge}) => {
        return (
            // @ts-ignore
            <Pressable onPress={() => { parNav.push('DrawerInfo', { id: relation.node.id, coverImage: relation.node.coverImage.extraLarge, type: relation.node.type }) }} style={{ marginHorizontal: 10, borderRadius:8, width:140, height:200 }} >
                <LinearGradient locations={[0, 1]} colors={['rgba(0,0,0,.3)', 'rgba(0,0,0,.9)']} style={{ position: 'absolute', width: 140, height: 200, borderRadius:8, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <View style={{position:'absolute', alignSelf:'center', top:0}}>
                        <Text style={{ color: '#FFF', fontWeight:'bold', textTransform: 'capitalize' }}>{relation.node.format?.replace('_', ' ') ?? null}</Text>
                    </View>
                    <Text numberOfLines={3} style={{ fontWeight:'bold', color: '#FFF', textAlign:'center', textTransform: 'capitalize' }}>{relation.node.title.userPreferred ?? null}</Text>
                </LinearGradient>
                <FastImage source={{ uri: relation.node.coverImage.extraLarge }} style={{ width: 140, zIndex: -1, height: 200, borderRadius:8, position: 'absolute' }} />
            </Pressable>
        );
    }

    useEffect(() => {
        setLoading(true);
        getData().then(res => {
            setData(res);
            setLoadingAni(false);
            setFavorite(res.isFavourite);
            getMalCharImages(res.name.first, res.name.last).then(() =>
                new Promise(resolve => setTimeout(resolve, 500)).then(() =>
                    setLoading(false)
                )
            );
        });
        
    }, [id])

    if (loading) return <LoadingView colors={{colors, dark}} titleData={[{title:'Anilist Data', loading:loadingAni}, {title:'MAL Images', loading:loadingImages}]} />

    return (
        <View style={{ flex: 1 }}>
            <MediaHeader coverImage={data.media?.edges[0].node.coverImage.extraLarge} loc={[0, .35]} />
            <Animated.ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                <LinearGradient colors={['rgba(0,0,0,0)', colors.background]} locations={[0, .35]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ height: 290, width: 180 }}>
                            <FastImage source={{ uri: data?.image.large }} style={{ height: 290, width: 180, marginTop: 10, marginLeft: 10, borderRadius: 12, borderWidth: .5 }} />
                            <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']} locations={[0.85, 1]} style={{ position: 'absolute', justifyContent: 'flex-end', marginLeft: 10, marginTop: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, height: '100%', width: '100%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10, paddingBottom: 5, }}>
                                    <AntDesign name="heart" size={16} color="red" />
                                    <Text style={{ fontSize: 12, color: '#FFF' }}>{(data?.favourites !== null) ? data?.favourites : 0}</Text>
                                </View>
                                {(date.getDate()+1 === data.dateOfBirth.day && date.getMonth()+1 === data.dateOfBirth.month) && <IconButton icon={'cake-variant'} color={colors.primary} size={28} style={{position:'absolute', top:-10, right:-5}} />}
                            </LinearGradient>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                            <Text onLongPress={() => handleCopy(data?.name?.userPreferred)} style={{ textAlign: 'left', fontSize: 22, fontWeight: 'bold', color: colors.text }}>{data?.name?.userPreferred}</Text>
                            <Text onLongPress={() => handleCopy(data?.name?.native)} style={{ textAlign: 'left', fontSize: 18, color: colors.text }}>{data?.name?.native}</Text>
                            {(data?.dateOfBirth.day) ? <Text style={{ textAlign: 'left', fontSize: 15, color: colors.text }}>Birthday: {getDate(data.dateOfBirth)}</Text> : null}
                        </View>
                    </View>
                    <View style={{ flex: 1, marginTop: 30, paddingHorizontal: 10 }}>
                        <Button mode={(favorite) ? 'contained' : 'outlined'} onPress={toggleLike} icon={(!favorite) ? 'heart-outline' : 'heart'} color={'red'} style={{borderColor: 'red', borderWidth:(favorite) ? 0 : 1}}>
                            {(favorite) ? 'Favorited' : 'Favorite'}
                        </Button>
                        <RenderHtml defaultTextProps={{selectable:true}} tagsStyles={{body:{color:colors.text}}} enableExperimentalBRCollapsing contentWidth={width} source={{html:data.description}} />
                    </View>
                    <Text style={{ fontSize: 34, fontWeight: 'bold', paddingHorizontal: 10, color: colors.text }}>Featured In</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {data.media?.edges.map((relation, index) => <FeaturedItem key={index} relation={relation} />)}
                    </ScrollView>

                    {(images !== undefined && images?.length > 0) ? <View style={{ flex: 1, marginTop: 30, marginBottom: 20 }}>
                        <Text style={{ fontSize: 34, fontWeight: 'bold', paddingHorizontal: 10, color: colors.text }}>Images</Text>
                        <FlatList
                            data={images}
                            renderItem={({ item, index }) => <ImageItem image={item} index={index} />}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View> : null}
                </LinearGradient>
            </Animated.ScrollView>
            {(images !== undefined && images?.length > 0) ? <ImageViewer visible={visible} setVisible={setVisible} theme={{colors, dark}} imageIndex={selectedImg} images={images.map((image, idx) => { return ({ uri: image.jpg.image_url }); })} /> : null}
            <Portal>
                <QrView colors={colors} visible={showQr} onDismiss={qrClose} link={`goraku://character/${data.id}`} />
            </Portal>
        </View>
    )
}

export default CharDetailScreen;