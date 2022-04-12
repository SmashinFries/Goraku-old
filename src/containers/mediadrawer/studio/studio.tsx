import { useTheme } from "@react-navigation/native";
import React, {useState, useEffect, useRef} from "react";
import { View, ActivityIndicator, Animated, FlatList} from "react-native";
import { IconButton } from 'react-native-paper';
import { getStudioList, toggleFav } from "../../../Api/anilist/anilist";
import { StudioListType } from "../../../Api/types";
import { StudioInfoProps } from "../../types";
import { MediaTile } from "../../../Components/Tiles/mediaTile";
import { HeaderBackButton, HeaderRightButtons } from "../../../Components/header/headers";
import { LoadingView } from "../../../Components";

const StudioInfo = ({navigation, route}:StudioInfoProps) => {
    const [studio, setStudio] = useState<StudioListType>();
    const [isLiked, setIsLiked] = useState<boolean>();
    const [loading, setLoading] = useState(true);
    const { id, name } = route.params;
    const { colors, dark } = useTheme();

    const handleStudioFetch = async () => {
        const data = await getStudioList(id, 1, 20);
        return data.data;
    }

    const handleMore = async() => {
        const data = await getStudioList(id, studio.data.Studio.media.pageInfo.currentPage + 1, 20);
        const newMedia = [...studio.data.Studio.media.edges, ...data.data.data.Studio.media.edges];
        setStudio({...studio, data: {...studio.data, Studio: {...studio.data.Studio, media: {...studio.data.Studio.media, edges: newMedia}}}});
    }

    const likeStudio = async() => {
        setIsLiked(!isLiked);
        const resp = await toggleFav(id, "STUDIO");
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <IconButton icon={(isLiked) ? 'heart' : 'heart-outline'} onPress={() => likeStudio()} color={(isLiked) ? 'red' : colors.text} />
                <HeaderRightButtons colors={colors} navigation={navigation} style={{paddingRight:15}} drawer />
            </View>,
            headerLeft: () => 
                <HeaderBackButton style={{marginLeft:15}} colors={colors} navigation={navigation} />
        });
    },[navigation, dark, isLiked]);

    useEffect(() => {
        handleStudioFetch().then(data => {setStudio(data); setIsLiked(data.data.Studio.isFavourite)}).then(() => setLoading(false)).catch((err) => console.log(err));
    },[]);

    if (loading) return <LoadingView colors={{colors, dark}} />

    return(
        <View>
            <FlatList
                data={studio.data.Studio.media?.edges ?? []}
                renderItem={({item}) => <MediaTile data={item.node} route={'DrawerInfo'} colors={colors} titleType={'userPreferred'} size={{ width: 185, height: 275 }} />}
                keyExtractor={item => item.node.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ margin: 5, justifyContent: 'space-around', alignItems:'center' }}
                onEndReached={(studio.data.Studio.media.pageInfo.hasNextPage) ? handleMore : null}
                onEndReachedThreshold={0.3}
            />
        </View>
    );
}

export default StudioInfo;