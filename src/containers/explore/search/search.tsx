import React, { useEffect, useRef, useState } from "react";
import { View, FlatList } from "react-native";
import { IconButton } from 'react-native-paper';
import { useTheme } from "@react-navigation/native";
import { LoadingView, MediaTile } from "../../../Components";
import { getHomeData } from "../../../Api";
import { HomeType } from "../../../Components/types";
import { SearchProps } from "../../types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FilterSheet } from "../../bottomsheets/filterSheet";
import { getCharacterSearch } from "../../../Api/anilist/anilist";
import { CharacterSearchTile, CharSearchType, StaffSearchType } from "../../../Api/types";
import { CharacterTile } from "../../../Components/Tiles/CharacterTile";
import { uniqueItems } from "../../../utils/filters/uniqueItems";

export const SearchScreen = ({ route, navigation }: SearchProps) => {
    const [data, setData] = useState<HomeType>();
    const [charData, setCharData] = useState<CharSearchType>();
    const [staffData, setStaffData] = useState<StaffSearchType>();
    const [loading, setLoading] = useState(false);
    const sheetRef = useRef<BottomSheetModal>(null);
    const { searchParams } = route.params;
    const { colors, dark } = useTheme();
    const date = new Date();

    const handleModalOpen = () => { sheetRef.current?.dismiss(); sheetRef.current?.present(); };

    const emptyToUndefinded = (tags: string[] | undefined) => {
        if (tags !== undefined) {
            if (tags.length === 0) {
                return undefined;
            } else {
                return tags;
            }
        }
        else {
            return undefined;
        }
    }

    const handleSearch = async () => {
        try {
            setLoading(true);
            if (searchParams.type !== 'CHARACTERS' && searchParams.type !== 'STAFF') {
                const result = await getHomeData({
                    sort: searchParams.sort,
                    type: searchParams.type,
                    format: searchParams.format,
                    page: 1,
                    perPage: 30,
                    onList: (searchParams.onList === true) ? true : (searchParams.onList === false) ? false : undefined,
                    search: searchParams.search,
                    countryOfOrigin: searchParams.country,
                    startDate_greater: (searchParams.year[0] !== undefined) ? Number(searchParams.year[0] + '0000') : undefined, startDate_lesser: (searchParams.year[1] !== undefined) ? Number(searchParams.year[1] + '0000') : undefined,
                    averageScore_greater: searchParams.averageScore[0], averageScore_lesser: searchParams.averageScore[1],
                    chapters_greater: searchParams.chapters[0], chapters_lesser: searchParams.chapters[1],
                    duration_greater: searchParams.duration[0], duration_lesser: searchParams.duration[1],
                    episodes_greater: (searchParams.type === 'ANIME') ? searchParams.episodes[0] : undefined, episodes_lesser: (searchParams.type === 'ANIME') ? searchParams.episodes[1] : undefined,
                    format_in: searchParams.formatIn, format_not_in: searchParams.formatNotIn,
                    tag_in: emptyToUndefinded(searchParams.tagsIn), tag_not_in: emptyToUndefinded(searchParams.tagsNotIn),
                    genre_in: emptyToUndefinded(searchParams.genresIn), genre_not_in: emptyToUndefinded(searchParams.genresNotIn),
                    volumes_greater: (searchParams.type === 'MANGA') ? searchParams.episodes[0] : undefined, volumes_lesser: (searchParams.type === 'MANGA') ? searchParams.episodes[1] : undefined,
                    minimumTagRank: searchParams.minTagRank,
                    status: searchParams.status,
                    licensedBy_in: (typeof (searchParams.licensedBy_in[0]) === 'string') ? searchParams.licensedBy_in : undefined,
                });
                setCharData(undefined);
                setStaffData(undefined);
                setData(result.data);
                setLoading(false);
            } else if (searchParams.type === 'CHARACTERS') {
                const resp = await getCharacterSearch('CHARACTER', searchParams.search ?? undefined, 1, 20, (searchParams.search?.length > 0) ? undefined : true);
                setStaffData(undefined);
                setData(undefined);
                setCharData(resp.data);
                setLoading(false);
            } else if (searchParams.type === 'STAFF') {
                const resp = await getCharacterSearch('STAFF', searchParams.search ?? undefined, 1, 20, (searchParams.search?.length > 0) ? undefined : true);
                setCharData(undefined);
                setData(undefined);
                // @ts-ignore
                setStaffData(resp.data);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    const fetchMore = async () => {
        try {
            const result = await getHomeData({
                sort: searchParams.sort,
                type: searchParams.type,
                format: searchParams.format,
                page: data.data.Page.pageInfo.currentPage + 1,
                perPage: 12,
                isAdult: false,
                onList: (searchParams.onList === true) ? true : (searchParams.onList === false) ? false : undefined,
                search: searchParams.search,
                countryOfOrigin: searchParams.country,
                startDate_greater: (searchParams.year[0] !== undefined) ? Number(searchParams.year[0] + '0000') : undefined, startDate_lesser: (searchParams.year[1] !== undefined) ? Number(searchParams.year[1] + '0000') : undefined,
                averageScore_greater: searchParams.averageScore[0], averageScore_lesser: searchParams.averageScore[1],
                chapters_greater: searchParams.chapters[0], chapters_lesser: searchParams.chapters[1],
                duration_greater: searchParams.duration[0], duration_lesser: searchParams.duration[1],
                episodes_greater: (searchParams.type === 'ANIME') ? searchParams.episodes[0] : undefined, episodes_lesser: (searchParams.type === 'ANIME') ? searchParams.episodes[1] : undefined,
                format_in: searchParams.formatIn, format_not_in: searchParams.formatNotIn,
                tag_in: emptyToUndefinded(searchParams.tagsIn), tag_not_in: emptyToUndefinded(searchParams.tagsNotIn),
                genre_in: emptyToUndefinded(searchParams.genresIn), genre_not_in: emptyToUndefinded(searchParams.genresNotIn),
                volumes_greater: (searchParams.type === 'MANGA') ? searchParams.episodes[0] : undefined, volumes_lesser: (searchParams.type === 'MANGA') ? searchParams.episodes[1] : undefined,
                minimumTagRank: searchParams.minTagRank,
                status: searchParams.status,
                licensedBy_in: (typeof (searchParams.licensedBy_in[0]) === 'string') ? searchParams.licensedBy_in : undefined,
            });
            const newData = [...data.data.Page.media, ...result.data.data.Page.media];
            const filtedData = uniqueItems(newData);
            setData({ ...data, data: { ...data.data, Page: { ...data.data.Page, media: filtedData, pageInfo:result.data.data.Page.pageInfo } } });
        } catch (e) {
            console.log(e);
        }
    }

    const fetchMoreChar = async () => {
        try {
            if (searchParams.type === 'CHARACTERS') {
                const resp = await getCharacterSearch('CHARACTER', searchParams.search ?? undefined, charData.data.Page.pageInfo.currentPage + 1, 20, (searchParams.search?.length > 0) ? undefined : true);
                setCharData({
                    ...charData,
                    data: {
                        ...charData.data,
                        Page: {
                            ...charData.data.Page,
                            pageInfo: {
                                ...charData.data.Page.pageInfo,
                                currentPage: charData.data.Page.pageInfo.currentPage + 1
                            },
                            characters: [...charData.data.Page.characters, ...resp.data.data.Page.characters]
                        }
                    }
                });
            } else if (searchParams.type === 'STAFF') {
                const resp = await getCharacterSearch('STAFF', searchParams.search ?? undefined, staffData.data.Page.pageInfo.currentPage + 1, 20, (searchParams.search?.length > 0) ? undefined : true);
                setStaffData({
                    ...charData,
                    data: {
                        ...staffData.data,
                        Page: {
                            ...staffData.data.Page,
                            pageInfo: {
                                ...staffData.data.Page.pageInfo,
                                currentPage: staffData.data.Page.pageInfo.currentPage + 1
                            },
                            // @ts-ignore
                            staff: [...staffData.data.Page.staff, ...resp.data.data.Page.staff]
                        }
                    }
                });
            }
        } catch (error) {
            console.log('Could not fetch more characters:', error);
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: colors.card },
            headerRight: () =>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon={'camera-outline'} size={26} onPress={() => { navigation.navigate('Image'); sheetRef.current.close() }} color={colors.text} rippleColor={colors.primary} />
                    <IconButton icon={'magnify'} size={26} onPress={handleModalOpen} color={colors.text} rippleColor={colors.primary} />
                </View>
        });
    }, [navigation, dark]);

    useEffect(() => {
        handleSearch();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <MediaTile titleType='userPreferred' data={item} colors={colors} sheetRef={sheetRef} size={{height:210, width:130}} />
        );
    }

    const charRenderItem = ({ item }: { item: CharacterSearchTile }) => {
        return (
            <CharacterTile
                character={item}
                date={date}
                primaryColor={colors.primary}
                // @ts-ignore
                onPress={() => {sheetRef?.current?.close(); navigation.push(searchParams.type === 'CHARACTERS' ? 'CharacterExplore' : 'StaffExplore', { id: item.id, name: item.name.full, malId: item.media?.nodes[0].idMal, type: item.media?.nodes[0].type, inStack: false })}}
            />
        )
    }

    if (loading) return <LoadingView colors={{ colors, dark }} />

    return (
        <View >
            {(data) ?
                <FlatList
                    data={(data !== undefined) ? data.data.Page.media : []}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{ marginVertical: 5, justifyContent: 'space-evenly' }}
                    onEndReached={() => (data.data.Page.pageInfo.hasNextPage) ? fetchMore() : null}
                    onEndReachedThreshold={0.7}
                /> :
                (charData) ?
                    <FlatList
                        data={(charData !== undefined) ? charData.data.Page.characters : []}
                        renderItem={charRenderItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        columnWrapperStyle={{ margin: 3, justifyContent: 'space-evenly' }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        onEndReached={() => (charData.data.Page.pageInfo.hasNextPage) ? fetchMoreChar() : null}
                        onEndReachedThreshold={0.7}
                    /> :
                    <FlatList
                        data={(staffData !== undefined) ? staffData.data.Page.staff : []}
                        renderItem={charRenderItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        columnWrapperStyle={{ margin: 3, justifyContent: 'space-evenly' }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        onEndReached={() => (staffData.data.Page.pageInfo.hasNextPage) ? fetchMoreChar() : null}
                        onEndReachedThreshold={0.7}
                    />
            }
            <FilterSheet sheetRef={sheetRef} searchParams={searchParams} handleSearch={() => handleSearch()} />
        </View>
    );
}