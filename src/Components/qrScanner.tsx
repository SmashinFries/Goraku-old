import { Theme } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner"
import { openURL } from "expo-linking";
import React, { useEffect, useState } from "react"
import { View } from "react-native";
import { Button } from "react-native-paper";

type Props = {
    visible: boolean;
    onDismiss: () => void;
    color: Theme;
}
const QrScanner = ({visible, onDismiss, color}:Props) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const { colors, dark } = color;
    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        if (data.includes('goraku')) {
            setScanned(true);
            onDismiss();
            openURL(data);
        }
    };

    if (!visible) return null;

    return(
        <View>
            <BarCodeScanner style={{height:'80%', width:'100%'}} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}/>
            <View style={{flex:1, justifyContent:'center'}}>
                <Button mode="outlined" onPress={onDismiss} style={{width:'50%', alignSelf:'center', borderColor:colors.primary, borderRadius:12}} color={colors.text}>Cancel</Button>
            </View>
        </View>
    );
}

export default QrScanner;