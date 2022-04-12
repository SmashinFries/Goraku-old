import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { removeActivity, useActivities } from "../../../Api/anilist/anilist";
import { LoadingView } from "../../../Components";
import { UserStackProps } from "../../types";
import ActivityTile from "./components/activityTile";
import { useHeaderHeight } from "@react-navigation/elements";

// const DropDownExtra = () => {
//     return(
//         <SelectDropdown
//                         data={['Following', 'Personal']}
//                         buttonTextAfterSelection={(selected, index) => {return selected}}
//                         rowTextForSelection={(item, index) => {return item}}
//                         defaultValue={showFollowing ? 'Following' : 'Personal'}
//                         defaultButtonText={showFollowing ? 'Following' : 'Personal'}
//                         onSelect={(selected) => setShowFollowing(selected === 'Following' ?  true : false)}
//                         dropdownStyle={{backgroundColor:colors.card, borderRadius:12}}
//                         rowStyle={{backgroundColor:colors.card, borderBottomWidth:0}}
//                         buttonStyle={{backgroundColor:colors.background, borderRadius:12, height:40, width:180}}
//                         renderDropdownIcon={() => <AntDesign name="down" size={16} color={colors.primary} style={{ marginRight: 10 }} />}
//                         rowTextStyle={{textTransform:'capitalize', color:colors.text}}
//                         buttonTextStyle={{textTransform:'capitalize', color:colors.text}}
//                     />
//     );
// }

const ActivitiesScreen = ({navigation, route}:UserStackProps) => {
    const [page, setPage] = useState(1);
    const {data, setData, loading, refresh, onRefresh, userId} = useActivities(page);
    const { colors, dark } = useTheme();
    const headerHeight = useHeaderHeight();

    const deleteActivity = async(id:number) => {
        const response = await removeActivity(id);
        const filterData = data.activities.filter(activity => activity.id !== id);
        setData({...data, activities: filterData});
    }

    const loadMore = async() => {
        if (data.pageInfo.hasNextPage){
            setPage(page + 1);
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Activities',
        });
    },[dark, navigation]);

    if (loading) return <LoadingView colors={{colors, dark}} />

    return (
        <FlatList 
            data={data.activities ?? []}
            renderItem={({item}) => <ActivityTile item={item} userId={Number(userId)} colors={colors} deleteActivity={deleteActivity} navigation={navigation} />}
            contentContainerStyle={{paddingHorizontal:15, paddingVertical:headerHeight+30}}
            ItemSeparatorComponent={() => <View style={{height:30}} />}
            keyExtractor={({id}) => id.toString()}
            refreshing={refresh}
            onRefresh={() => onRefresh()}
            onEndReached={(data?.pageInfo.hasNextPage) && loadMore}
            onEndReachedThreshold={0.4}
        />
    );
}

export default ActivitiesScreen;