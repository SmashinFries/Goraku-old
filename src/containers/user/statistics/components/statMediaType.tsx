import { Dispatch, SetStateAction } from "react";
import { IconButton } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { ThemeColors } from "../../../../Components/types";

type Props = {
    defaultText:string;
    colors:ThemeColors;
    setType: Dispatch<SetStateAction<string>>;
    width?: string|number;
}
const StatMediaSelector = ({defaultText, colors, setType, width}:Props) => {
    return(
        <SelectDropdown
            data={['ANIME', 'MANGA']}
            defaultValue={defaultText}
            defaultButtonText={defaultText}
            dropdownStyle={{ backgroundColor: colors.card, borderRadius: 12 }}
            rowStyle={{ backgroundColor: colors.card, borderBottomWidth: 0 }}
            buttonStyle={{ backgroundColor: colors.card, borderRadius: 12, borderWidth:1, borderColor:colors.primary, height: 40, width: width ?? 220 }}
            renderDropdownIcon={() => <IconButton icon="chevron-down" size={24} color={colors.primary} style={{ marginRight: 10 }} />}
            rowTextStyle={{ textTransform: 'capitalize', color: colors.text }}
            buttonTextStyle={{ textTransform: 'capitalize', color: colors.text }}
            onSelect={(selected: 'ANIME' | 'MANGA' | 'NOVEL', index) => setType(selected)}
            buttonTextAfterSelection={(selected, index) => { return selected }}
            rowTextForSelection={(item, index) => { return item }}
        />
    );
}

export default StatMediaSelector;