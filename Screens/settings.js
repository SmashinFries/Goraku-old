import React, { useContext, useEffect, useState } from 'react';
import { View, ToastAndroid, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem, Icon, Overlay, Switch, Text } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, useFocusEffect, CommonActions } from '@react-navigation/native';
import { getToken } from '../api/getstorage';
import * as Keychain from 'react-native-keychain';

const Stack = createStackNavigator();
export const ThemeContext = React.createContext({theme: 'Light', setTheme: () => {}});

const Settings = ({navigation}) => {
    const {theme, setTheme} = useContext(ThemeContext);
    const [language, setLanguage] = useState('Romaji');
    const [visTheme, setVisTheme] = useState(false);
    const [visLang, setVisLang] = useState(false);
    const [visAbout, setVisAbout] = useState(false);
    const [isNSFW, setNSFW] = useState();
    const [token, setToken] = useState(false);
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
        (typeof token === 'string') ? 
        {
            title: 'Logout',
            icon: 'logout',
        } : 
        {
            title: 'Login',
            icon: 'login',
        },
    ];

    useEffect(() => {
        getTheme();
        getLanguage();
        getNSFW();
    }, [token]);

    const getLog = async() => {
        const token = await getToken();
        setToken(token);
    }

    useFocusEffect(
        React.useCallback(() => {
            getLog();
        }, [])
    );

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

    const toggleNSFW = () => {setNSFW(!isNSFW); ToastAndroid.show('Refresh Required', ToastAndroid.SHORT)};

    const getNSFW = async() => {
        try {
            const nsfw = await AsyncStorage.getItem('@NSFW');
            setNSFW((nsfw === 'enabled') ? true : false);
        } catch (e) {
            console.log(e);
        }
    }

    const logout = async() => {
        await Keychain.resetGenericPassword();
        await AsyncStorage.removeItem('@UserID');
        setToken(false);
        Linking.openURL('goraku://user/false');
    }

    const toggleOption = (id) => {
        if (id === 0) {
            setVisTheme(!visTheme);
        } else if (id === 1) {
            setVisLang(!visLang);
        } else if (id === 3) {
            setVisAbout(!visAbout);
        } else if (id === 4) {
            if (typeof token === 'string') {
                logout();
            } else {
                Linking.openURL('https://anilist.co/api/v2/oauth/authorize?client_id=6419&response_type=token');
            }
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
                        <ListItem key={i} containerStyle={{ width: 200, backgroundColor:colors.card }} onPress={() => {storeLang(item); ToastAndroid.show('Refresh Required', ToastAndroid.SHORT)}}>
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
                <Text h3>Beta</Text>
                <Text>Version: 1.0</Text>
            </Overlay>
        );
    }

    return(
        <View style={{ flex: 1 }}>
            {
                options.map((item, i) => (
                     <ListItem key={i} onPress={() => toggleOption(i)} containerStyle={{backgroundColor:colors.card}} >
                        <Icon name={item.icon} type='material' color={colors.text}  />
                        <ListItem.Content>
                            <ListItem.Title style={{color:colors.text}}>{item.title}</ListItem.Title>
                            {(i == 0) ? <ListItem.Subtitle style={{color:colors.text}}>{theme}</ListItem.Subtitle> 
                            : (i == 1) ? <ListItem.Subtitle style={{color:colors.text}}>{language}</ListItem.Subtitle>
                            : null}
                        </ListItem.Content>
                        {(i === 2) ? <Switch value={isNSFW} color={colors.primary} onValueChange={toggleNSFW} /> : null}
                        {(i === 2) ? null : <ListItem.Chevron />}
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