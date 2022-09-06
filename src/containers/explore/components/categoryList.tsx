import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { MediaTile } from "../../../Components/Tiles/mediaTile";
import { getHomeData } from "../../../Api";
import { useTheme } from "@react-navigation/native";
import { MediaAnimeSort, MediaCountries, MediaTileType } from "../../../Api/types";
import { Titles, Formats, HomeType, PageInfoType, MediaType } from "../../../Components/types";
import { AxiosError } from "axios";
import { uniqueItems } from "../../../utils/filters/uniqueItems";
import { getAuthContext } from "../../../Storage/authToken";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LoadingView } from "../../../Components";
import { ActivityIndicator } from "react-native-paper";

type CategoryProps = { 
    titleType:Titles;
    format:Formats;
    noFormat?:Formats[] | undefined;
    sort:MediaAnimeSort; 
    type:string;
    season:string|undefined; 
    year:number|undefined;
    country?:MediaCountries|undefined;
    sortByAir?:boolean|undefined;
    doujin?:boolean|undefined;
};
export const CategoryList = (props:CategoryProps) => {
    const [data, setData] = useState<MediaType>();
    const [page, setPage] = useState<PageInfoType>();
    const [activeId, setActiveId] = useState<{id:number, index:number}>({id:undefined, index:undefined});
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError>(null);
    const { colors, dark } = useTheme();
    const {auth} = getAuthContext();
    const actionSheet = useRef<BottomSheetModal>(null);

    const ShowError = () => {
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:colors.text, paddingBottom:5}}>{error.message}</Text>
                <Pressable style={{borderWidth:2, borderRadius:8, padding:5, paddingHorizontal:20, borderColor:'red'}} onPress={() => handleError()}>
                    <Text style={{fontSize:18, textAlign:'center', color:colors.text}}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    const handleError = () => {
        setLoading(true);
        handleFetch().then(res => {setData(res.data.Page.media); setPage(res.data.Page.pageInfo); setLoading(false); setError(null)}).catch((err) => {console.log(err); setError(err); setLoading(false);});
    }

    const sortAiring = (a:MediaTileType, b:MediaTileType) => {
        if (!a.nextAiringEpisode) {
            return 1;
        }
        if (!b.nextAiringEpisode) {
            return -1;
        }
        return(a.nextAiringEpisode.timeUntilAiring-b.nextAiringEpisode.timeUntilAiring)
    };

    const handleFetch = async() => {
        try {
            const result = await getHomeData({ 
                sort:props.sort, 
                type:props.type, 
                format:props.format,
                page:1,
                perPage:props.sortByAir ? 50 : 24, 
                isAdult:false,
                season:props.season, seasonYear:props.year,
                search:undefined,
                countryOfOrigin:props.country,
                averageScore_greater:undefined, averageScore_lesser:undefined,
                chapters_greater:undefined, chapters_lesser:undefined,
                duration_greater:undefined, duration_lesser:undefined,
                episodes_greater:undefined, episodes_lesser:undefined,
                format_in:undefined, format_not_in:props.noFormat,
                tag_in:undefined, tag_not_in:undefined,
                genre_in:undefined, genre_not_in:undefined,
                volumes_greater:undefined, volumes_lesser:undefined,
                minimumTagRank:undefined,
                status:undefined,
                isLicensed:props.doujin,
                licensedBy_in:undefined,
            });
            let init_data: HomeType = result.data;
            if (props.sortByAir) {
                let medias = init_data.data.Page.media
                medias.sort(sortAiring)
                init_data = {...init_data, data: {...init_data.data, Page: {...init_data.data.Page, media: medias}}}
            }
            return init_data;
        } catch (error) {
            setError(error);
        }
    }

    const handleMore = async() => {
        try {
            setLoadingMore(true);
            const result = await getHomeData({ 
                sort:props.sort, 
                type:props.type, 
                format:props.format,
                page:page.currentPage + 1,
                perPage:props.sortByAir ? 50 : 24,
                isAdult:false,
                season:props.season, seasonYear:props.year,
                search:undefined,
                countryOfOrigin:props.country,
                averageScore_greater:undefined, averageScore_lesser:undefined,
                chapters_greater:undefined, chapters_lesser:undefined,
                duration_greater:undefined, duration_lesser:undefined,
                episodes_greater:undefined, episodes_lesser:undefined,
                format_in:undefined, format_not_in:props.noFormat,
                tag_in:undefined, tag_not_in:undefined,
                genre_in:undefined, genre_not_in:undefined,
                volumes_greater:undefined, volumes_lesser:undefined,
                minimumTagRank:undefined,
                status:undefined,
                isLicensed:props.doujin,
                licensedBy_in:undefined,
            });
            const init_data: HomeType = result.data;
            (props.sortByAir) && init_data.data.Page.media.sort(sortAiring);
            const unique = uniqueItems([...data, ...init_data.data.Page.media]);
            setData([...unique]);
            setPage(init_data.data.Page.pageInfo);
            setLoadingMore(false);
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        let isMounted = true;
        
        (isMounted) && setData(undefined);

        return () => {
            isMounted = false;
        }
    },[auth]);

    useEffect(() => {
        let isMounted = true;
        if (!data && isMounted) {
            handleFetch().then(res => {
                if (isMounted) {
                    setData(res?.data?.Page.media);
                    setPage(res?.data?.Page.pageInfo);
                    setLoading(false);
                }
            }).catch((err) => setError(err));
        } else {
            setLoading(false);
        }
        return () => {
            isMounted = false;
        }
    },[data]);

    const renderItem = ({item, index}) => {
        return(
            <MediaTile data={item} index={index} sheetControl={actionSheet} setActiveId={setActiveId} titleType={props.titleType} colors={colors} size={{width:160, height:250}} />
        );
    }

    if (loading) return <View style={{height:335}}><LoadingView colors={colors} mode='Circle' /></View>
    
    return(
        <View style={{flex:1, height:335}}>
            {(error === null) ? 
            <FlatList
                style={{flex:1}}
                data={data !== undefined ? data : []}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
                getItemLayout={(data, index) => ({length:250+65, offset:(250+65) * index, index})}
                showsHorizontalScrollIndicator={false}
                // enabling solves missing content but may lead to other issues
                disableVirtualization={true}
                contentContainerStyle={{paddingRight:10}}
                onEndReached={() => (page.hasNextPage === true) ? handleMore() : null}
                onEndReachedThreshold={0.75}
                // ListFooterComponent={() => (loadingMore) && <View style={{justifyContent:'center', height:250+65, width:160}}><ActivityIndicator size={'large'} color={colors.primary} /></View>}
                // ListFooterComponentStyle={{justifyContent:'center', marginLeft:10}}
            />: <ShowError />}
            {/* <ActionSheet actionSheetRef={actionSheet} id={activeId.id} index={activeId.index} info={typeof(activeId.index) !== undefined ? data[activeId.index] : null} setData={setData} /> */}
        </View>
    );
}