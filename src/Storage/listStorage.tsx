import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

type ListLayoutType = 'compact' | 'list' | 'none';
type TagListType = {
    statusTag: boolean;
    progressTag: boolean;
}
 
const TagLayoutContext = createContext({tags:{statusTag: true, progressTag: true}, listLayout:'compact', updateLayout:(newLayout: ListLayoutType) => {}, updateTagLayout:(newTagLayout: TagListType) => {}});
export const TagLayoutProvider = ({children}) => {
    const [tagLayout, setTagLayout] = useState<TagListType>({statusTag: true, progressTag: true});
    const [listLayout, setListLayout] = useState<ListLayoutType>();

    const updateTagLayout = (newTagLayout: TagListType) => {
        AsyncStorage.setItem('@tag_list_layout', JSON.stringify(newTagLayout)).then(() => {setTagLayout(newTagLayout);});
    }

    const updateLayout = (newLayout: ListLayoutType) => {
        AsyncStorage.setItem('@list_layout', newLayout).then(() => {setListLayout(newLayout);});
    }

    useEffect(() => {
        AsyncStorage.getItem('@list_layout').then(value => {
            if (value !== listLayout && value !== null) {
                // @ts-ignore
                setListLayout(value);
            } else if (!value) {
                updateLayout('compact');
            }
        }).catch(error => console.log(error));

        AsyncStorage.getItem('@tag_list_layout').then(value => {
            const parsed:TagListType = JSON.parse(value);
            (parsed === null) && updateTagLayout({statusTag: true, progressTag: true});
            if (parsed){
                if ((parsed.progressTag !== tagLayout.progressTag || parsed.statusTag !== tagLayout.statusTag)) {
                    setTagLayout(parsed);
                }
            } else {
                setTagLayout({statusTag: true, progressTag: true})
            }
        }).catch(error => console.log(error));
    },[]);

    return(
        <TagLayoutContext.Provider value={{tags: tagLayout, listLayout:listLayout, updateLayout:updateLayout, updateTagLayout:updateTagLayout}}>
            {children}
        </TagLayoutContext.Provider>
    );
}

const ListSearchContext = createContext({search:'', updateSearch:(search:string) => {}});
export const ListSearchProvider = ({children}) => {
    const [search, setSearch] = useState<string>('');

    const updateSearch = (newSearch: string) => {
        setSearch(newSearch);
    }

    return(
        <ListSearchContext.Provider value={{search: search, updateSearch:updateSearch}}>
            {children}
        </ListSearchContext.Provider>
    );
}

export const useTagLayout = () => useContext(TagLayoutContext);
export const useListSearch = () => useContext(ListSearchContext);