import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState, useContext, memo } from "react";
import { View, Text, FlatList, useWindowDimensions, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { ActivityIndicator, Avatar, IconButton } from 'react-native-paper';
import { getRecommendations, saveRecommendation } from "../../Api/anilist/anilist";
import { RecommendationInfoType, RecommendationMediaType, RecommendationsFullType } from "../../Api/types";
import { LinearGradient } from "expo-linear-gradient";
import { RecommendationProps } from "../types";
import { LoadingView, UserModal } from "../../Components";
import SelectDropdown from "react-native-select-dropdown";
import { AccountContext } from "../../contexts/context";
import { rgbConvert } from "../../utils";

const RecSort = {
    'Recent': 'ID_DESC',
    'Highest Rated': 'RATING_DESC',
    'Lowest Rated': 'RATING',
}

type RenderItem = {
    item: RecommendationInfoType;
    index: number;
}

type PageState = {
    currentPage: number;
    hasNextPage: boolean;
}
export const RecommendationScreen = ({navigation, route}:RecommendationProps) => {
    const [data, setData] = useState<RecommendationInfoType[]>();
    const [pageInfo, setPageInfo] = useState<PageState>();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [sort, setSort] = useState<string>('ID_DESC');
    const { isAuth, setIsAuth } = useContext(AccountContext);

    const {colors, dark} = useTheme();
    const { width, height } = useWindowDimensions();

    const handlePress = async(index:number, baseId:number, recId:number, rating:'NO_RATING'|'RATE_UP'|'RATE_DOWN') => {
        const res = await saveRecommendation(baseId, recId, rating);
        const newArray = [...data];
        newArray[index].userRating = rating;
        newArray[index].rating = res.data.SaveRecommendation.rating;
        setData(newArray);
    }

    const fetchMore = async() => {
        if (pageInfo.hasNextPage) {
            setLoadingMore(true);
            const newData = await getRecommendations(pageInfo.currentPage + 1, 8, [sort]);
            setData([...data, ...newData.data.Page.recommendations]);
            setPageInfo(newData.data.Page.pageInfo);
            (false);
        }
    }

    const DropDown = () => {
        return(
            <SelectDropdown 
                data={Object.keys(RecSort)} 
                defaultValue={'ID_DESC'}
                defaultButtonText={Object.keys(RecSort).find(k=>RecSort[k]===sort)}
                dropdownStyle={{backgroundColor:colors.card, borderRadius:12}}
                rowStyle={{backgroundColor:colors.card, borderBottomWidth:0}}
                buttonStyle={{backgroundColor:colors.background, borderRadius:12, height:40, width:150}}
                renderDropdownIcon={() => <AntDesign name="down" size={16} color={colors.primary} style={{ marginRight: 10 }} />}
                rowTextStyle={{textTransform:'capitalize', color:colors.text}}
                buttonTextStyle={{textTransform:'capitalize', color:colors.text}}
                onSelect={(selected, index) => setSort(RecSort[selected])} 
                buttonTextAfterSelection={(selected, index) => {return selected}}
                rowTextForSelection={(item, index) => {return item}}
            />
        );
    }

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {backgroundColor: colors.card},
            headerRight: () => 
            <DropDown />
        });
    },[navigation, sort, dark]);

    useEffect(() => {
        if (data === undefined) {
            getRecommendations(1, 8, ).then(resp => {
                setData(resp.data.Page.recommendations);
                setPageInfo(resp.data.Page.pageInfo);
            }).then(() => setLoading(false));
        }
    },[]);

    useEffect(() => {
        setLoading(true);
        getRecommendations(1, 8, [sort]).then(resp => {
            setData(resp.data.Page.recommendations);
            setPageInfo(resp.data.Page.pageInfo);
        }).then(() => setLoading(false));
    },[sort]);

    const refreshList = async() => {
        setRefreshing(true);
        const resp = await getRecommendations(1, 10, [sort]);
        setData(resp.data.Page.recommendations);
        setPageInfo(resp.data.Page.pageInfo);
        setRefreshing(false);
    }

    const pressNav = (media:RecommendationMediaType) => {
        // @ts-ignore
        navigation.push('Info', {
            id: media.id, 
            coverImage: media.coverImage.extraLarge, 
            type: media.type
        }
        );
        // @ts-ignore
        navigation.navigate('Info', {
            id: media.id, 
            coverImage: media.coverImage.extraLarge, 
            type: media.type
        }
        );
    }

    type MediaButtonProps = {onPress:()=>void; title:string; cover:string; mode:'Bottom'|'Top';}
    const MediaButton = ({onPress, title, cover, mode}:MediaButtonProps) => {
        const borderRadius = (mode === 'Bottom') ?
            {borderTopRightRadius:0, borderTopLeftRadius:0, borderRadius:12} :
            {borderBottomRightRadius:0, borderBottomLeftRadius:0, borderRadius:12};

        return (
            <View style={[borderRadius, { alignItems:'center', overflow:'hidden', height: 120, width: (width * 90) / 100 }]}>
                <Pressable onPress={onPress} android_ripple={{color:colors.primary}} style={[borderRadius, { height: 120, width: (width * 90) / 100}]}>
                    <View style={[borderRadius, {overflow:'hidden', margin:2}]}>
                        <FastImage fallback source={{ uri: cover }} resizeMode='cover' style={[borderRadius, { height: 120, width:(width * 90) / 100 }]} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,.6)']} locations={[.5, .9]} style={[borderRadius, { position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end' }]} >
                            <Text numberOfLines={2} style={{ color: '#FFF', textAlign: 'center', paddingHorizontal: 5, fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
                        </LinearGradient>
                    </View>
                </Pressable>
            </View>
        );
    }
    
    const RecView = memo(({item, index}:RenderItem) => {
        const [visible, setVisible] = useState<boolean>(false);
        const height = 120+100+120+25;
        return(
                <View style={{height:height, borderWidth:2, borderColor:colors.border, marginVertical:20, backgroundColor:colors.card, marginHorizontal:10, borderRadius:12}}>
                    <View style={{alignItems:'center', height:120}}>
                        <MediaButton mode='Top' onPress={() => pressNav(item.media)} title={item.media.title.userPreferred} cover={(item.media.bannerImage !== null) ? item.media.bannerImage : item.media.coverImage.extraLarge} />
                    </View>
                    <View style={{alignItems:'center', marginVertical:10, height:100, justifyContent:'center'}}>
                        {isAuth ? 
                        <View style={{flexDirection:'row', alignItems:'center'}}> 
                            <IconButton 
                                icon={(item.userRating === 'RATE_UP') ? 'thumb-up' : 'thumb-up-outline'} 
                                color={(item.userRating === 'RATE_UP') ? colors.primary : colors.text} 
                                style={{alignSelf:'center'}}
                                size={28}
                                onPress={() => handlePress(index, item.media.id, item.mediaRecommendation.id, (item.userRating !== 'RATE_UP') ? 'RATE_UP' : 'NO_RATING')}
                            />
                            <Text style={{textAlign:'center', paddingHorizontal:10, textAlignVertical:'center', color:colors.text}}>{(Math.sign(item.rating) !== -1) ? '+' : ''}{item.rating}</Text>
                            <IconButton 
                                icon={(item.userRating === 'RATE_DOWN') ? 'thumb-down' : 'thumb-down-outline'} 
                                color={(item.userRating === 'RATE_DOWN') ? colors.primary : colors.text} 
                                style={{alignSelf:'center'}}
                                size={28}
                                onPress={() => handlePress(index, item.media.id, item.mediaRecommendation.id, (item.userRating !== 'RATE_DOWN') ? 'RATE_DOWN' : 'NO_RATING')}
                            />
                        </View> : <Text style={{textAlign:'center', color:colors.text}}>{(Math.sign(item.rating) !== -1) ? '+' : ''}{item.rating}</Text>}
                        <View style={{height:50, borderRadius:12, overflow:'hidden'}}>
                            <Pressable onPress={() => setVisible(true)} android_ripple={{color:colors.primary}} style={{padding:3, borderRadius:12}}>
                                <View style={{flexDirection:'row', alignItems:'center', backgroundColor:colors.card, borderRadius:12,}}>
                                    <Avatar.Image source={{uri:item.user.avatar.large}} size={40} style={{backgroundColor:item.user.options.profileColor}} />
                                    <Text style={{paddingLeft:5, color:colors.text}}>{`${item.user.name}`}</Text>
                                </View>
                            </Pressable>
                        </View>
                        <Fontisto name="arrow-v" size={34} color={rgbConvert(colors.text, .25)} style={{position:'absolute', left:15}} />
                        <Fontisto name="arrow-v" size={34} color={rgbConvert(colors.text, .25)} style={{position:'absolute', right:15}} />
                    </View>
                    <View style={{justifyContent:'flex-end', alignItems:'center', height:120}}>
                        <MediaButton mode='Bottom' onPress={() => pressNav(item.mediaRecommendation)} title={item.mediaRecommendation.title.userPreferred} cover={(item.mediaRecommendation.bannerImage !== null) ? item.mediaRecommendation.bannerImage : item.mediaRecommendation.coverImage.extraLarge} />
                    </View>
                    <UserModal user={item.user} visible={visible} onDismiss={() => setVisible(false)} colors={colors} />
                </View>
        );
    });

    const renderItem = ({item, index}) => {
        return(
            <RecView item={item} index={index} />
        );
    }

    if (loading) return <LoadingView colors={ colors } />

    return (
        <View style={{flex:1}}>
            <FlatList 
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{marginHorizontal:10}}
                onRefresh={refreshList}
                refreshing={refreshing}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.4}
                getItemLayout={(data, index) => (
                    {length: 365, offset: 365 * index, index}
                )}
                disableVirtualization={true}
                removeClippedSubviews={true}
                windowSize={10}
                ListFooterComponent={() => (loadingMore) && <ActivityIndicator size={'large'} color={colors.primary} />}
                ListFooterComponentStyle={{justifyContent:'center', marginTop:10}}
            />
        </View>
    );
}