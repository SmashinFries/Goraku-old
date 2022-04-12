import React from "react";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export const handleCopy = (text:string) => {
    Haptics.impactAsync().catch((err) => console.log(err));
    Clipboard.setString(text);
}