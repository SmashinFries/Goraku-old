import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Text, useWindowDimensions, Animated } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import FastImage from 'react-native-fast-image';
import { IconButton } from 'react-native-paper';
import { AniMalType } from "../../../Api/types";
import { OverviewNav, OverviewProps } from "../../types";
import { handleCopy, handleShare } from "../../../utils";
import { getMediaListEntry, quickRemove, toggleFav, updateMediaListEntry } from "../../../Api";
import { ListEntryDialog } from "../../explore/components/entryModals";
import { PressableAnim } from "../../../Components/animated/AnimPressable";
import { HeaderBackButton, HeaderBackground, HeaderRightButtons } from "../../../Components/header/headers";
import { ListEntryUI, Trailer, MediaInformation, CharStaffList, ExternalLinkList, RecommendationList, RelationsList, TagScroll, OverViewHeader } from "./components";
import { openURL } from "expo-linking";
import RenderHtml from 'react-native-render-html';
import { Portal } from 'react-native-paper';
import { AnilistSVG } from "../../../Components/svg/svgs";
import QrView from "../../../Components/qrView";
import { ImageViewer } from "../../../Components";

const AnimGradient = Animated.createAnimatedComponent(LinearGradient);

type OverviewTabParams = {
    content: AniMalType;
    isList?: boolean;
}

const OverviewTab = ({ content, isList }: OverviewTabParams) => {
    const [data, setData] = useState(content);
    const [dates, setDates] = useState({ start: content.anilist.mediaListEntry?.startedAt ?? { year: null, month: null, day: null }, end: content.anilist.mediaListEntry?.completedAt ?? { year: null, month: null, day: null } });
    const [descVis, setDescVis] = useState(false);
    const [listEntryVis, setListEntryVis] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState({ vis: false, type: '' });
    const [imageIndex, setImageIndex] = useState(0);
    const { width, height } = useWindowDimensions();
    const { colors, dark } = useTheme();
    const descValue = useRef(new Animated.Value(85)).current;
    const gradientVal = useRef(new Animated.Value(1)).current;
    const bodyAnimVal = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<OverviewNav>();
    const episodes = (data.anilist.episodes) ? data.anilist.episodes : (data.anilist.format === 'NOVEL') ? data.anilist.volumes : data.anilist.chapters;
    const totalEP = Array.from(Array((episodes) ? episodes + 1 : 1001).keys());

    const handleFav = async () => {
        const status = await toggleFav(data.anilist.id, data.anilist.type);
        if (status === 200) {
            setData({ ...data, anilist: { ...data.anilist, isFavourite: !data.anilist.isFavourite } });
        }
    }

    const toggleDesc = (open: boolean) => {
        Animated.parallel([
            Animated.timing(descValue, {
                // 100 / 3
                toValue: open ? height : 85,
                duration: 400,
                useNativeDriver: false,
            }),
            Animated.timing(gradientVal, {
                toValue: open ? 0 : 1,
                duration: 400,
                useNativeDriver: true
            })
        ]).start();
    }

    const DescriptionView = () => {
        if (!data.anilist.description) return null;
        return(
            <View>
                <Animated.View style={{ maxHeight:descValue, paddingHorizontal:10 }}>
                    {/* TODO: Fix text not being selectable. Gradient may be the cause */}
                    <RenderHtml defaultTextProps={{selectable:true}} enableExperimentalBRCollapsing tagsStyles={{body:{color:colors.text}}} contentWidth={width} source={{html:data.anilist.description}} />
                </Animated.View>
                {(data.anilist.description.length > 99) ? <AnimGradient
                    colors={(!dark) ? ['rgba(242, 242, 242, .4)', colors.background] : ['rgba(0, 0, 0, .4)', colors.background]}
                    style={{ position: 'absolute', height: '101%', width: '100%', opacity: gradientVal, paddingVertical:5 }}
                    locations={[.2, .90]}
                /> : null}
                {(data.anilist.description.length > 99) ? <View
                    style={{ position: 'absolute', zIndex:5, bottom: -18, alignItems: 'center', width: '100%' }}
                >
                    <IconButton icon={(descVis === true) ? "chevron-up" : "chevron-down"} size={24} onPress={() => { toggleDesc(!descVis); setDescVis(!descVis) }} color={colors.text} />
                </View> : null}
            </View>
        );
    }

    const toggleEntryList = (open: boolean) => {
        Animated.parallel([
            Animated.timing(bodyAnimVal, {
                toValue: open ? 130 : 0,
                duration: 400,
                useNativeDriver: false
            })
        ]).start(() => setListEntryVis(!listEntryVis));
    }

    const handleQuickAdd = async () => {
        if (data.anilist.mediaListEntry === null) {
            const newStatus = await updateMediaListEntry(data.anilist.id, undefined, 'PLANNING');
            const newEntry = await getMediaListEntry(data.anilist.id);
            setData({ ...data, anilist: { ...data.anilist, mediaListEntry: newEntry.mediaListEntry } });
        } else {
            toggleEntryList(!listEntryVis);
        }
    }

    const handleQuickRemove = async () => {
        const deleted = await quickRemove(data.anilist.mediaListEntry.id);
        if (deleted) {
            setData({ ...data, anilist: { ...data.anilist, mediaListEntry: null } });
        }
    }

    const AuthDataUI = () => {
        if (!data.isAuth) return null;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20, marginHorizontal: 20 }}>
                <Pressable onPress={() => handleFav()} android_ripple={{ color: colors.primary, borderless: true }} style={{ alignItems: 'center' }}>
                    <IconButton icon={(!data.anilist.isFavourite) ? 'thumb-up-outline' : 'thumb-up'} color={(!data.anilist.isFavourite) ? colors.text : colors.primary} />
                    <Text style={{ color: (!data.anilist.isFavourite) ? colors.text : colors.primary }}>{(data.anilist.isFavourite) ? 'Favorited' : 'Favorite'}</Text>
                </Pressable>
                <Pressable android_ripple={{ color: colors.primary, borderless: true }} onPress={() => handleQuickAdd()} onLongPress={() => handleQuickRemove()} style={{ alignItems: 'center' }}>
                    <IconButton icon={(!data.anilist.mediaListEntry) ? 'plus' : 'check-underline'} color={(!data.anilist.mediaListEntry) ? colors.text : colors.primary} />
                    {(!data.anilist.mediaListEntry) ? <Text style={{ color: colors.text }}>Quick Add</Text>
                        : <Text style={{ color: colors.primary, textTransform: 'capitalize' }}>{data.anilist.mediaListEntry.status}</Text>
                    }
                </Pressable>
            </View>
        );
    }

    const StudioButton = () => {
        if (data.anilist.studios.nodes.length <= 0) return null;
        return (
            <PressableAnim onPress={() => navigation.navigate('StudioInfo', { id: data.anilist.studios.nodes[0].id, name: data.anilist.studios.nodes[0].name })} style={{ backgroundColor: colors.primary, borderRadius: 12, marginHorizontal: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center', height: 35 }}>
                <Text style={{ color: '#FFF', fontSize: 18 }}>Studio: {data.anilist.studios.nodes[0].name}</Text>
            </PressableAnim>
        );
    }

    const ImageList = () => {
        if (!data.images) return null;
        return (
            <View>
                <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>Images</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {data?.images.map((img, index) =>
                        <Pressable key={index} onPress={() => { setImageIndex(index); setVisible(true) }}>
                            <FastImage fallback source={{ uri: img.jpg.image_url }} resizeMode='contain' style={{ width: 130, height: 190, marginHorizontal: 10 }} />
                        </Pressable>
                    )}
                </ScrollView>
            </View>
        );
    }

    const SynonymsDisplay = () => {
        if (data.anilist.synonyms.length <= 0) return null;
        return (
            <View>
                <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>Synonyms</Text>
                <View style={{ marginLeft: 10 }}>
                    {data.anilist.synonyms.map((synonym, index) => <Text onLongPress={() => handleCopy(synonym)} key={index} style={{ fontSize: 16, color: colors.text }}>{synonym}</Text>)}
                </View>
            </View>
        );
    }

    const BackgroundInfo = () => {
        if (!data?.mal.data?.background) return null;
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>Background</Text>
                <Text style={{ padding: 10, fontSize: 15, color: colors.text }}>{data.mal.data.background}</Text>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: colors.background }}>
            <AuthDataUI />
            {(data.anilist.mediaListEntry) ?
                <Animated.View style={{ height: bodyAnimVal, paddingTop: 5 }}>
                    <ListEntryUI data={data} dates={dates} setDates={setDates} modalVisible={modalVisible} setModalVisible={setModalVisible} colors={colors} />
                </Animated.View>
                : null}
            <Animated.View style={{ backgroundColor: colors.background }}>
                <TagScroll genres={data.anilist.genres} tags={data.anilist.tags} colors={colors} />
                <DescriptionView />
                <View style={{backgroundColor:colors.background}}>
                    <MediaInformation data={data} type={data.anilist.type} colors={colors} />
                    <StudioButton />
                    <RelationsList data={data} navigation={navigation} colors={colors} />
                    <CharStaffList data={data} setData={setData} colors={colors} navigation={navigation} charData={data?.anilist.characters.edges} title='Characters' navLocation={'Character'} rolePosition='Top' />
                    <CharStaffList data={data} setData={setData} colors={colors} navigation={navigation} staffData={data?.anilist.staff.edges} title='Staff' navLocation={'Staff'} gradBottomLoc={[.1, .9]} rolePosition='Top' />
                    <Trailer trailer={data.anilist.trailer ?? null} width={width} colors={colors} />
                    <ImageList />
                    <RecommendationList data={data} navigation={navigation} colors={colors} />
                    <BackgroundInfo />
                    <SynonymsDisplay />
                    {(data.anilist.hashtag) ? <View>
                        <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>HashTag</Text>
                        <Text onLongPress={() => handleCopy(data.anilist.hashtag)} style={{ fontSize: 16, marginLeft: 10, color: colors.text }}>{data.anilist.hashtag}</Text>
                    </View> : null}
                    <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>Links</Text>
                    <View style={{ flex: 1 }}>
                        <ExternalLinkList data={data} colors={colors} />
                    </View>
                </View>
            </Animated.View>
            <ImageViewer data={data} imageIndex={imageIndex} visible={visible} setVisible={setVisible} theme={{ colors, dark }} />
            <Portal>
                <ListEntryDialog data={data} setData={setData} colors={{ colors, dark }} totalEP={totalEP} visible={modalVisible} setVisible={setModalVisible} />
            </Portal>
        </View>
    );
}

const MediaInfoScreen = ({ navigation, route }: OverviewProps) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const { data, isList } = route.params;
    const { colors, dark } = useTheme();
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 70],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });
    const qrOpen = () => setShowQr(true);
    const qrClose = () => setShowQr(false);

    useEffect(() => {
        navigation.setOptions({
            // @ts-ignore
            headerTitleStyle: { width: 150, opacity: headerOpacity },
            headerTitle: data.anilist.title.userPreferred,
            headerBackground: () => <HeaderBackground colors={colors} opacity={headerOpacity} />,
            headerRight: () =>
                <View style={{ paddingRight: 15 }}>
                    <HeaderRightButtons
                        colors={colors}
                        navigation={navigation}
                        drawer share qrCode
                        qrOnPress={() => qrOpen()}
                        onShare={() => handleShare(data.anilist.siteUrl, data.anilist.title.userPreferred)}
                    />
                </View>,
            headerLeft: () => <HeaderBackButton style={{ marginLeft: 15 }} colors={colors} navigation={navigation} />,
        });
    }, [headerOpacity, navigation, dark]);

    return (
        <View>
            <Animated.ScrollView
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {
                                y: scrollY,
                            }
                        }
                    }
                ], { useNativeDriver: true })}
                scrollEventThrottle={16}
            >
                <OverViewHeader data={data} colors={colors} dark={dark} setVisible={setVisible} />
                <OverviewTab content={data} isList={isList} />
                <Portal>
                    <QrView colors={colors} visible={showQr} onDismiss={qrClose} link={`goraku://info/${data.anilist.type.toLowerCase()}/${data.anilist.id}`} />
                </Portal>
                <ImageViewer imageIndex={0} visible={visible} setVisible={setVisible} theme={{colors, dark}} images={[{ uri: data.anilist.coverImage.extraLarge }, { uri: data.anilist.bannerImage }]} />
            </Animated.ScrollView>
        </View>
    );
}

export default MediaInfoScreen;