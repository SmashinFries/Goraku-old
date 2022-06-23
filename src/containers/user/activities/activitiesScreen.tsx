import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { fetchActivity, removeActivity } from "../../../Api/anilist/anilist";
import { LoadingView } from "../../../Components";
import { UserStackProps } from "../../types";
import ActivityTile from "./components/activityTile";
import { useHeaderHeight } from "@react-navigation/elements";
import { ActivityPage } from "../../../Api/types";
import { useUserId } from "../../../Storage/authToken";

const ActivitiesScreen = ({navigation, route}:UserStackProps) => {
    const [data, setData] = useState<ActivityPage>();
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);
    const { colors, dark } = useTheme();
    const userId = useUserId();
    const headerHeight = useHeaderHeight();

    const deleteActivity = async(id:number) => {
        const response = await removeActivity(id);
        const filterData = data.activities.filter(activity => activity.id !== id);
        setData({...data, activities: filterData});
    }

    const loadMore = async() => {
        if (data.pageInfo.hasNextPage) {
            const response = await fetchActivity(data.pageInfo.currentPage + 1);
            setData({...data, activities: [...data.activities, ...response.activities], pageInfo: response.pageInfo});
        }
    }

    const onRefresh = async() => {
        setRefresh(true);
        const resp = await fetchActivity();
        setData(resp);
        setRefresh(false);
    } 

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Activities',
        });
    },[dark, navigation]);

    useEffect(() => {
        fetchActivity().then(resp => {
            setData(resp);
            setLoading(false);
        });
    },[])

    const renderItem = ({ item }) => {
        return(
            <ActivityTile item={item} userId={Number(userId)} colors={colors} deleteActivity={deleteActivity} navigation={navigation} />
        );
    }

    if (loading) return <LoadingView colors={colors} />

    return (
        <FlatList 
            data={data?.activities ?? []}
            renderItem={renderItem}
            contentContainerStyle={{paddingHorizontal:15, paddingVertical:headerHeight+30}}
            ItemSeparatorComponent={() => <View style={{height:30}} />}
            keyExtractor={({id}) => id.toString()}
            refreshing={refresh}
            onRefresh={onRefresh}
            onEndReached={(data?.pageInfo.hasNextPage) && loadMore}
            onEndReachedThreshold={0.4}
        />
    );
}

export default ActivitiesScreen;