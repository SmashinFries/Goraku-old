import { MediaTileType } from "../../Api/types";

export const uniqueItems = (content: MediaTileType[]) => {
    const setObj = new Set();
    const result = content.reduce((acc, item) => {
        if (!setObj.has(item.id)) {
            setObj.add(item.id);
            acc.push(item);
        }
        return acc;
    }, []);
    return result;
}