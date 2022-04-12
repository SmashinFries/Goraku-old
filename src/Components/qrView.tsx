import React from "react";
import { Button, Dialog } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import { ThemeColors } from "./types";

type Props = {
    colors: ThemeColors;
    visible: boolean;
    onDismiss: () => void;
    link: string;
}
const QrView = ({colors, visible, onDismiss, link}:Props) => {
    return(
        <Dialog style={{ backgroundColor: colors.card }} visible={visible} onDismiss={onDismiss}>
                <Dialog.Title style={{ color: colors.text }}>QR Code</Dialog.Title>
                <Dialog.Content style={{alignItems:'center', justifyContent:'center', height:300}}>
                    <QRCode value={link} size={240} backgroundColor={colors.background} color={colors.text}/>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button color={colors.primary} onPress={onDismiss}>Done</Button>
                </Dialog.Actions>
            </Dialog>
    );
}

export default QrView;