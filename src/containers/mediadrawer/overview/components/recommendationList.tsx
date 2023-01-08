import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { AniMalType } from "../../../../Api/types";
import { ScoreTag } from "../../../../Components/Tiles/mediaTile";
import { ThemeColors } from "../../../../Components/types";
import { OverviewNav } from "../../../types";

type Props = {
    data: AniMalType;
    colors: ThemeColors;
    navigation: OverviewNav;
}
const RecommendationList = ({data, colors, navigation}:Props) => {
    if (data?.anilist.recommendations.edges.length < 1) return null;
    return(
        <View>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontFamily:'Inter_900Black', color: colors.text }}>Recommendations</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {data?.anilist.recommendations.edges.filter((recom) => recom.node.mediaRecommendation !== null).map((rec, index) =>
                    <Pressable key={index} onPress={() => { navigation.push('DrawerInfo', { id: rec.node.mediaRecommendation.id, coverImage: rec.node.mediaRecommendation.coverImage.extraLarge, type: rec.node.mediaRecommendation.type }) }} style={{ marginHorizontal: 10, width: 120, height: 180, overflow:'hidden', borderRadius:8 }}>
                        <FastImage fallback source={{ uri: rec.node.mediaRecommendation.coverImage?.extraLarge }} style={{ width: 120, zIndex: -1, height: 180, borderRadius:8, position: 'absolute' }} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,.75)']} locations={[.6, .9]} style={{ position: 'absolute', height: '100%', borderRadius:8, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 14, color: '#FFF', textTransform: 'capitalize', fontFamily:'Inter_900Black', textAlign: 'center' }} numberOfLines={2}>{rec.node.mediaRecommendation.title.userPreferred}</Text>
                            <View style={{ position: 'absolute', top: 0, right: 0 }}>
                                <ScoreTag score={(rec.node.mediaRecommendation.averageScore !== null) ? rec.node.mediaRecommendation.averageScore : rec.node.mediaRecommendation.meanScore} />
                            </View>
                        </LinearGradient>
                    </Pressable>
                )}
            </ScrollView>
        </View>
    );
}

export default RecommendationList;