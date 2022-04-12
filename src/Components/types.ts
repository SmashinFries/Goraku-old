import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { MediaTileType } from "../Api/types";

export type Titles = 'romaji' | 'english' | 'native' | 'userPreferred';
export type Types = 'ANIME' | 'MANGA';
export type Formats = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC' | 'MANGA' | 'NOVEL' | 'ONE_SHOT' | undefined;

export type ThemeColors = {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
}

export interface HomeType {
    data: {
        Page: {
            pageInfo: {
                hasNextPage: boolean;
                currentPage: number;
                total: number;
            };
            media: MediaTileType[];
        };
    };
}

export type MediaType = MediaTileType[];

export type MediaTileProps = { 
    data:MediaTileType;
    titleType:Titles;
    colors:ThemeColors;
    index?:number;
    sheetControl?:MutableRefObject<BottomSheetModalMethods>;
    setActiveId?: Dispatch<SetStateAction<{id:number|null, index:number|null}>>;
    route?:string;
    size?:{width:number, height:number} 
};

export type PageInfoType = {
    hasNextPage: boolean,
    currentPage: number
}