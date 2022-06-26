import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { fetchPopular, fetchRelatedTags } from "../../Api/deviantArt/devart";
import { PopularDevArtData } from "../../Api/deviantArt/types";
import { DevArtPageProps } from "../types";
import { DevArtImage } from "./components/devartImage";
import { TagSelector } from "./components/tagSelect";

type Tags = {
    active: string|null;
    tags: string[];
}
const DeviantArtPage = ({navigation, route}:DevArtPageProps) => {
    const { query, data } = route.params;
    const [images, setImages] = useState<PopularDevArtData>(data);
    const [tags, setTags] = useState<Tags>({tags:[], active:null});
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [tagLoad, setTagLoad] = useState<boolean>(false);
    const { colors, dark } = useTheme();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: (tags.active) ? tags.active + ' Art' : query + ' Art',
            headerRight: () => (
                <IconButton icon='tag' onPress={() => setVisible(true)} />
            ),
        });
    },[navigation, tags.active, dark]);

    const renderItem = ({item, index}) => {
        return(<DevArtImage item={item} navigation={navigation} colors={colors} />);
    }

    const getNewContent = async() => {
        setTagLoad(true);
        const resp = await fetchPopular(tags.active, 'tag', 0, 25);
        setImages(resp);
        setTagLoad(false);
    }

    const loadMore = async() => {
        if (!images.has_more) return;

        setLoading(true);
        console.log(images.next_offset);
        const art = (tags.active) ? await fetchPopular(tags.active, 'tag', images.next_offset, 25) : await fetchPopular(query, 'popular', images.next_offset, 25);
        setImages({...images, results: [...images.results, ...art.results], next_offset: art.next_offset, has_more: art.has_more});
        setLoading(false);
    }

    useEffect(() => {
        if (tags.tags.length <= 0) {
            fetchRelatedTags(query).then(tags => setTags({tags:tags, active:null}));
        }
    },[]);

    useEffect(() => {
        let isMounted = true;
        if (tags.active && isMounted) {
            console.log(tags.active);
            getNewContent();
        } else {
            setImages(data);
        }
    },[tags.active]);

    return(
        <View style={{flex:1}}>
            {(!tagLoad) ? <FlatList 
                key={0}
                data={images.results.filter((data) => data.preview?.src)}
                renderItem={renderItem}
                keyExtractor={({deviationid}) => deviationid}
                numColumns={2}
                onEndReached={(!loading) && loadMore}
                onEndReachedThreshold={0.5}
                windowSize={10}
                getItemLayout={(data, index) => ({length: 260+40, offset: index * (260+40), index})}
                contentContainerStyle={{flexGrow: 1, paddingVertical:20, justifyContent: 'space-evenly', alignItems:'center'}}
                columnWrapperStyle={{paddingVertical:10}}
                ListFooterComponent={() => (loading) && <ActivityIndicator size={'large'} color={colors.primary} />}
                ListFooterComponentStyle={{justifyContent:'center', marginTop:10}}
            /> : <ActivityIndicator size={'large'} color={colors.primary} />}
            <TagSelector tags={tags} visible={visible} setVisible={setVisible} setActive={(tag) => setTags({...tags, active: tag})} colors={colors} />
        </View>
    );
}

export default DeviantArtPage;