import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { MediaTile } from "../../../Components/Tiles/mediaTile";
import { getHomeData } from "../../../Api";
import { useTheme } from "@react-navigation/native";
import { MediaAnimeSort } from "../../../Api/types";
import { Titles, Formats, HomeType, PageInfoType, MediaType } from "../../../Components/types";
import { AxiosError } from "axios";
import { uniqueItems } from "../../../utils/filters/uniqueItems";
import { getAuthContext } from "../../../Storage/authToken";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LoadingView } from "../../../Components";

type CategoryProps = { 
    titleType:Titles;
    format:Formats; 
    sort:MediaAnimeSort; 
    type:string;
    season:string|undefined; 
    year:number|undefined;
};
export const CategoryList = (props:CategoryProps) => {
    const [data, setData] = useState<MediaType>();
    const [page, setPage] = useState<PageInfoType>();
    const [activeId, setActiveId] = useState<{id:number, index:number}>({id:undefined, index:undefined});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AxiosError>(null);
    const { colors, dark } = useTheme();
    const isAuth = getAuthContext();
    const actionSheet = useRef<BottomSheetModal>(null);

    const ShowError = () => {
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>{error.message}</Text>
                <Pressable style={{borderWidth:2, borderRadius:8, padding:5, borderColor:'red'}} onPress={() => handleError()}>
                    <Text style={{fontSize:18, textAlign:'center'}}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    const handleError = () => {
        setLoading(true);
        handleFetch().then(res => {setData(res.data.Page.media); setPage(res.data.Page.pageInfo); setLoading(false); setError(null)}).catch((err) => setError(err));
    }

    const handleFetch = async() => {
        try {
            const result = await getHomeData({ 
                sort:props.sort, 
                type:props.type, 
                format:props.format,
                page:1,
                perPage:10, 
                isAdult:false,
                season:props.season, seasonYear:props.year,
                search:undefined,
                countryOfOrigin:undefined,
                averageScore_greater:undefined, averageScore_lesser:undefined,
                chapters_greater:undefined, chapters_lesser:undefined,
                duration_greater:undefined, duration_lesser:undefined,
                episodes_greater:undefined, episodes_lesser:undefined,
                format_in:undefined, format_not_in:undefined,
                tag_in:undefined, tag_not_in:undefined,
                genre_in:undefined, genre_not_in:undefined,
                volumes_greater:undefined, volumes_lesser:undefined,
                minimumTagRank:undefined,
                status:undefined,
                licensedBy_in:undefined,
            });
            const init_data: HomeType = result.data
            return init_data;
        } catch (error) {
            setError(error);
        }
    }

    const handleMore = async() => {
        try {
            const result = await getHomeData({ 
                sort:props.sort, 
                type:props.type, 
                format:props.format,
                page:page.currentPage + 1,
                perPage:10, 
                isAdult:false,
                season:props.season, seasonYear:props.year,
                search:undefined,
                countryOfOrigin:undefined,
                averageScore_greater:undefined, averageScore_lesser:undefined,
                chapters_greater:undefined, chapters_lesser:undefined,
                duration_greater:undefined, duration_lesser:undefined,
                episodes_greater:undefined, episodes_lesser:undefined,
                format_in:undefined, format_not_in:undefined,
                tag_in:undefined, tag_not_in:undefined,
                genre_in:undefined, genre_not_in:undefined,
                volumes_greater:undefined, volumes_lesser:undefined,
                minimumTagRank:undefined,
                status:undefined,
                licensedBy_in:undefined,
            });
            const init_data: HomeType = result.data
            const unique = uniqueItems([...data, ...init_data.data.Page.media]);
            setData([...unique]);
            setPage(init_data.data.Page.pageInfo);
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        setData(undefined);
    },[isAuth]);

    useEffect(() => {
        let isMounted = true;
        if (!data) {
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

    if (loading) return <View style={{height:335}}><LoadingView colors={{colors, dark}} mode='Circle' /></View>
    
    return(
        <View style={{flex:1, height:335}}>
            {(error === null) ? 
            <FlatList
                style={{flex:1}}
                data={data !== undefined ? data : []}
                renderItem={({ item, index }) => <MediaTile data={item} index={index} sheetControl={actionSheet} setActiveId={setActiveId} titleType={props.titleType} colors={colors} />}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingRight:10}}
                onEndReached={() => (page.hasNextPage === true) ? handleMore() : null}
                onEndReachedThreshold={0.75}
            />: <ShowError />}
            {/* <ActionSheet actionSheetRef={actionSheet} id={activeId.id} index={activeId.index} info={typeof(activeId.index) !== undefined ? data[activeId.index] : null} setData={setData} /> */}
        </View>
    );
}