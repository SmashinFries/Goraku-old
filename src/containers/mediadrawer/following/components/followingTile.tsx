import { Theme } from "@react-navigation/native";
import { openURL } from "expo-linking";
import React, { useState } from "react";
import { Avatar, Card, IconButton, Menu } from "react-native-paper";
import { FollowingMediaList } from "../../../../Api/types";

const FollowingTile = ({item, colors}:{item:FollowingMediaList, colors:Theme}) => {
    const [visible, setVisible] = useState<boolean>(false);
    const getProgress = () => {
        if (item.media.type === 'ANIME') {
            return `${item.progress}/${item.media.episodes ?? '?'}`;
        } else if (item.media.format === 'NOVEL') {
            return `${item.progressVolumes}/${item.media.volumes ?? '?'}`;
        } else if (item.media.type === 'MANGA' && item.media.format !== 'NOVEL') {
            return `${item.progress}/${item.media.chapters ?? '?'}`;
        }
    }
    const getSubtitles = () => {
        if (item.status === 'PLANNING') {
            return `${item.status}`
        } else {
            return `${item.status}・${getProgress()}\nScore: ${item.score}/10`
        }
    }

    const rightIcon = (props) => {
        return (
            <Menu 
                visible={visible} 
                onDismiss={() => setVisible(false)}
                contentStyle={{backgroundColor:colors.colors.card}}
                anchor={<IconButton {...props} icon="dots-vertical" color={colors.colors.text} onPress={() => setVisible(true)} />}>
                    <Menu.Item title='View Profile' titleStyle={{color:colors.colors.text}} icon={() => <IconButton icon='account' color={colors.colors.text} />}  onPress={() => openURL(item.user.siteUrl)} />
                    {/* <Menu.Item title='Unfollow' titleStyle={{color:colors.colors.text}} icon={() => <IconButton icon='account-cancel' color={'red'} />} /> */}
            </Menu>
        );
    }

    return(
        <Card.Title
            style={{backgroundColor:(colors.dark) ? colors.colors.background : colors.colors.card}}
            title={item.user.name}
            titleStyle={{color:colors.colors.text}}
            subtitle={getSubtitles()}
            subtitleStyle={{textTransform:'capitalize', color:colors.colors.text}}
            subtitleNumberOfLines={2}
            left={(props) => <Avatar.Image {...props} source={{uri:item.user.avatar.large}} />}
            right={rightIcon}
        />
    );
}

export default FollowingTile;