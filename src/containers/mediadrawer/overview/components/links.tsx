import React from "react";
import { View, Text, Linking } from "react-native";
import AwesomeButton from "react-native-really-awesome-button-fixed";
import { AniMalType } from "../../../../Api/types";
import { AnilistSVG } from "../../../../Components/svg/svgs";
import { getExternalLinkColor } from "../../../../utils/colors/scoreColors";

const ExternalLinkList = ({data}:{data:AniMalType}) => {
    const LinkButton = ({link}) => {
        return (
            <View style={{ width: 90, height: 50, marginVertical: 5, marginHorizontal: 5, }}>
                <AwesomeButton onPress={() => Linking.openURL(link.url)} height={50} width={95} backgroundDarker='#000' backgroundColor={getExternalLinkColor(link.site)}>
                    <Text style={{ textAlign: 'center', fontSize: 15, color: '#FFF' }}>{link.site}</Text>
                </AwesomeButton>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10, justifyContent: 'flex-start', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <View style={{ width: 90, height: 50, marginVertical: 5, marginHorizontal: 5, }}>
                <AwesomeButton onPress={() => Linking.openURL(data.anilist.siteUrl)} height={50} width={95} backgroundDarker='#000' backgroundColor={'rgb(60,180,242)'}>
                    <AnilistSVG color={'#FFF'} />
                </AwesomeButton>
            </View>
            {data.anilist.externalLinks.map((link, index) =>
                <LinkButton key={index} link={link} />
            )}
        </View>
    )
}

export default ExternalLinkList;