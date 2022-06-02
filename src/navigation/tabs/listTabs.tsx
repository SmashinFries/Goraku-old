import React, { useEffect, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { LoadingView } from "../../Components";
import { TagLayoutProvider, useListSearch } from "../../Storage/listStorage";
import { Keyboard, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MediaCollectionEntries, MediaListCollectionData, UserFavMediaNode } from "../../Api/types";
import { getUserMediaList } from "../../Api";
import { UserList } from "../../containers/list/userList";
import { FavoritesTabs } from "./favoritesTab";
import { ListFilter } from "../../containers/bottomsheets/ListFilter";
import { ListTabProp } from "../../containers/types";
import { CharacterFav, MediaFav, StaffFav, StudioFav } from "../../containers/favorites";

const Tabs = createMaterialTopTabNavigator();
export const ListTabs = ({navigation, route}:ListTabProp) => {
    const [data, setData] = useState<MediaListCollectionData>(undefined);
    const {search, updateSearch} = useListSearch();
    const [loading, setLoading] = useState(true);
    const { format, type } = route.params;
    const sheetRef = useRef<BottomSheet>(null);

    const {colors, dark} = useTheme();

    useEffect(() => {
        navigation.setOptions({
            title:'List',
            headerSearchBarOptions:{
                autoCapitalize:'words',
                headerIconColor:colors.text,
                textColor:colors.text,
                hintTextColor:colors.text,
                shouldShowHintSearchIcon:false,
                disableBackButtonOverride:false,
                onSearchButtonPress:(event) => Keyboard.dismiss(),
                onChangeText: (event) => updateSearch(event.nativeEvent.text),
                placeholder:'Search your sauce...',
                onCancelButtonPress: () => {updateSearch(''); Keyboard.dismiss();}
            }
        });
    },[navigation, dark]);

    const fetchList = async(type:string) => {
        const resp = await getUserMediaList((type === 'NOVEL') ? 'MANGA' : type, ['UPDATED_TIME_DESC']);
        return(resp);
    }

    const filterData = (status:string) => {
        const statusData = data.lists.filter((item) => item.status === status);
        let formattedData = (format !== 'Any' && statusData.length > 0) ? statusData[0].entries.filter((item:MediaCollectionEntries) => {
            return(item.media.format === format && item.media.isAdult === false);
        }) : (statusData.length > 0) ? statusData[0].entries : [];
        return(formattedData);
    }

    useEffect(() => {
        let isMounted = true;
        updateSearch('');
        setLoading(true);
        if (type !== 'FAVORITES') {
            fetchList(type).then(resp => {
                if (isMounted) {
                    setData(resp?.data.MediaListCollection);
                    setLoading(false);
                }
            });
        } else {
            setLoading(false);
        }
        return () => {
            isMounted = false;
        }
    },[]);

    if (loading) return <LoadingView colors={{colors, dark}} />

    const initialParams = (listStatus:string) => {
        return({data: filterData(listStatus.toUpperCase()), type:type, listStatus:listStatus, colors:{colors, dark}});
    }

    return(
        <View style={{ height:'100%' }}>
            <TagLayoutProvider>
                {/* @ts-ignore */}
                <Tabs.Navigator screenOptions={{ tabBarScrollEnabled: true, swipeEnabled: true, }}>
                    {(type !== 'FAVORITES') ? <>
                    <Tabs.Screen name="Current" component={UserList} options={{ tabBarLabel: `Current` }} initialParams={initialParams('Current')} />
                    <Tabs.Screen name="Planning" component={UserList} options={{ tabBarLabel: `Planning` }} initialParams={initialParams('Planning')} />
                    <Tabs.Screen name="Completed" component={UserList} options={{ tabBarLabel: `Completed` }} initialParams={initialParams('Completed')} />
                    <Tabs.Screen name="Paused" component={UserList} options={{ tabBarLabel: `Paused` }} initialParams={initialParams('Paused')} />
                    <Tabs.Screen name="Repeating" component={UserList} options={{ tabBarLabel: `Repeating` }} initialParams={initialParams('Repeating')} />
                    <Tabs.Screen name="Dropped" component={UserList} options={{ tabBarLabel: `Dropped` }} initialParams={initialParams('Dropped')} />
                    </> : 
                    <>
                    <Tabs.Screen name="CharacterFav" component={CharacterFav} options={{ tabBarLabel: `Characters` }} initialParams={{type:'CHARACTERS'}} />
                    <Tabs.Screen name="AnimeFav" component={MediaFav} options={{ tabBarLabel: `Anime` }} initialParams={{type:'ANIME'}} />
                    <Tabs.Screen name="MangaFav" component={MediaFav} options={{ tabBarLabel: `Manga` }} initialParams={{type:'MANGA'}} />
                    <Tabs.Screen name="StaffFav" component={StaffFav} options={{ tabBarLabel: `Staff` }} initialParams={{type:'STAFF'}} />
                    <Tabs.Screen name="StudiosFav" component={StudioFav} options={{ tabBarLabel: `Studios` }} initialParams={{type:'STUDIO'}} />
                    </>}
                </Tabs.Navigator>
                <ListFilter sheetRef={sheetRef} type={type} format={format} navigation={navigation} />
            </TagLayoutProvider>
        </View>
    );
}