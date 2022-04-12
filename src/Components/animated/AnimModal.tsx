import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Animated, Pressable, PressableProps, useWindowDimensions, View, ViewStyle, } from "react-native";

const AnimPressable = Animated.createAnimatedComponent(Pressable);

const openAnim = (value:Animated.Value) => {
    Animated.timing(value, {
        toValue: 1,
        useNativeDriver: true,
    }).start();
}
const closeAnim = (value:Animated.Value, callback?:CallableFunction) => {
    Animated.timing(value, {
        toValue: 0,
        useNativeDriver: true,
    }).start();
}

type PressAnimParams = {
    isVisible: boolean,
    setIsVisible: Dispatch<SetStateAction<boolean>>,
    children:any;
    style?:ViewStyle;
}
export const ModalAnim = ({isVisible, setIsVisible, children, style, ...rest}:PressAnimParams&PressableProps) => {
    const animValue = useRef(new Animated.Value(0)).current;
    const {width, height} = useWindowDimensions();

    useEffect(() => {
        if (isVisible) {
            openAnim(animValue);
        }
    },[isVisible]);

    if (isVisible === false) return null;

    return(
        <Animated.View
            style={[{top:0, height: height, width: width, position: 'absolute', opacity:animValue}, style]}
        >
            <AnimPressable onPress={() => closeAnim(animValue, () => setIsVisible(false))} style={{position:'absolute', height:'100%', width:'100%', opacity:animValue, backgroundColor:'rgba(0,0,0,.6)'}} />
            {children}
        </Animated.View>
    );
}