import React from "react";
import { StyleSheet, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { ThemeColors } from "../types";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { FollowerListUser, UserBasic } from "../../Api/types";
import { openURL } from "expo-linking";
import { convertUnixTime } from "../../utils/time/getTime";

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
                    <Button mode="outlined" color={colors.primary} onPress={() => openURL(user.siteUrl)} style={modalStyle.viewButton}>View Profile</Button>
                    
                </View>
            </Modal>
        </Portal>
    );
}

// <RenderHTML source={{html:user.about}} contentWidth={width-100} />

export default UserModal;