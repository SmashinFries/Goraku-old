import { Linking } from "react-native"

export const handleLink = async(url:string) => {
    await Linking.openURL(url);
}