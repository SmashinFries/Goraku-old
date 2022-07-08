import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Pressable } from 'react-native';
import { WatchProps } from "../../types";
import { MediaHeader } from "../../../Components/header/mediaHeader";
import { StreamingEpType } from "../../../Api/types";
import FastImage from "react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import { handleLink } from "../../../utils";
import { CrunchyRollSVG } from "../../../Components/svg/svgs";
import { HeaderBackButton, HeaderBackground, HeaderRightButtons } from "../../../Components/header/headers";
import { IconButton } from "react-native-paper";
import { PressableAnim } from "../../../Components";

type renderProps = {
    item: StreamingEpType;
}
const WatchTab = ({navigation, route}:WatchProps) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const { data } = route.params;
    const { colors, dark } = useTheme();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRightButtons navigation={navigation} colors={colors} drawer />,
            headerLeft: () => <HeaderBackButton navigation={navigation} colors={colors} style={{paddingLeft:3}} />,
            headerBackground: () => <HeaderBackground colors={colors} />,
        });
    }, [navigation, dark]);

    const RenderItem = ({item}:renderProps) => {
        return(
          <View style={{alignSelf: 'center', width: '90%' }}>
            <PressableAnim onPress={() => handleLink(item.url)} style={{height:220, borderRadius:8}}>
              <FastImage source={{ uri: item.thumbnail }} style={{ height: 220, width: '100%', borderRadius:8 }} resizeMode='cover' />
              <LinearGradient colors={['transparent', '#000']} locations={[0.35, .9]} style={{ position: 'absolute', width: '100%', justifyContent: 'flex-end', height: 220, borderRadius:8 }}>
                <View style={{ width: '100%', padding: 5 }}>
                  <Text style={{ color: '#FFF', textAlign: 'center', fontFamily:'Inter_900Black', }}>{item.title}</Text>
                </View>
                {(item.site === 'Crunchyroll') ? <CrunchyRollSVG style={{ position: 'absolute', top: 5, left: 5 }} /> : null}
              </LinearGradient>
              <View style={{position:'absolute', height:220, width:'100%', alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
                <IconButton size={90} icon='play-circle' color="rgba(255,255,255,.5)" />
              </View>
            </PressableAnim>
          </View>
        );
    }

    return (
        <View style={{flex:1}}>
            <MediaHeader coverImage={data.anilist.coverImage.extraLarge} />
            <Animated.FlatList
                data={data.anilist.streamingEpisodes}
                renderItem={({item, index}) => <RenderItem item={item} key={index} />}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {
                                y: scrollY,
                            }
                        }
                    }
                ], { useNativeDriver: true })}
                scrollEventThrottle={16}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingTop:10}}
                ItemSeparatorComponent={() => <View style={{height:10}} />}
            />
        </View>
    )
}

export default WatchTab;