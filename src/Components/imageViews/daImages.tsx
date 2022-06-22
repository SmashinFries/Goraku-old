import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { fetchPopular } from "../../Api/deviantArt/devart";
import { PopularDevArtData, PopularResult } from "../../Api/deviantArt/types";
import { _openBrowserUrl } from "../../utils";
import LoadingView from "../loadingView";
import { ThemeColors } from "../types";

type Props = {
    query: string;
    colors: ThemeColors;
}
const DeviantArtImages = ({query, colors}:Props) => {
    const [images, setImages] = useState<PopularDevArtData>();
    const [loading, setLoading] = useState<boolean>(true);

    const searchImages = async() => {
        // const filteredQuery = query.replace(/[\u00D7-]/g, ' x ');
        try {
            const art = await fetchPopular(query);
            return art;
        } catch (e) {
            console.log('Search:', e);
            return null;
        }
        
    }

    const ArtView = ({item}:{item:PopularResult}) => {
        return(
            <Pressable onPress={() => _openBrowserUrl(item.url, colors.primary, colors.text)}>
                <FastImage fallback source={{ uri: item.preview.src }} resizeMode='contain' style={{ width: 130, height: 190, marginHorizontal: 10 }} />
            </Pressable>
        );
    }

    useEffect(() => {
        let isMounted = true;
        const queryTest = query.replace(/(Season \d+)|(\d+(nd|st|rd|th) Season)/gm, '');
        console.log('Query:', queryTest);
        if (!images) {
            searchImages().then(art => {
                if (isMounted) {
                    setImages(art);
                    setLoading(false);
                }
            }).catch(err => { console.log('Mount:', err) });
        }

        return () => {
            isMounted = false;
        }
    },[]);

    if (loading) return <LoadingView colors={colors} mode='Circle' titleData={[{title:'DevArt', loading:loading}]} />;
    if (!loading && images?.results.length < 1) return null;

    return(
        <View>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>Fan Art</Text>
            <FlatList
                data={images?.results ?? []}
                renderItem={ArtView}
                horizontal
                keyExtractor={({deviationid}) => deviationid}
            />
        </View>
    );
}

export default DeviantArtImages;