import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { StaffDataType } from "../../../Api/types";
import { _openBrowserUrl } from "../../../utils";
import { ThemeColors } from "../../../Components/types";
import { CharacterBody, CharacterHeaderImage, CharacterOverview, EditButton, PressableAnim } from "../../../Components";
import { getDate } from "../../../utils/time/getTime";

type LinkType = {title:string, url:string}[];
type Props = {
    data:StaffDataType;
    date: {day:number, month:number};
    colors: ThemeColors;
    links: LinkType;
    liked: boolean;
    isAuth: boolean;
    toggleLike: () => void;
}

const StaffOverview = ({data, links, colors, liked, isAuth, toggleLike}:Props) => {
    const { width, height } = useWindowDimensions();
    const date = new Date();

    if (!data) return null;
    return(
        <View style={{flex:1}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <CharacterHeaderImage date={date} image={data.image} dateOfBirth={data.dateOfBirth} origin={data.languageV2} />
                <CharacterOverview name={data.name} dateOfBirth={data.dateOfBirth} favourites={data.favourites} colors={colors} age={data.age} />
                
            </View>
            <CharacterBody 
                description={data.description}
                favorite={data.isFavourite} 
                links={{aniLink:data.siteUrl, malLink:null}} 
                toggleLike={toggleLike}
                staffData={{
                    dateOfBirth: (data.dateOfBirth.year) ? `Date of Birth: ${getDate(data.dateOfBirth)}` : null,
                    dateOfDeath: (data.dateOfDeath.year) ? `Date of Death: ${getDate(data.dateOfDeath)}` : null,
                    gender: (data.gender) ? `Gender: ${data.gender}` : null,
                    homeTown: (data.homeTown) ? `Hometown: ${data.homeTown}` : null,
                    languageV2: (data.languageV2) ? `Language: ${data.languageV2}` : null,
                    primaryOccupations: (data.primaryOccupations.length > 0) ? `Occupations: ${data.primaryOccupations.join(', ')}` : null,
                    yearsActive: (data.yearsActive.length > 0) ? `Years Active: ${data.yearsActive}` : null
                }}
                altNames={data.name.alternative}
                colors={colors}
                isAuth={isAuth}
            />
            {(links.length > 0) ?
                <View style={{ flexDirection: 'row', flexWrap: "wrap", justifyContent: 'space-evenly', marginTop: 10, alignItems: 'center' }}>
                    {links.map((item, index) =>
                        <PressableAnim key={index} onPress={() => _openBrowserUrl(item.url, colors.primary, colors.text)} style={{ padding: 8, borderRadius: 12, borderWidth: 2, borderColor: colors.primary }}>
                            <Text style={{ color: colors.text }}>{item.title}</Text>
                        </PressableAnim>
                    )}
                </View>
            : null}
            <EditButton type="STAFF" id={data.id} colors={colors} />
            {(data.staffMedia.edges.length === 0 || data.primaryOccupations.includes('Voice Actor') || data.characterMedia.edges.length >  data.staffMedia.edges.length) ? <Text style={{fontSize:30, fontWeight:'bold', paddingHorizontal: 10, color:colors.text}}>Roles</Text> : null}
        </View>
    );
}

export default StaffOverview;