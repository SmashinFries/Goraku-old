import React, { useContext, useEffect, useState } from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SettingsScreenProps, ThemesScreenProps } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton, List, Switch } from 'react-native-paper';
import { storeTheme } from "../../Storage/themeStorage";
import { ThemeContext } from "../../contexts/context";
import { AvailableThemes } from "../../Themes/themes";

const Stack = createNativeStackNavigator();

export const SettingsScreen = ({navigation, route}:SettingsScreenProps) => {
    const { colors, dark } = useTheme();

    return(
        <ScrollView style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
            <List.Item rippleColor={colors.border} title="Themes" titleStyle={{color:colors.text}} onPress={() => navigation.push('Themes')} left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.primary} />} />
        </ScrollView>
    );
}

const Themes = ({navigation, route}:ThemesScreenProps) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const {colors, dark} = useTheme();
    const [selectedColor, setSelectedColor] = useState<string>(theme);

    useEffect(() => {
        storeTheme(theme);
    },[theme]);

    type ColorPickerProps = {icon: string; color: string; title?: AvailableThemes;}
    const toggleColor = (title:string) => {
        console.log(title)
        if (title === selectedColor) {
            setSelectedColor((title.includes('Dark')) ? 'Dark' : 'Light'); 
            setTheme((title.includes('Dark')) ? 'Dark' : 'Light');
        } else {
            setSelectedColor(title); 
            setTheme(title);
        }
    }; 
    const ColorPicker = ({icon, color, title}:ColorPickerProps) => {
        return(
            <View style={{borderRadius:12, margin:5, overflow:'hidden'}}>
                <Pressable style={{ borderRadius:12, borderWidth:(title === selectedColor) ? .6 : 0, borderColor:colors.primary}} onPress={() => toggleColor(title)} android_ripple={{color:color}}>
                    <IconButton icon={icon} color={color} size={40} />
                    <Text style={{position:'absolute', alignSelf:'center', bottom:0, color:color}}>{(title.includes('Dark')) ? title.replace('Dark', '') : title}</Text>
                    {(title === selectedColor) && <IconButton icon='checkbox-marked-circle-outline' color={colors.primary} size={15} style={{position:'absolute', top:-4, right:-4}} />}
                </Pressable>
            </View>
        );
    }

    const toggleDarkMode = () => {
        console.log('Settings:', theme);
        const newTheme = (theme.includes('Dark')) ? theme.replace('Dark', '') : theme+'Dark';
        setTheme((theme === 'Dark' || theme === 'Light') ? (theme === 'Dark') ? 'Light' : 'Dark' : newTheme);
        setSelectedColor(newTheme);
    }

    return(
        <ScrollView contentContainerStyle={{justifyContent:'flex-start',}} style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
            {/* @ts-ignore */}
            <List.Item titleStyle={{color:colors.text}} title="Dark Mode" right={() => <Switch value={(dark) ? true : false} onValueChange={toggleDarkMode} color={colors.primary} />} />
            <List.Section>
                <List.Subheader style={{color:colors.text}}>Theme Colors</List.Subheader>
                <View style={{flexDirection:'row', marginHorizontal:10, justifyContent:'space-evenly',}}>
                    <ColorPicker icon='taco' title={(selectedColor.includes('Dark')) ? "TacoDark" : "Taco"} color='rgb(241, 191, 97)' />
                    <ColorPicker icon='noodles' title={(selectedColor.includes('Dark')) ? 'NoodlesDark' : 'Noodles'} color='rgb(255, 37, 25)' />
                    <ColorPicker icon='cup-water' title={(selectedColor.includes('Dark')) ? 'WaterDark' : 'Water'} color='rgb(2, 186, 227)' />
                    <ColorPicker icon='alien-outline' title={(selectedColor.includes('Dark')) ? 'AlienDark' : 'Alien'} color='rgb(81, 173, 16)' />
                    <ColorPicker icon='cupcake' title={(selectedColor.includes('Dark')) ? 'CupcakeDark' : 'Cupcake'} color={'rgb(238, 130, 164)'} />
                </View>
            </List.Section>
            {/* <List.Item titleStyle={{color:colors.text}} title="Use Profile Color" right={() => <Switch value={(theme === 'Light') ? true : false} color={colors.primary} />} /> */}
        </ScrollView>
    );
}

export const SettingsStack = () => {
    const {colors, dark} = useTheme();
    return (
        <Stack.Navigator initialRouteName="Settings" screenOptions={{headerStyle:{backgroundColor:colors.card}}}>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Themes" component={Themes} />
        </Stack.Navigator>
    );
}