import React from "react";
import { Pressable } from "react-native";
import { handleCopy, _openBrowserUrl } from "../../utils";
import { AnilistSVG, MalSVG, MalSVGc } from "../svg/svgs";
import { ThemeColors } from "../types";

type Props = {
    type: "anilist" | "mal";
    link: string;
    colors: ThemeColors;
    height?: number | string;
    width?: number | string;
}
const SiteButton = ({type, link, colors, height, width}:Props) => {
    const bgColor = (type === 'mal') ? '#2A50A3' : 'rgb(60,180,242)'
    return(
        <Pressable onLongPress={() => handleCopy(link)} onPress={() => _openBrowserUrl(link, colors.primary, colors.text)} style={{ height: height ?? 50, width: width ?? 85, alignItems: 'center', borderRadius: 8, justifyContent: 'center', backgroundColor: bgColor }}>
            {type === 'anilist' ? <AnilistSVG color={'#FFF'} width={35} height={35} /> : 
                <MalSVGc color='#FFF' width={55} />
            }
        </Pressable>
    );
}

export { SiteButton }