// LIST UPDATES / DELETES
export const STATUS_UPDATE = `
mutation ($mediaId: Int, $status: MediaListStatus) {
    SaveMediaListEntry (mediaId:$mediaId, status:$status) {
      status
      id
    }
  }
`;

export const PROGRESS_UPDATE = `
mutation ($mediaId: Int, $progress: Int) {
  SaveMediaListEntry (mediaId:$mediaId, progress:$progress) {
    progress
    id
  }
}
`;

export const SCORE_UPDATE = `
mutation ($mediaId: Int, $score: Float) {
  SaveMediaListEntry (mediaId:$mediaId, score:$score) {
    score
    id
  }
}
`;

export const DELETE_MEDIA_ENTRY = `
mutation ($id: Int) {
    DeleteMediaListEntry (id:$id) {
      deleted
    }
  }
`;

// CHARACTER FAVORITING
export const FAVORITE_MODIFY = `
mutation ($characterId: Int) {
  ToggleFavourite (characterId:$characterId) {
    characters {
      nodes {
        isFavourite
      }
    }
  }
}
`;


// TOGGLES
export const TOGGLE_LIKE = `
mutation ($id: Int) {
  ToggleLikeV2 (id:$id, type:ACTIVITY) {
    __typename
    ... on ListActivity {
      id
      likeCount
      isLiked
    }
    ... on TextActivity {
      id
      likeCount
      isLiked
    }
    ... on MessageActivity {
      id
      likeCount
      isLiked
    }
    ... on ActivityReply {
      id
      likeCount
      isLiked
    }
    ... on Thread {
      id
      likeCount
      isLiked
    }
    ... on ThreadComment {
      id
      likeCount
      isLiked
    }
  }
}
`;

export const TOGGLE_FOLLOW = `
mutation ($userId: Int) {
  ToggleFollow (userId: $userId) {
    isFollowing
  }
}
`;

// ACTIVITY MUTATIONS
// (The id is for updating (id of the reply - not activity). Use activityId for adding replies)
export const SAVE_ACTIVITY_REPLY = `
mutation ($id: Int, $activityId: Int) {
  SaveActivityReply(id:$id, activityId:$activityId) {
    id
    text
    likeCount
    isLiked
    createdAt
  }
}
`;

export const DELETE_ACTIVITY_REPLY = `
mutation ($id: Int) {
  DeleteActivityReply (id:$id) {
    deleted
  }
}
`;

export const DELETE_ACTIVITY = `
mutation ($id: Int) {
  DeleteActivity (id:$id) {
    deleted
  }
}
`;