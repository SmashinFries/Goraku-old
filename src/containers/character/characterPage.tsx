import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Animated, Pressable, ScrollView, FlatList } from "react-native";
import FastImage from 'react-native-fast-image';
import { Button, Portal } from 'react-native-paper';
import { getCharacterDetail, toggleFav } from "../../Api/anilist/anilist";
import { CharDetailShort, CharFullEdge, MalCharImagesShort } from "../../Api/types";
import { CharDetailProps } from "../types";
import { MediaHeader } from "../../Components/header/mediaHeader";
import { handleShare } from "../../utils";
import { LinearGradient } from "expo-linear-gradient";
import { getMalChar } from "../../Api/mal";
import { HeaderBackButton, HeaderRightButtons } from "../../Components/header/headers";
import { ImageViewer, LoadingView } from "../../Components";
import RenderHtml from "react-native-render-html";
import QrView from "../../Components/qrView";
import { CharacterBody, CharacterFeatured, CharacterHeaderImage, CharacterImages, CharacterOverview } from "./components/views";

const CharDetailScreen = ({ navigation, route }: CharDetailProps) => {
    const { id, name, malId, type, inStack } = route.params;
    const [data, setData] = useState<CharDetailShort>(null);
    const [favorite, setFavorite] = useState(data ? data.isFavourite : false);
    const [images, setImages] = useState<MalCharImagesShort[]>(null);
    const [links, setLinks] = useState({aniLink: null, malLink: null});
    const [loading, setLoading] = useState(true);
    const [loadingAni, setLoadingAni] = useState(true);
    const [loadingImages, setLoadingImages] = useState(true);
    const [showQr, setShowQr] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const [selectedImg, setSelectedImg] = useState<number>(0);
    const { colors, dark } = useTheme();
    const parNav = navigation.getParent();
   
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

    const getMalCharImages = async (first: string, last: string, aniLink:string) => {
        const fullName = (last) ? last + ', ' + first : first;
        const res = await getMalChar(malId, fullName, type);
        setLoadingImages(res?.images?.data?.length > 0 ? false : null);
        setImages(res?.images?.data ?? []);
        setLinks({aniLink:aniLink, malLink:res?.link})
        return res;
    }

    useEffect(() => {
        setLoading(true);
        getData().then(res => {
            setData(res);
            setLoadingAni(false);
            setFavorite(res.isFavourite);
            getMalCharImages(res.name.first, res.name.last, res.siteUrl).then(() =>
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
                        <CharacterHeaderImage data={data} date={date} colors={colors} />
                        <CharacterOverview data={data} colors={colors} />
                    </View>
                    <CharacterBody data={data} links={links} favorite={favorite} toggleLike={toggleLike} colors={colors} />
                    <CharacterFeatured data={data} parNav={parNav} colors={colors} />
                    <CharacterImages images={images} setSelectedImg={setSelectedImg} setVisible={setVisible} colors={colors} />
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