import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { DrawerNavigationProp, DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeNavigationProp, CompositeScreenProps } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { AniMalType, MediaAnimeSort, MediaMangaSort, ReviewsNode } from "../Api/types";

export type BottomTabParamList = {
    ExploreStack: undefined;
    RecommendationStack: undefined;
    ListStack: ListParamList;
    UserStack: undefined;
    MoreStack: MoreStackParamList;
}

export type ListParamList = {
    UserList: {type:string, format:string, layout:'column'|'row'},
    UserListDetail: undefined;
    UserCharDetail: undefined;
    UserStaffDetail: undefined;
}

export type UserStackParamList = {
    UserActivity: undefined;
    MediaDetail: undefined;
}

export type DrawerInfoParamList = {
    DrawerInfo: { id: number, isList?:boolean, type?: string, banner?: string, coverImage?:string };
}

export type ExploreStackParamList = {
    Explore: { type?: 'ANIME' | 'MANGA' | 'NOVEL', searchParams?: FilterRef};
    Info: DrawerInfoParamList;
    Search: { searchParams: FilterRef };
    Image: undefined;
    RandomExplore: undefined;
}

export type RecommendationStackParamList = {
    Recommendations: { isAuth: boolean};
    RecInfo: DrawerInfoParamList;
}

export interface FilterRef {
    search: string;
    type: 'ANIME' | 'MANGA' | 'NOVEL' | 'CHARACTERS' | 'STAFF';
    sort?: MediaAnimeSort | MediaMangaSort;
    tagsIn: string[];
    genresIn: string[];
    tagsNotIn: string[];
    genresNotIn: string[];
    format: string;
    formatIn: string[];
    formatNotIn: string[];
    duration: number[];
    averageScore: number[];
    country: string;
    year: number[];
    score: number[];
    episodes: number[];
    minTagRank: number;
    status: string;
    licensedBy_in: string[];
    onList: boolean;
    chapters: number[];
    season?: string;
    seasonYear?: number;
}

export type AccountType = 'Anilist' | 'DeviantArt';

export type ExploreScreenNavigationProp = NativeStackNavigationProp<ExploreStackParamList,'Explore'>;
export type DrawerInfoNavProp = DrawerNavigationProp<ExploreStackParamList, 'Info'>
export type ListTabProp = NativeStackScreenProps<ListParamList, 'UserList'>;


export type DrawerParamList = {
    Overview: {data: AniMalType, isList?:boolean };
    Music: { id:number, coverImage:string };
    CharacterStack: { data: AniMalType };
    Watch: { data: AniMalType };
    StudioInfo: { id: number, name: string, isAuth: boolean };
    Reviews: { reviews: ReviewsNode[] };
}

export type CharStackParamList = {
    Character: { data: AniMalType };
    CharDetail: { id: number, malId:number, name:string, type:string, inStack:boolean };
    StaffDetail: { id: number, name:string, inStack:boolean };
}

export type OverviewNav = CompositeNavigationProp<
    NativeStackNavigationProp<DrawerInfoParamList, 'DrawerInfo'>,
    DrawerNavigationProp<DrawerParamList, 'Overview'>>;

// Expore Tab Stack Nav/Route
export type ExploreTabProps = MaterialBottomTabScreenProps<BottomTabParamList, 'ExploreStack'>;
export type UserStackProps = NativeStackScreenProps<UserStackParamList, 'UserActivity'>;
export type ExploreProps = NativeStackScreenProps< ExploreStackParamList, 'Explore'>;
export type InfoProps = DrawerScreenProps<DrawerInfoParamList, 'DrawerInfo'>;
export type SearchProps = NativeStackScreenProps<ExploreStackParamList, 'Search'>;

// Drawer Nav/Route
export type OverviewProps = DrawerScreenProps<DrawerParamList, 'Overview'>;
export type MusicProps = DrawerScreenProps<DrawerParamList, 'Music'>;
export type CharStackProps = NativeStackScreenProps<DrawerParamList, 'CharacterStack'>;
export type CharacterProps = DrawerScreenProps<CharStackParamList, 'Character'>;
export type CharDetailProps = DrawerScreenProps<CharStackParamList, 'CharDetail'>;
export type WatchProps = DrawerScreenProps<DrawerParamList, 'Watch'>;
export type StudioInfoProps = DrawerScreenProps<DrawerParamList, 'StudioInfo'>;
export type ReviewProps = DrawerScreenProps<DrawerParamList, 'Reviews'>;

// Recommendation Stack Nav/Route
export type RecommendationProps = CompositeScreenProps<
    NativeStackScreenProps<RecommendationStackParamList, 'Recommendations'>,
    NativeStackScreenProps<DrawerInfoParamList, 'DrawerInfo'>>;

// MoreStack Nav/Route
export type SettingsStackParamList = {
    Settings: undefined;
    Themes: undefined;
}
export type MoreStackParamList = {
    MoreHome: undefined;
    AccountStack: undefined;
    SettingsStack: SettingsStackParamList;
    About: undefined;
    DataSources: undefined;
}


export type MoreStackProps = CompositeScreenProps<
    MaterialBottomTabScreenProps<BottomTabParamList, 'MoreStack'>,
    NativeStackScreenProps<MoreStackParamList, 'SettingsStack'>>;
export type MoreHomeScreenProps = NativeStackScreenProps<MoreStackParamList, 'MoreHome'>;
export type DataSourcesProps = NativeStackScreenProps<MoreStackParamList, 'DataSources'>;
export type SettingStackScreenProps = NativeStackScreenProps<MoreStackParamList, 'SettingsStack'>;
export type SettingsScreenProps = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;
export type ThemesScreenProps = NativeStackScreenProps<SettingsStackParamList, 'Themes'>;
// NativeStackScreenProps<RecommendationStackParamList, 'Recommendations'>;
