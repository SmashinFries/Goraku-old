import React from "react";
import { View, Text, FlatList, ActivityIndicator, useWindowDimensions, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Button, IconButton } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { MDTag, MetadataDA, StatsDA } from "../../../Api/deviantArt/types";
import { ThemeColors } from "../../../Components/types";
import { _openBrowserUrl } from "../../../utils";
import { TagScroll } from "../../mediadrawer/overview/components";

type Props = {
    data: MetadataDA;
    url: string;
    colors: ThemeColors;
}
export const DevArtMetaData = ({data, url, colors}:Props) => {
    const { width, height } = useWindowDimensions();

    const tagItem = (item:MDTag, idx:number) => {
        return(
            <Pressable key={idx} style={{ padding: 5, height: 35, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10, marginHorizontal: 5, marginVertical: 10, backgroundColor: colors.primary, borderRadius: 12 }}>
                <Text style={{ color: '#FFF' }}>{item.tag_name}</Text>
            </Pressable>
        )
    }

    const TotalViews = () => {
        return (
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <IconButton icon={'eye'} />
                <Text style={{ color: colors.text }}>{data.stats.views}</Text>
            </View>
        );
    }

    const TotalLikes = () => {
        return(
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <IconButton icon={'thumb-up'} />
                <Text style={{ color: colors.text }}>{data.stats.favourites}</Text>
            </View>
        );
    }

    const TotalDownloads = () => {
        return(
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <IconButton icon={'download-box'} />
                <Text style={{ color: colors.text }}>{data.stats.downloads}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <TotalViews />
                <TotalLikes />
                <TotalDownloads />
            </View>
            {(data.tags) ? <ScrollView horizontal>
                {data.tags.map(tagItem)}
            </ScrollView> : null}
            <Button mode='outlined' onPress={() => _openBrowserUrl(url, colors.primary, colors.text)}>Open Site</Button>
            {(data.description) ? <View style={{width:'100%', alignItems:'center', paddingTop:20}}>
                    <RenderHTML source={{html:data.description}} tagsStyles={{body:{color:colors.text}}} contentWidth={width} />
            </View> : null}
        </View>
    );
}