import React, { useState, useEffect } from "react";
import { View, Text} from "react-native";
import { Checkbox } from "react-native-paper";

type CheckBoxProps = {
    value: boolean;
    onValueChange: (value: boolean) => void;
    text: string;
    color: string;
    textColor: string;
    disabled: boolean;
}
export const SortCheckBox = ({value, onValueChange, text, color, disabled, textColor}: CheckBoxProps) => {
    return (
        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
            <Checkbox
                status={value ? "checked" : "unchecked"}
                onPress={() => onValueChange(!value)}
                color={color}
                theme={{colors: {disabled: textColor}}}
                uncheckedColor={color}
                disabled={disabled}
            />
            <Text style={{ fontSize: 15, color:textColor }}>{text}</Text>
        </View>
    );
}