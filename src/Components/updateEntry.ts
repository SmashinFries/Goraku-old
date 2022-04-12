import { updateMediaListEntry } from "../Api/anilist/anilist";

export const updateEntry = async(entryId:number, type:string, value:any) => {
    try {
        switch (type) {
            case 'status':
                const status = updateMediaListEntry(undefined, entryId, value);
                return status;
            case 'progress':
                const progress = updateMediaListEntry(undefined, entryId, undefined, undefined, value);
                return progress;
            case 'score':
                const score = updateMediaListEntry(undefined, entryId, undefined, value);
                return score;
            case 'repeat':
                const repeat = updateMediaListEntry(undefined, entryId, undefined, undefined, undefined, value);
                return repeat;
            case 'startedAt':
                const startedAt = updateMediaListEntry(undefined, entryId, undefined, undefined, undefined, undefined, value);
                return startedAt;
            case 'completedAt':
                const completedAt = updateMediaListEntry(undefined, entryId, undefined, undefined, undefined, undefined, undefined, value);
                return completedAt;
            case 'notes':
                const notes = updateMediaListEntry(undefined, entryId, undefined, undefined, undefined, undefined, undefined, undefined, value);
                return notes;
        }
        
    } catch (error) {
        console.log(error);
        return null;
    }
}