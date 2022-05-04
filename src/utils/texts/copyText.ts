import React from "react";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { ToastAndroid } from "react-native";

export const handleCopy = (text:string) => {
    Haptics.impactAsync().catch((err) => console.log(err));
    Clipboard.setString(text);
    ToastAndroid.show(`Copied to clipboard:\n${text}`, ToastAndroid.SHORT);
}