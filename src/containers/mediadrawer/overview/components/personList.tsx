import { LinearGradient } from "expo-linear-gradient";
import React, { Dispatch, useState } from "react";
import { View, Text, ScrollView, Pressable, ToastAndroid } from "react-native";
import FastImage from "react-native-fast-image";
import { Button } from "react-native-paper";
import { toggleFav } from "../../../../Api";
import { AniMalType, CharacterItemType, StudioItemType } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import { OverviewNav } from "../../../types";

type CharStaffParams = {
    title: string;
    navLocation: string;
    data: AniMalType;
    setData: Dispatch<React.SetStateAction<AniMalType>>;
    colors: ThemeColors;
    navigation: OverviewNav;
    isList: boolean;
    charData?: CharacterItemType[],
    staffData?: StudioItemType[],
    rolePosition?: 'Top' | 'Bottom';
    gradBottomLoc?: number[];
    gradTopLoc?: number[];
}

const CharStaffList = ({charData, staffData, data, setData, navigation, isList, title, colors, navLocation, rolePosition='Bottom', gradBottomLoc=[.5, .95], gradTopLoc=[0, .35]}:CharStaffParams) => {
    const content = (charData) ? charData.slice(0, 10) : staffData;
    const PersonItem = ({person}) => {
        const [fav, setFav] = useState<boolean>(person.node.isFavourite);

        const handleFav = async() => {
            setFav(!fav);
            const resp = await toggleFav(person.node.id, (charData) ? 'CHARACTER' : 'STAFF');
            if (resp === null) {
                ToastAndroid.show('Login Required / Network Error', ToastAndroid.SHORT);
            }
        }
        return(
            // @ts-ignore 
            <Pressable onLongPress={(data.isAuth) ? handleFav : null} onPress={() => navigation.navigate(navLocation, { id: person.node.id, name: person.node.name.full, malId: data.anilist.idMal, type: data.anilist.type, inStack: false, isList:isList })} style={{ marginHorizontal: 10, borderRadius:8, width:120, height:180 }}>
                <FastImage fallback source={{ uri: person.node.image.large }} style={{ width: 120, zIndex: -1, height: 180, position: 'absolute', borderRadius:8 }} resizeMode='cover' />
                <LinearGradient colors={['transparent', (fav) ? 'rgba(255, 0, 0,.85)' : 'rgba(0,0,0,.55)']} locations={gradBottomLoc} style={{ position: 'absolute', height: '100%', justifyContent: 'flex-end', alignItems: 'center', width: '100%', borderRadius:8 }}>
                    {(rolePosition === 'Bottom') ? <Text style={[{ fontSize: 14, color: '#FFF', textTransform: 'capitalize', textAlign: 'center' }]}>{person.role}</Text> : null}
                    <Text style={{ fontSize: 14, color: '#FFF', textTransform: 'capitalize', fontWeight: 'bold', textAlign: 'center' }}>{person.node.name.userPreferred}</Text>
                </LinearGradient>
                {(rolePosition === 'Top') ? <LinearGradient colors={['rgba(0,0,0,.55)', 'transparent']} locations={gradTopLoc} style={{ position: 'absolute', height: '100%', justifyContent: 'flex-start', alignItems: 'center', width: '100%', borderRadius:8 }}>
                    <View style={[(rolePosition === 'Top') ? { position: 'absolute', top: 0, justifyContent: 'center', alignItems: 'flex-start' } : null]}>
                        <Text style={[{ fontSize: 14, color: '#FFF', textTransform: 'capitalize', textAlign: 'center' }]}>{person.role}</Text>
                    </View>
                </LinearGradient> : null}
            </Pressable>
        );
    }

    if (content.length <= 0) return null;
    return(
        <View>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontWeight: 'bold', color: colors.text }}>{title}</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {content.map((person, index) =>
                    // @ts-ignore
                    <PersonItem key={index} person={person} />
                )}
                {(charData?.length > 10) ? <Pressable onPress={() => navigation.jumpTo('CharacterStack')} style={{alignItems:'center',justifyContent:'center', width:120, height:180}}>
                    <Text style={{color:colors.primary}}>View More</Text>
                </Pressable> : null}
            </ScrollView>
        </View>
    );
}

export default CharStaffList;