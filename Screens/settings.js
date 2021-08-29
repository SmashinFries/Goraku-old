import React, { useContext, useEffect, useState } from 'react';
import { View, StatusBar, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem, Icon, Overlay, Switch, Text } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();
export const ThemeContext = React.createContext({theme: 'Light', setTheme: () => {}});

const Settings = () => {
    const {theme, setTheme} = useContext(ThemeContext);
    const [language, setLanguage] = useState('Romaji');
    const [visTheme, setVisTheme] = useState(false);
    const [visLang, setVisLang] = useState(false);
    const [visAbout, setVisAbout] = useState(false);
    const [isNSFW, setNSFW] = useState();
    const { colors } = useTheme();
    const options = [
        {
            title: 'Change Theme',
            icon: 'lightbulb',
        },
        {
            title: 'Media Language',
            icon: 'language',
        },
        {
            title: 'NSFW',
            icon: 'explicit',
        },
        {
            title: 'About',
            icon: 'info',
        },
    ];

    useEffect(() => {
        getTheme();
        getLanguage();
        getNSFW();
    }, []);

    const storeNSFW = async() => {
        try {
            await AsyncStorage.setItem('@NSFW', (isNSFW === true) ? 'enabled' : 'disabled');
        } catch (e) {
            console.log('Asyncstorage ERROR:', e);
        };
    }

    useEffect(() => {
        storeNSFW();
    }, [isNSFW]);

    const toggleNSFW = () => {setNSFW(!isNSFW);  Toast.show({text1:'Restart Required', position:'top', visibilityTime: 3000, autoHide:true, type:'success', topOffset:StatusBar.currentHeight })};

    const getNSFW = async() => {
        try {
            const nsfw = await AsyncStorage.getItem('@NSFW');
            setNSFW((nsfw === 'enabled') ? true : false);
        } catch (e) {
            console.log(e);
        }
    }

    const toggleOption = (id) => {
        if (id === 0) {
            setVisTheme(!visTheme);
        } else if (id === 1) {
            setVisLang(!visLang);
        } else if (id === 3) {
            setVisAbout(!visAbout);
        }
    }

    const toggleLang = () => setVisLang(!visLang);
    const storeLang = async(language) =>  {
        try {
            await AsyncStorage.setItem('@TitleLang', language);
        } catch (e) {
            console.log('Asyncstorage ERROR:', e);
        };
        setLanguage(language);
        setVisLang(false);
    }
    const getLanguage = async () => {
        try {
            const languageSet = await AsyncStorage.getItem('@TitleLang');
            setLanguage((languageSet !== null) ? languageSet : 'Romaji');
            (languageSet === null) ? storeLang('Romaji') : null;
        } catch (e) {
            console.log(e);
        }
    }
    const ShowLang = () => {
        const langs = ['Romaji', 'Native'];
        return (
            <Overlay isVisible={visLang} onBackdropPress={toggleLang} overlayStyle={{ borderRadius: 8, backgroundColor:colors.card }}  >
                {
                    langs.map((item, i) => (
                        <ListItem key={i} containerStyle={{ width: 200, backgroundColor:colors.card }} onPress={() => {storeLang(item); Toast.show({text1:'Restart Required', position:'top', visibilityTime: 3000, autoHide:true, type:'success', topOffset:StatusBar.currentHeight })}}>
                            <ListItem.Content>
                                <ListItem.Title style={{color:colors.text}}>{item}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))
                }
            </Overlay>
        );
    }

    const toggleTheme = () => setVisTheme(!visTheme);
    const storeTheme = async (item) => {
        try {
            await AsyncStorage.setItem('@Theme', item.theme);
        } catch (e) {
            console.log('Asyncstorage ERROR:', e);
        };
        setTheme(item.theme);
        setVisTheme(false);
    }
    const getTheme = async () => {
        try {
            const themeSet = await AsyncStorage.getItem('@Theme');
            setTheme((themeSet !== null) ? themeSet : 'Light');
        } catch (e) {
            console.log(e);
        }
    }
    const ShowTheme = () => {
        const themes = [{ theme: 'Light' }, { theme: 'Dark' }];
        return (
            <Overlay isVisible={visTheme} onBackdropPress={toggleTheme} overlayStyle={{ borderRadius: 8, backgroundColor:colors.card }}  >
                {
                    themes.map((item, i) => (
                        <ListItem key={i} containerStyle={{ width: 200, backgroundColor:colors.card }} onPress={() => storeTheme(item)}>
                            <ListItem.Content>
                                <ListItem.Title style={{color:colors.text}}>{item.theme}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))
                }
            </Overlay>
        );
    }

    const ShowAbout = () => {
        return(
            <Overlay isVisible={visAbout} onBackdropPress={() => setVisAbout(false)}>
                <Text h3>Work in Progress</Text>
                <Text>Version: 0.01</Text>
            </Overlay>
        );
    }

    return(
        <View style={{ flex: 1 }}>
            {
                options.map((item, i) => (
                    <ListItem key={i} onPress={() => toggleOption(i)} containerStyle={{backgroundColor:colors.card}}  bottomDivider>
                        <Icon name={item.icon} type='material' color={colors.text}  />
                        <ListItem.Content>
                            <ListItem.Title style={{color:colors.text}}>{item.title}</ListItem.Title>
                            {(i == 0) ? <ListItem.Subtitle style={{color:colors.text}}>{theme}</ListItem.Subtitle> 
                            : (i == 1) ? <ListItem.Subtitle style={{color:colors.text}}>{language}</ListItem.Subtitle>
                            : null}
                        </ListItem.Content>
                        {(i === 2) ? <Switch value={isNSFW} color={colors.primary} onValueChange={toggleNSFW} /> : null}
                        <ListItem.Chevron />
                    </ListItem>
                ))
            }
            {(visTheme === true) ? <ShowTheme /> : null}
            {(visLang === true) ? <ShowLang /> : null}
            {(visAbout === true) ? <ShowAbout /> : null}
        </View>
    );
}

export const SettingsPage = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name='Settings' component={Settings} />
        </Stack.Navigator>
    );
}