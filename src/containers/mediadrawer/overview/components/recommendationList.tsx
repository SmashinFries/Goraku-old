import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import FastImage from "react-native-fast-image";
import AwesomeButton from "react-native-really-awesome-button-fixed";
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
    if (data?.anilist.recommendations.edges.length <= 0) return null;
    return(
        <View>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>Recommendations</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {data?.anilist.recommendations.edges.map((rec, index) =>
                    <AwesomeButton key={index} backgroundColor='#000' onPress={() => { navigation.push('DrawerInfo', { id: rec.node.mediaRecommendation.id, coverImage: rec.node.mediaRecommendation.coverImage.extraLarge, type: rec.node.mediaRecommendation.type }) }} style={{ marginHorizontal: 10 }} backgroundDarker='#000' width={120} height={180}>
                        <FastImage fallback source={{ uri: rec.node.mediaRecommendation.coverImage.extraLarge }} style={{ width: 120, zIndex: -1, height: 180, position: 'absolute' }} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,.75)']} locations={[.6, .9]} style={{ position: 'absolute', height: '100%', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 14, color: '#FFF', textTransform: 'capitalize', fontWeight: 'bold', textAlign: 'center' }} numberOfLines={2}>{rec.node.mediaRecommendation.title.userPreferred}</Text>
                            <View style={{ position: 'absolute', top: 0, right: 0 }}>
                                <ScoreTag score={(rec.node.mediaRecommendation.averageScore !== null) ? rec.node.mediaRecommendation.averageScore : rec.node.mediaRecommendation.meanScore} />
                            </View>
                        </LinearGradient>
                    </AwesomeButton>
                )}
            </ScrollView>
        </View>
    );
}

export default RecommendationList;