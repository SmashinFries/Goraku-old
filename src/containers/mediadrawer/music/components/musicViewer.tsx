import { Video } from "expo-av";
import { openURL } from "expo-linking";
import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import { AnimeThemes } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import { handleCopy, _openBrowserUrl } from "../../../../utils";

const getWikiURL = (title:string, slug:string, tags?:string, version?:number|null) => {
    console.log(version);
    if (tags && version) return `https://staging.animethemes.moe/wiki/anime/${title}/${slug}-${tags}v${version}`;
    if (tags && !version) return `https://staging.animethemes.moe/wiki/anime/${title}/${slug}-${tags}`;
    if (!tags && version) return `https://staging.animethemes.moe/wiki/anime/${title}/${slug}v${version}`;
    if (!tags && !version) return `https://staging.animethemes.moe/wiki/anime/${title}/${slug}`;
};

type ViewerProps = {
    track: AnimeThemes;
    animeTitle: string;
    colors: ThemeColors;
}
const MusicViewer = ({ track, animeTitle, colors }:ViewerProps) => {
    const openLink = (link:string) => _openBrowserUrl(link, colors.primary, colors.text);
    const [viewVid, setViewVid] = useState(false);
    return(
        <View key={track.id} style={{ flex: 1, width: '95%', padding: 10, marginVertical: 15, alignItems: 'center', justifyContent: 'space-between', borderWidth: 0, borderRadius: 0, backgroundColor: 'transparent' }}>
            <Card style={{width:'100%', backgroundColor:colors.primary}}>
                <Card.Title 
                    right={props => (track.song.artists[0]?.name) && <IconButton {...props}icon="account" onPress={() => openLink(`https://staging.animethemes.moe/wiki/artist/${track.song.artists[0].slug}`)} />} 
                    title={<Text onLongPress={() => handleCopy(track.song.title)}>{track.slug + '・' + track.song.title}</Text>} 
                    titleNumberOfLines={3}
                    subtitle={(track.song.artists[0]?.name) ? 'By ' + track.song.artists[0]?.name : undefined} 
                />
                <Card.Content style={{backgroundColor:colors.card}}>
                    {track.animethemeentries.map((entry, index) => 
                        <Card.Title
                            key={index}
                            title={'V' + (entry.version ?? '1')}
                            titleNumberOfLines={3}
                            titleStyle={{color:colors.text}}
                            subtitle={`${(entry.episodes) ? 'Episodes ' + track.animethemeentries[0].episodes : ''}${(track.animethemeentries[0].episodes?.charAt(track.animethemeentries[0].episodes.length -1) === '-') ? '?' : ''}`}
                            subtitleNumberOfLines={2}
                            subtitleStyle={{color:colors.text}}
                            right={(props) =>
                                <IconButton {...props} icon="music" color={colors.text} onPress={() => openLink(getWikiURL(animeTitle, track.slug, entry.videos[index]?.tags, (entry.version) ? ((entry.version > 1) ? entry.version : null) : null))} />
                            }
                        />
                    )}
                    {(viewVid) ? 
                    <Video onError={() => Alert.alert('Video could not load!')} source={{uri:track.animethemeentries[track.animethemeentries.length - 1].videos[0].link}} useNativeControls resizeMode="contain" style={{height:200, width:'100%'}} shouldPlay={false} />
                    : <Button onPress={() => setViewVid(true)}>View Video</Button>
                    }
                    
                </Card.Content>
            </Card>
        </View>
    );
}

export default MusicViewer;