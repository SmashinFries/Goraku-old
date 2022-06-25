import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { Button, IconButton } from "react-native-paper";
import { fetchPopular } from "../../Api/deviantArt/devart";
import { PopularDevArtData, PopularResult } from "../../Api/deviantArt/types";
import { DevArtPageProps } from "../../containers/types";
import { _openBrowserUrl } from "../../utils";
import { PressableAnim } from "../animated/AnimPressable";
import LoadingView from "../loadingView";
import { ThemeColors } from "../types";

type Props = {
    query: string;
    navigation: NavigationProp<any>;
    colors: ThemeColors;
}
const DeviantArtImages = ({query, navigation, colors}:Props) => {
    const [images, setImages] = useState<PopularDevArtData>();
    const [loading, setLoading] = useState<boolean>(true);

    const searchImages = async() => {
        // const filteredQuery = query.replace(/[\u00D7-]/g, ' x ');
        try {
            const art = await fetchPopular(query, 'popular');
            return art;
        } catch (e) {
            console.log('Search:', e);
            return null;
        }
        
    }

    const artView = ({item}:{item:PopularResult}) => {
        return(
            <Pressable onPress={() => _openBrowserUrl(item.url, colors.primary, colors.text)}>
                <FastImage fallback source={{ uri: item.preview.src }} resizeMode='contain' style={{ width: 130, height: 190, marginHorizontal: 10 }} />
            </Pressable>
        );
    }

    const FooterLoad = () => {
        return(
            <View style={{height:190, width:130, justifyContent:'center', alignItems:'center', }}>
                <Pressable onPress={() => navigation.navigate('DeviantArt', {query:query, data:images})} style={{alignItems:'center', justifyContent:'center', borderWidth:1, borderRadius:12, borderColor:colors.primary, padding:20}}>
                    <Text style={{color:colors.text}}>View More</Text>
                </Pressable>
            </View>
        );
    }

    useEffect(() => {
        let isMounted = true;
        if (!images && isMounted) {
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
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>Fan Art</Text>
                <PressableAnim style={{ marginTop: 20, marginLeft: 10, borderRadius:8, borderColor:colors.primary, borderWidth:.8, padding:2, paddingHorizontal:10}} onPress={() => navigation.navigate('DeviantArt', {query:query, data:images})}>
                    <Text style={{color:colors.primary, fontSize:12}}>View More</Text>
                </PressableAnim>
            </View>
            <FlatList
                data={images?.results ?? []}
                renderItem={artView}
                horizontal
                keyExtractor={({deviationid}) => deviationid}
                getItemLayout={(data, index) => ({length: 190, offset: 190 * index, index})}
                ListFooterComponent={FooterLoad}
            />
        </View>
    );
}

export default DeviantArtImages;