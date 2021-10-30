export const cacheA = {Season: {Page: {}, content: []}, NextSeason: {Page: {}, content: []}, Trending: {Page: {}, content: []}, Popular: {Page: {}, content: []}, Top: {Page: {}, content: []}};
export const cacheM = {Trending: {Page: {}, content: []}, Popular: {Page: {}, content: []}, Top: {Page: {}, content: []}};
export const cacheN = {Trending: {Page: {}, content: []}, Popular: {Page: {}, content: []}, Top: {Page: {}, content: []}};
export const cacheS = {Page: {}, Content:[]};

export const cacheFilter = [{title: 'Genres', data: []}];
export const filterObj = {type: "ANIME", origin:undefined, format_in:[], format_not:[], filter_in: [], filter_not: [], tags_in: [], tags_not: [], genre_in: [], genre_not: [], sort:"POPULARITY_DESC"};
export const activeList = [];

const PAGE_FRAG = `
currentPage
lastPage
hasNextPage
perPage
`;

const BASICS_FRAG = `
id
meanScore
averageScore
type
format
isFavourite
episodes
chapters
status(version:2)
coverImage {
  extraLarge
}
title {
  romaji
  english
  native
  userPreferred
}
`;

const LIST_FRAG = `
mediaListEntry{
  id
  status
  progress
  score
}
`;

const STAT_FRAG = `
statistics {
  anime {
    count
    minutesWatched
    episodesWatched
    statuses (sort:PROGRESS_DESC){
      status
      count
    }
    tags (limit:10, sort:COUNT_DESC){
      count
      tag {
        id
        description
        name
      }
      minutesWatched
    }
    staff(limit:5, sort:COUNT_DESC) {
      count
      minutesWatched
      staff {
        id
        primaryOccupations
        name {
          full
          userPreferred
        }
        image{
          large
        }
      }
    }
    voiceActors(limit:5, sort:COUNT_DESC) {
      count
      minutesWatched
      voiceActor {
        id
        primaryOccupations
        name {
          full
          userPreferred
        }
        image{
          large
        }
      }
    }
  }
  manga {
    count
    chaptersRead
    volumesRead
    statuses (sort:PROGRESS_DESC) {
      status
      count
      chaptersRead
    }
    tags (limit:10, sort:COUNT_DESC) {
      count
      tag {
        id
        description
        name
      }
      chaptersRead
    }
    staff(limit:5, sort:COUNT_DESC) {
      count
      chaptersRead
      staff{
        id
        primaryOccupations
        name {
          full
          userPreferred
        }
        image {
          large
        }
      }
    }
  }
}
`;

export const HPQUERY = `
query ($id: Int, $origin: CountryCode, $onList: Boolean, $isAdult: Boolean, $page: Int, $perPage: Int, $format: MediaFormat, $sort: [MediaSort], $search: String, $format_in: [MediaFormat], $format_not_in: [MediaFormat], $tag_in: [String], $tag_not_in: [String], $genre_in: [String], $genre_not_in: [String], $season: MediaSeason, $seasonYear: Int, $type: MediaType) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      ${PAGE_FRAG}
    }
    media (onList: $onList, id: $id, sort: $sort, countryOfOrigin:$origin, isAdult: $isAdult, search:$search, format:$format, format_in: $format_in, format_not_in: $format_not_in, tag_in: $tag_in, tag_not_in: $tag_not_in, genre_in: $genre_in, genre_not_in: $genre_not_in, season:$season, seasonYear:$seasonYear, type: $type) {
      ${BASICS_FRAG}
      ${LIST_FRAG}
    }
  }
}`;

export const ITEMQUERY = `
query ($id: Int, $page: Int, $perPage: Int) {
  Media (id:$id) {
    ${BASICS_FRAG}
    synonyms
    bannerImage
    genres
    duration
    description(asHtml: false)
    volumes
    source(version:3)
    ${LIST_FRAG}
    recommendations {
      edges {
        node {
          mediaRecommendation {
            id
            coverImage{
              extraLarge
            }
            title {
              romaji
              english
              native
              userPreferred
            }
            meanScore
            ${LIST_FRAG}
          }
        }
      }
    }
    nextAiringEpisode {
      timeUntilAiring
      airingAt
    }
    staff (sort:RELEVANCE) {
      edges{
        role
        node {
          id
          name {
            full
            native
          }
          image {
            large
          }
        }
      }
    }
    externalLinks {
      id
      site
      url
    }
    studios (isMain: true) {
      edges {
        node {
          id
          name
        }
      }
    }
    trailer {
      thumbnail
      id
      site
    }
    startDate {
      month
      day
      year
    }
    endDate {
      month
      day
      year
    }
    tags {
      id
      name
      description
      rank
    }
    streamingEpisodes {
      title
      thumbnail
      url
      site
    }
    relations{
      edges{
        relationType (version:2)
        node {
          ${BASICS_FRAG}
        }
      }
    }
    characters (page:$page, perPage:$perPage, sort:[ROLE]){
      pageInfo {
        currentPage
        hasNextPage
      }
      edges {
        role
        voiceActors {
          id
          languageV2
          name {
            full
            native
          }
          image {
            large
          }
        }
        node {
          id
          isFavourite
          name {
            full
            native
          }
          image {
            large
          }
        }
      }
    }
  }
}
`;

export const LISTS = `
query ($userId:Int, $page:Int, $perPage:Int, $status:MediaListStatus, $type:MediaType, $sort:[MediaListSort]) {
  Page (page:$page, perPage:$perPage) {
    pageInfo {
      ${PAGE_FRAG}
    }
    mediaList (userId:$userId, status:$status, type:$type, sort:$sort) {
      id
      progress
      score
      updatedAt
      createdAt
      startedAt {
        year
        month
        day
      }
      media {
        ${BASICS_FRAG}
        rankings {
          rank
          type
          season
          allTime
        }
        startDate {
          month
          year
        }
        title{
          native
          romaji
          english
        }
        coverImage{
          extraLarge
        }
      }
    }
  }
}
`;

const REPLY_FRAG = `
replies {
  id
  text
  likeCount
  isLiked
  createdAt
  user {
    id
    name
    avatar {
      large
    }
  }
}
`;

export const ACTIVITY = `
query ($page:Int, $perPage:Int, $userId:Int) {
  Page (page:$page, perPage:$perPage) {
    pageInfo {
      ${PAGE_FRAG}
    }
    activities (userId:$userId, sort:ID_DESC) {
      __typename
      ... on ListActivity{
        id
        type
        isLiked
        status
        progress
        createdAt
        likeCount
        replyCount
        ${REPLY_FRAG}
        media {
          id
          meanScore
          coverImage {
            extraLarge
          }
          title {
            romaji
            english
            native
            userPreferred
          }
        }
      }
      ... on TextActivity{
        id
        type
        isLiked
        replyCount
        text
        likeCount
        createdAt
        ${REPLY_FRAG}
        user {
          id
          name
          avatar {
            large
          }
        }
      }
      ... on MessageActivity{
        id
        isLiked
        type
        replyCount
        message(asHtml: false)
        likeCount
        createdAt
        ${REPLY_FRAG}
        replyCount
        messenger{
          id
          name
          avatar{
            large
          }
        }
      }
    }
  }
}
`;


export const REVIEWS = `
query ($id: Int) {
  Media (id:$id) {
    reviews (sort:[RATING_DESC]) {
      edges {
        node {
          id
          summary
          body (asHtml: false)
          ratingAmount
          score
          rating
          user {
            avatar {
              large
            }
            name
          }
        }
      }
    }
  }
}
`;

export const REVIEW_BODY = `
query ($id: Int) {
  Review(id:$id) {
    body
  }
}
`

export const CHARACTERS = `
query ($id: Int!) {
  Character(id: $id) {
    name {
      native
      full
    }
    gender
    age
    bloodType
    dateOfBirth{
      day
      month
      year
    }
    image {
      large
    }
    favourites
    description(asHtml:false)
    media (sort:[FORMAT,TITLE_ROMAJI]) {
      edges {
        id
        voiceActors {
          id
          name {
            full
            userPreferred
            native
          }
          image {
            large
          }
          languageV2
        }
        node {
          id
          title {
            romaji
            native
          }
          coverImage {
            extraLarge
          }
          format
        }
      }
    }
  }
}`;

export const VA_QUERY = `
query ($id: Int, $page: Int, $perPage: Int, $sort: [CharacterSort]) {
  Staff(id:$id){
    id
    name{
      full
      userPreferred
      native
    }
    image {
      large
    }
    gender
    age
    homeTown
    characters (page:$page, perPage:$perPage, sort:$sort){
      pageInfo {
        currentPage
        perPage
        lastPage
      }
      edges{
        id
        role
        node {
          id
          name {
            full
            userPreferred
            native
          }
          image {
            large
          }
        }
      }
    }
    staffMedia (sort:POPULARITY_DESC) {
      edges {
        id
        staffRole
        node {
          id
          title {
            romaji
            native
            userPreferred
          }
          coverImage {
            extraLarge
          }
        }
      }
    }
    bloodType
    favourites
    description (asHtml:false)
    dateOfBirth{
      month
      day
      year
    }
    dateOfDeath{
      month
      day
      year
    }
    languageV2
    primaryOccupations
    yearsActive
  }
}
`;

// Other users
export const USER_QUERY = `
query ($name: String, $page: Int, $perPage: Int) {
  User (name:$name) {
    id
    name
    avatar {
      large
    }
    bannerImage
    about
    isFollowing
    isFollower
    favourites {
      characters(page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          hasNextPage
        }
        edges {
          voiceActors {
            id
            languageV2
            name {
              full
              native
            }
            image {
              large
            }
          }
          node {
            id
            name {
              userPreferred
            }
            image {
              large
            }
          }
        }
      }
    }
    ${STAT_FRAG}
  }
}
`;

export const USER_SEARCH = `
query ($search: String!, $page: Int, $perPage: Int) {
  Page (page:$page, perPage:$perPage) {
    pageInfo {
      ${PAGE_FRAG}
    }
    users (search:$search, sort:SEARCH_MATCH) {
      id
      name
      isFollowing
      isFollower
      avatar {
        large
      }
    }
  }
}
`;

export const AUTH_USER_QUERY = `
query ($page: Int, $perPage: Int) {
  Viewer {
    id
    name
    avatar {
      large
    }
    bannerImage
    about
    unreadNotificationCount
    mediaListOptions {
      scoreFormat
    }
    favourites {
      characters (page:$page, perPage:$perPage) {
        pageInfo {
          currentPage
          hasNextPage
        }
        edges {
          node {
            id
            name {
              userPreferred
            }
            image {
              large
            }
          }
          voiceActors {
            id
            languageV2
            name{
              full
              native
            }
            image {
              large
            }
          }
        }
      }
    }
    ${STAT_FRAG}
  }
}
`;

export const FOLLOWING_QUERY = `
query ($userId: Int!, $page: Int, $perPage: Int) {
  Page (page:$page, perPage:$perPage) {
    pageInfo {
      ${PAGE_FRAG}
    }
    following (userId:$userId) {
      id
      name
      avatar {
        large
      }
      isFollowing
      isFollower
    }
  }
}
`;

export const FILTER_QUERY = `
query {
  MediaTagCollection {
    id
    category
    name
    description
    isAdult
  }
  GenreCollection
}
`;

const NOTIF_FRAG1 = `
id
type
context
createdAt
media {
  id
  meanScore
  coverImage {
    extraLarge
  }
  title {
    romaji
    english
    native
    userPreferred
  }
}
`;

const NOTIF_FRAG2 = `
id
activityId
type
context
createdAt
user {
  id
  name
  avatar {
    large
  }
}
`;

export const AIRING_NOTIFICATION = `
query ($page:Int, $perPage:Int, $type:NotificationType) {
  Page (page:$page, perPage:$perPage) {
    pageInfo {
      ${PAGE_FRAG}
    }
    notifications (type:$type) {
      __typename
      ... on AiringNotification {
        id
        contexts
        createdAt
        episode
        media {
          id
          meanScore
          mediaListEntry {
            status
          }
          title {
            english
            native
            romaji
            userPreferred
          }
          coverImage {
            extraLarge
          }
        }
      }
      ... on FollowingNotification {
        id
        type
        context
        createdAt
        user {
          id
          name
          avatar {
            large
          }
        }
      }
      ... on RelatedMediaAdditionNotification {
        ${NOTIF_FRAG1}
      }
      ... on ActivityLikeNotification {
        ${NOTIF_FRAG2}
        activity {
          ... on TextActivity {
            id
            text
          }
          ... on ListActivity {
            id
            media {
              title {
                userPreferred
              }
            }
          }
          ... on MessageActivity {
            id
            message
          }
        }
      }
      ... on ActivityMessageNotification {
        ${NOTIF_FRAG2}
        message {
          id
          message
        }
      }
      ... on ActivityMentionNotification {
        ${NOTIF_FRAG2}
      }
      ... on ActivityReplyNotification {
        ${NOTIF_FRAG2}
      }
      ... on ActivityReplySubscribedNotification {
        ${NOTIF_FRAG2}
      }
      ... on ActivityReplyLikeNotification {
        ${NOTIF_FRAG2}
      }
      ... on MediaDataChangeNotification {
        ${NOTIF_FRAG1}
        reason
      }
      ... on MediaMergeNotification {
        id
        type
        context
        reason
        createdAt
        deletedMediaTitles
      }
      ... on MediaDeletionNotification {
        id
        type
        context
        reason
        createdAt
        deletedMediaTitle
      }
      ... on ThreadCommentMentionNotification {
        id
      }
      ... on ThreadCommentReplyNotification {
        id
      }
      ... on ThreadCommentSubscribedNotification {
        id
      }
      ... on ThreadCommentLikeNotification {
        id
      }
      ... on ThreadLikeNotification {
        id
      }
    }
  }
  Viewer {
    unreadNotificationCount
  }
}
`;

export const CLEAR_NOTIFICATIONS = `
query ($reset: Boolean) {
  Notification (resetNotificationCount:$reset) {
    __typename
  }
}
`;