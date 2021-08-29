import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { _ContentTile, height } from "./customtile";
import { useTheme, useRoute } from "@react-navigation/native";
import { getSeason, getNextSeason, getTrend, getPopular, getTop } from '../api/getdata';

export const HomeDisplay = ({data, page, type, section, isAdult}) => {
    const [info, setInfo] = useState(data);
    const routeName = useRoute();
    const [newpage, setPage] = useState(1);
    const { colors } = useTheme();

    const fetchMore = async() => {
        if (section === 'This Season' && newpage < page.lastPage) {
            const content  = await getSeason(newpage + 1, isAdult);
            await setInfo(content);
            await setPage(newpage + 1);
        } else if (section === 'Next Season' && newpage < page.lastPage) {
            const content  = await getNextSeason(newpage + 1, isAdult);
            await setInfo(content);
            await setPage(newpage + 1);
        } else if (section === 'Trending' && newpage < page.lastPage) {
            const content  = await getTrend(type, newpage + 1, (data[0].format === 'NOVEL') ? 'NOVEL' : undefined, isAdult);
            await setInfo(content);
            await setPage(newpage + 1);
        } else if (section === 'Popular' && newpage < page.lastPage) {
            const content  = await getPopular(type, newpage + 1, (data[0].format === 'NOVEL') ? 'NOVEL' : undefined, isAdult);
            await setInfo(content);
            await setPage(newpage + 1);
        } else if (section === 'Top Rated' && newpage < page.lastPage) {
            const content  = await getTop(type, newpage + 1, (data[0].format === 'NOVEL') ? 'NOVEL' : undefined, isAdult);
            await setInfo(content);
            await setPage(newpage + 1);
        } else {
            console.error('Rip');
        }
    }

    useEffect(() => {
        setInfo(data);
        setPage(page.currentPage);
    }, [data]);

    return(
        <View>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 30, paddingBottom: 10, paddingLeft: 10, color: colors.text }}>{section}</Text>
                    <FlatList
                        data={info}
                        renderItem={({ item }) => <_ContentTile item={item} routeName={routeName} />}
                        style={{ flex: 1, flexGrow: 0, minHeight:height / 2.6 }}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                        contentContainerStyle={{paddingTop:10, paddingBottom:5}}
                        onEndReachedThreshold={.2}
                        onEndReached={fetchMore}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
        </View>
    );
}