import React, { useContext, useEffect, useMemo, useState } from "react";
import { View, Text, Linking, ToastAndroid, useWindowDimensions, ScrollView } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { List, Switch, Avatar, Portal, Dialog, Button, Caption } from 'react-native-paper';
import { checkTokenExpiration, getAuth, removeToken } from "../../../Storage/authToken";
import { changeLanguage, changeNSFW, getUserOptions } from "../../../Api/anilist/anilist";
import { RefreshContext, AccountContext, NotificationContext } from "../../../contexts/context";
import useNotification from "../../../Notifications/notifications";
import { openURL } from "expo-linking";
import {  UserOptionViewer } from "../../../Api/types";
import FastImage from "react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import { storeNSFW } from "../../../Storage/nsfw";
import { ADULT_ALLOW } from "../../../constants";
import { RadioButton } from "../../../Components/buttons/radio";
import { _openAuthBrowser } from "../../../utils";
import UserHeader from "./components/userHeading";
import { LoginButton, LogoutButton, MLMenuButton, NSFWswitch, ProfileMenuButton } from "./components/buttons";

export const AccountHome = ({navigation, route}) => {
    const { isAuth, setIsAuth } = useContext(AccountContext);
    const { isAllowed, toggleFetchTask } = useNotification(isAuth);
    const [ userData, setUserData ] = useState<UserOptionViewer>(undefined);
    const { colors, dark } = useTheme();
    const [isPressed, setIsPressed] = useState(false);
    const [tokenExp, setTokenExp] = useState<string>();
    const token = route.params?.token;

    const handleLogin = () => _openAuthBrowser().then(() => setIsPressed(true));

    const value =  useMemo(() => ({ isAllowed, toggleFetchTask }), [isAllowed]);

    const logout = async() => {
        const success = await removeToken();
        if(success) {
            // @ts-ignore
            setIsAuth(false);
            changeNSFW(ADULT_ALLOW);
            ToastAndroid.show('Logged out', ToastAndroid.SHORT);
        }
    }

    const adultContentWarning = () => {
        return 'The uncensored version on Github is required.';
    }

    const handleNSFW = async() => {
        await changeNSFW(!userData.options.displayAdultContent);
        setUserData({...userData, options: {...userData.options, displayAdultContent: !userData.options.displayAdultContent}});        
    }

    useEffect(() => {
        if (!isAuth && isPressed) {
            // @ts-ignore
            getAuth(token).then(auth => {setIsAuth(auth); ToastAndroid.show('Logged In', ToastAndroid.SHORT);});
            getUserOptions().then(data => {
                setUserData(data);
                storeNSFW(data.options.displayAdultContent);
            });
        }
    },[token]);

    useFocusEffect(
        React.useCallback(() => {
            if (isAuth) {
                checkTokenExpiration().then(exp => {
                    setTokenExp(exp);
                });
            }
        },[isAuth])
      );

    useEffect(() => {
        if (isAuth) {
            getUserOptions().then(data => {
                setUserData(data);
                storeNSFW(data.options.displayAdultContent);
            });
        }
    },[]);

    return (
        <NotificationContext.Provider value={value}>
            <ScrollView style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
                {(userData && isAuth) && 
                    <UserHeader userData={userData} colors={colors} />
                }
                {(!isAuth) ? 
                    <LoginButton handleLogin={handleLogin} colors={colors} />
                    : <LogoutButton colors={colors} tokenExp={tokenExp} logout={logout} />
                }
                {(isAuth) &&
                    <View>
                        <MLMenuButton userData={userData} navigation={navigation} colors={colors} />
                        <ProfileMenuButton userData={userData} colors={colors} />
                        <NSFWswitch userData={userData} adultContentWarning={adultContentWarning} handleNSFW={handleNSFW} colors={colors} />
                        {(tokenExp) && <Caption onPress={() => checkTokenExpiration().then(txt => setTokenExp(txt))} style={{color:colors.text, paddingLeft:10}}>{`Login Expires in:\n${tokenExp}`}</Caption>}
                    </View>
                }
                {/* Disabling Notifications */}
                {/* {(isAuth) && 
                    <List.Item 
                        title="Notifications" 
                        titleStyle={{color:colors.text}} 
                        left={props => <List.Icon {...props} icon="bell" color={colors.primary} />}
                        right={() => <Switch value={isAllowed} onValueChange={toggleFetchTask} color={colors.primary} />}
                    /> 
                } */}
            </ScrollView>
        </NotificationContext.Provider>
    );
}

export const ChooseLanguage = ({navigation, route}) => {
    const { title, staffName } = route.params;
    const [visible, setVisible] = useState({vis: false, type:''});
    const [languages, setLanguages] = useState({title: title, staffName: staffName});
    const { colors, dark } = useTheme();
    const {refresh, setRefresh} = useContext(RefreshContext);
    const onDismiss = () => setVisible({vis: false, type:''});
    
    const { width, height } = useWindowDimensions();
    const titleLanguage = ['ROMAJI', 'ENGLISH', 'NATIVE'];
    const staffLanguage = ['ROMAJI_WESTERN', 'ROMAJI', 'NATIVE'];

    const LanguageDialog = () => {
        const [value, setValue] = useState((visible.type) ? languages.title : languages.staffName);
        const options = (visible.type === 'Title') ? titleLanguage : staffLanguage;

        const confirmPress = async(language:string) => {
            const res = await changeLanguage((visible.type === 'Title') ? language : undefined, (visible.type === 'Staff') ? language : undefined);
            // @ts-ignore
            setRefresh(!refresh);
            switch(visible.type) {
                case 'Title': 
                    setLanguages({...languages, title: language});
                    break;
                case 'Staff':
                    setLanguages({...languages, staffName: language});
                    break;
            }
            onDismiss();
        }

        return (
            <Dialog visible={visible.vis} onDismiss={onDismiss} style={{ backgroundColor: colors.card }}>
                <Dialog.Title theme={{ colors: { text: colors.text } }}>{visible.type + ' Language'}</Dialog.Title>
                <Dialog.Content>
                        {options.map((option, index) =>
                            <RadioButton key={index} colors={{colors,dark}} activeItem={value} text={option} onPress={() => setValue(option)} />
                        )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss} color={colors.text}>Cancel</Button>
                    <Button onPress={() => confirmPress(value)} color={colors.primary}>Confirm</Button>
                </Dialog.Actions>
            </Dialog>
        );
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Language'
        });
    },[navigation, dark]);

    return(
        <ScrollView style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
            <List.Item rippleColor={colors.border} title='Title Language' titleStyle={{color:colors.text}} onPress={() => setVisible({vis:true, type:'Title'})} right={props => <Text style={[props.style, {textAlignVertical:'center', marginRight:10, textTransform:'capitalize', color:colors.primary}]}>{languages.title}</Text>} />
            <List.Item rippleColor={colors.border} title='Staff Name Language' titleStyle={{color:colors.text}} onPress={() => setVisible({vis:true, type:'Staff'})} right={props => <Text style={[props.style, {textAlignVertical:'center', marginRight:10, textTransform:'capitalize', color:colors.primary}]}>{languages.staffName}</Text>} />
            <Portal>
                <LanguageDialog />
            </Portal>
        </ScrollView>
    );
}