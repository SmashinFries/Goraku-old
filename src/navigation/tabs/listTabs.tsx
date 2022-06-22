import React, { useEffect, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { LoadingView } from "../../Components";
import { TagLayoutProvider, useListSearch } from "../../Storage/listStorage";
import { Keyboard, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Favorites, MediaCollectionEntries, MediaListCollectionData } from "../../Api/types";
import { getUserMediaList } from "../../Api";
import { UserList } from "../../containers/list/userList";
import { ListFilter } from "../../containers/bottomsheets/ListFilter";
import { ListTabProp } from "../../containers/types";

const Tabs = createMaterialTopTabNavigator();
export const ListTabs = ({ navigation, route }: ListTabProp) => {
    const [data, setData] = useState<MediaListCollectionData>();
    const { type, format } = route.params;
    const { search, updateSearch } = useListSearch();
    const [listLoad, setListLoad] = useState(true);
    const sheetRef = useRef<BottomSheet>(null);

    const { colors, dark } = useTheme();

    useEffect(() => {
        navigation.setOptions({
            title: 'List',
            headerSearchBarOptions: {
                autoCapitalize: 'words',
                headerIconColor: colors.text,
                textColor: colors.text,
                hintTextColor: colors.text,
                shouldShowHintSearchIcon: false,
                disableBackButtonOverride: false,
                onSearchButtonPress: (event) => Keyboard.dismiss(),
                onChangeText: (event) => updateSearch(event.nativeEvent.text),
                placeholder: 'Search...',
                onCancelButtonPress: () => { updateSearch(''); Keyboard.dismiss(); }
            }
        });
    }, [navigation, dark]);

    const fetchList = async (type: string) => {
        const resp = await getUserMediaList((type === 'NOVEL') ? 'MANGA' : type, ['UPDATED_TIME_DESC']);
        return (resp);
    }

    const filterData = (status: string) => {
        const statusData = data?.lists.filter((item) => item.status === status);
        let formattedData = (statusData.length > 0 && statusData[0].entries !== undefined) ? statusData[0].entries : [];
        if (format === 'NOVEL' || format === 'MANGA' && formattedData.length > 0) {
            formattedData = formattedData.filter((item: MediaCollectionEntries) => {
                if (format === 'MANGA') return(item.media.format !== 'NOVEL');
                return (item.media.format === format);
            });
        }
        return (formattedData);
    }

    useEffect(() => {
        let isMounted = true;
        updateSearch('');
        if (!data && isMounted) {
            fetchList(type).then((resp) => {setData(resp.data.MediaListCollection); setListLoad(false);});
        }

        return () => {
            isMounted = false;
        }
    }, []);

    const initialParams = (listStatus: string) => {
        return ({ data: filterData(listStatus.toUpperCase()), listStatus: listStatus, colors: { colors, dark } });
    }

    if (listLoad) return <LoadingView colors={colors} titleData={[{ title: 'Fetching List', loading: listLoad }]} />

    return (
        <View style={{ height: '100%' }} collapsable={false}>
            <TagLayoutProvider>
                <Tabs.Navigator screenOptions={{ tabBarScrollEnabled: true, swipeEnabled: true, }}>
                    <Tabs.Screen name="Current" component={UserList} options={{ tabBarLabel: `Current` }} initialParams={initialParams('Current')} />
                    <Tabs.Screen name="Planning" component={UserList} options={{ tabBarLabel: `Planning` }} initialParams={initialParams('Planning')} />
                    <Tabs.Screen name="Completed" component={UserList} options={{ tabBarLabel: `Completed` }} initialParams={initialParams('Completed')} />
                    <Tabs.Screen name="Paused" component={UserList} options={{ tabBarLabel: `Paused` }} initialParams={initialParams('Paused')} />
                    <Tabs.Screen name="Repeating" component={UserList} options={{ tabBarLabel: `Repeating` }} initialParams={initialParams('Repeating')} />
                    <Tabs.Screen name="Dropped" component={UserList} options={{ tabBarLabel: `Dropped` }} initialParams={initialParams('Dropped')} />
                </Tabs.Navigator>
                <ListFilter sheetRef={sheetRef} type={type} format={format} navigation={navigation} />
            </TagLayoutProvider>
        </View>
    );
}