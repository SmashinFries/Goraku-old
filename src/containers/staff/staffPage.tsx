import { NavigationProp, RouteProp, useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { getStaffData, toggleFav } from "../../Api/anilist/anilist";
import { CharacterMediaType, StaffDataType } from "../../Api/types";
import { FlatList } from "react-native-gesture-handler";
import { HeaderBackButton, HeaderRightButtons } from "../../Components/header/headers";
import StaffOverview from "./components/staffoverview";
import StaffMediaRender from "./components/staffMediaRender";
import { LoadingView } from "../../Components";
import { handleShare } from "../../utils";
import { Portal } from "react-native-paper";
import QrView from "../../Components/qrView";

type StaffInfoProps = {
    navigation: NavigationProp<any>,
    route: RouteProp<any, any>
}
type linkType = {title:string, url:string}[];
export const StaffInfo = ({ navigation, route }:StaffInfoProps) => {
    const [data, setData] = useState<StaffDataType>();
    const [isLiked, setIsLiked] = useState<boolean>();
    const [links, setLinks] = useState<linkType>([]);
    const [loading, setLoading] = useState(true);
    const [showQr, setShowQr] = useState<boolean>(false);
    const { id, name, inStack } = route.params;
    const { colors, dark } = useTheme();
    const date = new Date();

    const qrOpen = () => setShowQr(true);
    const qrClose = () => setShowQr(false);

    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    const toggleLike = () => {
        const status = toggleFav(id, 'STAFF')
        setIsLiked(!isLiked);
    }

    const fetchInfo = async () => {
        const response = await getStaffData(id, 1, undefined, true, true);
        return response.data.data.Staff;
    }

    const filterDescription = (description:string) => {
        const linkRegex = /\[([^\[]+)\]\(([^\)]+)\)/gm;
        const linkTitleRegex = /\[(.*)]/gm;
        const underScoreRegex = /(\__)/gm;
        const urlRegex = /\]\((.*)\)/gm;
        let newDesc = description.replace(/(\*\*)/gm, '');
        const linkRaw = newDesc.match(linkRegex);
        const links:linkType = [];
        if (linkRaw) {
            linkRaw.forEach(element => {
                const linkList = element.split(' | ');
                linkList.forEach(link => links.push({title: link.match(linkTitleRegex)[0].replace(/\[|\]/gm, ''), url: link.match(urlRegex)[0].replace(/\(|\)/gm, '').replace(/\]/gm, '')}));
            });
        }
        setLinks(links);
        newDesc = newDesc.replace(linkRegex, '').replace('|', '').replace(underScoreRegex, '').trim();
        return {description: newDesc, links: links};
    }

    const fetchMore = async() => {
        const resp = await getStaffData(id, data.characterMedia.pageInfo.currentPage + 1, undefined, true, true);
        setData({...data, characterMedia: {...data.characterMedia, pageInfo: resp.data.data.Staff.characterMedia.pageInfo, edges: [...data.characterMedia.edges, ...resp.data.data.Staff.characterMedia.edges]}});
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitleStyle: { color: colors.text, width: 200 },
            title: name || data?.name.userPreferred || 'Staff',
            headerRight: () => (!loading) && <HeaderRightButtons colors={colors} navigation={navigation} drawer={(inStack) ? true : false} qrCode qrOnPress={() => qrOpen()} share onShare={() => handleShare(data?.siteUrl ?? 'None')} id={id} />,
            headerLeft: () => <HeaderBackButton style={{paddingRight:10}} colors={colors} navigation={navigation} />
        });
    }, [navigation, route, dark, loading]);

    useEffect(() => {
        fetchInfo().then((res) => {
            if (res.description) {
                const {description, links} = filterDescription(res.description);
                setLinks(links);
                setData(res);
                setIsLiked(res.isFavourite);
                setLoading(false);
            } else {
                setData(res);
                setLoading(false);
            }
        }).catch((err) => console.log(err));
    }, []);

    const renderItem = ({item}: {item: CharacterMediaType}) => {
        return(
            <View style={{width: 180}}>
                <Pressable onPress={() => navigation.navigate('CharDetail', {id:item.characters[0].id, name:item.characters[0].name.full, malId:item.node.idMal, type:item.node.type, inStack:false})}>
                    <FastImage fallback source={{ uri: item.characters[0].image.large }} style={{ height: 250, width: 180, borderRadius:8, borderBottomLeftRadius:0, borderBottomRightRadius:0 }} resizeMode={'cover'} />
                    <LinearGradient locations={[.7, 1]} colors={['transparent', (item.characters[0].isFavourite) ? 'rgba(255, 0, 0,.85)' : 'rgba(0,0,0,.8)']} style={{position:'absolute', borderRadius:8, borderBottomLeftRadius:0, borderBottomRightRadius:0, top:0, justifyContent:'flex-end', height: 250, width: 180,}}>
                        <Text style={{textAlign:'center', color:'#FFF'}}>{item.characterRole}</Text>
                        <Text style={{textAlign:'center', color:'#FFF', fontWeight:'bold'}}>{item.characters[0].name.userPreferred}</Text>
                    </LinearGradient>
                </Pressable>
                {/* @ts-ignore */}
                <Pressable onPress={() => navigation.push('DrawerInfo', {id:item.node.id})} style={{borderWidth:1, borderColor:colors.border}}>
                    <FastImage fallback source={{uri:item.node.bannerImage ?? item.node.coverImage.extraLarge}} resizeMode={'cover'} style={{height:50, width:'100%'}} />
                    <LinearGradient colors={['rgba(0,0,0,.3)', 'rgba(0,0,0,.8)']} style={{position:'absolute', justifyContent:'center', height:'100%', width:'100%'}}>
                        <Text numberOfLines={2} style={{color:'#FFF', textAlign:'center', textAlignVertical:'center'}}>{item.node.title.userPreferred}</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        );
    }

    if (loading) return <LoadingView colors={{colors, dark}} />;

    return (
        <View style={{flex:1}}>
            <View>
                {(data.primaryOccupations.includes('Voice Actor') || data.characterMedia.edges?.length > data.staffMedia.edges?.length) ? <FlatList
                    data={data.characterMedia.edges}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={() => <StaffOverview data={data} date={{day:date.getDate(), month:date.getMonth()}} links={links} liked={isLiked} toggleLike={toggleLike} colors={colors} />}
                    ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                    columnWrapperStyle={{ paddingHorizontal:10, justifyContent: 'space-evenly' }}
                    contentContainerStyle={{paddingBottom:10}}
                    numColumns={2}
                    onEndReached={() => (data.characterMedia.pageInfo.hasNextPage) ? fetchMore() : null}
                    onEndReachedThreshold={0.2}
                /> :
                <FlatList
                    data={[0]}
                    renderItem={() => <StaffMediaRender data={data} navigation={navigation} colors={colors} />}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={() => <StaffOverview data={data} date={{day:date.getDate(), month:date.getMonth()}} links={links} liked={isLiked} toggleLike={toggleLike} colors={colors} />}
                    ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                    columnWrapperStyle={{ paddingHorizontal:10, justifyContent: 'space-evenly' }}
                    numColumns={2}
                    onEndReached={() => (data.characterMedia.pageInfo.hasNextPage) ? fetchMore() : null}
                    onEndReachedThreshold={0.2}
                /> 
                }
                <Portal>
                    <QrView colors={colors} visible={showQr} onDismiss={qrClose} link={`goraku://staff/${data.id}`} />
                </Portal>
            </View>
        </View>
    );
}