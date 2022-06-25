export type PopularDevArtData = {
    has_more:        boolean;
    next_offset:     number;
    estimated_total: number;
    results:         PopularResult[];
}

export type PopularResult = {
    deviationid:        string;
    printid:            null;
    url:                string;
    title:              string;
    category:           string;
    category_path:      CategoryPath;
    is_favourited:      boolean;
    is_deleted:         boolean;
    is_published:       boolean;
    is_blocked:         boolean;
    author:             Author;
    stats:              StatsDA;
    published_time:     string;
    allows_comments:    boolean;
    preview:            Content;
    content:            Content;
    thumbs:             Content[];
    is_mature:          boolean;
    is_downloadable:    boolean;
    download_filesize?: number;
}

export type Author = {
    userid:        string;
    username:      string;
    usericon:      string;
    type:          Type;
    is_subscribed: boolean;
}

export type Type = {
    Premium: "premium",
    Regular: "regular",
}

export type CategoryPath = {
    CartoonsDigitalCartoonsDrawings: "cartoons/digital/cartoons/drawings",
    VisualArt: "visual_art",
}

export type Content = {
    src:          string;
    height:       number;
    width:        number;
    transparency: boolean;
    filesize?:    number;
}

export type StatsDA = {
    comments:   number;
    favourites: number;
}

// METADATA

export type MetaDatas = {
    metadata: MetadataDA[];
}

export type MetadataDA = {
    deviationid:      string;
    printid:          null;
    author:           Author;
    is_watching:      boolean;
    title:            string;
    description:      string;
    license:          string;
    allows_comments:  boolean;
    tags:             MDTag[];
    is_favourited:    boolean;
    is_mature:        boolean;
    can_post_comment: boolean;
    submission:       SubmissionDA;
    stats:            MetaDataStatsDA;
}

export type MDTag = {
    tag_name:  string;
    sponsored: boolean;
    sponsor:   string;
}

export type SubmissionDA = {
    creation_time: string;
    category: string;
    file_size: string;
    resolution: string;
    submitted_with: {
        app: string;
        url: string;
    };
}

export type MetaDataStatsDA = {
    views: number;
    views_today: number;
    favourites: number;
    comments: number;
    downloads: number;
    downloads_today: number;
}


// DOWNLOAD

export type DownloadData = {
	src: string;
	filename: string;
	width: number;
	height: number;
	filesize: number;
}