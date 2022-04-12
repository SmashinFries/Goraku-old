import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo } from "react";
import { ToastAndroid, View, Text, Pressable } from "react-native";
import { updateMediaListEntry } from "../../../../../Api";
import { AniMalType } from "../../../../../Api/types";
import { RadioButton } from "../../../../../Components/buttons/radio";

const STATUS_OPTIONS = ['CURRENT', 'PLANNING', 'COMPLETED', 'DROPPED', 'PAUSED', 'REPEATING'];

type StatusProps = {
    data:AniMalType;
    setData: React.Dispatch<React.SetStateAction<AniMalType>>;
    onClose: () => void;
}
const StatusList = ({data, setData, onClose}:StatusProps) => {
    const { colors, dark } = useTheme();
    const currentStatus = data.anilist.mediaListEntry.status;

    const changeStatus = async(status:string) => {
        setData({...data, anilist:{...data.anilist, mediaListEntry:{...data.anilist.mediaListEntry, status:status.toUpperCase()}}});
        const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, status.toUpperCase());
        if(!res) {
            ToastAndroid.show('Error updating status', ToastAndroid.SHORT);
        }
    }

    return(
        <View style={{ width:'85%', paddingVertical:10, borderRadius:12, backgroundColor:colors.card, borderColor:colors.border, borderWidth:.5}}>
            <Text style={{marginLeft:20, fontSize:34,  color:colors.text}}>Status</Text>
            <View style={{marginLeft:10, marginTop:5}}>
                {STATUS_OPTIONS.map((status, index) => 
                    <RadioButton key={index} text={status} onPress={() => changeStatus(status)} activeItem={currentStatus} />
                )}
            </View>
            <View style={{alignItems:'flex-end', marginVertical:10, marginRight:30}}>
                <Pressable onPress={onClose}>
                    <Text style={{color:colors.primary,}}>Close</Text>
                </Pressable>
            </View>
        </View>
    );
}

const StatusModal = ({sheetRef}) => {
    const snapPoints = useMemo(() => ['80%'], []);
    const { colors, dark } = useTheme();

    useEffect(() => {
        sheetRef.current?.present();
    },[])

    return (
        <BottomSheetModal
            ref={sheetRef}
            index={-1}
            snapPoints={snapPoints}
            detached
            onDismiss={() => console.log('onDismiss')}
            handleStyle={{backgroundColor:colors.card}}
            handleIndicatorStyle={{backgroundColor:colors.primary}}
        >
            <BottomSheetScrollView style={{
                flex: 1,
            }}>
                <StatusList />
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
}

export default StatusModal;