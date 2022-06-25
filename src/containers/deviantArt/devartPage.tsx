import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { fetchPopular } from "../../Api/deviantArt/devart";
import { PopularDevArtData } from "../../Api/deviantArt/types";
import { DevArtPageProps } from "../types";
import { DevArtImage } from "./components/devartImage";

const DeviantArtPage = ({navigation, route}:DevArtPageProps) => {
    const { query, data } = route.params;
    const [images, setImages] = useState<PopularDevArtData>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const { colors, dark } = useTheme();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: query + ' Art',
        });
    },[navigation, dark]);

    const renderItem = ({item, index}) => {
        return(<DevArtImage item={item} navigation={navigation} colors={colors} />);
    }

    const loadMore = async() => {
        if (!images.has_more) return;

        setLoading(true);
        const art = await fetchPopular(query, 'popular', images.next_offset, 25);
        setImages({...images, results: [...images.results, ...art.results], next_offset: art.next_offset, has_more: art.has_more});
        setLoading(false);
    }

    return(
        <View style={{flex:1}}>
            <FlatList 
                key={0}
                data={images.results}
                renderItem={renderItem}
                keyExtractor={({deviationid}) => deviationid}
                numColumns={2}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                windowSize={10}
                getItemLayout={(data, index) => ({length: 260+40, offset: index * (260+40), index})}
                contentContainerStyle={{flexGrow: 1, paddingVertical:20, justifyContent: 'space-evenly', alignItems:'center'}}
                columnWrapperStyle={{paddingVertical:10}}
                ListFooterComponent={() => (loading) && <ActivityIndicator size={'large'} color={colors.primary} />}
                ListFooterComponentStyle={{justifyContent:'center', marginTop:10}}
            />
        </View>
    );
}

export default DeviantArtPage;