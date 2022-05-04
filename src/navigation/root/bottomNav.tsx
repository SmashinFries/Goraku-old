import React, { useEffect } from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { ExploreStack } from "../stacks/exploreStack";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ListStack } from "../stacks/list";
import { MoreStack } from "../stacks/more";
import { RecommendationStack } from "../stacks/recommendations";
import UserStack from "../stacks/user";
import { useTheme } from "@react-navigation/native";
import * as NavigationBar from 'expo-navigation-bar';

const Bt = createMaterialBottomTabNavigator();
export const BottomNav = ({isAuth}) => {
    const { colors } = useTheme();

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync(colors.card);
    },[colors])
    return (
            <Bt.Navigator initialRouteName="ExploreStack" activeColor={colors.primary} barStyle={{ backgroundColor: colors.card }} shifting keyboardHidesNavigationBar >
                <Bt.Screen 
                    name="ExploreStack" 
                    component={ExploreStack} 
                    options={{  
                        tabBarLabel: 'Explore', 
                        tabBarIcon: ({ color }) => 
                            <MaterialIcons name="explore" size={24} color={color} /> 
                    }} 
                />
                <Bt.Screen 
                    name="RecommendationStack" 
                    component={RecommendationStack}
                    initialParams={{isAuth: isAuth}}
                    options={{ 
                        tabBarLabel: 'Suggested', 
                        tabBarIcon: ({ color }) => 
                            <MaterialIcons name="batch-prediction" size={24} color={color} /> 
                    }} 
                />
                {(isAuth) ? 
                <Bt.Screen 
                    name="ListStack" 
                    component={ListStack} 
                    options={{ 
                        tabBarLabel: 'Shelf', 
                        title:'List', 
                        tabBarIcon: ({ color }) => 
                            <MaterialCommunityIcons name="bookshelf" size={24} color={color} />
                    }} 
                /> : null}
                {(isAuth) ? 
                <Bt.Screen 
                    name="UserStack" 
                    component={UserStack} 
                    options={{ 
                        tabBarLabel: 'User', 
                        title:'User', 
                        tabBarIcon: ({ color }) => 
                            <MaterialIcons name="dynamic-feed" size={24} color={color} /> 
                        }} 
                /> : null}
                <Bt.Screen 
                    name="MoreStack" 
                    component={MoreStack} 
                    options={{ 
                        tabBarLabel: 'More', 
                        title:'More', 
                        tabBarIcon: ({ color }) => 
                            <MaterialIcons name="more-horiz" size={24} color={color} /> 
                    }} 
                />
            </Bt.Navigator>
        
    );
}