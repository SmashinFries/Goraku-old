export const toggleLike_M = `
mutation ($animeId: Int, $mangaId: Int, $characterId: Int, $staffId: Int, $studioId: Int) {
	ToggleFavourite (animeId:$animeId, mangaId:$mangaId, characterId:$characterId staffId:$staffId, studioId:$studioId) {
		__typename
	}
}
`

export const quickAdd_M = `
mutation ($id: Int, $mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int, $progressVolumes: Int, $repeat: Int, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput, $notes: String) {
	SaveMediaListEntry (id: $id, mediaId:$mediaId, status:$status, score:$score, progress:$progress, progressVolumes:$progressVolumes, repeat:$repeat, startedAt:$startedAt, completedAt:$completedAt, notes:$notes) {
        id
		status
		score
		progress
		repeat
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
		notes
	}
}
`;

export const quickRemove_M = `
mutation ($id: Int) {
	DeleteMediaListEntry (id:$id) {
		deleted
	}
}
`;

export const changeLanguage_M = `
mutation ($titleLanguage: UserTitleLanguage, $staffNameLanguage: UserStaffNameLanguage) {
	UpdateUser (titleLanguage:$titleLanguage, staffNameLanguage:$staffNameLanguage) {
		id
	}
}
`;

export const changeNotifications_M = `
mutation ($notificationOptions: [NotificationOptionInput]) {
	UpdateUser (notificationOptions:$notificationOptions) {
		id
	}
}
`;

export const changeAdultContent_M = `
mutation ($displayNSFW: Boolean) {
	UpdateUser (displayAdultContent:$displayNSFW) {
		id
	}
}
`;

export const saveRecommendation_M = `
mutation ($mediaId: Int, $mediaRecommendationId: Int, $rating: RecommendationRating) {
	SaveRecommendation (mediaId:$mediaId, mediaRecommendationId: $mediaRecommendationId, rating: $rating) {
		rating
		userRating
	}
}
`;

export const removeActivity_M = `
mutation ($id: Int) {
	DeleteActivity (id:$id) {
		deleted
	}
}
`;