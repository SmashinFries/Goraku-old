import React from "react";
import { View, Text } from "react-native";
import YoutubePlayer from 'react-native-youtube-iframe';
import { ThemeColors } from "../../../../Components/types";

type Props = {
    trailer: any;
    width: number;
    colors: ThemeColors;
}
const Trailer = ({trailer, width, colors}:Props) => {
    if (trailer === null) return null;
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 28, fontFamily:'Inter_900Black', color: colors.text }}>Trailer</Text>
            <View style={{ alignItems: 'center' }}>
                <YoutubePlayer
                    height={270}
                    width={width}
                    videoId={trailer.id.toString()}
                    webViewStyle={{ opacity: 0.99, overflow: 'hidden' }}
                />
            </View>
        </View>
    );
}

export default Trailer;