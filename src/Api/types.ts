import { PageInfoType } from "../Components/types";

export type HomePageFetchParams = { 
    sort:string; 
    type:string; 
    format?:string; 
    format_in?:string[];
    format_not_in?:string[];
    genre_in?:string[];
    genre_not_in?:string[];
    tag_in?:string[];
    tag_not_in?:string[];
    licensedBy_in?:string[];
    minimumTagRank?:number;
    page:number;
    perPage:number;
    isAdult?:boolean;
    season?:string;
    seasonYear?:number;
    countryOfOrigin?:string;
    averageScore_greater?:number;
    averageScore_lesser?:number;
    volumes_greater?:number;
    volumes_lesser?:number;
    chapters_greater?:number;
    chapters_lesser?:number;
    episodes_greater?:number;
    episodes_lesser?:number;
    duration_greater?:number;
    duration_lesser?:number;
    startDate_lesser?:number;
    startDate_greater?:number;
    search?:string;
    status?:string;
    onList?:boolean;
}

export type MediaAnimeSort = 
    'ID' | 'ID_DESC' | 'TITLE_ROMAJI' | 'TITLE_ROMAJI_DESC' | 'TITLE_ENGLISH' | 'TITLE_ENGLISH_DESC' | 
    'TITLE_NATIVE' | 'TITLE_NATIVE_DESC' | 'TYPE' | 'TYPE_DESC' | 'FORMAT' | 'FORMAT_DESC' | 'START_DATE' |
    'START_DATE_DESC' | 'END_DATE' | 'END_DATE_DESC' | 'SCORE' | 'SCORE_DESC' | 'POPULARITY' |
    'POPULARITY_DESC' | 'TRENDING' | 'TRENDING_DESC' | 'EPISODES' | 'EPISODES_DESC' | 'DURATION' |
    'DURATION_DESC' | 'STATUS' | 'STATUS_DESC' | 'UPDATED_AT' | 'UPDATED_AT_DESC' | 'SEARCH_MATCH' | 
    'FAVOURITES' | 'FAVOURITES_DESC';

export type MediaMangaSort =
    'ID' | 'ID_DESC' | 'TITLE_ROMAJI' | 'TITLE_ROMAJI_DESC' | 'TITLE_ENGLISH' | 'TITLE_ENGLISH_DESC' | 
    'TITLE_NATIVE' | 'TITLE_NATIVE_DESC' | 'TYPE' | 'TYPE_DESC' | 'FORMAT' | 'FORMAT_DESC' |
    'SCORE' | 'SCORE_DESC' | 'POPULARITY' | 'POPULARITY_DESC' | 'TRENDING' | 'TRENDING_DESC' |
    'STATUS' | 'STATUS_DESC' | 'CHAPTERS' | 'CHAPTERS_DESC' | 'VOLUMES' | 'VOLUMES_DESC' |
    'UPDATED_AT' | 'UPDATED_AT_DESC' | 'SEARCH_MATCH' | 'FAVOURITES' | 'FAVOURITES_DESC';

export interface MediaTileType {
        id: number;
        title: {
            userPreferred:string,
            romaji:string,
            native:string,
            english:string,
        };
        coverImage: {
            extraLarge:string,
        };
        type: string;
        isFavorite: boolean;
        bannerImage: string;
        meanScore: number | null;
        averageScore: number | null;
        mediaListEntry: {
            id: number;
            status: string;
        }
}

type TitleType = {
    userPreferred: string;
    native: string;
    english: string;
    romaji: string;
}

export type DateType = {
    year: number;
    month: number;
    day: number;
}

export type TagsType = {
    id: number;
    name: string;
    description: string;
    category: string;
    rank: number;
}

type TrailerType = {
    id: number;
    site: string;
    thumbnail: string;
}

type RelationsType = {
    edges: {
        id: number;
        relationType: string;
        node: {
            id: number;
            idMal: number;
            bannerImage: string;
            title: TitleType;
            meanScore: number;
            averageScore: number;
            type: string;
            format: string;
            coverImage: {
                extraLarge: string;
            }
        }
    }[];
}

type pageInfoType = {
    currentPage: number;
    hasNextPage: boolean;
}

export type CharVoiceActorType = {
    voiceActor: {
        id: number;
        name: {
          userPreferred: string;
        };
        language: string;
        image: {
          large:string;
        }
      }
}

export type CharacterItemType = {
    id: number;
    role: string;
    voiceActorRoles: CharVoiceActorType[];
    node: {
        id: number;
        isFavourite: boolean;
        image: {
            large: string;
        };
        name: {
            userPreferred: string;
            full: string;
            native: string;
            first: string;
            last: string;
        };
        favourites: number;
    }
}

export type CharFullEdge = {
    id: number;
    node: {
        id: number;
        averageScore: number;
        meanScore: number;
        format: string;
        type: string;
        coverImage: {
            extraLarge: string;
        }
        title: TitleType;
    }
}

export type CharDetailShort = {
    id: number;
    name: {
        full: string;
        userPreferred: string;
        native: string;
        first: string;
        last: string;
    };
    image: {
        large: string;
    };
    description: string;
    gender: string;
    age: string;
    bloodType: string;
    isFavourite: boolean;
    siteUrl: string;
    favourites: number;
    dateOfBirth: DateType;
    media: {
        pageInfo: {
            currentPage: number;
            hasNextPage: boolean;
        }
        edges: CharFullEdge[];
    }
}

export type CharFullType = {
    data: {
        Character: CharDetailShort;
    }
}

export type CharacterType = {
    pageInfo: {
        total: number;
        hasNextPage: boolean;
        currentPage: number;
    },
    edges: CharacterItemType[];
}

type RankingsType = {
    id: number;
    rank: number;
    type: string;
    format: string;
    year: number;
    season: string;
    allTime: boolean;
    context: string;
}

type nextAiringType = {
    id: number;
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
    mediaId: number;
}

export type StreamingEpType = {
    title: string;
    thumbnail: string;
    url: string;
    site: string;
}

type MediaRecommendationNode = {
    node: RecommendationInfoType;
}

export type MediaEntryInfoType = {
    id: number;
    mediaId: number;
    status: string;
    score: number;
    progress: number;
    progressVolumes: number;
    repeat: number;
    priority: number;
    private: boolean;
    notes: string;
    hiddenFromStatusLists: boolean;
    customLists: JSON;
    advancedScores: {
        Story: number;
        Character: number;
        Visuals: number;
        Audio: number;
        Enjoyment: number;
    };
    startedAt: {
      year: number;
      month: number;
      day: number;
    }
    completedAt: {
      year: number;
      month: number;
      day: number;
    }
    updatedAt: number;
    createdAt: number;
}

export type ExtLink = {
    id: number;
    site: string;
    url: string;
    color: string;
    icon: string;
}

export type ReviewsNode = {
    node: {
        id: number;
        userId: number;
        summary: string;
        body: string;
        rating: number;
        ratingAmount: number;
        score: number;
        siteUrl: number;
        createdAt: number;
        updatedAt: number;
        user: UserBasic
    }
}
export type Reviews = {
    edges: ReviewsNode[];
}

export type MediaQueryType = {
    id: number;
    idMal: number;
    coverImage: {
        extraLarge: string;
    };
    characters: CharacterType;
    bannerImage: string;
    title: TitleType;
    meanScore: number;
    averageScore: number;
    startDate: DateType;
    endDate: DateType;
    tags: TagsType[];
    trailer: TrailerType;
    relations: RelationsType;
    description: string;
    nextAiringEpisode: nextAiringType;
    mediaListEntry: MediaEntryInfoType;
    staff: StaffTileType;
    reviews: Reviews;
    studios: {
        nodes: {
            id: number;
            name: string;
            isAnimationStudio: boolean;
            favourites: number;
        }[];
    }
    externalLinks: ExtLink[];
    recommendations: {
        pageInfo: pageInfoType;
        edges: MediaRecommendationNode[];
    }
    rankings: RankingsType[];
    streamingEpisodes: StreamingEpType[];
    siteUrl: string;
    updatedAt: number;
    season: string;
    seasonYear: number;
    type: 'ANIME'|'MANGA';
    format: string;
    status: string;
    episodes: number;
    duration: number;
    chapters: number;
    volumes: number;
    isAdult: boolean;
    genres: string[];
    countryOfOrigin: string;
    isLicensed: boolean;
    source: string;
    hashtag: string;
    synonyms: string[];
    popularity: number;
    isLocked: boolean;
    trending: number;
    favourites: number;
    isFavourite: boolean;
}

export type MalNewsData = {
    mal_id: number;
    url: string;
    title: string;
    date: string;
    author_username: string;
    author_url: string;
    forum_url: string;
    images: {
        jpg: {
            image_url: string;
        }
    };
    comments: number;
    excerpt: string;
}

export type MalNews = {
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
    };
    data: MalNewsData[];
}

export type MalImages = {
    jpg: MALImageType;
    webp: MALImageType;
}

export type MediaQueryRoot = {
    data: {
        Viewer: {id:number}
        Media: MediaQueryType;
    }
}

export interface CurrentFilters {
    ActiveTags: string[];
    ActiveGenres: string[];
    DisabledTags: string[];
    DisabledGenres: string[];
}

export type MediaTagCollection = {
    id: number;
    name: string;
    description: string;
    category: string;
    rank: number | null;
    isAdult: boolean;
}

export type TagCollectionType = {
    data: {
        MediaTagCollection: MediaTagCollection[];
        GenreCollection: string[];
    }
}

export interface CategorizedTag {
    [x: string]: MediaTagCollection[];
}

export interface TagArrangedType {
    tags: CategorizedTag;
    genres: string[];
}

type Video = {
    id: number;
    basename: string;
    link: string;
    tags: string;
}

type Artists = {
    id: number;
    name: string;
    slug: string;
    as: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

type Song = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    artists: Artists[];
};

export type AnimeThemeEntries = {
    id: number;
    version: number;
    episodes: string;
    nsfw: boolean;
    notes: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    videos: Video[];
};

export type AnimeThemes = {
    id: number;
    type: string;
    sequence: number;
    group: string | null;
    slug: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    animethemeentries: AnimeThemeEntries[];
    song: Song;
};

export type MusicInfo = {
    id: number;
    name: string;
    slug: string;
    year: number;
    season: string | null;
    synopsis: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    animethemes: AnimeThemes[];
}
export type Music = {
    anime: MusicInfo;
};

export type MoeData = {
    anilist: {
        id: number;
        idMal: number;
        title: {
            native: string;
            romaji: string;
            english: string;
        };
        synonyms: string[];
        isAdult: boolean;
    };
    filename: string;
    episode: number;
    from: number;
    to: number;
    similarity: number;
    video: string;
    image: string;
}

export type TraceMoeType = {
    error: string;
    frameCount: number;
    result:MoeData[];
}

type MalPublishType = {
    from: string;
    to: string;
    prop: {
        from: {
            day: number;
            month: number;
            year: number;
        },
        to: {
            day: number;
            month: number;
            year: number;
        }
    },
    string: string;
}

type MALImageType = {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
}
export type MALType = {
    data: {
        mal_id: number;
        url: string;
        synopsis: string;
        background: string;
        images: {
            jpg: MALImageType;
            webp: MALImageType;
        };
        trailer: {
            youtube_id: string;
            url: string;
            embed_url: string;
        };
        title: string;
        rating: string;
        score: number;
        scored_by: number;
        scored: number;
        published: MalPublishType;
        aired: MalPublishType;
        rank: number;
        popularity: number;
        members: number;
        favorites: number;
    }
}

export type AniMalType = {
    anilist: MediaQueryType;
    mal: MALType;
    images: MalImages[];
    isAuth: boolean;
}

export type MalCharType = {
    character: {
        mal_id: number;
        url: string;
        images: {
            jpg: MALImageType;
            webp: MALImageType;
        }
        name: string;
    };
    role: string;
}

export type MalCharactersType = {
    data: MalCharType[];
}

export type MalCharImagesShort = {
    jpg: {
        image_url: string;
    };
    webp: {
        image_url: string;
    }
}
export type MalCharImagesType = {
    data: MalCharImagesShort[];
}

export type RecommendationMediaType = {
    id: number;
        malId: number;
        type: string;
        bannerImage: string;
        title: TitleType;
        averageScore: number;
        meanScore: number;
        coverImage: {
            extraLarge: string;
        };
}
export type RecommendationInfoType = {
    id: number;
    rating: number;
    userRating: 'NO_RATING'|'RATE_UP'|'RATE_DOWN';
    media: RecommendationMediaType;
    mediaRecommendation: RecommendationMediaType;
    user: {
        id: number;
        name: string;
        avatar: {large: string};
        siteUrl: string;
    }
}

export type RecommendationsFullType = {
    data: {
        Page: {
            pageInfo: pageInfoType;
            recommendations: RecommendationInfoType[];
        }
    }
}

export type MediaCollectionEntries = {
    customLists: JSON;
    progress: number;
    progressVolumes: number;
    updatedAt: number;
    media: {
        id: number;
        idMal: number;
        averageScore: number;
        meanScore: number;
        type: string;
        format: string;
        episodes: number;
        chapters: number;
        volumes: number;
        bannerImage: string;
        isAdult: boolean;
        status: string;
        synonyms: string[];
        nextAiringEpisode: {
            timeUntilAiring: number;
        }
        title: {
            userPreferred: string;
			english: string;
			native: string;
			romaji: string;
        }
        coverImage: {
            extraLarge: string;
        }
    }
}
export type MediaListCollectionData = {
    lists: {
        name: string;
        isCustomList: boolean;
        status: string;
        entries: MediaCollectionEntries[];
    }[];
}

export type StudioDataType = {
    id: number;
    name: string;
    siteUrl: string;
    isFavourite: boolean;
    favourites: number;
    media: {
        pageInfo: pageInfoType;
        edges: {
            node: MediaTileType;
        }[];
    }
}
export type StudioListType = {
    data: {
        Studio: StudioDataType;
    }
}

export type StudioItemType = {
    role: string;
    node: {
        id: number;
        name: {
            full: string;
            first: string;
            middle: string;
            last: string;
            native: string;
            userPreferred: string;
        };
        image: {
            large: string;
        }
        isFavourite: boolean;
    }
}

export type StaffTileType = {
    edges: StudioItemType[];
}

export type CharacterMediaType = {
    id: number;
    characterRole: string;
    characterName: string;
    node: {
        id: number;
        idMal: number;
        type: string;
        bannerImage: string;
        title: {
            userPreferred: string;
        };
        coverImage: {
            extraLarge: string;
        };
        startDate: DateType;
        mediaListEntry: {
            id: number;
            status: string;
        }
    }
    characters: {
        id: number;
        isFavourite: boolean;
        name: {
            full: string;
            userPreferred: string;
        }
        image: {
            large: string;
        }
    }[];
}

export type StaffMediaEdge = {
    id: number;
    staffRole: string;
    node: {
        id: number;
        type: string;
        title: {
            userPreferred: string
        }
        coverImage: {
            extraLarge: string;
        }
        mediaListEntry: {
            id: number;
            status: string;
        }
    }
}

export type StaffDataType = {
    id: number;
    name: {
        first: string;
        middle: string;
        last: string;
        native: string;
        userPreferred: string;
        full: string;
        alternative: string[];
    }
    image: {
        large: string;
    }
    siteUrl: string;
    description: string;
    favourites: number;
    isFavourite: boolean;
    isFavouriteBlocked: boolean;
    age: number;
    gender: string;
    yearsActive: number[];
    homeTown: string;
    bloodType: string;
    primaryOccupations: string[];
    dateOfBirth: DateType;
    dateOfDeath: DateType;
    languageV2: string;
    staffMedia: {
        pageInfo: pageInfoType;
        edges: StaffMediaEdge[];
    };
    characterMedia: {
        pageInfo: pageInfoType;
        edges: CharacterMediaType[];
    }
}
export type StaffFullType = {
    data: {
        Staff: StaffDataType;
    }
}

export type MediaListCollectionType = {
    data: {
        MediaListCollection: MediaListCollectionData;
    }
}

export type UserFavMediaNode = {
    node: {
        id: number;
        idMal: number;
        bannerImage: string;
        type: string;
        format: string;
        isFavourite: boolean;
        title: TitleType;
        isAdult: boolean;
        episodes: number;
        chapters: number;
        coverImage: {
            extraLarge: string;
        }
        meanScore: number;
        averageScore: number;
        mediaListEntry: {
            id: number;
            status: string;
            progress: number;
        }
    }
}
export type UserFavStaffNode = {
    node: {
        id: number;
        languageV2: string;
        name: {
            userPreferred: string;
        }
        image: {
            large: string;
        }
        isFavourite: boolean;
        favourites: number;
    }
}
export type UserFavStudioNode = {
    node: {
        id: number;
        name: string;
        siteUrl: string;
        isfavourites: boolean;
        favourites: number;
    }
}
export type UserFavCharNode = {
    node: {
        id: number;
        isFavourite: boolean;
        image: {
            large: string;
        }
        name: {
        full: string;
            userPreferred: string;
            native: string;
            first: string;
            last: string;
        }
        dateOfBirth: DateType;
        favourites: number;
    }
}


type FavoritePageInfo = {
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
    total: number;
};
export type FavoriteChar = {
    pageInfo: FavoritePageInfo;
    edges: UserFavCharNode[];
}
export type FavoriteMedia = {
    pageInfo: FavoritePageInfo;
    edges: UserFavMediaNode[];
}
export type FavoriteStaff = {
    pageInfo: FavoritePageInfo;
    edges: UserFavStaffNode[];
}
export type FavoriteStudio = {
    pageInfo: FavoritePageInfo;
    edges: UserFavStudioNode[];
}
export type UserFavList = {
    favourites: {
        anime: FavoriteMedia;
        manga: FavoriteMedia;
        staff: FavoriteStaff;
        studios: FavoriteStudio;
        characters: FavoriteChar;
    }
};
export type UserFavoritesType = {
    data: {
        Viewer: UserFavList;
    }
}

export type RandomMediaInfo = {
    id: number;
    idMal: number;
    genres: string[];
    title: {
        userPreferred: string,
        romaji: string,
        native: string,
        english: string,
    };
    coverImage: {
        extraLarge: string,
    };
    bannerImage: string;
    meanScore: number;
    averageScore: number;
    type: string;
    format: string;
    status: string;
    isAdult: boolean;
}
export type RandomContent = {
    data: {
        Page: {
            pageInfo: {total:number};
            media: RandomMediaInfo[];
        }
    }
}

export type CharacterSearchTile = {
    id: number;
    name: {
        userPreferred: string;
        full: string;
    };
    image: {
        large: string;
    };
    dateOfBirth: DateType;
    isFavourite: boolean;
    favourites: number;
}
export type CharSearchType = {
    data: {
        Page: {
            pageInfo: pageInfoType;
            characters: CharacterSearchTile[];
        }
    }
}

export type StaffSearchType = {
    data: {
        Page: {
            pageInfo: pageInfoType;
            staff: CharacterSearchTile[];
        }
    }
}

export type UserBasic = {
    id: number;
    name: string;
    avatar: {
        large: string;
    }
    siteUrl: string
};

export type Activities = {
    id: number;
    progress: number;
    status: string;
    createdAt: number;
    user: UserBasic;
    media: {
        id: number;
        isAdult: boolean;
        type: string;
        bannerImage: string;
        title: {
            userPreferred: string;
        };
        coverImage: {
            extraLarge: string;
        }
    };
    siteUrl: string;
}
export type ActivityPage = {
    pageInfo: {
        currentPage: number;
        hasNextPage: boolean;
        total: number;
    };
    activities: Activities[];
}
export type ActivityData = {
    data: {
        Page: ActivityPage;
    }
}

export type UserNotifications = {
    __typename: string;
    id: number;
    type: string;
    contexts: string[];
    context: string;
    reason: string;
    episode: number;
    createdAt: number;
    media: {
        id: number;
        type: string;
        title: TitleType;
        coverImage: {
            extraLarge: string;
        }
    }
    user: {
        id: number;
        name: string;
        avatar: {
            large: string;
        }
        siteUrl: string;
    }
}
export type UserNotificationPage = {
    pageInfo: pageInfoType;
    notifications: UserNotifications[];
}
export type UserNotificationData = {
    data: {
        Page: UserNotificationPage;
    }
}

export type UserOptionViewer = {
    id: number;
    siteUrl: string;
    bannerImage: string;
    name: string;
    avatar: {
        large: string;
        medium: string;
    }
    options: {
        titleLanguage: string;
        staffNameLanguage: string;
        displayAdultContent: boolean;
        timezone: string;
        notificationOptions: {
            type: string;
            enabled: boolean;
        }[];
        airingNotifications: boolean;
    }
}
export type UserOptions = {
    data: {
        Viewer: UserOptionViewer;
    }
}

type AnimeStatFrag = {
    count: number;
    meanScore: number;
    minutesWatched: number;
    mediaIds: number[];
}

type MangaStatFrag = {
    count: number;
    meanScore: number;
    chaptersRead: number;
    mediaIds: number[];
}
export interface AnimeFormats extends AnimeStatFrag {format:string};
interface AnimeStatuses extends AnimeStatFrag {status:string};
interface AnimeScores extends AnimeStatFrag {score:number};
interface AnimeLengths extends AnimeStatFrag {length:string};
export interface AnimeReleaseYrs extends AnimeStatFrag {releaseYear:number};
interface AnimeStartYrs extends AnimeStatFrag {startYear:number};
interface AnimeGenres extends AnimeStatFrag {genre:string};
interface AnimeTags extends AnimeStatFrag {tag: TagsType};
interface AnimeCountries extends AnimeStatFrag {country: string};
interface AnimeStaff extends AnimeStatFrag {staff: UserFavStaffNode}
interface AnimeVA extends AnimeStatFrag {voiceActor: UserFavStaffNode}
interface AnimeStudios extends AnimeStatFrag {studio: UserFavStudioNode}

interface MangaFormats extends MangaStatFrag {fragment:string};
interface MangaStatuses extends MangaStatFrag {status:string};
interface MangaScores extends MangaStatFrag {score:number};
interface MangaLengths extends MangaStatFrag {length:string};
export interface MangaReleaseYrs extends MangaStatFrag {releaseYear:number};
interface MangaStartYrs extends MangaStatFrag {startYear:number};
interface MangaGenres extends MangaStatFrag {genre:string};
interface MangaTags extends MangaStatFrag {tag: TagsType};
interface MangaCountries extends MangaStatFrag {country: string};
interface MangaStaff extends MangaStatFrag {staff: UserFavStaffNode}

export type UserAnimeStats = {
    count: number;
    meanScore: number;
    standardDeviation: number;
    minutesWatched: number;
	episodesWatched: number;
    formats: AnimeFormats[];
    statuses: AnimeStatuses[];
    scores: AnimeScores[];
    lengths: AnimeLengths[];
    releaseYears: AnimeReleaseYrs[];
    startYears: AnimeStartYrs[];
    genres: AnimeGenres[];
    tags: AnimeTags[];
    countries: AnimeCountries[];
    voiceActors: AnimeVA[];
    staff: AnimeStaff[];
    studios: AnimeStudios[];
}

export type UserMangaStats = {
    count: number;
    meanScore: number;
    standardDeviation: number;
    chaptersRead: number;
	volumesRead: number;
    formats: MangaFormats[];
    statuses: MangaStatuses[];
    scores: MangaScores[];
    lengths: MangaLengths[];
    releaseYears: MangaReleaseYrs[];
    startYears: MangaStartYrs[];
    genres: MangaGenres[];
    tags: MangaTags[];
    countries: MangaCountries[];
    staff: MangaStaff[];
}

export type UserStatsTypes = {
    anime: UserAnimeStats;
    manga: UserMangaStats;
}
export type UserStats = {
    data: {
        Viewer: {
            statistics: UserStatsTypes;
        }
    }
}

export type FollowingMediaList = {
    id: number;
    status: string;
    score: number;
    progress: number;
    progressVolumes: number;
    media: {
        type: string;
        format: string;
        episodes: number;
        chapters: number;
        volumes: number;
    }
    user: {
        id: number;
        name: string;
        avatar: {
            large: string;
        };
        mediaListOptions: {
            scoreFormat: string;
        }
        siteUrl: string;
    }
}
export type FollowingMediaPage = {
    Page: {
        pageInfo:PageInfoType;
        mediaList: FollowingMediaList[];
    }
}
export type MediaFollowing = {
    data: FollowingMediaPage;
}