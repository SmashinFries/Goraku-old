import { openURL } from "expo-linking";
import React from "react";
import { Text } from 'react-native';
import { Dialog, Button, IconButton, Portal } from "react-native-paper";
import { Release } from "../../Api/github/types";
import { ThemeColors } from "../types";

type Props = {
    release:Release;
    visible:boolean;
    onDismiss:() => void;
    colors:ThemeColors;
}
const DownloadDialog = ({release, visible, onDismiss, colors}:Props) => {
    if (!release) return null;
    return(
        <Portal>
            <Dialog style={{ backgroundColor: colors.card }} visible={visible} onDismiss={onDismiss}>
                <Dialog.Title style={{ color: colors.text }}>New Version Available!</Dialog.Title>
                <Dialog.Content>
                    <Text style={{color:colors.text}}>Version: {release.tag_name}</Text>
                    <Text style={{color:colors.text}}>Size: {(release.assets[0].size/1048576).toFixed(2)} MB</Text>
                    <Text style={{color:colors.text}}>Created: {release.assets[0].created_at.split('T')[0]}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button color={colors.primary} onPress={onDismiss}>Close</Button>
                    <IconButton icon={'github'} onPress={() => openURL(release.html_url)} color={colors.primary} />
                    <IconButton icon={'download'} onPress={() => openURL(release.assets[0].browser_download_url)} color={colors.primary} />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default DownloadDialog;