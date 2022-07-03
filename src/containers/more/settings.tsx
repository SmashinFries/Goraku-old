import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SettingsScreenProps, ThemesScreenProps } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Card, DefaultTheme, Divider, IconButton, List, Modal, Portal, RadioButton, Switch } from 'react-native-paper';
import { storeTheme } from "../../Storage/themeStorage";
import { ThemeContext } from "../../contexts/context";
import { AvailableThemes } from "../../Themes/themes";
import { ThemeColors } from "../../Components/types";
import { getImgType, getSaveImgType, storeSaveImgType, useDevArtEnabled } from "../../Storage/generalSettings";
import { ADULT_ALLOW } from "../../constants";

const Stack = createNativeStackNavigator();

export const SettingsScreen = ({navigation, route}:SettingsScreenProps) => {
    const { colors, dark } = useTheme();
    const {imgType, setImgType} = getImgType();
    const [saveimgVis, setSaveimgVis] = useState(false);
    const {devartState, updateDevArt} = useDevArtEnabled();

    const hideSaveImgModal = () => setSaveimgVis(false);

    const ToggleDevArt = () => {
        return(
            <Switch value={devartState} onValueChange={() => updateDevArt(!devartState)} />
        )
    }

    return(
        <ScrollView style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
            <List.Section>
                <List.Subheader>Appearance</List.Subheader>
                <List.Item rippleColor={colors.border} title="Themes" titleStyle={{color:colors.text}} onPress={() => navigation.navigate('Themes')} left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.primary} />} />
            </List.Section>
            <List.Section>
                <List.Subheader>API</List.Subheader>
                <List.Item 
                    rippleColor={colors.border} 
                    title="Deviant Art" 
                    description={(ADULT_ALLOW) ? 'Enable character fan art' : 'Uncensored version required!\n(Too risky for Play Store 😔)'} 
                    descriptionStyle={(!ADULT_ALLOW) && {color:'red'}}
                    titleStyle={{color:colors.text}} 
                    left={props => <List.Icon {...props} 
                    icon="brush" 
                    color={colors.primary} />} 
                    right={props => (ADULT_ALLOW) ? <ToggleDevArt /> : undefined} 
                />
            </List.Section>
            <List.Section>
                <List.Subheader>Images</List.Subheader>
                <List.Item rippleColor={colors.border} title="Save Image Type" titleStyle={{color:colors.text}} onPress={() => setSaveimgVis(true)} right={props => <View style={{justifyContent:'center', paddingRight:10}}><Text style={{color:props.color}}>{imgType}</Text></View>} left={props => <List.Icon {...props} icon="image" color={colors.primary} />} />
            </List.Section>
            <SavedImageModal visible={saveimgVis} hideModal={hideSaveImgModal} setType={setImgType} colors={colors} />
            
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

type ImageModalProps = {
    visible: boolean;
    hideModal: () => void;
    setType: Dispatch<SetStateAction<string>>;
    colors: ThemeColors;
}
const SavedImageModal = ({visible, hideModal, setType, colors}:ImageModalProps) => {
    const [saveImgType, setSaveImgType] = useState<string>('jpg');

    const selectJPG = () => setSaveImgType('jpg');
    const selectPNG = () => setSaveImgType('png');

    const confirmType = async() => {
        await storeSaveImgType(saveImgType);
        setType(saveImgType);
        hideModal();
    }

    useEffect(() => {
        let isMounted = true;
        const checkType = async() => {
            const type = await getSaveImgType();
            return type;
        }

        if (isMounted) {
            checkType().then(type => (type) && setSaveImgType(type));
        }

    },[]);

    return(
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{width:'60%', alignSelf:'center'}}>
                <Card>
                    <Card.Title title="Saved Image Type" />
                    <Divider />
                    <Card.Content style={{paddingTop:20}}>
                        <Pressable onPress={selectJPG} style={{flexDirection:'row', paddingHorizontal:5, justifyContent:'space-between', alignItems:'center'}} >
                            <Text style={{color:colors.text}}>jpg</Text>
                            <RadioButton.Android onPress={selectJPG} color={colors.primary} status={(saveImgType === 'jpg') ? 'checked' : 'unchecked'} uncheckedColor={colors.text} value="jpg" />
                        </Pressable>
                        <Pressable onPress={selectPNG} style={{flexDirection:'row', paddingHorizontal:5, justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={{color:colors.text}}>png</Text>
                            <RadioButton.Android onPress={selectPNG} color={colors.primary} status={(saveImgType === 'png') ? 'checked' : 'unchecked'} uncheckedColor={colors.text} value="png" />
                        </Pressable>
                    </Card.Content>
                    <Card.Actions style={{justifyContent:'flex-end', paddingTop:20}}>
                        <Button onPress={hideModal} color={colors.primary}>Cancel</Button>
                        <Button onPress={confirmType} color={colors.primary}>Ok</Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
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