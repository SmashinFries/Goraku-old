import { MediaTileType, UserFavCharNode } from "../../Api/types";

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

export const uniqueNodes = (content: UserFavCharNode[] | any) => {
    const setObj = new Set();
    const result = content.reduce((acc, item) => {
        if (!setObj.has(item.node.id)) {
            setObj.add(item.node.id);
            acc.push(item);
        }
        return acc;
    }, []);
    return result;
}