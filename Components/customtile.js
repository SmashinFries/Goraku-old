import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, View, ToastAndroid } from "react-native";
import { Tile, Badge, Text, BottomSheet, ListItem } from "react-native-elements";
import { useTheme, useNavigation } from "@react-navigation/native";
import { getLanguage } from "./storagehooks";
import { deleteEntry, updateStatus } from "../api/updatedata";

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;

export const _ContentTile = ({ item, routeName, token, isSearch }) => {
    const [lang, setLang] = useState('Romaji');
    const [isVisible, setVisible] = useState(false);
    const [status, setStatus] = useState((item.mediaListEntry !== null) ? item.mediaListEntry.status : null);
    const [id, setId] = useState((item.mediaListEntry !== null) ? item.mediaListEntry.id : null);
    const [deleted, setDeleted] = useState(false);
    const { colors } = useTheme();
    const navigation  = useNavigation();

    const fetchLang = async () => {
        const language = await getLanguage();
        setLang(language);
    }

    const updateItem = async(newStatus) => {
        const newItem = await updateStatus(token, item.id, newStatus);
        setStatus(newItem.status);
        setId(newItem.id);
    }

    const deleteItem = async() => {
        const isDeleted = deleteEntry(token, id);
        setStatus((isDeleted) ? null : status);
        setDeleted(true);
    }

    const Action = () => {
        const list = [
            {
                title: (item.type === "ANIME") ? 'Plan to Watch' : 'Plan to Read',
                onPress: () => {updateItem('PLANNING'); ToastAndroid.show(`Updated!`, ToastAndroid.SHORT); setVisible(false);},
            },
            {
                title: (item.type === "ANIME") ? 'Watching' : 'Reading',
                onPress: () => {updateItem('CURRENT'); ToastAndroid.show(`Updated!`, ToastAndroid.SHORT); setVisible(false);},
            },
            {
                title: 'Completed',
                onPress: () => {updateItem('COMPLETED'); ToastAndroid.show(`Updated!`, ToastAndroid.SHORT); setVisible(false);},
            },
            (isSearch === true) ?
            {
                title: 'Delete',
                onPress: () => {deleteItem(); ToastAndroid.show(`Updated!`, ToastAndroid.SHORT); setVisible(false);},
                containerStyle:{backgroundColor:'red', justifyContent:'center'},
                titleStyle:{color:'#FFF'},
            } : undefined,
            {
                title: 'Go Back',
                onPress: () => setVisible(false),
                containerStyle:{backgroundColor:'blue', justifyContent:'center'},
                titleStyle:{color:'#FFF'},
            },
        ];
        return (
            <BottomSheet isVisible={isVisible} containerStyle={{backgroundColor:'rgba(0,0,0,0)'}} >
                {list.map((l, i) => ( (l !== undefined) ?
                    <ListItem key={i} onPress={l.onPress} containerStyle={l.containerStyle}>
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                : null))}
            </BottomSheet>
        );
    }

    useEffect(() => {
        fetchLang();
    }, []);

    return (
        <View style={{paddingRight: 10, paddingLeft: 10}}>
            <Tile
                imageSrc={{uri: item.coverImage.extraLarge}}
                imageProps={{style: {resizeMode:'cover', borderRadius: 8}}}
                title={(lang !== 'Native') ? item.title.romaji : item.title.native}
                titleNumberOfLines={2}
                titleStyle={{ color:colors.text, fontSize: 15, position: 'absolute', top: 3, textAlign:'center', alignSelf:'center' }}
                containerStyle={{borderRadius: 8, backgroundColor: 'rgba(0,0,0,0)'}}
                activeOpacity={0.7}
                width={width / 2.5}
                height={height / 3}
                key={item.id}
                onPress={() => {navigation.push((routeName.name === 'SearchPage') ? 'InfoSearch' : 'InfoHome', {screen: 'Info', params: {id:item.id, title:{romaji: item.title.romaji, native: item.title.native, english:item.title.english}},});}}
                onLongPress={() => (typeof token === 'string') ? setVisible(true) : null}
            />
            {((item.mediaListEntry !== null || status !== null) && typeof token === 'string') ? <Pressable onLongPress={() => setVisible(true)} onPress={() => {navigation.push((routeName.name === 'SearchPage') ? 'InfoSearch' : 'InfoHome', {screen: 'Info', params: {id:item.id, title:{romaji: item.title.romaji, native: item.title.native, english:item.title.english}},});}} style={{position:'absolute', top:0, left:10, height:(height / 3)-20, width:width / 2.5, borderRadius:8, backgroundColor:(status !== null) ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,0)', justifyContent:'center'}}><Text style={{color:'#FFF', textAlign:'center', fontWeight:'bold', fontSize:16}}>{status}</Text></Pressable> : null}
            {(typeof item.meanScore === 'number' ) ? <Badge value={`${item.meanScore}%`}
                containerStyle={{ alignSelf: 'flex-end', position: 'absolute', elevation: 24, top:-5 }}
                badgeStyle={{ borderColor: 'rgba(0,0,0,0)' }}
                status={(item.meanScore >= 75) ? 'success'
                    : (item.meanScore < 75 && item.meanScore >= 65) ? 'warning'
                    : (item.meanScore < 65) ? 'error' : undefined
                }
            /> : null}
            <Action />
        </View>
    );
}