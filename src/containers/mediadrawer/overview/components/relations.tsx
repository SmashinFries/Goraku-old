import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ScrollView, Text, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import AwesomeButton from "react-native-really-awesome-button-fixed";
import { AniMalType } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import { OverviewNav } from "../../../types";

type Props = {
    data: AniMalType;
    navigation: OverviewNav;
    colors: ThemeColors;
}
const RelationsList = ({data, navigation, colors}:Props) => {
    if (data?.anilist.relations.edges.length <= 0) return null;
    return(
        <View>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>Relations</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {data?.anilist.relations.edges.map((relation, index) =>
                    <Pressable key={index} onPress={() => { navigation.push('DrawerInfo', { id: relation.node.id, coverImage: relation.node.coverImage.extraLarge, type: relation.node.type }) }} style={{ marginHorizontal: 10, width:120, height:180, borderRadius:8 }}>
                        <FastImage fallback source={{ uri: relation.node.coverImage.extraLarge }} style={{ width: '100%', height: '100%', position: 'absolute', borderRadius:8 }} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,.6)']} locations={[.5, .8]} style={{ position: 'absolute', height: '100%', justifyContent: 'flex-end', alignItems: 'center', width: '100%', borderRadius:8 }}>
                            <Text style={{ fontSize: 14, color: '#FFF', textTransform: 'capitalize' }}>{relation.node.format}</Text>
                            <Text style={{ fontSize: 14, color: '#FFF', textTransform: 'capitalize', fontWeight: 'bold' }}>{relation.relationType.replace('_', ' ')}</Text>
                        </LinearGradient>
                    </Pressable>
                )}
            </ScrollView>
        </View>
    );
}

export default RelationsList;