import React, { useState, useEffect } from "react";
import { View, Text} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';

type DropDownProps = {
    data: string[];
    onSelect: (value: string) => void;
    defaultText?: string;
    header: string;
    textColor: string;
    buttonColor: string;
}
export const SortDropDown = ({ data, onSelect, defaultText = 'Any', header, textColor, buttonColor }: DropDownProps) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, }}>
            <Text style={{ fontSize: 16, textAlign: 'center', color:textColor }}>{`${header}:`}</Text>
            <SelectDropdown
                data={data}
                defaultValue={defaultText}
                onSelect={onSelect}
                buttonTextAfterSelection={(selectedItem, idx) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, idx) => {
                    return item;
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={{backgroundColor:buttonColor, borderRadius:12}}
                buttonTextStyle={{ color: textColor }}
                rowStyle={{backgroundColor: buttonColor, borderBottomWidth: 0 }}
                rowTextStyle={{ color: textColor }}
                buttonStyle={{ margin: 5, width: 180, height: 40, borderRadius: 12, backgroundColor:buttonColor }}
                renderDropdownIcon={() => <Ionicons name='chevron-down' size={24} color={textColor} />}
            />
        </View>
    );
}