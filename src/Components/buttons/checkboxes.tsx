import React from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';

type TagCheckBoxProps = {
    value: boolean;
    onValueChange: (value: any) => void;
    title: string;
    color: string;
    textColor: string;
}
export const TagCheckBox = ({value, onValueChange, title, color, textColor}:TagCheckBoxProps) => {
    return(
        <View style={{ flexDirection: 'row', marginHorizontal:5, paddingVertical:10 }}>
            <Checkbox onPress={() => onValueChange(value)} uncheckedColor={color} status={value ? 'checked' : 'unchecked'} color={color}  />
            <Text style={{color:textColor, textAlignVertical:'center', marginLeft:10}}>{title}</Text>
        </View>
    );
}