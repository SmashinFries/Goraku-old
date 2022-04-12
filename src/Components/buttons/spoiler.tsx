import React, { useState } from "react";
import { Pressable, View, Text } from "react-native";
import { ThemeColors } from "../types";

type Params = { spoil: string, colors: ThemeColors };
export const SpoilerButton = ({spoil, colors}:Params) => {
    const [showSpoiler, setShowSpoiler] = useState(false);
    return(
        <Pressable onPress={() => setShowSpoiler(!showSpoiler)} style={{marginVertical:5}}>
                {(showSpoiler) ? <Text style={{color:colors.text}}>{spoil}</Text> :
                    <View style={{ width: 120, height: 40, borderRadius: 12, justifyContent: 'center', backgroundColor: colors.primary }}>
                        <Text style={{ textAlign: 'center', color: '#FFF' }}>Show Spoiler</Text>
                    </View>
                }
        </Pressable>
    );
}