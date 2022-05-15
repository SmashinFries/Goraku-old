const title_Q = `
title {
    userPreferred
    romaji
    native
    english
}
`;

const coverImage_Q = `
coverImage {
    extraLarge
}
`;

const score_Q = `
meanScore
averageScore
`;

const tags_Q = `
tags {
    id
    name
    description
    rank
    category
}
`;

const dates_Q = `
startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
`;

const trailer_Q = `
trailer {
    id
    site
    thumbnail
}
`;

export const TagCollection_Q = `
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

const media_params = `
sort:$sort,
type:$type,
format:$format,
format_in:$format_in,
format_not_in:$format_not_in,
season:$season,
seasonYear:$seasonYear,
isAdult:$isAdult,
search:$search,
genre_in:$genre_in,
genre_not_in:$genre_not_in,
tag_in:$tag_in,
tag_not_in:$tag_not_in,
chapters_greater:$chapters_greater,
chapters_lesser:$chapters_lesser,
volumes_greater:$volumes_greater,
volumes_lesser:$volumes_lesser,
episodes_greater:$episodes_greater,
episodes_lesser:$episodes_lesser,
duration_greater:$duration_greater,
duration_lesser:$duration_lesser,
licensedBy_in:$licensedBy_in,
minimumTagRank:$minimumTagRank,
countryOfOrigin:$countryOfOrigin,
averageScore_greater:$averageScore_greater,
averageScore_lesser:$averageScore_lesser,
status:$status
startDate_lesser:$startDate_lesser,
startDate_greater:$startDate_greater,
onList:$onList,
`;

const character_q = `
characters (sort:$sort_c, role:$role_c, page:$page_c, perPage:$perPage_c) {
    pageInfo {
      total
      hasNextPage
      currentPage
    }
    edges {
      id
      role
      voiceActorRoles(sort: [RELEVANCE, ID]) {
        voiceActor {
          id
          name {
            full,
            userPreferred,
            native
          }
          language: languageV2
          image {
            large
          }
        }
      }
      node {
        id
        isFavourite
        image {
          large
        }
        name {
          full
          userPreferred
          native
          first
          last
        }
        favourites
      }
    }
  }
`;

const studio_q = `
studios (sort:$sort_studio) {
    edges {
      isMain
      node {
        id
        name
        isAnimationStudio
        siteUrl
      }
    }
  }
`;

const streamingEP_q = `
streamingEpisodes {
    title
    thumbnail
    url
    site
  }
`;

const rankings_q = `
rankings {
    id
    rank
    type
    format
    year
    season
    allTime
    context
  }
`;

const recommendation_q = `
recommendations(sort:RATING_DESC, page:$page_rec, perPage:$perPage_rec) {
    edges {
      node {
        id
        rating
        userRating
        mediaRecommendation {
          id
          idMal
          bannerImage
          type
          ${title_Q}
          ${coverImage_Q}
          ${score_Q}
        }
      }
    }
  }
`;

const reviews_q = `
reviews(limit:5, sort:RATING_DESC, page:1, perPage:20) {
    edges{
      node{
        id
        userId
        summary
        body(asHtml:true)
        rating
        ratingAmount
        userRating
        score
        siteUrl
        createdAt
        updatedAt
        user {
          id
          name
          about(asHtml:true)
          bannerImage
          createdAt
          options {
            profileColor
          }
          avatar {
            large
          }
          donatorBadge
          siteUrl
        }
      }
    }
  }
`;
export const reviewUserRating_q = `
query ($id: Int) {
	Review (id:$id) {
		id
		userRating
	}
}
`;

const mediaListEntry_q = `
mediaListEntry {
    id
    mediaId
    status
    score
    progress
    progressVolumes
    repeat
    priority
    private
    notes
    hiddenFromStatusLists
    customLists
    advancedScores
    startedAt {
      year
      month
      day
    }
    completedAt {
      year
      month
      day
    }
    updatedAt
    createdAt
  }
`;

export const mediaListEntryFull_q = `
query ($id: Int) {
	Media(id: $id) {
		mediaListEntry {
			id
			mediaId
			status
			score
			progress
			progressVolumes
			repeat
			priority
			private
			notes
			hiddenFromStatusLists
			customLists
			advancedScores
			startedAt {
				year
				month
				day
			}
			completedAt {
				year
				month
				day
			}
			updatedAt
			createdAt
		}
	}
}
`

const relations_q = `
relations {
    edges {
        id
        relationType(version:2)
        node {
            id
            idMal
            bannerImage
            type
            format
            ${title_Q}
            ${coverImage_Q}
            ${score_Q}
        }
    }
}
`;

const extLinks_q = `
externalLinks {
    id
    site
    url
    color
    icon
  }
`;

const trends_q = `
trends (sort: $sort_trend, perPage:$perPage_trend) {
    edges{
      node{
        trending
        date
        averageScore
        popularity
        inProgress
        episode
        mediaId
        releasing
      }
    }
  }
`;

const airing_schedule_q = `
airingSchedule(notYetAired:true, page:$page_airing, perPage:$perPage_airing) {
    edges {
      id
      node {
        mediaId
        episode
        airingAt
        timeUntilAiring
      }
    }
  }
`;

const nextAiring = `
nextAiringEpisode {
    id
    airingAt
    timeUntilAiring
    episode
    mediaId
  }
`;

const statsdistribution_q = `
scoreDistribution {
    score
    amount
  }
  statusDistribution {
    status
    amount
  }
`;

const media_tile_listEntry_q = `
mediaListEntry {
  id
  status
  progress
}
`;

const staff_tile_q = `
staff (page:1, perPage:12, sort:[RELEVANCE, ID]) {
  edges {
    role
    node {
      id
      name {
        full
        first
        middle
        last
        native
        userPreferred
      }
      image {
        large
      }
      isFavourite
    }
  }
}
`;

export const mediaTile_Q = `
media(${media_params}) {
    id
    idMal
    bannerImage
    type
    isFavourite
    ${title_Q}
    ${coverImage_Q}
    ${score_Q}
    ${media_tile_listEntry_q}
}
`;

export const fullInfo_Q = `
Media(id:$id) {
    ${title_Q}
    ${score_Q}
    ${dates_Q}
    ${tags_Q}
    ${trailer_Q}
    ${relations_q}
    ${extLinks_q}
    ${rankings_q}
    ${streamingEP_q}
    ${nextAiring}
    ${coverImage_Q}
    ${character_q}
    ${recommendation_q}
    ${mediaListEntry_q}
    ${staff_tile_q}
    ${reviews_q}
    studios (isMain:true) {
			nodes {
				id
				name
				isAnimationStudio
				isFavourite
				favourites
			}
		}
    source (version:3)
    idMal
    id
    bannerImage
    description(asHtml:true)
    siteUrl
    updatedAt
    season
    seasonYear
    type
    format
    status(version:2)
    episodes
    duration
    chapters
    volumes
    isAdult
    genres
    countryOfOrigin
    isLicensed
    hashtag
    synonyms
    popularity
    isLocked
    trending
    favourites
    isFavourite
}
`;

export const mediaListFollowers_q = `
query ($page:Int,  $perPage:Int, $mediaId: Int) {
  Page (page:$page, perPage:$perPage) {
    mediaList (mediaId:$mediaId, sort:[UPDATED_TIME_DESC] isFollowing:true) {
			id
			status
			progress
			startedAt {
				year
				month
				day
			}
			updatedAt
      user {
				id
        name
				avatar {
					large
				}
				bannerImage
      }
    }
	}
}
`;

export const charDetail_Q = `
query ($id: Int, $page: Int, $perPage: Int) {
  Character(id: $id) {
    id
    name {
      full
      first
      last
      userPreferred
      native
    }
    image {
      large
    }
    description(asHtml:true)
    gender
    age
    bloodType
    isFavourite
    siteUrl
    favourites
    dateOfBirth {
      year
      month
      day
    }
    media(sort:[POPULARITY_DESC], page:$page, perPage:$perPage) {
      pageInfo{
        currentPage
        hasNextPage
      }
      edges {
        id
        node {
          id
          averageScore
          meanScore
          format
          type
          title {
            userPreferred
          }
          coverImage {
            extraLarge
          }
        }
      }
    }
  }
}
`;

export const recommendations_full_q = `
query ($page:Int,  $perPage:Int, $sort:[RecommendationSort], $onList:Boolean) {
  Page (page:$page, perPage:$perPage) {
    pageInfo {
      currentPage
      hasNextPage
    }
    recommendations (sort:$sort,onList:$onList) {
      id
      rating
      userRating
      media {
        id
        idMal
        type
        bannerImage
        ${title_Q}
        ${coverImage_Q}
        ${score_Q}
      }
      mediaRecommendation {
        id
        idMal
        type
        bannerImage
        ${title_Q}
        ${coverImage_Q}
        ${score_Q}
      }
      user {
        id
        name
        avatar {
          large
        }
        siteUrl
      }
    }
  }
}
`

export const account_options_q = `
query {
	Viewer {
		id
    siteUrl
    name
    bannerImage
    avatar {
			large
			medium
		}
		options {
			titleLanguage
			staffNameLanguage
      profileColor
			displayAdultContent
      notificationOptions {
        type
        enabled
      }
		}
	}
}
`;

export const alsofollowing_media_q = `
query ($id: Int, $page: Int, $perPage: Int) {
	Page(page: $page, perPage: $perPage) {
		pageInfo {
			total
			perPage
			currentPage
			lastPage
			hasNextPage
		}
		mediaList(mediaId: $id, isFollowing: true, sort: UPDATED_TIME_DESC) {
			id
			status
			score
			progress
      progressVolumes
      media {
        type
        format
				episodes
				chapters
				volumes
			}
			user {
				id
				name
				avatar {
					large
				}
				mediaListOptions {
					scoreFormat
				}
        siteUrl
			}
		}
	}
}
`;

export const user_list_q = `
query ($userId: Int, $type: MediaType, $sort: [MediaListSort]) {
	MediaListCollection (userId:$userId, type:$type, sort:$sort) {
		lists {
			name
			isCustomList
			status
			entries {
				customLists
        progress
        progressVolumes
        updatedAt
				media {
					id
					idMal
					averageScore
					meanScore
          episodes
          chapters
          volumes
          bannerImage
					type
          synonyms
					format
          isAdult
          status (version:2)
          nextAiringEpisode {
						timeUntilAiring
					}
					title {
            userPreferred
						english
						native
						romaji
					}
					coverImage {
						extraLarge
					}
				}
			}
		}
	}
}
`;

export const studio_list_q = `
query ($id: Int, $page: Int, $perPage: Int) {
	Studio (id:$id) {
		id
		name
		siteUrl
		isFavourite
		media (page:$page, perPage:$perPage, sort:[START_DATE_DESC]) {
			pageInfo {
				hasNextPage
				currentPage
			}
			edges {
				node {
					id
          idMal
          bannerImage
          type
          isFavourite
          ${title_Q}
          ${coverImage_Q}
          ${score_Q}
          ${media_tile_listEntry_q}
				}
			}
		}
	}
}
`;

export const staff_info_q = `
query staff($id:Int,$sort:[MediaSort],$characterPage:Int,$staffPage:Int,$onList:Boolean,$type:MediaType,$withCharacterRoles:Boolean = false,$withStaffRoles:Boolean = false){ 
  Staff(id:$id){
      id
      name{
          first 
          middle 
          last 
          full 
          native 
          userPreferred 
          alternative
      }
      image{
          large
      }
      description(asHtml:true)
      favourites
      isFavourite
      isFavouriteBlocked
      age
      gender
      yearsActive
      homeTown
      bloodType
      siteUrl
      primaryOccupations
      dateOfBirth{
          year
          month
          day
      }
      dateOfDeath{
          year
          month
          day
      }
      languageV2 
      characterMedia(page:$characterPage,sort:$sort,onList:$onList)@include(if:$withCharacterRoles){
          pageInfo{
              currentPage
              hasNextPage
          }
          edges{
            id
              characterRole
              characterName
              node{
                  id
                  idMal
                  type
                  bannerImage
                  title{
                    userPreferred
                  }
                  coverImage{
                    extraLarge
                  }
                  startDate{
                    year
                    month
                    day
                  }
                  mediaListEntry{
                    id
                    status
                  }
              }
              characters{
                  id
                  isFavourite
                  name{
                    full
                      userPreferred
                  }
                  image{
                      large
                  }
              }
          }
      }
      staffMedia(page:$staffPage,type:$type,sort:$sort,onList:$onList)@include(if:$withStaffRoles){
          pageInfo{
            currentPage
            hasNextPage
          }
          edges{
            id
              staffRole
              node{
                  id
                  type
                  title{
                    userPreferred
                  }
                  coverImage{
                    extraLarge
                  }
                  mediaListEntry{
                    id
                    status
                  }
              }
          }
      }
  }
}
`;


export const favoriteCharacters_q = `
query ($page: Int) {
	Viewer {
    favourites {
      characters (page:$page) {
        pageInfo {
          currentPage
          lastPage
          hasNextPage
          perPage
          total
        }
        edges {
          node {
            id
            isFavourite
            image {
              large
            }
            name {
              full
              userPreferred
              native
              first
              last
            }
            dateOfBirth {
							year
							month
							day
						}
            favourites
          }
        }
      }
    }
  }
}
`;
export const favoriteAnime_q = `
query ($page: Int) {
	Viewer {
		favourites {
      anime (page:$page) {
        pageInfo {
					currentPage
					lastPage
					hasNextPage
					perPage
					total
				}
				edges {
					node {
						id
            idMal
            bannerImage
            episodes
            type
            format
            isAdult
            isFavourite
            synonyms
            ${title_Q}
            ${coverImage_Q}
            ${score_Q}
            ${media_tile_listEntry_q}
					}
				}
			}
    }
  }
}
`;
export const favoriteManga_q = `
query ($page: Int) {
	Viewer {
		favourites {
      manga (page:$page) {
        pageInfo {
					currentPage
					lastPage
					hasNextPage
					perPage
					total
				}
				edges {
					node {
						id
            idMal
            bannerImage
            type
            chapters
            format
            isAdult
            synonyms
            isFavourite
            ${title_Q}
            ${coverImage_Q}
            ${score_Q}
            ${media_tile_listEntry_q}
					}
				}
			}
    }
  }
}
`;
export const favoriteStaff_q = `
query ($page: Int) {
	Viewer {
		favourites {
      staff (page:$page) {
        pageInfo {
					currentPage
					lastPage
					hasNextPage
					perPage
					total
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
          isFavourite
					}
				}
			}
    }
  }
}
`;
export const favoriteStudio_q = `
query ($page: Int) {
	Viewer {
		favourites {
      studios (page:$page) {
        pageInfo {
					currentPage
					lastPage
					hasNextPage
					perPage
					total
				}
				edges {
					node {
						id
						name
						siteUrl
					}
				}
			}
    }
  }
}
`;

export const random_q = `
query ($random: Int, $perRandom: Int, $type:MediaType, $isAdult:Boolean) {
	Page (page:$random, perPage:$perRandom) {
		pageInfo {
			total
		}
		media (type:$type, isAdult:$isAdult) {
			id
      idMal
      type
      format
      isAdult
      genres
      description(asHtml:true)
      status(version:3)
			${title_Q}
      ${coverImage_Q}
      bannerImage
      ${score_Q}
		}
	}
}
`

export const character_search_q = `
query ($search: String, $page: Int, $perPage: Int, $isBirthday:Boolean) {
	Page (page:$page, perPage:$perPage) {
		pageInfo {
			total
			hasNextPage
			currentPage
		}
		characters (search:$search, sort:[SEARCH_MATCH, FAVOURITES_DESC], isBirthday:$isBirthday) {
			id
			name {
				userPreferred
        full
			}
			image {
				large
			}
      dateOfBirth {
        year
        month
        day
      }
			isFavourite
			favourites
		}
	}
}
`;

export const staff_search_q = `
query ($search: String, $page: Int, $perPage: Int, $isBirthday:Boolean) {
	Page (page:$page, perPage:$perPage) {
		pageInfo {
			total
			hasNextPage
			currentPage
			
		}
		staff (search:$search, sort:[SEARCH_MATCH, FAVOURITES_DESC], isBirthday:$isBirthday) {
			id
			name {
				userPreferred
			}
			image {
				large
			}
      dateOfBirth {
        year
        month
        day
      }
			isFavourite
			favourites
		}
	}
}
`;

export const activity_q = `
query ($page: Int, $isFollowing: Boolean, $userId: Int) {
	Page (page:$page, perPage:24){
    pageInfo {
      total
			currentPage
			hasNextPage
		}
		activities (sort:ID_DESC, isFollowing:$isFollowing, userId:$userId) {
			__typename
			...on ListActivity {
				id
				progress
        status
        createdAt
        user {
					id
					name
					avatar {
						large
					}
					siteUrl
				}
				media {
					id
					type
          bannerImage
          isAdult
					title {
						userPreferred
					}
					coverImage {
						extraLarge
					}
				}
				siteUrl
			}
		}
	}
}
`;

export const notification_q = `
query ($page: Int, $perPage: Int) {
	Page (page:$page, perPage:$perPage) {
		pageInfo {
			total
			currentPage
			hasNextPage
		}
		notifications {
			__typename
			...on AiringNotification {
				id
				type
				contexts
				episode
				media {
					id
					type
					title {
						userPreferred
					}
					coverImage {
						extraLarge
					}
				}
			}
			...on FollowingNotification {
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
					siteUrl
				}
			}
      ...on ActivityLikeNotification {
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
					siteUrl
				}
			}
			...on MediaDataChangeNotification {
				id
				type
				context
				reason
				createdAt
				media {
					id
					type
					title {
						userPreferred
					}
					coverImage {
						extraLarge
					}
				}
			}
			...on RelatedMediaAdditionNotification {
				id
				type
				context
				media {
					id
					type
					title {
						userPreferred
					}
					coverImage {
						extraLarge
					}
				}
			}
		}
	}
}
`;


const animeStatFrag = `
count
meanScore
minutesWatched
mediaIds
`;
const mangaStatFrag = `
count
meanScore
chaptersRead
mediaIds
`;
export const user_statistics_q = `
query {
	Viewer {
		statistics {
			anime {
				count
				meanScore
				standardDeviation
				minutesWatched
				episodesWatched
				formats (sort:[COUNT_DESC]) {
					${animeStatFrag}
					format
				}
				statuses (sort:[COUNT_DESC]) {
					${animeStatFrag}
					status
				}
				scores (sort:[COUNT_DESC]) {
					${animeStatFrag}
					score
				}
				lengths (sort:[COUNT_DESC]) {
					${animeStatFrag}
					length
				}
				releaseYears (sort:[COUNT_DESC]) {
					${animeStatFrag}
					releaseYear
				}
				startYears (sort:[COUNT_DESC]) {
					${animeStatFrag}
					startYear
				}
				genres (sort:[COUNT_DESC]) {
					${animeStatFrag}
					genre
				}
				tags (sort:[COUNT_DESC]) {
					${animeStatFrag}
					tag {
            id
						name
						description
						category
					}
				}
				countries (sort:[COUNT_DESC]) {
					${animeStatFrag}
					country
				}
				voiceActors (sort:[COUNT_DESC]) {
					${animeStatFrag}
					voiceActor {
						id
						languageV2
						image {
							large
						}
						isFavourite
						favourites
						name {
							userPreferred
						}
					}
				}
				staff (sort:[COUNT_DESC]) {
					${animeStatFrag}
					staff {
						id
						languageV2
						image {
							large
						}
						isFavourite
						favourites
						name {
							userPreferred
						}
					}
				}
				studios {
					${animeStatFrag}
					studio {
						id
						name
            favourites
						isFavourite
					}
				}
			}
			manga {
				count
				meanScore
				standardDeviation
				chaptersRead
				volumesRead
				formats (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					format
				}
				statuses (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					status
				}
				scores (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					score
				}
				lengths (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					length
				}
				releaseYears (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					releaseYear
				}
				startYears (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					startYear
				}
				genres (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					genre
				}
				tags (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					tag {
            id
						name
						description
						category
					}
				}
				countries (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					country
				}
				staff (sort:[COUNT_DESC]) {
					${mangaStatFrag}
					staff {
						id
						languageV2
						image {
							large
						}
						isFavourite
						favourites
						name {
							userPreferred
						}
					}
				}
			}
		}
	}
}
`; 