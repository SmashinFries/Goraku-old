import React, { useEffect } from "react";
import { View, Text, Linking, Pressable, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import { AniMalType, ExtLink } from "../../../../Api/types";
import { SiteButton } from "../../../../Components/buttons/siteButtons";
import { AnilistSVG, MalSVG } from "../../../../Components/svg/svgs";
import { ThemeColors } from "../../../../Components/types";
import { _openBrowserUrl } from "../../../../utils";

const ExternalLinkList = ({data, colors}:{data:AniMalType, colors:ThemeColors}) => {
    const officialLinks = data.anilist.externalLinks.filter((link, index) => link.site === 'Official Site');
    const malLink = data.mal?.data?.url;
    const openLink = (link:string) => _openBrowserUrl(link, colors.primary, colors.text)
    const uniWidth = 85;

    const LinkButton = ({link, width, height}:{link:ExtLink, width?:number|string, height?:number|string}) => {
        // () => Linking.openURL(link.url)
        return (
            <View style={[{ marginVertical: 5, width:(link.site === 'Official Site') ? width : undefined, borderRadius:8, marginHorizontal: 5, }]}>
                <Pressable onPress={() => openLink(link.url)} style={{ height: height, width:width, alignItems:'center', justifyContent:'center', borderRadius:8, backgroundColor: (link.site === 'Official Site') ? colors.primary : link.color}}>
                    {(link.icon) ?
                    <FastImage fallback source={{uri:link.icon}} style={{height:40, width:40, borderRadius:8}} />
                    : <Text style={{ textAlign: 'center', fontSize: 15, color: '#FFF' }}>{link.site}</Text>
                    }
                </Pressable>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            
            {officialLinks.length > 0 && officialLinks.map((link, index) => 
                <View key={index} style={{flex:1, width:'100%', paddingHorizontal:10, alignItems:'center'}}>
                    <LinkButton link={link} width={'100%'} height={40} />
                </View>
            )}
            
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal:5, flexWrap: 'wrap', width:'100%', alignItems: 'center'}}>
                <View style={{ marginVertical: 5, marginHorizontal: 5, borderRadius:8 }}>
                    <SiteButton type="anilist" link={data.anilist.siteUrl} colors={colors} width={uniWidth} />
                </View>
                {data.anilist.externalLinks.filter((offlink, index) => offlink.site !== 'Official Site').map((link, index) =>
                    <LinkButton key={index} link={link} width={uniWidth} height={50} />
                )}
                {malLink && 
                    <View style={[{ marginVertical: 5, borderRadius:8, marginHorizontal: 5, }]}>
                        <SiteButton type='mal' link={malLink} colors={colors} width={uniWidth} />
                    </View>
                }
            </View>
        </View>
    )
}

export default ExternalLinkList;