import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Animated, View, Text, FlatList, useWindowDimensions } from "react-native";
import { Button, IconButton, Portal } from "react-native-paper";
import { getRandomMedia } from "../../../Api/anilist/anilist";
import { RandomContent, RandomMediaInfo } from "../../../Api/types";
import { AnimatedIcon, spinAnimate, bounceAnimate } from "./components/animations";
import RandomTile from "./components/randomTile";

const RandomFive = ({navigation}) => {
    const [data, setData] = useState<RandomMediaInfo[]>([]);
    const [type, setType] = useState<'ANIME'|'MANGA'|'CHARACTER'>('ANIME');
    const [loading, setLoading] = useState<boolean>(false);
    const diceAnimVal = useRef(new Animated.Value(1)).current;
    const diceSpin = useRef(new Animated.Value(0)).current;
    const animSpin = useRef(spinAnimate(diceSpin)).current;
    const spin = diceSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const { colors, dark } = useTheme();
    const { width, height } = useWindowDimensions();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: (type === 'ANIME' || type === 'MANGA') ? '3 Sauces' : '3 Waifus',
            headerRight: () => 
            <View style={{flexDirection:'row'}}>
                <IconButton icon='book-outline' onPress={() => setType('MANGA')} color={(type === 'MANGA') ? colors.primary : colors.text} />
                <IconButton icon='television' onPress={() => setType('ANIME')} color={(type === 'ANIME') ? colors.primary : colors.text} />
            </View>
        })
    },[navigation, dark, type]);

    const getRandomPage = (max:number) => {
        let random = Math.floor(Math.random() * max);
        return random === 0 ? random+1 : random;
    }

    const fetchData = async() => {
        const resp1 = await getRandomMedia(getRandomPage(type === 'MANGA' ? 11600 : 3155), 1, type);
        const resp2 = await getRandomMedia(getRandomPage(type === 'MANGA' ? 11600 : 3155), 1, type);
        const resp3 = await getRandomMedia(getRandomPage(type === 'MANGA' ? 11600 : 3155), 1, type);
        const allMedia = [resp1.data.Page.media[0], resp2.data.Page.media[0], resp3.data.Page.media[0]];
        console.log(allMedia.length);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(allMedia);
        setLoading(false);
        
    }

    const onPress = () => {
        bounceAnimate(diceAnimVal);
        setLoading(true);
        fetchData();
    }

    useEffect(() => {
        if (loading) {
            animSpin.start();
        } else {
            animSpin.stop()
            diceSpin.setValue(0);
        }
    },[loading]);

    const renderItem = ({item}:{item:RandomMediaInfo}) => {
        return(
            <RandomTile item={item} colors={colors} navigation={navigation} />
        );
    }

    const EmptyList = () => {
        return (
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Text style={{color:colors.text, fontWeight:'bold', fontSize:24}}>Hit the dice to start!</Text>
            </View>
        );
    }

    const DiceHeader = () => {
        return (
            <View style={{ position:'absolute', alignItems: 'center', bottom:10, right:10 }}>
                <View>
                    <AnimatedIcon onPress={onPress} style={{ transform: [{ scale: diceAnimVal }, { rotate: spin }] }}>
                        <IconButton icon='dice-5-outline' size={45} style={{backgroundColor:colors.primary}} color={colors.text} />
                    </AnimatedIcon>
                </View>
            </View>
        );
    }

    return(
        <View style={{flex:1}}>
            {data.length > 0 ? 
            <FlatList
                data={data}
                renderItem={renderItem}
                contentContainerStyle={{paddingBottom:100}}
                keyExtractor={({ id }) => id.toString()}
            /> : <EmptyList />}
            <DiceHeader />
        </View>
    );
}

export default RandomFive;