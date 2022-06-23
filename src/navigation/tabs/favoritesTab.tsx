import React, { useEffect, useRef, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "@react-navigation/native";
import { Favorites } from "../../Api/types";
import { CharacterFav, MediaFav, StaffFav, StudioFav } from "../../containers/favorites";
import { Keyboard, useWindowDimensions, View } from "react-native";
import { HeaderRightButtons } from "../../Components/header/headers";
import { getFavoriteContent } from "../../Api/anilist/anilist";
import { TagLayoutProvider, useListSearch } from "../../Storage/listStorage";
import BottomSheet from "@gorhom/bottom-sheet";
import { LoadingView } from "../../Components";
import { ListFilter } from "../../containers/bottomsheets/ListFilter";

const Tabs = createMaterialTopTabNavigator();

const FavTabs = ({navigation, route}) => {
    const [favs, setFavs] = useState<Favorites>();
    const [favLoad, setFavLoad] = useState(true);

    const sheetRef = useRef<BottomSheet>(null);
    const { search, updateSearch } = useListSearch();
    const { colors, dark } = useTheme();

    const fetchFavs = async () => {
        const resp = await getFavoriteContent('ALL');
        setFavs(resp?.data.Viewer.favourites);
    }

    useEffect(() => {
        navigation.setOptions({
            title: 'Favorites',
            headerSearchBarOptions: {
                autoCapitalize: 'words',
                headerIconColor: colors.text,
                textColor: colors.text,
                hintTextColor: colors.text,
                shouldShowHintSearchIcon: false,
                disableBackButtonOverride: false,
                onSearchButtonPress: (event) => Keyboard.dismiss(),
                onChangeText: (event) => updateSearch(event.nativeEvent.text),
                placeholder: 'Search your sauce...',
                onCancelButtonPress: () => { updateSearch(''); Keyboard.dismiss(); }
            }
        });
    }, [navigation, dark]);

    useEffect(() => {
        let isMounted = true;
        if (!favs && isMounted) {
            fetchFavs().then(() => setFavLoad(false));
        }
        
        return () => {
            isMounted = false;
        }
    },[]);

    if (favLoad) return <LoadingView colors={ colors } titleData={[{ title: 'Fetching Favorites', loading: favLoad }]} />

    return (
        <View style={{ flex:1 }}>
            <TagLayoutProvider>
                <Tabs.Navigator screenOptions={{ tabBarScrollEnabled: true, swipeEnabled: true, }}>
                    <Tabs.Screen name="CharacterFav" component={CharacterFav} options={{ tabBarLabel: `Characters` }} initialParams={{ data: favs.characters }} />
                    <Tabs.Screen name="AnimeFav" component={MediaFav} options={{ tabBarLabel: `Anime` }} initialParams={{ data: favs.anime, type: 'ANIME' }} />
                    <Tabs.Screen name="MangaFav" component={MediaFav} options={{ tabBarLabel: `Manga` }} initialParams={{ data: favs.manga, type: 'MANGA' }} />
                    <Tabs.Screen name="StaffFav" component={StaffFav} options={{ tabBarLabel: `Staff` }} initialParams={{ data: favs.staff }} />
                    <Tabs.Screen name="StudiosFav" component={StudioFav} options={{ tabBarLabel: `Studios` }} initialParams={{ data: favs.studios }} />
                </Tabs.Navigator>
                <ListFilter sheetRef={sheetRef} type={'FAVORITES'} format={'Any'} navigation={navigation} />
            </TagLayoutProvider>
        </View>
    );
}

export default FavTabs;