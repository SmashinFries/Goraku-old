import React, { Dispatch, SetStateAction } from "react";
import { View, Pressable, Text } from "react-native";
import ImageView from 'react-native-image-viewing';
import { Theme } from "@react-navigation/native";
import { AniMalType } from "../Api/types";
import { saveImage, shareImage } from "../utils";
import { IconButton } from "react-native-paper";

type Props = {
    data?: AniMalType;
    images?: {uri: string}[];
    imageIndex: number;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    theme: Theme;
}
const ImageViewer = ({data, images, imageIndex, visible, setVisible, theme}:Props) => {
    const images_data = (data) ? data.images?.map((image, index) => {
        return {uri: image.jpg.large_image_url}
    }) : images;

    if (data && !data.images) return null;
    return (
        <ImageView
            swipeToCloseEnabled={false}
            HeaderComponent={({ imageIndex }) =>
                <View style={{ flexDirection: 'row', width: '100%', height: 50, zIndex: 20, paddingTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>
                        <IconButton icon={'close'} size={26} color={theme.colors.text} onPress={() => setVisible(false)} />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',}}>
                        <IconButton icon='share-variant' size={26} color={theme.colors.text} onPress={() => shareImage(images_data[imageIndex].uri, 'image')} />
                        <IconButton icon='content-save-outline' size={26} color={theme.colors.text} onPress={() => saveImage(images_data[imageIndex].uri, (data) ? data.anilist.title.userPreferred.replace(/ /g, '_') : 'Image')} />
                    </View>
                </View>}
            FooterComponent={({ imageIndex }) =>
                <View style={{ alignItems: 'center', paddingBottom: 15 }}><Text style={{ color: theme.colors.text, fontSize: 16 }}>{`${imageIndex + 1}/${images_data.length}`}</Text></View>
            }
            backgroundColor={(theme.dark) ? theme.colors.background : theme.colors.card}
            images={images_data}
            imageIndex={imageIndex} visible={visible} onRequestClose={() => setVisible(false)}
        />
    );
}

export default ImageViewer;