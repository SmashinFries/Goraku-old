import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { Tile, Badge } from "react-native-elements";
import { useTheme, useNavigation } from "@react-navigation/native";
import { getLanguage } from "./storagehooks";

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;

export const _ContentTile = ({ item, routeName }) => {
    const [lang, setLang] = useState('Romaji');
    const { colors } = useTheme();
    const navigation  = useNavigation();

    const fetchLang = async () => {
        const language = await getLanguage();
        setLang(language);
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
                />
            <Badge value={(typeof item.meanScore == 'number') ? `${item.meanScore}%` : '?'}
                containerStyle={{ alignSelf: 'flex-end', position: 'absolute', elevation: 24, top:-5 }}
                badgeStyle={{ borderColor: 'rgba(0,0,0,0)' }}
                status={(item.meanScore >= 75) ? 'success'
                    : (item.meanScore < 75 && item.meanScore >= 65) ? 'warning'
                    : (item.meanScore < 65) ? 'error' : undefined
                }
            />
        </View>
    );
}