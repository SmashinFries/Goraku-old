export const cacheA = {Season: {Page: {}, content: []}, NextSeason: {Page: {}, content: []}, Trending: {Page: {}, content: []}, Popular: {Page: {}, content: []}, Top: {Page: {}, content: []}};
export const cacheM = {Trending: {Page: {}, content: []}, Popular: {Page: {}, content: []}, Top: {Page: {}, content: []}};
export const cacheN = {Trending: {Page: {}, content: []}, Popular: {Page: {}, content: []}, Top: {Page: {}, content: []}};
export const cacheS = {Page: {}, Content:[]};
export const cacheFilter = [{title: 'Genres', data: []}];
export const filterObj = {type: "ANIME", format_in:[], format_not:[], filter_in: [], filter_not: [], tags_in: [], tags_not: [], genre_in: [], genre_not: [], sort:"POPULARITY_DESC"};
export const activeList = [];

export const HPQUERY = `
query ($id: Int, $isAdult: Boolean, $page: Int, $perPage: Int, $format: MediaFormat, $sort: [MediaSort], $search: String, $format_in: [MediaFormat], $format_not_in: [MediaFormat], $tag_in: [String], $tag_not_in: [String], $genre_in: [String], $genre_not_in: [String], $season: MediaSeason, $seasonYear: Int, $type: MediaType) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (id: $id, sort: $sort, isAdult: $isAdult, search:$search, format:$format, format_in: $format_in, format_not_in: $format_not_in, tag_in: $tag_in, tag_not_in: $tag_not_in, genre_in: $genre_in, genre_not_in: $genre_not_in, season:$season, seasonYear:$seasonYear, type: $type) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
      }
      meanScore
      format
    }
  }
}`;

export const ITEMQUERY = `
query ($id: Int) {
  Media (id:$id) {
    format
    synonyms
    meanScore
    type
    bannerImage
    genres
    description(asHtml: true)
    status
    volumes
    chapters
    episodes
    recommendations {
      edges {
        node {
          mediaRecommendation {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              extraLarge
            }
            meanScore
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
          id
          type
          title {
            romaji
            native
          }
          coverImage{
            extraLarge
          }
        }
      }
    }
    characters (sort:[ROLE]){
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

export const REVIEWS = `
query ($id: Int) {
  Media (id:$id) {
    reviews (sort:[RATING_DESC]) {
      edges {
        node {
          id
          summary
          body (asHtml: true)
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
    description(asHtml:true)
    media {
      edges {
        id
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
            native
          }
          image {
            large
          }
        }
      }
    }
    staffMedia {
      edges {
        id
        staffRole
        node {
          id
          title {
            romaji
            native
          }
          coverImage {
            extraLarge
          }
        }
      }
    }
    bloodType
    favourites
    description (asHtml:true)
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

// LOOKING INTO USER LISTS
export const USER_QUERY = `
query ($name: String) {
  User (name:$name) {
    name
    avatar {
      large
    }
    bannerImage
    about
    statistics {
      anime {
        count
        minutesWatched
        episodesWatched
        statuses (sort:PROGRESS_DESC){
          status
          minutesWatched
        }
        staff(limit:3, sort:COUNT_DESC) {
          count
          minutesWatched
          staff {
            name {
              full
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
        staff(limit:3, sort:COUNT_DESC) {
          count
          chaptersRead
          staff{
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
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