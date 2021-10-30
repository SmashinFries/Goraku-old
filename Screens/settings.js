// React
import React, { useContext, useEffect, useState } from 'react';
import { View, ToastAndroid, Linking, Vibration, useWindowDimensions, ScrollView, ActivityIndicator } from 'react-native';
// UI
import { ListItem, Icon, Overlay, Switch, Text, Divider, Button } from 'react-native-elements';
// Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, useFocusEffect } from '@react-navigation/native';
// Data
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getToken } from '../Storages/getstorage';
import * as Keychain from 'react-native-keychain';
import RNFetchBlob from 'rn-fetch-blob';
import Markdown from 'react-native-markdown-display';
import { LightTheme, themes } from '../Utils/themes';
import { FocusAwareStatusBar } from '../Utils/dataprocess';



const Stack = createStackNavigator();
export const ThemeContext = React.createContext({theme: {theme: 'Light', object:LightTheme, title:'Default'}, setTheme: () => {}});
const android = RNFetchBlob.android;
let dirs = RNFetchBlob.fs.dirs
export const VERSION = 'v1.2-beta';

export const downloadUpdate = (link) => {
    Vibration.vibrate(100);
    ToastAndroid.show('Downloading new update...', ToastAndroid.LONG)
    RNFetchBlob.config({
        addAndroidDownloads : {
          useDownloadManager : true,
          title : 'goraku.apk',
          description : 'Downloading Goraku update',
          mime : 'application/vnd.android.package-archive',
          mediaScannable : true,
          notification : true,
          path: dirs.DownloadDir + `/goraku.apk`,
        }
      })
      .fetch('GET', `${link}`)
      .then((res) => {
          android.actionViewIntent(res.path(), 'application/vnd.android.package-archive')
      })
}

const Settings = () => {
    const {theme, setTheme} = useContext(ThemeContext);
    const [language, setLanguage] = useState('Romaji');
    const [visTheme, setVisTheme] = useState(false);
    const [visLang, setVisLang] = useState(false);
    const [visAbout, setVisAbout] = useState(false);
    const [isNSFW, setNSFW] = useState();
    const [token, setToken] = useState(false);
    const { colors, dark } = useTheme();
    const { width, height } = useWindowDimensions();
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
            title: 'Changelog',
            icon: 'info',
        },
        {
            title: 'Check for Update',
            icon: 'upgrade',
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
            updateChecker();
        } else if (id === 5) {
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
        setTheme({theme: item.theme, object:item.object, title:item.title});
        setVisTheme(false);
    }
    const getTheme = async () => {
        try {
            const themeSet = await AsyncStorage.getItem('@Theme');
            let temp = {theme:'', object:{}, title:''}
            for (let thm in themes) {
                if (themes[thm].theme === themeSet) {
                    temp.theme = themes[thm].theme;
                    temp.object = themes[thm].object;
                    temp.title = themes[thm].title;
                    break;
                }
            }
            setTheme((typeof themeSet === 'string' && temp.theme.length > 0) ? temp : themes[0]);
        } catch (e) {
            console.log(e);
        }
    }
    const ShowTheme = () => {
        return (
            <Overlay fullScreen={true} isVisible={visTheme} onBackdropPress={toggleTheme} overlayStyle={{ backgroundColor:colors.card }}  >
                <View>
                    <Text h1 style={{color:colors.text}}>Themes</Text>
                    <Divider color={colors.border} style={{width:width, marginBottom:5}} orientation='horizontal' width={1} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text h3 style={{color:colors.text}}>Light</Text>
                        <Divider color={colors.text} style={{width:width-180, marginBottom:5}} orientation='horizontal' width={1} />
                        {
                            themes.map((item, i) => ( (item.object.dark === false) ?
                                <ListItem key={i} containerStyle={{backgroundColor:colors.card}} onPress={() => storeTheme(item)}>
                                    <ListItem.Content>
                                        <ListItem.Title style={{color:colors.text}}>{item.title}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            : null))
                        }
                        <Text h3 style={{color:colors.text}}>Dark</Text>
                        <Divider color={colors.text} style={{width:width-180, marginBottom:5}} orientation='horizontal' width={1} />
                        {
                            themes.map((item, i) => ( (item.object.dark === true) ?
                                <ListItem key={i} containerStyle={{backgroundColor:colors.card}} onPress={() => storeTheme(item)}>
                                    <ListItem.Content>
                                        <ListItem.Title style={{color:colors.text}}>{item.title}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            : null))
                        }
                    </ScrollView>
                    <Button icon={{name:'close', type:'material', color:colors.text, size:25}} onPress={toggleTheme} containerStyle={{position:'absolute', top:15, right:15, borderRadius:100}} buttonStyle={{backgroundColor:'rgba(0,0,0,0)'}} />
                </View>
            </Overlay>
        );
    }

    const ShowChangelog = () => {
        const [changelog, setChangeLog] = useState('');
        const [load, setLoad] = useState(false);
        const [tag, setTag] = useState('');
        getChanges = async() => {
            try {
                setLoad(true);
                const update = await axios.request(`https://api.github.com/repos/smashinfries/goraku/releases/tags/${VERSION}`);
                setChangeLog(update.data.body);
                setTag(update.data.tag_name);
                setLoad(false);
            } catch (error) {
                console.error(error);
            }
        }

        useEffect(() => {
            getChanges();
        },[]);

        return(
            <Overlay isVisible={visAbout} onBackdropPress={() => setVisAbout(false)} overlayStyle={{ backgroundColor: colors.card, width: width / 1.15, minHeight:50 }}>
                {(load !== true) ? 
                <View>
                    <Text h2 style={{ color: colors.text }}>{tag}</Text>
                    <Divider />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Markdown style={{ body: { color: colors.text } }}>{changelog}</Markdown>
                    </ScrollView>
                    <Button icon={{ name: 'close', type: 'material', size: 20, color: colors.text }} onPress={() => setVisAbout(false)} titleStyle={{ color: '#000' }} type='clear' containerStyle={{ position: 'absolute', top: 0, right: 0, padding: 8, borderRadius: 8 }} />
                </View>
                    : <View style={{ flex: 1, justifyContent: 'center', height:50 }}><ActivityIndicator size='large' color={colors.primary} /></View>}
            </Overlay>
        );
    }

    const updateChecker = async() => {
        try {
            const update = await axios.request('https://api.github.com/repos/smashinfries/goraku/releases/latest');
            if (update.data['tag_name'] === VERSION) return ToastAndroid.show('No updates yet :(', ToastAndroid.SHORT)
            if (update.data['tag_name'] !== VERSION) return downloadUpdate(update.data.assets[0].browser_download_url);
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <View style={{ flex: 1 }}>
            <FocusAwareStatusBar barStyle={(dark === true) ? 'light-content' : 'dark-content' } translucent={true} />
            {
                options.map((item, i) => (
                     <ListItem key={i} onPress={() => toggleOption(i)} containerStyle={{backgroundColor:colors.card}} >
                        <Icon name={item.icon} type='material' color={colors.primary}  />
                        <ListItem.Content>
                            <ListItem.Title style={{color:colors.text}}>{item.title}</ListItem.Title>
                            {(i == 0) ? <ListItem.Subtitle style={{color:colors.text}}>{theme.title}</ListItem.Subtitle> 
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
            {(visAbout === true) ? <ShowChangelog /> : null}
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