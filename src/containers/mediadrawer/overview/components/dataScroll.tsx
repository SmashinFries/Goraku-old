import { View, ScrollView, Pressable, Text } from 'react-native';
import { AniMalType, MediaCountries } from '../../../../Api/types';
import { ThemeColors } from '../../../../Components/types';
import { getDate, getMalScoreColor, getScoreColor, handleCopy } from '../../../../utils';

type MetaDataTileProps = {
    header: string;
    text: string;
    textColor: string;
    titleColor?: string;
}
const MetaDataItem = ({ header, text, textColor, titleColor }:MetaDataTileProps) => {
    if (text === '?' || text === null || text === undefined) return null;
    return (
        <Pressable onLongPress={() => handleCopy(text)} style={{ flex: 1, justifyContent: 'center', marginHorizontal:10, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: titleColor ?? textColor, fontSize: 16 }}>{header}</Text>
            <Text style={{ color: textColor, textTransform:'capitalize'}}>{(text !== undefined && text !== null) ? text : '?'}</Text>
        </Pressable>
    );
}

const getOrigin = (countryCode:MediaCountries) => {
    console.log(countryCode);
    if (countryCode === 'JP') return('🇯🇵');
    if (countryCode === 'KR') return('🇰🇷');
    if (countryCode === 'CN') return('🇨🇳');
    if (countryCode === 'TW') return('🇹🇼');
    return null;
}

type DataTileProps = {
    data: AniMalType;
    colors: ThemeColors;
}
const AnimeDataTile = ({data, colors}:DataTileProps) => {
    const popularRank = (data.anilist.rankings !== null) ? data.anilist.rankings.filter((val) => {
        if (val.allTime === true && val.type === 'POPULAR') {
            return val.rank;
        } else {
            return null;
        }
    }) : [];
    const ratingRank = (data.anilist.rankings !== null) ? data.anilist.rankings.filter((val) => {
        if (val.allTime === true && val.type === 'RATED') {
            return val.rank;
        } else {
            return null;
        }
    }) : [];

    return (
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 15, marginHorizontal: 10, paddingVertical: 10, justifyContent: 'space-evenly', backgroundColor: colors.card, borderRadius: 12, borderWidth: .5 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(data.anilist.source) ? <MetaDataItem header='Source' text={data.anilist.source?.replace('_', ' ')} textColor={colors.text} /> : null}
                <MetaDataItem header='Episodes' text={data.anilist.episodes?.toString()} textColor={colors.text} />
                {(data.anilist.duration) ? <MetaDataItem header='Duration' text={data.anilist.duration.toString() + ' min'} textColor={colors.text} /> : null}
                {(data.mal.data) ? <MetaDataItem header='Date' text={data.mal.data.aired.string} textColor={colors.text} /> : null}
                {(data.anilist.season) ? <MetaDataItem header='Season' text={data.anilist.season + ' ' + data.anilist.seasonYear} textColor={colors.text} titleColor={colors.text} /> : null}
                <MetaDataItem header='Average Score' text={data.anilist.averageScore?.toString()} textColor={getScoreColor(data.anilist.averageScore ?? null)} titleColor={colors.text} />
                <MetaDataItem header='Mean Score' text={data.anilist.meanScore?.toString()} textColor={getScoreColor(data.anilist.meanScore ?? null)} titleColor={colors.text} />
                <MetaDataItem header='MAL Score' text={data.mal.data?.score?.toString()} textColor={getMalScoreColor(data.mal.data?.score ?? null)} titleColor={colors.text} />
                <MetaDataItem header='Origin' text={getOrigin(data.anilist.countryOfOrigin)} textColor={colors.text} />
                <MetaDataItem header='Rating Rank' text={(ratingRank?.length > 0) ? ratingRank[0].rank.toString() : null} textColor={colors.text} />
                <MetaDataItem header='Popularity Rank' text={(popularRank?.length > 0) ? popularRank[0].rank.toString() : null} textColor={colors.text} />
                <MetaDataItem header='Favorites' text={data.anilist.favourites?.toString()} textColor={colors.text} />
                <MetaDataItem header='English' text={data.anilist.title.english} textColor={colors.text} />
                <MetaDataItem header='Romaji' text={data.anilist.title.romaji} textColor={colors.text} />
                <MetaDataItem header='Native' text={data.anilist.title.native} textColor={colors.text} />
            </ScrollView>
        </View>
    );
}

const MangaDataTile = ({data, colors}:DataTileProps) => {
    const popularRank = (data.anilist.rankings !== null) ? data.anilist.rankings.filter((val) => {
        if (val.allTime === true && val.type === 'POPULAR') {
            return val.rank;
        } else {
            return null;
        }
    }) : [];

    const startDate = (data.mal.data?.published?.string) ? 
        data.mal.data.published.string 
        : (data.anilist.startDate.month) ? getDate(data.anilist.startDate): null;

    const endDate = (data.mal.data?.published?.string) ?
        null
        : (data.anilist.endDate.month) ? getDate(data.anilist.endDate) : null;

    return (
            <View style={{ flex: 1, flexDirection:'row', marginTop: 15, marginHorizontal: 10, paddingVertical:10, justifyContent: 'space-evenly', backgroundColor: colors.card, borderRadius: 12, borderWidth: .5 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(data.anilist.source) ? <MetaDataItem header='Source' text={data.anilist.source?.replace('_', ' ')} textColor={colors.text} /> : null}
                    {(startDate) ? <MetaDataItem header={(!endDate) ? 'Date' : 'Start Date'} text={startDate} textColor={colors.text} /> : null}
                    {(endDate) ? <MetaDataItem header='End Date' text={endDate} textColor={colors.text} /> : null}
                    {data.anilist.chapters && <MetaDataItem header='Chapters' text={data.anilist.chapters?.toString()} textColor={colors.text} />}
                    {data.anilist.volumes && <MetaDataItem header='Volumes' text={data.anilist.volumes?.toString()} textColor={colors.text} />}
                    {data.anilist.averageScore && <MetaDataItem header='Average Score' text={data.anilist.averageScore?.toString()} textColor={getScoreColor(data.anilist.averageScore ?? null)} titleColor={colors.text} />}
                    {data.anilist.meanScore && <MetaDataItem header='Mean Score' text={data.anilist.meanScore?.toString()} textColor={getScoreColor(data.anilist.meanScore ?? null)} titleColor={colors.text} />}
                    <MetaDataItem header='MAL Score' text={data.mal.data?.scored?.toString()} textColor={getMalScoreColor(data.mal.data?.scored ?? null)} titleColor={colors.text} />
                    <MetaDataItem header='Origin' text={getOrigin(data.anilist.countryOfOrigin)} textColor={colors.text} />
                    <MetaDataItem header='Popularity Rank' text={popularRank[0]?.rank?.toString()} textColor={colors.text} />
                    <MetaDataItem header='Favorites' text={data.anilist.favourites?.toString()} textColor={colors.text} /> 
                    <MetaDataItem header='English' text={data.anilist.title?.english} textColor={colors.text} />
                    <MetaDataItem header='Romaji' text={data.anilist.title?.romaji} textColor={colors.text} />
                    <MetaDataItem header='Native' text={data.anilist.title?.native} textColor={colors.text} />
                </ScrollView>
            </View>
    );
}

type MediaInfoProps = {
    type: 'ANIME' | 'MANGA';
    data: AniMalType;
    colors: ThemeColors;
}
const MediaInformation = ({type, data, colors}:MediaInfoProps) => {
    if (type === 'ANIME') return <AnimeDataTile data={data} colors={colors} />;
    if (type === 'MANGA') return <MangaDataTile data={data} colors={colors} />;
}

export default MediaInformation;