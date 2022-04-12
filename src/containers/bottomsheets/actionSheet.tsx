import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Keyboard, Text } from "react-native";
import { List } from "react-native-paper";
import * as Haptics from 'expo-haptics';
import { quickAdd } from "../../Api";
import { MediaTileType } from "../../Api/types";

type ActionSheetProps = {
    actionSheetRef:React.RefObject<BottomSheetModalMethods>;
    id: number;
    setData: React.Dispatch<React.SetStateAction<MediaTileType[]>>;
    index: number;
    info?: MediaTileType;
}
const ActionSheet = ({actionSheetRef, id, setData, index, info}:ActionSheetProps) => {
    const [isEntry, setIsEntry] = useState<boolean>(false);
    const snapPoints = useMemo(() => ['20%'], []);
    const { colors, dark } = useTheme();

    const handleAdd = async() => {
        Haptics.impactAsync();
        setIsEntry(!isEntry);
        const resp = await quickAdd(id);
        setData(prev => {
            let oldValues = prev;
            oldValues[index].mediaListEntry = resp;
            return oldValues;
        });
    }

    useEffect(() => {
        if(info) {
            setIsEntry(info.mediaListEntry ? true : false);
        }
    },[info]);

    return (
        <BottomSheetModal
            ref={actionSheetRef}
            index={0}
            snapPoints={snapPoints}
            enableOverDrag={true}
            handleStyle={{backgroundColor:colors.card}}
            handleIndicatorStyle={{backgroundColor:colors.primary}}
            onChange={(index) => index === -1 && Keyboard.dismiss()}
        >
            {info && <BottomSheetScrollView keyboardShouldPersistTaps={'handled'} style={{
                flex: 1,
            }}>
                <List.Item title={(isEntry) ? 'Remove' : 'Add to List'} onPress={() => (!isEntry) ? handleAdd() : null} titleStyle={{color:colors.text}} left={props => <List.Icon {...props} color={colors.text} icon={(info.mediaListEntry) ? 'minus' : 'plus'} />} />
                <List.Item title={(info.isFavorite) ? 'Unfavorite' : 'Favorite'} titleStyle={{color:colors.text}} left={props => <List.Icon {...props} color={colors.text} icon={(info.isFavorite) ? 'heart-broken-outline' : 'heart-outline'} />} />
                {/* <List.Item title='' titleStyle={{color:colors.text}} left={props => <List.Icon {...props} color={colors.text} icon="plus" />} /> */}
            </BottomSheetScrollView>}
        </BottomSheetModal>
    );
}

export default ActionSheet;