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

export const DELETE_MEDIA_ENTRY = `
mutation ($id: Int) {
    DeleteMediaListEntry (id:$id) {
      deleted
    }
  }
`;