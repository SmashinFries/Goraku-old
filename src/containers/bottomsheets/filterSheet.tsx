import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Keyboard } from "react-native";
import { FilterUI } from "./components/filterUI";

export const FilterSheet = ({sheetRef, handleSearch, searchParams}) => {
    const snapPoints = useMemo(() => ['45%', '80%'], []);
    const { colors, dark } = useTheme();

    return (
        <BottomSheetModal
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            enableOverDrag={true}
            handleStyle={{backgroundColor:colors.card}}
            handleIndicatorStyle={{backgroundColor:colors.primary}}
            onChange={(index) => index === -1 && Keyboard.dismiss()}
        >
            <BottomSheetScrollView keyboardShouldPersistTaps={'handled'} style={{
                flex: 1,
            }}>
                <FilterUI colors={colors} dark={dark} searchParams={searchParams} handleSearch={() => handleSearch()} />
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
}