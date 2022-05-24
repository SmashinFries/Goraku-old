import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { Avatar } from "react-native-paper";
import { UserOptionViewer } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";

type Props = {
    userData: UserOptionViewer;
    colors: ThemeColors;
}
const UserHeader = ({userData, colors}) => {
    return(
        <View style={{ justifyContent: 'center', height: 200, width: '100%' }}>
            {(userData.bannerImage) && <FastImage fallback source={{ uri: userData.bannerImage }} style={{ height: 200, width: '100%' }} resizeMode='cover' />}
            {(userData.bannerImage) && <LinearGradient colors={['transparent', 'rgba(0,0,0,.5)']} locations={[.60, 1]} style={{ position: 'absolute', top: 0, height: 200, width: '100%' }} />}
            <View style={{ position: 'absolute', alignSelf: 'center' }}>
                <Avatar.Image size={124} source={{ uri: userData.avatar.large }} style={{ alignSelf: 'center', backgroundColor: userData.options.profileColor }} />
                <Text style={{ textAlign: 'center', alignSelf: 'center', color: (userData.bannerImage) ? '#FFF' : colors.text, fontWeight: 'bold', marginTop: 10, fontSize: 20 }}>{userData.name}</Text>
            </View>
        </View>
    );
}

export default UserHeader;