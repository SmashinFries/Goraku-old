import React from "react";
import { Animated, Easing, Pressable } from "react-native";
import { IconButton } from "react-native-paper";

const AnimatedIcon = Animated.createAnimatedComponent(Pressable);

const bounceAnimate = (value: Animated.Value) => {
    Animated.sequence([
        Animated.spring(value, {
            toValue: .75,
            useNativeDriver:true
        }),
        Animated.spring(value, {
            toValue: 1,
            useNativeDriver:true
        })
    ]).start()
}

const spinAnimate = (value:Animated.Value) => 
    Animated.loop(
        Animated.timing(value, {
            toValue:-100,
            duration: 2500,
            useNativeDriver:true
        })
    );

export {AnimatedIcon, bounceAnimate, spinAnimate};