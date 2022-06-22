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
    stats:              Stats;
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

export type Stats = {
    comments:   number;
    favourites: number;
}
