import React, { useLayoutEffect, useEffect, useState } from "react";
import {  View, Text, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';
import { IconButton } from "react-native-paper";
import { getSeason, getYear } from "../../utils";
import { CategoryList } from "./components/categoryList";

import { ExploreProps } from "../types";
import { StatusBar } from "expo-status-bar";
import SelectDropdown from "react-native-select-dropdown";
import { HeaderBackground } from "../../Components/header/headers";


export const ExploreScreen = ({navigation, route}:ExploreProps) => {
    const [type, setType] = useState(route.params.type);
    const { colors, dark } = useTheme();
    const { searchParams } = route.params;
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}) => 
            <View style={{flexDirection:'row'}}>
                <IconButton icon='dice-3-outline' size={26} color={colors.text} onPress={() => navigation.navigate('RandomExplore')} />
                <IconButton icon={'filter-outline'} size={26} onPress={() => navigation.navigate('Search', {searchParams})} color={colors.text} rippleColor={colors.primary} />
            </View>,
            headerTitleAlign:'left',
            headerTitle: () =>
            <SelectDropdown 
                data={['ANIME', 'MANGA', 'NOVEL']} 
                defaultValue={type}
                defaultButtonText={type}
                dropdownStyle={{backgroundColor:colors.card, borderRadius:12}}
                rowStyle={{backgroundColor:colors.card, borderBottomWidth:0}}
                buttonStyle={{backgroundColor:colors.background, borderRadius:12, height:40, width:120}}
                renderDropdownIcon={() => <AntDesign name="down" size={16} color={colors.primary} style={{ marginRight: 10 }} />}
                rowTextStyle={{textTransform:'capitalize', color:colors.text}}
                buttonTextStyle={{textTransform:'capitalize', color:colors.text}}
                onSelect={(selected:'ANIME' | 'MANGA' | 'NOVEL', index) => setType(selected)} 
                buttonTextAfterSelection={(selected, index) => {return selected}}
                rowTextForSelection={(item, index) => {return item}}
            />,
            headerBackground: () => <HeaderBackground colors={colors} />
        });
    },[type, navigation, dark, colors]);

    useEffect(() => {
        if (type === 'NOVEL') {
            searchParams.format = 'NOVEL';
        }
    },[]);

    const ListUI = () => {
        const TYPE = (type === 'NOVEL') ? 'MANGA' : type;
        const format = (type === 'NOVEL') ? 'NOVEL' : undefined;
        return(
            <View style={{flex:1}}>
                <ScrollView contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} style={{ flex: 1, backgroundColor:'transparent'}}>
                    <Text style={{ fontSize: 36, fontWeight: 'bold', color:colors.text, alignSelf: 'flex-start', marginLeft: 10,}}>Trending</Text>
                    <CategoryList titleType={"userPreferred"} type={TYPE} format={format} sort={'TRENDING_DESC'} season={undefined} year={undefined} />
                    {type === 'ANIME' ? <Text style={{ fontSize: 36, fontWeight: 'bold', color:colors.text, alignSelf: 'flex-start', marginLeft: 10, }}>This Season</Text> : null}
                    {type === 'ANIME' ? <CategoryList titleType='userPreferred' type='ANIME' format={undefined} sort={'POPULARITY_DESC'} season={getSeason()} year={getYear()} /> : null}
                    <Text style={{ fontSize: 36, fontWeight: 'bold', alignSelf: 'flex-start', color:colors.text, marginLeft: 10,}}>Popular</Text>
                    <CategoryList titleType='userPreferred' type={TYPE} format={format} sort={'POPULARITY_DESC'} season={undefined} year={undefined} />
                    <Text style={{ fontSize: 36, fontWeight: 'bold', alignSelf: 'flex-start', color:colors.text, marginLeft: 10,}}>Top Rated</Text>
                    <CategoryList titleType='userPreferred' type={TYPE} format={format} sort={'SCORE_DESC'} season={undefined} year={undefined} />
                </ScrollView>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{flex:1}}>
            <ListUI />
            <StatusBar style={(dark) ? "light" : 'dark'} />
        </GestureHandlerRootView>
    );
}

