import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { getTagData } from "../../../Api";
import { TagArrangedType } from "../../../Api/types";
import { FilterRef } from "../../types";
import { SearchBar, SortFilterUI } from "../../../Components";
import { ActiveTagItem, FilterGenre, FilterTags } from "../../../Components/buttons/filterTag";
import { getColor } from "../../../utils";
import { ThemeColors } from "../../../Components/types";
import { useAnilistAuth } from "../../../auth/auth";

interface Props {
    handleSearch: () => void;
    searchParams: FilterRef;
    colors: ThemeColors;
    dark: boolean;
}

interface SelectedType {
    name: string;
    color: string;
    status: string;
    type: string;
}

const retainTags = (searchParams:FilterRef):SelectedType[] => {
    const selectedTags:SelectedType[] = [];
    for (let tag in searchParams.tagsIn) {
        selectedTags.push({name: searchParams.tagsIn[tag], color: getColor('ACTIVE'), status:'ACTIVE', type:'TAG'});
    }
    for (let tag in searchParams.tagsNotIn) {
        selectedTags.push({name: searchParams.tagsNotIn[tag], color: getColor('DISABLED'), status:'DISABLED', type:'TAG'});
    }
    for (let genre in searchParams.genresIn) {
        selectedTags.push({name: searchParams.genresIn[genre], color: getColor('ACTIVE'), status:'ACTIVE', type:'GENRE'});
    }
    for (let genre in searchParams.genresNotIn) {
        selectedTags.push({name: searchParams.genresNotIn[genre], color: getColor('DISABLED'), status:'DISABLED', type:'GENRE'});
    }
    return selectedTags;
}

export const FilterUI = ({handleSearch, searchParams, colors, dark}:Props) => {
    const [filters, setFilters] = useState<TagArrangedType>({ tags: {}, genres: [] });
    const [tagList, setTagList] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<SelectedType[]>([]);
    const [type, setType] = useState(searchParams.type);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const {isAuth} = useAnilistAuth();

    const fetchTags = async () => {
        const res = await getTagData();
        return res;
    }

    const setColor = (text: string) => {
        const index = selectedTags.findIndex(tag => tag.name === text);
        if (index > -1) {
            return selectedTags[index].color;
        } else {
            return colors.primary;
        }
    }

    const handleTagPress = (text: string, type:string) => {
        const tempArray = [...selectedTags];
        const index = tempArray.findIndex(tag => tag.name === text);
        if (index > -1 && tempArray[index].status === 'DISABLED') {
            tempArray.splice(index, 1);
            setSelectedTags(tempArray);
            switch (type) {
                case 'GENRE':
                    const newGeneres = searchParams.genresNotIn;
                    newGeneres.splice(searchParams.genresNotIn.indexOf(text), 1);
                    searchParams.genresNotIn = newGeneres;
                    break;
                case 'TAG':
                    const newTags = searchParams.tagsNotIn
                    newTags.splice(searchParams.tagsNotIn.indexOf(text), 1);
                    searchParams.tagsNotIn = newTags;
                    break;
            }
        } else if (index === -1) {
            tempArray.push({ name: text, color: getColor('ACTIVE'), status: 'ACTIVE', type:type });
            setSelectedTags(tempArray);
            switch (type) {
                case 'GENRE':
                    (searchParams.genresIn === undefined) ?
                        searchParams.genresIn = [text] :
                        searchParams.genresIn = [...searchParams.genresIn, text];
                    break;
                case 'TAG':
                    (searchParams.tagsIn === undefined) ?
                        searchParams.tagsIn = [text] :
                        searchParams.tagsIn = [...searchParams.tagsIn, text];
                    break;
            }
        } else if (index > -1 && tempArray[index].status === 'ACTIVE') {
            tempArray[index].status = 'DISABLED';
            tempArray[index].color = getColor('DISABLED');
            setSelectedTags(tempArray);
            switch (type) {
                case 'GENRE':
                    if (searchParams.genresNotIn === undefined) {
                        searchParams.genresNotIn = [text];
                        searchParams.genresIn.splice(searchParams.genresIn.indexOf(text), 1)
                    } else {
                        searchParams.genresNotIn = [...searchParams.genresNotIn, text];
                        searchParams.genresIn.splice(searchParams.genresIn.indexOf(text), 1);
                    }
                    break;
                case 'TAG':
                    if (searchParams.tagsNotIn === undefined) {
                        searchParams.tagsNotIn = [text];
                        searchParams.tagsIn.splice(searchParams.tagsIn.indexOf(text), 1);
                    } else {
                        searchParams.tagsNotIn = [...searchParams.tagsNotIn, text];
                        searchParams.tagsIn.splice(searchParams.tagsIn.indexOf(text), 1);
                    }
                    break;
            }
        }
    }

    useEffect(() => {
        const oldSelectedTags = retainTags(searchParams);
        setSelectedTags(oldSelectedTags);
        if (tagList.length === 0) {
            fetchTags().then(res => {
                setFilters(res);
                const sortedtags = Object.keys(res.tags).sort((a, b) => a.localeCompare(b));
                setTagList(sortedtags);
            });
        }
        setLoading(false);
    }, []);

    if (loading) return (
        <View style={{ flex: 1, justifyContent: 'center', height: 300, alignItems: 'center' }}>
            <ActivityIndicator color={colors.primary} size={'large'} />
        </View>);

    return(
        <View style={{ flex: 1, backgroundColor:(dark) ? colors.background : (dark) ? colors.background : colors.card }}>
            <View style={{height:10}} />
            <SearchBar searchParams={searchParams} colors={colors} dark={dark} searchPress={() => handleSearch()} />
            <Pressable onPress={() => handleSearch()} android_ripple={{color:colors.primary}} style={{borderWidth:1, borderRadius:12, borderColor:colors.primary, justifyContent:'center', marginTop:10, width:'85%', alignSelf:'center', height:35}}>
                <Text style={{color:colors.text, textAlign:'center', fontSize:16}}>Search</Text>
            </Pressable>
            <SortFilterUI type={searchParams.type} setType={setType} isAuth={isAuth} searchParams={searchParams} colors={colors} dark={dark} />
            { (type !== 'CHARACTERS' && type !== 'STAFF') ? <View style={{paddingHorizontal:10}}>
                <Text style={{ fontSize: 38, fontWeight: 'bold', textAlign:'center', color:colors.text }}>Tags</Text>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {selectedTags.length > 0 && selectedTags.map((item, idx) =>
                        <ActiveTagItem 
                            key={idx}
                            item={item}
                            onPress={handleTagPress}
                        />
                    )}
                </View>
                {/* SearchBar */}
                <View style={{justifyContent:'center'}}>
                    <TextInput
                        theme={{colors: {primary:colors.primary, background:colors.background, text:colors.text}}}
                        onChangeText={(txt) => setSearch(txt)}
                        placeholder="Search Tags..."
                        placeholderTextColor={(dark) && colors.text}
                        underlineColor={colors.primary}
                        value={search}
                        style={{ height: 40, width: '80%', marginVertical: 10, fontSize: 16, borderRadius: 8, paddingHorizontal: 10, alignSelf: 'center' }}
                    />
                    <Ionicons name="close" size={18} color={colors.text} onPress={() => setSearch('')} style={{position:'absolute', right:50}} />
                </View>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color:colors.text }}>Genres</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        (search.length === 0) ?
                            filters.genres.map((genre, idx) => 
                                <FilterGenre 
                                    key={idx} 
                                    onPress={() => {handleTagPress(genre, 'GENRE')}} 
                                    item={{ name: genre,color: setColor(genre) }}
                                />)
                            : filters.genres.map((genre, idx) => (genre.toLowerCase().includes(search.toLowerCase())) ? 
                            <FilterGenre 
                                key={idx}
                                onPress={() => handleTagPress(genre, 'GENRE')} 
                                item={{ name: genre, color: setColor(genre) }} 
                            /> 
                            :null)
                    }
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        (search.length === 0) ?
                            tagList.map((item, idx) =>
                                <FilterTags 
                                    key={idx}
                                    category={item}
                                    onPress={handleTagPress}
                                    tags={filters.tags}
                                    setColor={setColor}
                                    colors={colors}
                                />
                            )
                            : tagList.map((item, idx) => (
                                filters.tags[item].some(tag => tag.name.toLowerCase().includes(search.toLowerCase()))) ?
                                <FilterTags 
                                    key={idx} 
                                    category={item} 
                                    onPress={handleTagPress} 
                                    tags={filters.tags} 
                                    setColor={setColor} 
                                    search={search}
                                    colors={colors}
                                />
                            : null)
                    }
                </View>
            </View> : null}
        </View>
    );
}