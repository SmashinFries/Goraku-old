import { useHeaderHeight } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Animated } from 'react-native';
import { getMusic } from "../../../Api";
import { MediaHeader } from "../../../Components/header/mediaHeader";
import { MusicInfo } from "../../../Api/types";
import { MusicProps } from "../../types";
import { HeaderBackButton, HeaderRightButtons, HeaderTitle } from "../../../Components/header/headers";
import { LoadingView } from "../../../Components";
import MusicViewer from "./components/musicViewer";

const MUSIC_URL = 'https://animethemes.moe/video/';

const MusicTab = ({ navigation, route }: MusicProps) => {
    const [data, setData] = useState<MusicInfo>();
    const [loading, setLoading] = useState(true);
    const [musicLoad, setMusicLoad] = useState(true);
    const { id, coverImage } = route.params;
    const headerHeight = useHeaderHeight();
    const { colors, dark } = useTheme();
    const parNav = navigation.getParent();

    const fetchMusic = async () => {
        const response = await getMusic(id);
        return response.data;
    }

    const GifOnEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../../Assets/anime-found.gif')} style={{ width: '90%', height: 350 }} />
                <Text style={{ fontSize: 38, marginHorizontal: 35, color:colors.text, textAlign: 'center', fontWeight: 'bold' }}>No tracks found ＞︿＜</Text>
            </View>
        );
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <HeaderTitle title={`Music${(data) ? ' (' + data?.animethemes.length + ')' : ''}`} colors={colors} />,
            headerRight: () => <HeaderRightButtons navigation={navigation} colors={colors} drawer style={{paddingRight:15}} />,
            headerLeft: () => <HeaderBackButton navigation={navigation} colors={colors} style={{paddingLeft:15}} />,
            headerBackground: () => (
                <Animated.View 
                    style={{ 
                        backgroundColor: colors.card,
                        justifyContent: 'flex-end', 
                        height: '100%' 
                    }}
                />
            ),
        });
    }, [navigation, parNav, data, dark]);

    useEffect(() => {
        fetchMusic().then(res => { setData(res?.anime[0]); setMusicLoad(res.anime[0]?.animethemes?.length > 0 ? false : null); new Promise(resolve => setTimeout(resolve, 500)).then(() => setLoading((res) ? false : null));}).catch(err => console.log(err));
    }, []);

    if (loading) return <LoadingView colors={{colors, dark}} titleData={[{title:'Tracks', loading:musicLoad}]} />

    return ( 
        <View style={{flex:1}}>
            <MediaHeader coverImage={coverImage} />
            {(data) ? 
            <Animated.ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: headerHeight+20, }}>
                {/* <WarningMessage /> */}
                {data?.animethemes.map(track =>
                    <MusicViewer key={track.id} animeTitle={data?.slug} colors={colors} track={track} />
                )}
            </Animated.ScrollView> : 
            <GifOnEmpty />}
        </View>
    )
}

export default MusicTab;
