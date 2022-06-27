import { NavigationProp, RouteProp, useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Avatar, IconButton } from "react-native-paper";
import { fetchDownload, fetchMetaData, fetchPopular } from "../../Api/deviantArt/devart";
import { MetadataDA, PopularDevArtData, PopularResult, DownloadData } from "../../Api/deviantArt/types";
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingView } from "../../Components";
import { handleShare, saveImage, shareImage } from "../../utils";
import { DevArtMetaData } from "./components/metadataView";

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
}
const DevArtDetail = ({navigation, route}:Props) => {
    const { colors, dark } = useTheme();
    const [metaData, setMetaData] = useState<MetadataDA>();
    const [download, setDownload] = useState<DownloadData>();
    const [loading, setLoading] = useState<boolean>(true);
    const image:PopularResult = route.params.image;

    const ContentView = () => {
        return (
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <FastImage fallback source={{ uri: image.content.src }} style={{ height: 450, width: '100%' }} resizeMode='contain' />
            </View>
        );
    }

    const UserView = () => {
        return(
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '80%', paddingVertical:10 }}>
                <Avatar.Image source={{ uri: image.author.usericon }} />
                <View>
                    <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold', paddingLeft: 20 }}>{image.title}</Text>
                    <Text style={{ color: colors.text, paddingLeft: 20 }}>By {image.author.username}</Text>
                    {(metaData) ? 
                    <View style={{flexDirection:'row', alignItems:'center', paddingLeft: 10}}>
                        <IconButton icon='calendar' size={15} />
                        <Text style={{color:colors.text}}>{metaData?.submission?.creation_time?.split('T')[0]}</Text>
                    </View> : null}
                </View>
            </View>
        );
    }

    const DownloadIcon = () => {
        if (!download) return (<IconButton onPress={() => saveImage(download ? download?.src : image.content.src, image.title)} icon={'download'} color={colors.text} />)
        return(
            <View>
                <IconButton onPress={() => saveImage(download?.src ?? image.content.src, download?.filename ?? image.title)} icon={'download'} color={colors.text} />
                <MaterialIcons name="hd" style={{position:'absolute', top:5, right:5}} size={15} color={colors.text} />
            </View>
        );
    }

    useEffect(() => {
        navigation.setOptions({
            // got em
            headerTitle: (image.is_mature) ? 'Sus Image' : 'Image',
            headerRight: () => (
                <>
                    <IconButton onPress={() => shareImage(download?.src ?? image.content.src, download?.filename ?? image.title)} icon={'share-variant'} color={colors.text} />
                    <DownloadIcon/>
                </>
            ),
        });
    },[navigation, download, dark])

    useEffect(() => {
        let isMounted = true;

        const getData = async() => {
            const meta = (!metaData) ? await fetchMetaData(image.deviationid) : null;
            const down = (!download) ? await fetchDownload(image.deviationid) : null;
            if (isMounted) {
                (meta) && setMetaData(meta);
                (down) && setDownload(down);
            }
            setLoading(false);
        }

        if (isMounted) {
            getData();
        }
        
        return () => {
            isMounted = false;
        }
    }, [])

    if (loading) return <LoadingView mode="Gif" colors={colors} />;

    return(
        <ScrollView contentContainerStyle={{paddingVertical:10}}>
            <ContentView />
            <View style={{alignItems:'center'}}>
                <UserView />
                {(metaData) ? <DevArtMetaData data={metaData} url={image.url} colors={colors} /> : null}
            </View>
        </ScrollView>
    );
}

export default DevArtDetail;