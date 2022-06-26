import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import FastImage from "react-native-fast-image";
import { Avatar, Button } from "react-native-paper";
import RenderHtml from "react-native-render-html";
import { CharDetailShort, DateType, LanguageV2, Names, Origin } from "../../Api/types";
import { checkBD, getDate, handleCopy, _openBrowserUrl } from "../../utils";
import { SiteButton } from "../buttons/siteButtons";
import { ThemeColors } from "../types";

type CharacterHeaderProps = {
    origin: Origin | LanguageV2;
    dateOfBirth: DateType;
    image: {large: string;};
    date:Date;
}
const CharacterHeaderImage = ({origin, dateOfBirth, image, date }:CharacterHeaderProps) => {
    const birthdayJP = ['Happy Birthday!', 'Tanjoubi Omedetou!', 'お誕生日おめでとう！']
    const birthdayKR = ['Happy Birthday!', 'Saengil Chukahae', '생일 축하해!']
    const birthdayCN = ['Happy Birthday!', 'Shēngrì Kuàilè', '生日快乐!']

    const getBirthday = () => {
        if (origin === 'JP' || origin === 'Japanese') return birthdayJP;
        if (origin === 'KR' || origin === 'Korean') return birthdayKR;
        if (origin === 'CN' || origin === 'Chinese' || origin === 'TW') return birthdayCN;
        return birthdayJP;
    }
    const birthdayLang = getBirthday();
    const emojis = ['🎉', '🥳', '🎈', '🎂', '🎁'];
    const [emoji, setEmoji] = useState(emojis[Math.floor(Math.random() * emojis.length)]);
    const [birthdayIndex, setBirthdayIndex] = useState(0);


    const switchLanguage = (count:number) => {
        if (count < 2) {
            count +=1;
            setBirthdayIndex(count);
        } else {
            count = 0;
            setBirthdayIndex(0);
        }
        return count;
    }

    useEffect(() => {
        if (checkBD(date, dateOfBirth)) {
            let count = 0;
            const interval = setInterval(() => {
                const randomEmoji = Math.floor(Math.random() * emojis.length);
                setEmoji(emojis[randomEmoji]);
                count = switchLanguage(count);
            }, 2000);
            return () => {
                clearInterval(interval);
            };
        }
    },[])
    
    return (
        <View style={{ height: 300, width: 200 }}>
            <FastImage source={{ uri: image.large }} style={{ height: 300, width: 200, marginTop: 10, marginLeft: 10, borderRadius: 12,}} />
            <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']} locations={[0.80, 1]} style={{ position: 'absolute', justifyContent: 'flex-end', marginLeft: 10, marginTop: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, height: '100%', width: '100%' }}>
                {checkBD(date, dateOfBirth) ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 5 }}>
                        <Text style={{ fontSize: 14, color: '#FFF' }}>{emoji}{birthdayLang[birthdayIndex]}{emoji}</Text>
                    </View> : null}
            </LinearGradient>
        </View>
    );
}

type CharOverviewProps = {
    name: Names;
    favourites: number;
    dateOfBirth: DateType;
    colors: ThemeColors;
    age?: number;
}
const CharacterOverview = ({name, favourites, dateOfBirth, colors, age}:CharOverviewProps) => {
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
            <Text onLongPress={() => handleCopy(name?.userPreferred)} style={{ textAlign: 'left', fontSize: 22, fontWeight: 'bold', color: colors.text }}>{name?.userPreferred}</Text>
            {(name?.native) ? <Text onLongPress={() => handleCopy(name?.native)} style={{ textAlign: 'left', fontSize: 18, color: colors.text }}>{name?.native}</Text> : null}
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Avatar.Icon icon='heart' size={24} color='red' style={{backgroundColor:'transparent'}} />
                <Text style={{color: colors.text}}>{favourites}</Text>
            </View>
            {(dateOfBirth.day && !age) ? 
                <Text style={{ textAlign: 'left', fontSize: 14, color: colors.text }}>{'\n'}Birthday: {getDate(dateOfBirth)}</Text> :
                (age) ? <Text style={{ textAlign: 'left', fontSize: 14, color: colors.text }}>{'\n'}{age} years old</Text> : null
            }
        </View>
    );
}

type CharacterDescProps = {
    description:string;
    width:number;
    colors:ThemeColors;
}
const CharacterDescription = React.memo(function CharacterDescription ({description, width, colors}:CharacterDescProps) {
    return(
        <RenderHtml 
            defaultTextProps={{ selectable: true }} 
            tagsStyles={{ body: { color: colors.text } }} 
            contentWidth={width} 
            source={{ html: description }}
            renderersProps={{a: {onPress: (event, url) => _openBrowserUrl(url, colors.primary, colors.text)}}}
        />
    );
});

type staffData = {
    dateOfBirth: string;
    dateOfDeath: string;
    gender: string;
    homeTown: string;
    languageV2: string;
    primaryOccupations: string;
    yearsActive: string;
}
type CharButtonsProps = {
    description:string;
    links: { aniLink:string; malLink:string; };
    favorite:boolean;
    toggleLike: () => void;
    colors:ThemeColors;
    staffData?:staffData;
}
const CharacterBody = ({description, links, favorite, toggleLike, colors, staffData}:CharButtonsProps) => {
    const {width, height} = useWindowDimensions();
    return(
        <View style={{ flex: 1, marginTop: 30, paddingHorizontal: 10 }}>
            <Button mode={(favorite) ? 'contained' : 'outlined'} onPress={toggleLike} icon={(!favorite) ? 'heart-outline' : 'heart'} color={'red'} style={{ borderColor: 'red', borderWidth: (favorite) ? 0 : 1 }}>
                {(favorite) ? 'Favorited' : 'Favorite'}
            </Button>
            {(staffData) ?
                <View style={{marginTop:10}}>
                    {Object.keys(staffData).filter((elem, idx) => staffData[elem] !== null).map((item, index) => <Text key={index} style={{ marginBottom: 5, color: colors.text }}>{staffData[item]}</Text>)}
                </View>
                : null
            }
            <CharacterDescription description={description} width={width} colors={colors} />
            <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%', paddingVertical:10}}>
                <View style={{minWidth:'45%'}}>
                    <SiteButton type='anilist' link={links?.aniLink} colors={colors} width='100%' height={40} />
                </View>
                {(links?.malLink) && <View style={{minWidth:'45%'}}><SiteButton type="mal" link={links.malLink} colors={colors} width='100%' height={40} /></View>}
            </View>
        </View>
    );
}

export { CharacterHeaderImage, CharacterOverview, CharacterBody };