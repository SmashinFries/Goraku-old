import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import Animated, { useAnimatedStyle, interpolateColor, useDerivedValue, withTiming } from "react-native-reanimated";
import { CategorizedTag, MediaTagCollection } from "../../Api/types";
import { ADULT_ALLOW } from "../../constants";
import { ThemeColors } from "../types";

const AnimPressable = Animated.createAnimatedComponent(Pressable);

type TagButton = {item:any; onLongPress?: () => any; onPress: () => any};
export const FilterGenre = ({ item, onLongPress, onPress }:TagButton) => {
    return (
        <AnimPressable onPress={onPress} onLongPress={onLongPress} style={{ backgroundColor:item.color, margin: 5, padding: 8, borderRadius: 12 }}>
            <Text style={{ fontSize: 15, color: '#FFF', fontWeight: 'bold' }}>{item.name}</Text>
        </AnimPressable>
    );
}

interface FilterTagType {
    category: string;
    onPress: (text: string, type:string) => void;
    setColor: (text: string) => string;
    tags: CategorizedTag;
    nsfw?: boolean;
    search?:string;
    colors: ThemeColors;
}
export const FilterTags = ({ category, onPress, setColor, tags, nsfw=false, search='', colors }: FilterTagType) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedTag, setSelectedTag] = useState<MediaTagCollection>();
    if (category === 'Sexual Content' && (ADULT_ALLOW === false && nsfw === false)) return null;
    return (
        <View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color:colors.text, marginTop:10 }}>{category}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {(search.length === 0) ?
                    tags[category].map((item, idx) =>
                        <FilterGenre
                            key={idx}
                            onPress={() => onPress(item.name, 'TAG')}
                            onLongPress={() => {setSelectedTag(item); setVisible(true)}}
                            item={{ name: item.name, desc: item.description, color: setColor(item.name) }}
                        />
                    )
                    : tags[category].map((item, idx) => (item.name.toLowerCase().includes(search.toLowerCase())) ?
                        <FilterGenre
                            key={idx}
                            onPress={() => onPress(item.name, 'TAG')}
                            onLongPress={() => {setSelectedTag(item); setVisible(true)}}
                            item={{ name: item.name, desc: item.description, color: setColor(item.name) }}
                        /> : null)
            }
            </View>
            <Portal>
            <Dialog style={{backgroundColor:colors.card}} visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title style={{color:colors.text}}>{selectedTag?.name}</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{color:colors.text}}>{selectedTag?.description}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button color={colors.primary} onPress={() => setVisible(false)}>Nice</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

interface ActiveTagProps {
    item: {
        name: string;
        color: string;
        status: string;
        type: string;
    }
    onPress: (text:string, type:string) => void;
}
export const ActiveTagItem = ({item, onPress}:ActiveTagProps) => {
    const entryValue = useRef(new Animated.Value(0)).current;
    const colorValue = useDerivedValue(() => {
        return item.color === 'rgba(3, 252, 44, .8)' ? withTiming(0) : withTiming(1);
    });

    const tagAddAnim = () => {
        Animated.spring(entryValue, {
            toValue: 1,
            damping: 15,
            mass: 1,
            stiffness: 150,
            overshootClamping: false,
            restSpeedThreshold: 0.001,
            restDisplacementThreshold: 0.001,
        }).start();
    }

    const colorStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(colorValue.value, [0,1], ['rgba(3, 252, 44, .8)', 'rgba(255, 40, 20, .8)']);
        return { backgroundColor: backgroundColor}
    });

    useEffect(() => {
        tagAddAnim();
    },[]);
    
    return (
        <AnimPressable
            onPress={() => {onPress(item.name, item.type)}}
            style={[colorStyle, {borderRadius: 12, padding: 5, margin: 5, transform: [{ scale: entryValue }] }]}
        >
            <Text style={{ color: '#FFF' }}>{item.name}</Text>
        </AnimPressable>
    );
}