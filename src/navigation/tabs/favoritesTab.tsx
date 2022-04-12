import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { UserFavMediaNode, UserFavoritesType } from "../../Api/types";
import { CharacterFav, MediaFav, StaffFav, StudioFav } from "../../containers/favorites";

const Tabs = createMaterialTopTabNavigator();

export const FavoritesTabs = () => {

    return(
        <Tabs.Navigator screenOptions={{ tabBarScrollEnabled: true, swipeEnabled: true }}>
            <Tabs.Screen name="CharacterFav" component={CharacterFav} options={{ tabBarLabel: `Characters` }} initialParams={{type:'CHARACTERS'}} />
            <Tabs.Screen name="AnimeFav" component={MediaFav} options={{ tabBarLabel: `Anime` }} initialParams={{type:'ANIME'}} />
            <Tabs.Screen name="MangaFav" component={MediaFav} options={{ tabBarLabel: `Manga` }} initialParams={{type:'MANGA'}} />
            <Tabs.Screen name="StaffFav" component={StaffFav} options={{ tabBarLabel: `Staff` }} initialParams={{type:'STAFF'}} />
            <Tabs.Screen name="StudiosFav" component={StudioFav} options={{ tabBarLabel: `Studios` }} initialParams={{type:'STUDIO'}} />
        </Tabs.Navigator>
    );
}