import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import FastImage from "react-native-fast-image";
import { AntDesign } from '@expo/vector-icons';
import { Button, IconButton } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import { StaffDataType } from "../../../Api/types";
import { handleCopy } from "../../../utils";
import { ThemeColors } from "../../../Components/types";
import { PressableAnim } from "../../../Components";
import { openURL } from "expo-linking";
import { getDate } from "../../../utils/time/getTime";

type LinkType = {title:string, url:string}[];
type Props = {
    data:StaffDataType;
    date: {day:number, month:number};
    colors: ThemeColors;
    links: LinkType;
    liked: boolean;
    toggleLike: () => void;
}

const StaffOverview = ({data, date, links, colors, liked, toggleLike}:Props) => {
    const { width, height } = useWindowDimensions();

    if (!data) return null;
    return(
        <View style={{flex:1}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ height: 290, width: 180 }}>
                    <FastImage fallback source={{ uri: data?.image.large }} style={{ height: 290, width: 180, marginTop: 10, marginLeft: 10, borderRadius: 12, borderWidth: .5 }} />
                    <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']} locations={[0.85, 1]} style={{ position: 'absolute', justifyContent: 'flex-end', marginLeft: 10, marginTop: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, height: '100%', width: '100%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10, paddingBottom: 5, }}>
                            <AntDesign name="heart" size={16} color="red" />
                            <Text style={{ fontSize: 12, color: '#FFF' }}>{(data?.favourites !== null) ? data?.favourites : 0}</Text>
                        </View>
                        {(date.day+1 === data.dateOfBirth.day && date.month+1 === data.dateOfBirth.month) && <IconButton icon={'cake-variant'} color={colors.primary} size={28} style={{position:'absolute', top:-10, right:-5}} />}
                    </LinearGradient>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                    <Text onLongPress={() => handleCopy(data?.name?.userPreferred)} style={{ textAlign: 'left', fontSize: 22, fontWeight: 'bold', color: colors.text }}>{data?.name?.userPreferred}</Text>
                    <Text onLongPress={() => handleCopy(data?.name?.native)} style={{ textAlign: 'left', fontSize: 18, fontWeight: 'bold', color: colors.text }}>{data?.name?.native}</Text>
                    {(data.age) ? <Text style={{ textAlign: 'left', fontSize: 15, color: colors.text }}>Age: {data.age}</Text> : null}
                </View>
            </View>
            <View style={{ flex: 1, marginTop: 30, paddingHorizontal: 10 }}>
                <Button mode={(liked) ? 'contained' : 'outlined'} onPress={toggleLike} icon={(!liked) ? 'heart-outline' : 'heart'} color={'red'} style={{ borderColor: 'red', borderWidth: (liked) ? 0 : 1, marginBottom:10 }}>
                    {(liked) ? 'Favorited' : 'Favorite'}
                </Button>
                {(data.dateOfBirth.year) ? <Text style={{ marginBottom: 5, color: colors.text }}>Date of Birth: {getDate(data.dateOfBirth)}</Text> : null}
                {(data.dateOfDeath.year) ? <Text style={{ marginBottom: 5, color: colors.text }}>Date of Death: {getDate(data.dateOfDeath)}</Text> : null}
                {(data.gender) ? <Text style={{ marginBottom: 5, color: colors.text }}>Gender: {data.gender}</Text> : null}
                {(data.homeTown) ? <Text style={{ marginBottom: 5, color: colors.text }}>Hometown: {data.homeTown}</Text> : null}
                {(data.languageV2) ? <Text style={{ marginBottom: 5, color: colors.text }}>Language: {data.languageV2}</Text> : null}
                {(data.primaryOccupations.length > 0) ? <Text style={{ marginBottom: 5, color: colors.text }}>Occupations: {data.primaryOccupations.join(', ')}</Text> : null}
                {(data.yearsActive.length > 0) ? <Text style={{ marginBottom: 5, color: colors.text }}>Years Active: {data.yearsActive}</Text> : null}
                {/* <Text style={{ color: colors.text }}>{data.description}</Text> */}
                <RenderHtml contentWidth={width} tagsStyles={{body:{color:colors.text}}} source={{html:data.description}} />
                {(links.length > 0) ? <View style={{flexDirection:'row', flexWrap:"wrap", justifyContent:'space-evenly', marginTop:10, alignItems:'center'}}>
                    {links.map((item, index) => 
                    <PressableAnim key={index} onPress={() => openURL(item.url)} style={{padding:8, borderRadius:12, borderWidth:2, borderColor:colors.primary}}>
                        <Text style={{color:colors.text}}>{item.title}</Text>
                    </PressableAnim>
                    )}
                </View>: null}
            </View>
            {(data.staffMedia.edges.length === 0 || data.primaryOccupations.includes('Voice Actor') || data.characterMedia.edges.length >  data.staffMedia.edges.length) ? <Text style={{fontSize:30, fontWeight:'bold', paddingHorizontal: 10, color:colors.text}}>Roles</Text> : null}
        </View>
    );
}

export default StaffOverview;