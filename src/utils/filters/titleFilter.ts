export const dataTitleFilter = (data:any[], search:string) => {
    if (search.length === 0) return data;
    return data.filter((item, index) => {
        const userPreferred = (item.node) ? item.node.title.userPreferred : item.media.title.userPreferred;
        const english = (item.node) ? item.node.title.english : item.media.title.english;
        const romaji = (item.node) ? item.node.title.romaji : item.media.title.romaji;
        const native = (item.node) ? item.node.title.native : item.media.title.native;
        const synonyms:string[] = (item.node) ? item.node.synonyms : item.media.synonyms;

        if (userPreferred.toLowerCase().includes(search.toLowerCase())) {
            return item;
        } else if (english?.toLowerCase().includes(search.toLowerCase())) {
            return item;
        } else if (romaji?.toLowerCase().includes(search.toLowerCase())) {
            return item;
        } else if (native?.toLowerCase().includes(search.toLowerCase())) {
            return item;
        } else if (synonyms?.some((value, index) => value.includes(search))) {
            return item;
        }
    });
}