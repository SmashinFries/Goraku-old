import React, { useContext, useEffect, useState } from "react";
import { View, Text, ToastAndroid, useWindowDimensions, ScrollView, Image } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { List, Portal, Dialog, Button, Caption, ActivityIndicator, IconButton } from 'react-native-paper';
import { checkTokenExpiration, getAuth, removeToken } from "../../../Storage/authToken";
import { changeLanguage, changeNSFW } from "../../../Api/anilist/anilist";
import { RefreshContext, AccountContext } from "../../../contexts/context";
import { ADULT_ALLOW } from "../../../constants";
import { RadioButton } from "../../../Components/buttons/radio";
import { _openAuthBrowser, _openBrowserUrl } from "../../../utils";
import { AccountSettings, LoginButton, LogoutButton } from "./components/buttons";
import { LoadingView } from "../../../Components";
import { AccountType } from "../../types";
import { fetchPopular, fetchDevArtToken } from "../../../Api/deviantArt/devart";
import { DEVART_KEY } from '@env';

export const AccountHome = ({navigation, route}) => {
    const { isAuth, setIsAuth, isDevArtAuth, setIsDevArtAuth } = useContext(AccountContext);
    const { colors, dark } = useTheme();
    const [isAniPressed, setIsAniPressed] = useState(false);
    const [isDevArtPressed, setIsDevArtPressed] = useState(false);
    const [tokenExp, setTokenExp] = useState<string>();
    const [aniLoading, setAniLoading] = useState<boolean>(false);
    const [devartLoading, setDevartLoading] = useState<boolean>(false);
    const token:string = route.params?.token;

    const handleLogin = async(type:AccountType) => {
        if (type === 'Anilist') {
            await _openAuthBrowser('Anilist');
            setAniLoading(true);
            setIsAniPressed(true);
        }
        if (type === 'DeviantArt') {
            const token = await 
            setDevartLoading(true);
            setIsDevArtPressed(true);
        }
    };

    const logout = async(type:AccountType) => {
        const success = await removeToken(type);
        if(success) {
            // @ts-ignore
            (type === 'Anilist') ? setIsAuth(false) : setIsDevArtAuth(false);
            (type === 'Anilist') && setTokenExp(null);
            ToastAndroid.show('Logged out', ToastAndroid.SHORT);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if (isAuth) {
                checkTokenExpiration().then(exp => {
                    setTokenExp(exp);
                });
            }
        }, [isAuth])
    );

    useEffect(() => {
        if (!isAuth && isAniPressed) {
            console.log('AniList');
            getAuth('Anilist', token).then(auth => {setIsAuth(auth); setAniLoading(false); ToastAndroid.show('Logged In', ToastAndroid.SHORT);});
            setIsAniPressed(false);
        }
        // if (!isDevArtAuth && isDevArtPressed) {
        //     getAuth('DeviantArt', token).then(auth => {setIsDevArtAuth(auth); setDevartLoading(false); ToastAndroid.show('Logged In', ToastAndroid.SHORT);}).catch(err => {console.log(err); setDevartLoading(false)});
        //     setIsDevArtPressed(false);
        // }
    },[token]);

    return (
            <ScrollView style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
                <List.Section>
                    <List.Subheader>Anilist</List.Subheader>
                    {(!aniLoading) ? 
                    <>
                        {(isAuth) && <AccountSettings colors={colors} onPress={() => navigation.navigate('AnilistAccount', {auth: isAuth})} />}
                        {(!isAuth) ? 
                            <LoginButton handleLogin={() => handleLogin('Anilist')} colors={colors} />
                            : <LogoutButton colors={colors} tokenExp={tokenExp} description logout={() => logout('Anilist')} />
                        }
                        {(tokenExp) && <Caption onPress={() => checkTokenExpiration().then(txt => setTokenExp(txt))} style={{color:colors.text, paddingLeft:10}}>{`Login Expires in:\n${tokenExp}`}</Caption>}
                    </> : <LoadingView colors={colors} mode='Circle' titleData={[{title:'AnilistLoading', loading:aniLoading}]} />}
                </List.Section>
            
                {/* <List.Section>
                    <List.Subheader>DeviantArt</List.Subheader>
                    {(!devartLoading) ? 
                    <>
                        {(!isDevArtAuth) ?
                            <LoginButton handleLogin={() => handleLogin('DeviantArt')} colors={colors} />
                            : <LogoutButton colors={colors} logout={() => logout('DeviantArt')} />
                        }
                    </>: <LoadingView colors={colors} mode='Circle' titleData={[{title:'DevArtLoading', loading:devartLoading}]} />}
                <List.Item title='Test' onPress={() => fetchDevArtToken()} />
                </List.Section> */}
            </ScrollView>
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