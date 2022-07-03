import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { getMediaFollowing } from "../../../Api/anilist/anilist";
import { MediaFollowing } from "../../../Api/types";
import { LoadingView } from "../../../Components";
import { HeaderBackButton, HeaderBackground, HeaderRightButtons } from "../../../Components/header/headers";
import { getUserID } from "../../../Storage/authToken";
import FollowingTile from "./components/followingTile";


const FollowingTab = ({ navigation, route }) => {
    const [data, setData] = useState<MediaFollowing>();
    const [loading, setLoading] = useState(true);
    const { id } = route.params;
    const { colors, dark } = useTheme();

    const fetchFollowing = async() => {
        const userId = await getUserID();
        const response = await getMediaFollowing(id, 1);
        const filteredResponse = response.data.data.Page.mediaList.filter((item) => item.user.id !== Number(userId))
        response.data.data.Page.mediaList = filteredResponse;
        return response.data;
    }

    const renderItem = ({item, index}) => {
        return(<FollowingTile item={item} colors={{colors, dark}} />);
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRightButtons navigation={navigation} colors={colors} drawer />,
            headerLeft: () => <HeaderBackButton navigation={navigation} colors={colors} style={{paddingLeft:3}} />,
            headerBackground: () => <HeaderBackground colors={colors} />,
        });
    }, [navigation, dark]);

    useEffect(() => {
        fetchFollowing().then((resp) => {setData(resp); setLoading(false);});
    },[]);

    if (loading) return <LoadingView colors={colors} />

    return (
        <FlatList
            data={data?.data.Page.mediaList ?? []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()} 
        />
    );
}

export default FollowingTab;
