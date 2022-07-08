import React from "react";
import { StyleSheet, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { ThemeColors } from "../types";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { FollowerListUser, UserBasic, UserFavChar, UserFavMed, UserFavorites } from "../../Api/types";
import { openURL } from "expo-linking";
import { convertUnixTime } from "../../utils/time/getTime";
import { handleCopy, _openBrowserUrl } from "../../utils"

type FavViewProps = {
    favourites: UserFavorites;
    colors: ThemeColors;
}
const FavoritesView = ({favourites, colors}:FavViewProps) => {
    const anime = favourites.anime.nodes[0] ?? null;
    const manga = favourites.manga.nodes[0] ?? null;
    const character = favourites.characters?.nodes[0] ?? null;
    const gender = favourites.characters?.nodes[0]?.gender ?? 'Female'

    const ImageItem = ({image, title, type}:{image:string, title:string, type:string}) => {
        return(
            <View style={{flex:1, alignItems:'center'}}>
                <Text style={{
                    color:colors.text,
                    fontWeight:'bold',
                    fontSize:18,
                    textShadowColor: colors.primary,
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 2
                    }}>
                        {type}
                </Text>
                <FastImage fallback source={{uri:image}} style={{height:120, width:80}} resizeMode='cover' />
                <Text onPress={() => handleCopy(title)} style={{textAlign:'center', color:colors.text}} numberOfLines={3}>{title}</Text>
            </View>
        );
    }

    return(
        <View style={{marginTop:20}}>
            <Text style={{color:colors.text, fontSize:20, textDecorationLine:'underline', fontWeight:'bold', textAlign:'center'}}>Favorites</Text>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                {(anime) && <ImageItem type={'Anime'} image={anime.coverImage.extraLarge} title={anime.title.userPreferred} />}
                {(manga) && <ImageItem type={'Manga'} image={manga.coverImage.extraLarge} title={manga.title.userPreferred} />}
                {(character) && <ImageItem type={(gender === 'Male') ? 'Husbando' : 'Waifu'} image={character.image.large} title={character.name.userPreferred} />}
            </View>
        </View>
    );
}

type Props = {
    user: UserBasic | FollowerListUser;
    visible: boolean;
    onDismiss: () => void;
    colors: ThemeColors;
}
type Styles = { 
    container: ViewStyle;
    avatarContainer: ViewStyle;
    bannerContainer: ViewStyle;
    banner: ImageStyle;
    avatar: ImageStyle;
    userName: TextStyle;
    createdText: TextStyle;
    viewButton: ViewStyle;
}
const UserModal = ({user, visible, onDismiss, colors}:Props) => {
    const { width } = useWindowDimensions();

    const modalStyle = StyleSheet.create<Styles>({
        container: {
            margin:'10%',
            backgroundColor:colors.card,
            padding:20,
            borderRadius:30,
        },
        avatarContainer: {
            position:'absolute',
            top:-70,
            alignSelf:'center',
            borderRadius:100/2,
        },
        bannerContainer: {
            position:'absolute',
            top:-21,
            alignSelf:'center',
            borderRadius:30,
        },
        banner: {
            width:width*(1-0.20),
            height:60,
            borderTopLeftRadius:30,
            borderTopRightRadius:30,
            marginRight:.5,
        },
        avatar: {
            width:100,
            height:100,
            borderRadius:100/2,
            borderWidth:1,
            resizeMode:'cover',
            backgroundColor:user.options.profileColor,
        },
        userName: {
            fontSize:24,
            marginTop:45,
            textAlign:'center',
            color:colors.text,
            fontFamily:'Inter_900Black'
        },
        createdText: {
            color:colors.text,
            textAlign:'center',
            fontSize:12,
        },
        viewButton: {
            marginTop:20,
            borderColor:colors.primary
        }
    });

    return(
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={modalStyle.container}>
                <View>
                    {user.bannerImage && <View style={modalStyle.bannerContainer}>
                        <FastImage fallback source={{uri:user.bannerImage}} style={modalStyle.banner} />
                    </View>}
                    <View style={modalStyle.avatarContainer}>
                        <FastImage fallback source={{uri:user.avatar.large}} style={modalStyle.avatar} />
                    </View>
                    <Text style={modalStyle.userName}>{user.name}</Text>
                    <Text style={modalStyle.createdText}>Created {convertUnixTime(user.createdAt)}</Text>
                    <FavoritesView favourites={user.favourites} colors={colors} />
                    <Button mode="outlined" color={colors.primary} onPress={() => _openBrowserUrl(user.siteUrl, colors.primary, colors.text)} style={modalStyle.viewButton}>View Profile</Button>
                </View>
            </Modal>
        </Portal>
    );
}

// <RenderHTML source={{html:user.about}} contentWidth={width-100} />

export default UserModal;