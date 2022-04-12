import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useRef } from "react";
import { DrawerStack } from "../drawers/mediaDrawer";
import { ExploreScreen } from "../../containers/explore/explore";
import { FilterRef } from "../../containers/types";
import { SearchScreen } from "../../containers/explore/search/search";
import { TraceMoeScreen } from "../../containers/tracemoe/tracemoe";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { CharDetailScreen } from "../../containers/character";
import { StaffInfo } from "../../containers/staff/staffPage";
import RandomFive from "../../containers/explore/random/random";

const Stack = createNativeStackNavigator();

const initialSearchParams:FilterRef = {
    search: undefined,
    type: 'ANIME',
    tagsIn: undefined,
    genresIn: undefined,
    tagsNotIn: undefined,
    genresNotIn: undefined,
    format: undefined,
    formatIn: undefined,
    formatNotIn: undefined,
    country: undefined,
    year: [undefined],
    score: [undefined],
    episodes: [undefined, undefined],
    chapters: [undefined, undefined],
    onList: undefined,
    licensedBy_in: [undefined],
    status: undefined,
    duration: [undefined, undefined],
    averageScore: [undefined, undefined],
    minTagRank: undefined,
    sort: 'SEARCH_MATCH'
}

export const ExploreStack = () => {
    const searchParams = useRef<FilterRef>(initialSearchParams).current;
    const { colors } = useTheme();
    return (
        <GestureHandlerRootView style={{flex:1}} collapsable={false}>
            <Stack.Navigator initialRouteName="Explore" screenOptions={{}}>
                <Stack.Screen
                    name="Explore"
                    component={ExploreScreen}
                    initialParams={{ type: 'ANIME', searchParams: searchParams }}
                />
                <Stack.Screen
                    name="Info"
                    component={DrawerStack}
                    options={{
                        headerShown: false,                        
                    }}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    initialParams={{searchParams:searchParams}}
                />
                <Stack.Screen
                    name='Image'
                    component={TraceMoeScreen}
                    options={{title:'Image Search'}}
                />
                <Stack.Screen
                    name='CharacterExplore'
                    component={CharDetailScreen}
                    options={{title:'Character'}}
                />
                <Stack.Screen 
                    name='StaffExplore'
                    component={StaffInfo}
                    options={{title:'Staff'}}
                />
                <Stack.Screen
                    name='RandomExplore'
                    component={RandomFive}
                    options={{title:'3 Sauces'}}
                />
            </Stack.Navigator>
            </GestureHandlerRootView>
    );
}