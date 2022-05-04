import React, { Dispatch, SetStateAction } from "react";
import { View, Pressable, Text, Animated } from "react-native";
import FastImage from "react-native-fast-image";
import { MaterialIcons } from '@expo/vector-icons';
import { AniMalType } from "../../../../Api/types";
import { AnilistSVG, MalSVG } from "../../../../Components/svg/svgs";
import { getMalScoreColor, getScoreColor, handleCopy, getTime } from "../../../../utils";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeColors } from "../../../../Components/types";

type Props = {
    data: AniMalType;
    colors: ThemeColors;
    dark: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    scrollValue?: Animated.Value;
}
const OverViewHeader = ({data, colors, dark, setVisible, scrollValue}:Props) => {
    return (
        <View style={{ width: '100%', backgroundColor: 'transparent' }}>
            <View>
                <View style={{ zIndex: 1, flexDirection: 'row', marginTop: 100, marginLeft: 20 }}>
                    <Pressable onPress={() => setVisible(true)} style={{ height: 200, width: 130 }}>
                        <FastImage fallback source={{ uri: data.anilist.coverImage.extraLarge, priority: 'high' }} style={{ height: 200, width: 130, borderRadius: 8 }} resizeMode='cover' />
                    </Pressable>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                        <Text onLongPress={() => handleCopy(data?.anilist.title.userPreferred)} style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }} >{data?.anilist.title.userPreferred}</Text>
                        {(!data.anilist.isLicensed) ? <Text style={{ fontSize: 16, textTransform: 'capitalize', color: colors.text }}>{'Doujinshi'}</Text> : null}
                        <View style={{ flexDirection: 'row' }}>
                            {(data?.anilist.format !== null) ? <Text style={{ fontSize: 16, color: colors.text, textTransform: (data?.anilist.format !== 'TV') ? 'capitalize' : 'none' }}>{data?.anilist.format} ・ </Text> : null}
                            <Text style={{ fontSize: 16, textTransform: 'capitalize', color: colors.text }}>{data?.anilist.status.replace(/_/g, ' ')}</Text>
                        </View>
                        {/* {data?.anilist.season ? <Text style={{ fontSize: 16, color: colors.text, textTransform:'capitalize' }}>{data?.anilist.season} {data.anilist.seasonYear ?? ''}</Text> : null} */}
                        {(data?.anilist.averageScore !== null || data?.anilist.meanScore !== null || data?.mal.data?.score || data?.mal.data?.scored) ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {(data?.anilist.averageScore !== null || data?.anilist.meanScore !== null) ? <>
                                <AnilistSVG color={'rgb(60,180,242)'} height={18} width={18} />
                                <Text style={{ fontSize: 16, textTransform: 'capitalize', fontWeight: 'bold', color: getScoreColor(data?.anilist.averageScore ?? data?.anilist.meanScore), marginLeft: 5 }}>
                                    {data?.anilist.averageScore ?? data?.anilist.meanScore}%
                                </Text>
                            </> : null}
                            {((data?.anilist.averageScore !== null || data?.anilist.meanScore !== null) && (data?.mal.data?.score || data?.mal.data?.scored)) ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>・</Text> : null}
                            {(data.mal.data?.score || data.mal.data?.scored) ?
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MalSVG color='#2A50A3' />
                                    <Text style={{ fontSize: 16, textTransform: 'capitalize', fontWeight: 'bold', color: getMalScoreColor((data?.anilist.type === 'ANIME') ? data?.mal.data.score : data?.mal.data.scored), marginLeft: 5 }}>
                                        {(data?.anilist.type === 'ANIME') ? data?.mal.data?.score : data?.mal.data?.scored}
                                    </Text>
                                </View> : null}
                        </View> : null}

                        {(data?.anilist.nextAiringEpisode !== null) ? <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name="access-time" size={16} style={{ alignSelf: 'center' }} color={colors.text} />
                            <Text style={{ fontSize: 16, marginLeft: 5, color: colors.text }}>EP {data?.anilist.nextAiringEpisode.episode}・</Text>
                            {(data?.anilist.nextAiringEpisode !== null) ? <Text style={{ fontSize: 16, color: colors.primary, fontWeight: 'bold' }}>{getTime(data?.anilist.nextAiringEpisode?.timeUntilAiring)}</Text> : null}
                        </View> : null}

                        {(data?.anilist.episodes) ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="personal-video" size={16} color={colors.text} />
                            <Text style={{ fontSize: 16, textTransform: 'capitalize', marginLeft: 5, color: colors.text }}>{data?.anilist.episodes} Episodes</Text>
                        </View> : null}
                        {(data?.anilist.chapters && data?.anilist.format !== 'NOVEL') ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="book" size={16} color={colors.text} />
                            <Text style={{ fontSize: 16, textTransform: 'capitalize', marginLeft: 5, color: colors.text }}>{`${data?.anilist.chapters+' Chapters'}`}</Text>
                        </View> : null}
                        {(data?.anilist.volumes && data?.anilist.format === 'NOVEL') ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="book" size={16} color={colors.text} />
                            <Text style={{ fontSize: 16, textTransform: 'capitalize', marginLeft: 5, color: colors.text }}>{`${data?.anilist.volumes + ' Volumes'}`}</Text>
                        </View> : null}
                    </View>
                </View>
                <FastImage source={{ priority: 'high', uri: (data.anilist.bannerImage !== null) ? data.anilist.bannerImage : data.anilist.coverImage.extraLarge }} fallback style={{ position: 'absolute', zIndex: -1, height: 195, width: '100%' }} resizeMode='cover' />
                <LinearGradient colors={(!dark) ? ['rgba(242, 242, 242, .4)', colors.background] : ['rgba(0, 0, 0, .3)', colors.background]} locations={[.2, .95]} style={{ position: 'absolute', height: 195, width: '100%' }} />
            </View>
        </View>
    );
}

export default OverViewHeader; 