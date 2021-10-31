// React
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, View, ToastAndroid } from "react-native";
// UI
import { Badge, Text, BottomSheet, ListItem, Image } from "react-native-elements";
// Navigation
import { useTheme, useNavigation } from "@react-navigation/native";
// Data
import { getLanguage } from "../Storages/storagehooks";
import { deleteEntry, updateStatus } from "../Data Handler/updatedata";

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;

export const _ContentTile = ({ item, routeName, token, isSearch, isNode=false, size=[width / 2, height / 2.9] }) => {
    const entry = (isNode === true) ? item.node.mediaRecommendation : item;
    const stat = (entry.mediaListEntry !== null) ? 
        (entry.mediaListEntry.status !== null) ? entry.mediaListEntry.status : null
        : null; 
    const [lang, setLang] = useState('Romaji');
    const [isVisible, setVisible] = useState(false);
    const [status, setStatus] = useState(stat);
    const [id, setId] = useState(entry.id);
    const [deleted, setDeleted] = useState(false);
    const { colors } = useTheme();
    const navigation  = useNavigation();
    const score = (entry.meanScore !== null) ? entry.meanScore : null;

    const fetchLang = async () => {
        const language = await getLanguage();
        return language;
    }

    const updateItem = async(newStatus) => {
        const newItem = await updateStatus(token, entry.id, newStatus);
        setStatus(newItem.status);
        setId(newItem.id);
        setVisible(false);
        ToastAndroid.show(`Updated!`, ToastAndroid.SHORT);
    }

    const deleteItem = async() => {
        const isDeleted = deleteEntry(token, id);
        setStatus((isDeleted) ? null : status);
        setDeleted(true);
        setVisible(false);
        ToastAndroid.show(`Deleted!`, ToastAndroid.SHORT);
    }

    const Action = () => {
        // Turn this into component - not sure how to handle 'setVisible'
        const normalText = {color:'#FFF'};
        const normalContainer = {justifyContent:'center', backgroundColor:'rgba(0,0,0,.8)'};
        const list = [
            {
                title: (item.type === "ANIME") ? 'Plan to Watch' : 'Plan to Read',
                onPress: () => {updateItem('PLANNING');},
                containerStyle: normalContainer,
                titleStyle: normalText,
            },
            {
                title: (item.type === "ANIME") ? 'Watching' : 'Reading',
                onPress: () => {updateItem('CURRENT');},
                containerStyle: normalContainer,
                titleStyle: normalText,
            },
            {
                title: 'Completed',
                onPress: () => {updateItem('COMPLETED');},
                containerStyle: normalContainer,
                titleStyle: normalText,
            },
            {
                title: 'Repeating',
                onPress: () => {updateItem('REPEATING');},
                containerStyle: normalContainer,
                titleStyle: normalText,
            },
            {
                title: 'Dropped',
                onPress: () => {updateItem('DROPPED');},
                containerStyle: normalContainer,
                titleStyle: normalText,
            },
            (isSearch === true) ?
            {
                title: 'Delete',
                onPress: () => {deleteItem();},
                containerStyle: normalContainer,
                titleStyle: {color:'red', fontWeight:'bold'},
            } : undefined,
            {
                title: 'Go Back',
                onPress: () => setVisible(false),
                containerStyle: normalContainer,
                titleStyle:{color:'#28c922', fontWeight:'bold'},
            },
        ];
        return (
            <BottomSheet isVisible={isVisible} containerStyle={{backgroundColor:'rgba(0,0,0,0)'}} >
                {list.map((l, i) => ( (l !== undefined) ?
                    <ListItem key={i} onPress={l.onPress} containerStyle={l.containerStyle}>
                        <ListItem.Content style={{alignItems:'center'}}>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                : null))}
            </BottomSheet>
        );
    }

    const getLocation = () => {
        (routeName.name !== 'Info') ?
            navigation.push((routeName.name === 'SearchPage') ? 'InfoSearch' : 'InfoHome', { screen: 'Info', params: { id: entry.id, title: { romaji: entry.title.romaji, native: entry.title.native, english: entry.title.english } }, })
        : navigation.push('Info', { id: entry.id, title: { romaji: entry.title.romaji, native: entry.title.native, english: entry.title.english } });
    }

    useEffect(() => {
        let mounted = true;
        fetchLang().then((lang) => {
            if (mounted) {
                setLang(lang);
            }
        });
        return () => {mounted = false};
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 10, maxHeight: size[1] + 50, maxWidth: size[0], borderRadius: 8 }}>
            <Pressable style={{ height: size[1], width: size[0] - 20, borderRadius: 8 }}
                onPress={getLocation}
                onLongPress={() => (typeof token === 'string') ? setVisible(true) : null}
            >
                <Image source={{ uri: entry.coverImage.extraLarge }} resizeMode='cover' style={{ borderRadius: 8, height: size[1], width: size[0] - 20 }} blurRadius={(status !== null) ? 3 : 0} />
            </Pressable>
            <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center' }} numberOfLines={2}>{(lang !== 'Native') ? entry.title.romaji : entry.title.native}</Text>
            {((status !== null) && typeof token === 'string') ?
                <Pressable
                    onLongPress={() => setVisible(true)}
                    onPress={getLocation}
                    style={{ position: 'absolute', top: 0, left: 10, height: size[1], width: size[0] - 20, borderRadius: 8, backgroundColor: (status !== null) ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,0)', justifyContent: 'center' }}
                >
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{status}</Text>
                </Pressable>
                : null}
            {(typeof score === 'number') ? <Badge value={`${score}%`}
                containerStyle={{ alignSelf: 'flex-end', position: 'absolute', elevation: 25, top: -5, right: 4 }}
                badgeStyle={{ borderColor: 'rgba(0,0,0,0)', transform: [{ scale: 1.20 }] }}
                status={(score >= 75) ? 'success'
                    : (score < 75 && score >= 65) ? 'warning'
                        : (score < 65) ? 'error' : undefined
                }
            /> : null}
            <Action />
        </View>
    );
}