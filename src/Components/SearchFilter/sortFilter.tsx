import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { FilterRef } from "../../containers/types";
import { filterSet } from "../../utils/filters/filterChange";
import { ThemeColors } from "../types";
import { SortCheckBox } from "./sortCheckBox";
import { SortDropDown } from "./sortDropdown";
import { SliderFilter } from "./sortSlider";
import { countryOrigins, formats_anime, formats_manga, onList, sort_anime, sort_manga, status_anime, status_manga, streaming_services } from "./sortDict";

const getKeyValue = (obj, value) => {
    return Object.keys(obj).find(key => obj[key] === value);
}

const checkUndefined = (value:string|string[]) => {
    const type = typeof value;
    switch (type) {
        case 'string':
            return value;
        case 'object':
            if (value.length === 1) {
                return value[0];
            } else {
                return '';
            }
        case 'undefined':
            return '';
    }
}

interface SortFilterParams {
    type: 'ANIME' | 'MANGA' | 'NOVEL' | 'CHARACTERS' | 'STAFF';
    searchParams: FilterRef;
    colors: ThemeColors;
    dark: boolean;
    isAuth: boolean;
    setType: any;
}
const SortFilterUI = ({ searchParams, colors, dark, isAuth, setType }:SortFilterParams) => {
    const [checkBoxState, setCheckBoxState] = useState({
        hideList: (searchParams.onList !== undefined) ? (searchParams.onList === false) ? true : false : false,
        onlyShowList: (searchParams.onList !== undefined) ? (searchParams.onList === true) ? true : false : false,
    });
    const [dropDownState, setDropDownState] = useState({
        format: searchParams.format, 
        stream: checkUndefined(searchParams.licensedBy_in), 
        country: checkUndefined(searchParams.country), 
        status: checkUndefined(searchParams.status),
        sort: searchParams.sort,
        type: searchParams.type,
    });
    const [sliderState, setSliderState] = useState({
        score: (searchParams.averageScore[0] === undefined) ? [0, 100] : searchParams.averageScore,
        years: (searchParams.year[0] === undefined) ? [1970, 2023] : searchParams.year, 
        episodes: (dropDownState.type === 'ANIME') ? [0, 150] : [0, 50], 
        chapters: (searchParams.chapters[0] === undefined) ? [0, 500] : searchParams.chapters,
    });

    const compareArrays = (state=[], defaultRange=[]) => {
        if (state[0] === defaultRange[0] && state[1] === defaultRange[1]) {
            return [undefined, undefined];
        } else {
            return state;
        }
    }

    const handleTypeChange = (type:'ANIME'|'MANGA' | 'NOVEL' | 'CHARACTERS' | 'STAFF') => {
        switch (type) {
            case 'ANIME':
                setDropDownState({...dropDownState, type: 'ANIME', format: undefined});
                setType('ANIME');
                break;
            case 'MANGA':
                setDropDownState({...dropDownState, type: 'MANGA', format: 'Manga'});
                setType('MANGA');
                break;
            case 'CHARACTERS':
                setDropDownState({...dropDownState, type:'CHARACTERS'});
                setType('CHARACTERS');
                break;
            case 'STAFF':
                setDropDownState({...dropDownState, type:'STAFF'});
                setType('STAFF');
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (checkBoxState.hideList === false && checkBoxState.onlyShowList === false) {
            searchParams.onList = undefined;
        } else if (checkBoxState.hideList === true) {
            searchParams.onList = !checkBoxState.hideList;
        } else if (checkBoxState.onlyShowList === true) {
            searchParams.onList = checkBoxState.onlyShowList;
        }
    },[checkBoxState]);

    useEffect(() => {
        const form:string = filterSet(searchParams.format, dropDownState.format);
        const stream:string = filterSet(searchParams.licensedBy_in, dropDownState.stream);
        const country = filterSet(searchParams.country, dropDownState.country);
        const stat = filterSet(searchParams.status, dropDownState.status);
        const sort = filterSet(searchParams.sort, dropDownState.sort);
        searchParams.format = (form !== undefined) ? form.toUpperCase() : form;
        searchParams.licensedBy_in = [stream];
        searchParams.country = country;
        searchParams.status = stat;
        searchParams.sort = sort;
        searchParams.type = (dropDownState.type === 'NOVEL') ? 'MANGA' : dropDownState.type;
        // searchParams.type = (dropDownState.type === 'ANIME') ? 'ANIME' : (dropDownState.type === 'CHARACTERS') ? 'CHARACTERS' : (dropDownState.type === 'STAFF') ? 'STAFF' : 'MANGA';
    }, [dropDownState]);

    useEffect(() => {
        searchParams.averageScore = compareArrays(sliderState.score, [0, 100]);
        searchParams.year = compareArrays(sliderState.years, [1970, 2023]);
        searchParams.episodes = compareArrays(sliderState.episodes, (dropDownState.type === 'ANIME') ? [0, 150] : [0, 50]);
        searchParams.chapters = compareArrays(sliderState.chapters, [0, 500]);
    },[sliderState]);

    return (
        <View style={{ marginHorizontal: 5, paddingBottom:35 }}>
            <View style={{paddingBottom:(dropDownState.type === 'CHARACTERS' || dropDownState.type === 'STAFF') ? 525 : 0}}>
                {/* CheckBoxes */}
                {(dropDownState.type !== 'CHARACTERS' && dropDownState.type !== 'STAFF' && isAuth) && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                    <SortCheckBox
                        value={checkBoxState.hideList}
                        onValueChange={(value) => { setCheckBoxState({...checkBoxState, hideList: value}) }}
                        text={onList.false}
                        color={colors.primary}
                        textColor={colors.text}
                        disabled={checkBoxState.onlyShowList}
                    />
                    <SortCheckBox
                        value={checkBoxState.onlyShowList}
                        onValueChange={(value) => { setCheckBoxState({...checkBoxState, onlyShowList: value}) }}
                        text={onList.true}
                        color={colors.primary}
                        textColor={colors.text}
                        disabled={checkBoxState.hideList}
                    />
                </View>}

                {/* Dropdowns */}
                <SortDropDown
                    data={['ANIME', 'MANGA', 'CHARACTERS', 'STAFF']}
                    onSelect={(text:'ANIME'|'MANGA'|'CHARACTERS'|'STAFF') => { handleTypeChange(text) }}
                    header='Type'
                    defaultText={dropDownState.type}
                    textColor={colors.text}
                    buttonColor={colors.card}
                />
                { (dropDownState.type !== 'CHARACTERS' && dropDownState.type !== 'STAFF') && <View>
                <SortDropDown
                    data={Object.keys((dropDownState.type === 'ANIME') ? sort_anime : sort_manga)}
                    onSelect={(text) => { setDropDownState({...dropDownState, sort: (dropDownState.type === 'ANIME') ? sort_anime[text] : sort_manga[text]}) }}
                    header='Sort'
                    defaultText={getKeyValue(sort_anime, dropDownState.sort)}
                    textColor={colors.text}
                    buttonColor={colors.card}
                />
                <SortDropDown
                    data={Object.keys((dropDownState.type === 'ANIME') ? formats_anime : formats_manga)}
                    onSelect={(text) => { setDropDownState({...dropDownState, format: (dropDownState.type === 'ANIME') ? formats_anime[text] : formats_manga[text]}) }}
                    header='Format'
                    textColor={colors.text}
                    buttonColor={colors.card}
                    defaultText={(dropDownState.type === 'MANGA' && dropDownState.format === '') ? 
                    'Manga' : 
                    getKeyValue((dropDownState.type === 'ANIME') ? formats_anime : formats_manga, dropDownState.format)}
                />
                {(dropDownState.type === 'ANIME') ?
                    <SortDropDown
                        data={Object.keys(streaming_services)}
                        onSelect={(text) => { setDropDownState({...dropDownState, stream: streaming_services[text]}) }}
                        header='Streaming Services'
                        defaultText={getKeyValue(streaming_services, dropDownState.stream)}
                        textColor={colors.text}
                        buttonColor={colors.card}
                    />
                    : null}
                <SortDropDown
                    data={Object.keys(countryOrigins)}
                    onSelect={(text) => { setDropDownState({...dropDownState, country: countryOrigins[text]}) }}
                    header='Country'
                    defaultText={getKeyValue(countryOrigins, dropDownState.country)}
                    textColor={colors.text}
                    buttonColor={colors.card}
                />
                <SortDropDown
                    data={Object.keys((dropDownState.type === 'ANIME') ? status_anime : status_manga)}
                    onSelect={(text) => { setDropDownState({...dropDownState, status: (dropDownState.type === 'ANIME') ? status_anime[text] : status_manga[text]}) }}
                    header='Status'
                    defaultText={getKeyValue((dropDownState.type === 'ANIME') ? status_anime : status_manga, dropDownState.status)}
                    textColor={colors.text}
                    buttonColor={colors.card}
                />

                {/* Sliders */}
                <SliderFilter 
                    header='Average Score'
                    values={sliderState.score}
                    range={[0, 100]}
                    activeColor={colors.primary}
                    markerColor={colors.border}
                    onValueChange={(res) => { setSliderState({...sliderState, score: res}) }}
                    textColor={colors.text}
                />
                <SliderFilter
                    header='Year Range'
                    values={sliderState.years}
                    range={[1970, 2023]}
                    activeColor={colors.primary}
                    markerColor={colors.border}
                    onValueChange={(res) => setSliderState({...sliderState, years: res}) }
                    textColor={colors.text}
                />
                {(dropDownState.type === 'ANIME') ? 
                <SliderFilter
                    header={'Episodes'}
                    values={sliderState.episodes}
                    range={[0, 150]}
                    activeColor={colors.primary}
                    markerColor={colors.border}
                    onValueChange={(res) => setSliderState({...sliderState, episodes: res})}
                    textColor={colors.text}
                /> : 
                <SliderFilter
                    header={'Volumes'}
                    values={sliderState.episodes}
                    range={[0, 50]}
                    activeColor={colors.primary}
                    markerColor={colors.border}
                    onValueChange={(res) => setSliderState({...sliderState, episodes: res})}
                    textColor={colors.text}
                />
                }
                {(dropDownState.type === 'MANGA') ? 
                    <SliderFilter
                        header={'Chapters'}
                        values={sliderState.chapters}
                        range={[0, 500]}
                        activeColor={colors.primary}
                        markerColor={colors.border}
                        onValueChange={(res) => setSliderState({...sliderState, chapters: res})}
                        textColor={colors.text}
                    />
                : null}
                </View>}
            </View>
        </View>
    );
}

export default SortFilterUI;