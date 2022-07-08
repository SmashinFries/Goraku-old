import React, { useEffect, useState } from "react";
import {  View, Text } from "react-native";
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
import { Formats } from "../../Components/types";
import { MediaAnimeSort, MediaCountries } from "../../Api/types";


export const ExploreScreen = ({navigation, route}:ExploreProps) => {
    const [type, setType] = useState(route.params.type);
    const { colors, dark } = useTheme();
    const { searchParams } = route.params;
    
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => 
            <View style={{flexDirection:'row'}}>
                <IconButton icon='dice-3-outline' size={26} color={colors.text} onPress={() => navigation.navigate('RandomExplore')} />
                <IconButton icon={'magnify'} size={26} onPress={() => navigation.navigate('Search', {searchParams})} color={colors.text} rippleColor={colors.primary} />
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
    },[type, navigation, dark]);

    useEffect(() => {
        if (type === 'NOVEL') {
            searchParams.format = 'NOVEL';
        }
    },[]);

    type SectionListProps = {
        heading:string;
        TYPE:"ANIME"|"MANGA";
        format:"NOVEL"|undefined;
        noFormat:Formats[]|undefined;
        sort?:MediaAnimeSort;
        country?:MediaCountries|undefined;
        doujin?:boolean;
    }
    type ListProps = {
        TYPE:"ANIME"|"MANGA";
        format:"NOVEL"|undefined;
        noFormat:Formats[]|undefined;
    }
    const GeneralList = ({heading, TYPE, format, noFormat, sort, country, doujin=false}:SectionListProps) => {
        return(
            <>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color:colors.text, alignSelf: 'flex-start', marginLeft: 10,}}>{heading}</Text>
                <CategoryList titleType={"userPreferred"} type={TYPE} country={country} doujin={!doujin} format={format} noFormat={noFormat} sort={sort} season={undefined} year={undefined} />
            </>
        );
    }

    type SeasonListType = {
        heading:string;
        nextSeason?:boolean;
    }
    const SeasonList = ({heading, nextSeason=false}:SeasonListType) => {
        return(
            <>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color:colors.text, alignSelf: 'flex-start', marginLeft: 10, }}>{heading}</Text>
                <CategoryList titleType='userPreferred' type='ANIME' format={undefined} sort={'POPULARITY_DESC'} season={getSeason(nextSeason)} year={getYear()} />
            </>
        );
    }

    const AnimeList = ({TYPE, format, noFormat}:ListProps) => {
        return(
            <>
                <GeneralList heading="Trending" TYPE={TYPE} format={format} noFormat={noFormat} sort='TRENDING_DESC' />
                <SeasonList heading='This Season' />
                <SeasonList heading='Next Season' nextSeason />
                <GeneralList heading="Popular" TYPE={TYPE} format={format} noFormat={noFormat} sort='POPULARITY_DESC' />
                <GeneralList heading="Top Rated" TYPE={TYPE} format={format} noFormat={noFormat} sort='SCORE_DESC' />
            </>
        );
    }

    const MangaList = ({TYPE, format, noFormat}:ListProps) => {
        return(
            <>
                <GeneralList heading='Trending' TYPE={TYPE} format={format} noFormat={noFormat} sort='TRENDING_DESC' />
                <GeneralList heading='Popular' TYPE={TYPE} format={format} noFormat={noFormat} sort='POPULARITY_DESC' />
                <GeneralList heading='Popular Doujin' TYPE={TYPE} format={format} noFormat={noFormat} sort='POPULARITY_DESC' doujin={true} />
                <GeneralList heading='Popular Manhwa' TYPE={TYPE} format={format} noFormat={noFormat} sort='POPULARITY_DESC' country="KR" />
                <GeneralList heading='Top Rated' TYPE={TYPE} format={format} noFormat={noFormat} sort='SCORE_DESC' />
            </>
        );
    }

    const NovelList = ({TYPE, format, noFormat}:ListProps) => {
        return(
            <>
                <GeneralList heading='Trending' TYPE={TYPE} format={format} noFormat={noFormat} sort='TRENDING_DESC' />
                <GeneralList heading='Popular' TYPE={TYPE} format={format} noFormat={noFormat} sort='POPULARITY_DESC' />
                <GeneralList heading='Top Rated' TYPE={TYPE} format={format} noFormat={noFormat} sort='SCORE_DESC' />
            </>
        );
    }

    const ListUI = () => {
        const TYPE = (type === 'NOVEL') ? 'MANGA' : type;
        const format = (type === 'NOVEL') ? 'NOVEL' : undefined;
        const noFormat:Formats[] = (type === 'MANGA') ? ['NOVEL'] : undefined;
        return(
            <View style={{flex:1}}>
                <ScrollView contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} style={{ flex: 1, backgroundColor:'transparent'}}>
                    {(type === 'ANIME') ? <AnimeList TYPE={TYPE} format={format} noFormat={noFormat} /> : null}
                    {(type === 'MANGA') ? <MangaList TYPE={TYPE} format={format} noFormat={noFormat} /> : null}
                    {(type === 'NOVEL') ? <NovelList TYPE={TYPE} format={format} noFormat={noFormat} /> : null}
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

