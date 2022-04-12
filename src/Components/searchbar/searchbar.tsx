import React, { useState, useEffect } from "react";
import { View, StyleProp, ViewStyle, Pressable } from "react-native";
import { TextInput, Searchbar } from 'react-native-paper';
import { FilterRef } from "../../containers/types";
import { useKeyboard } from "../../utils";
import { ThemeColors } from "../types";

interface SearchProps {
    searchParams?: FilterRef;
    style?: StyleProp<ViewStyle>;
    searchPress?: () => void;
    colors: ThemeColors;
    dark: boolean;
}
export const SearchBar = ({searchParams, searchPress, colors, dark, style={}}:SearchProps) => {
    const [isPressed, setIsPressed] = useState(false);
    const [search, setSearch] = useState((searchParams.search !== undefined) ? searchParams.search : '');
    const isKeyBoardOpen = useKeyboard();

    useEffect(() => {
        if (isKeyBoardOpen === false && search.length === 0) {
            setIsPressed(false);
        }
    }, [isKeyBoardOpen]);

    useEffect(() => {
        if (search.length > 0) {
            searchParams.search = search;
        } else {
            searchParams.search = undefined;
        }
        
    },[search])

    return(
        <View style={[style]}>
            <Searchbar
                placeholder="Search the sauce..."
                placeholderTextColor={colors.text}
                onChangeText={text => setSearch(text)}
                onSubmitEditing={() => searchPress()}
                iconColor={colors.text}
                value={search}
                inputStyle={{color:colors.text}}
                style={{width:'85%', alignSelf:'center', backgroundColor:colors.card, color:colors.text}}
            />
        </View>
    );
}