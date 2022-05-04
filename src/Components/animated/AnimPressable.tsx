import { useRef } from "react";
import { Animated, Pressable, PressableProps, ViewStyle, } from "react-native";

export const AnimPressable = Animated.createAnimatedComponent(Pressable);

const pressAnim = (value:Animated.Value) => {
    Animated.spring(value, {
        toValue: .95,
        useNativeDriver: true,
    }).start();
}
const releaseAnim = (value:Animated.Value) => {
    Animated.spring(value, {
        toValue: 1,
        useNativeDriver: true,
    }).start();
}

type PressAnimParams = {
    children?:any;
    style?:ViewStyle;
}
export const PressableAnim = ({children, style, ...rest}:PressAnimParams&PressableProps) => {
    const pressValue = useRef(new Animated.Value(1)).current;
    return(
        <AnimPressable
            style={[style, {transform: [{ scale: pressValue }]}]} 
            onPressIn={() => pressAnim(pressValue)} 
            onPressOut={() => releaseAnim(pressValue)}
            {...rest}
        >
            {children}
        </AnimPressable>
    );
}