import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { ScrollView } from "react-native-gesture-handler";
import { Button, IconButton } from "react-native-paper";
import { fetchPopular } from "../../Api/deviantArt/devart";
import { PopularDevArtData, PopularResult } from "../../Api/deviantArt/types";
import { TitleType } from "../../Api/types";
import { DevArtPageProps } from "../../containers/types";
import { _openBrowserUrl } from "../../utils";
import { PressableAnim } from "../animated/AnimPressable";
import LoadingView from "../loadingView";
import { ThemeColors, Titles } from "../types";

type Props = {
    name: string;
    titles: TitleType;
    navigation: NavigationProp<any>;
    isList: boolean;
    altNames: string[];
    colors: ThemeColors;
}
const DeviantArtImages = ({name, titles, navigation, altNames, isList, colors}:Props) => {
    const [images, setImages] = useState<PopularDevArtData>();
    const [query, setQuery] = useState<string>(name);
    const [loading, setLoading] = useState<boolean>(true);
    const alternatives = [name, ...altNames, titles.english, titles.romaji].filter(() => !null);

    const searchImages = async() => {
        try {
            const art = await fetchPopular(query, 'popular');
            return art;
        } catch (e) {
            console.log('Search:', e);
            return null;
        }
    }

    const selectName = (search:string) => {
        setQuery(search);
    };

    const artView = ({item}:{item:PopularResult}) => {
        if (!item?.preview) return null;
        return(
            <Pressable onPress={() => navigation.navigate((isList) ? 'DeviantArtListDetail' : 'DeviantArtDetail', {image:item})} style={{width:130, height:190, marginHorizontal: 10 }}>
                <FastImage fallback source={{ uri: item.preview.src }} resizeMode='contain' style={{ width: 130, height: 190 }} />
            </Pressable>
        );
    }

    const FooterLoad = () => {
        if (!images?.has_more) return null;
        return(
            <View style={{height:190, width:130, justifyContent:'center', alignItems:'center', }}>
                <Pressable onPress={() => navigation.navigate((isList) ? 'DeviantArtList' : 'DeviantArt', {query:query, data:images})} style={{alignItems:'center', justifyContent:'center', borderWidth:1, borderRadius:12, borderColor:colors.primary, padding:20}}>
                    <Text style={{color:colors.text}}>View More</Text>
                </Pressable>
            </View>
        );
    }

    const ViewMore = () => {
        if (!images) return null;
        return (
            <PressableAnim style={{ marginTop: 20, marginLeft: 10, borderRadius: 8, borderColor: colors.primary, borderWidth: .8, padding: 2, paddingHorizontal: 10 }} onPress={() => navigation.navigate((isList) ? 'DeviantArtList' : 'DeviantArt', { query: query, data: images })}>
                <Text style={{ color: colors.primary, fontSize: 12 }}>View All</Text>
            </PressableAnim>
        );
    }

    const LoadingDevArtView = () => {
        return(
            <View style={{ width: 130, height: 190, alignItems:'center', alignSelf:'center', justifyContent:'center' }}>
                <LoadingView colors={colors} mode='Circle' titleData={[{title:'DevArt', loading:loading}]} />
            </View>
        );
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            setLoading(true);
            searchImages().then(art => {
                if (isMounted) {
                    setImages(art);
                    setLoading(false);
                }
            }).catch(err => { console.log('Mount:', err); setLoading(false) });
        }

        return () => {
            isMounted = false;
        }
    },[query]);

    return(
        <View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>DeviantArt</Text>
                <ViewMore />
            </View>
            {(alternatives.length > 0) ? <ScrollView horizontal contentContainerStyle={{paddingVertical:10}}>
                {alternatives.map((name, idx) => 
                    <Pressable key={idx} onPress={() => selectName(name)} style={{padding:5, borderRadius:8, marginHorizontal:5, borderWidth:.5, borderColor:colors.primary, backgroundColor:(query === name) ? colors.primary : 'transparent'}}>
                        <Text style={{color:colors.text}}>{name}</Text>
                    </Pressable>
                )}
            </ScrollView> : null}
            {(!loading) ? <View>
                <FlatList
                    data={images?.results ?? []}
                    renderItem={artView}
                    horizontal
                    ListEmptyComponent={() => <View style={{ height: 190, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: colors.text, fontSize: 28 }}>No Results</Text></View>}
                    keyExtractor={({ deviationid }) => deviationid}
                    getItemLayout={(data, index) => ({ length: 190, offset: 190 * index, index })}
                    ListFooterComponent={FooterLoad}
                />
            </View>: <LoadingDevArtView />}
            
        </View>
    );
}

export default DeviantArtImages;