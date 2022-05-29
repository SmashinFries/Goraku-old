import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { NavigationProp, useTheme } from "@react-navigation/native";
import React, { useMemo, } from "react";
import { View, Text } from "react-native";
import { AntDesign, Octicons } from '@expo/vector-icons';
import { Button, IconButton } from 'react-native-paper';
import { PressableAnim } from "../../Components";
import { RadioButton } from "../../Components/buttons/radio";
import { useTagLayout } from "../../Storage/listStorage";
import { TagCheckBox } from "../../Components/buttons/checkboxes";
import { _openBrowserUrl } from "../../utils";
import { useUserId } from "../../Storage/authToken";

type TypeButton = {
    title: string;
    icon: string;
    iconActive: string;
    layout?: string;
}
type ListFilterProps = {
    sheetRef: React.MutableRefObject<BottomSheet>;
    type: string;
    format: string;
    navigation: NavigationProp<any>;
}
export const ListFilter = ({sheetRef, type, format, navigation}:ListFilterProps) => {
    const snapPoints = useMemo(() => [25, '20%', '48%'], []);
    const { colors, dark } = useTheme();
    const userId = useUserId();
    const {tags, listLayout, updateLayout, updateTagLayout} = useTagLayout();

    const selectedType = (currentButton:string) => {
        if (currentButton.toUpperCase() === type && format !== 'NOVEL') {
            return true;
        } else if (currentButton === 'Novel' && format === 'NOVEL') {
            return true;
        } else {
            return false;
        } 
    }
    
    const TypeButton = ({title, icon, iconActive}:TypeButton) => {
        const state = selectedType(title);
        const params = {
            type: (title === 'Novel') ? 'MANGA' : title.toUpperCase(),
            format: (title === 'Manga') ? 'MANGA' : (title === 'Novel') ? 'NOVEL' : 'Any',
        };

        return(
            <View>
                {(title === 'Novel') ? 
                // @ts-ignore
                <IconButton icon={(state) ? 'book-open' : icon} onPress={() => navigation.replace('UserList', params)} size={38} color={(state) ? colors.primary : colors.text} />
                // @ts-ignore
                : <IconButton icon={(state) ? iconActive : icon} onPress={() => navigation.replace('UserList', params)} size={38} color={(state) ? colors.primary : colors.text} />
                }
                <Text style={{ color: colors.text, textAlign:'center' }}>{title}</Text>
            </View>
        );
    }

    const reorderFavs = async () => {
        const url = `https://anilist.co/user/${userId}/favorites`;
        const params = {type: 'FAVORITES', format: 'Any'};
        await _openBrowserUrl(url, colors.primary, colors.text);
        // @ts-ignore
        navigation.replace('UserList', params);
    }

    const TagCheckBoxes = () => {
        return(
            <View style={{ flexDirection: 'row' }}>
                <TagCheckBox value={tags.progressTag} onValueChange={() => updateTagLayout({progressTag: !tags.progressTag, statusTag:tags.statusTag})} title={'Progress'} color={colors.primary} textColor={colors.text} />
                <TagCheckBox value={tags.statusTag} onValueChange={() => updateTagLayout({progressTag: tags.progressTag, statusTag:!tags.statusTag})} title={'Status'} color={colors.primary} textColor={colors.text} />
            </View>
        );
    }

    return (
        <BottomSheet
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            enableOverDrag={true}
            handleStyle={{backgroundColor:colors.card}}
            handleIndicatorStyle={{backgroundColor:colors.primary}}
            backgroundStyle={{backgroundColor:(dark) ? colors.background : colors.card}}
        >
            <BottomSheetScrollView contentInsetAdjustmentBehavior="automatic" style={{
                height:'100%',}}>
                <BottomSheetView style={{flexDirection:'row', marginTop:10, paddingBottom:15, justifyContent:"space-evenly"}}>
                    <TypeButton title={'Anime'} icon='video-outline' iconActive='video' />
                    <TypeButton title={'Manga'} icon='book-outline' iconActive='book' />
                    <TypeButton title={'Novel'} icon='book-open-outline' iconActive='book-open' />
                    <TypeButton title={'Favorites'} icon='heart-outline' iconActive='heart' />
                </BottomSheetView>
                {(type === 'FAVORITES') &&
                    <Button
                        mode='outlined'
                        color={colors.primary}
                        onPress={() => reorderFavs()}
                        style={{ width: '80%', borderColor: colors.primary, alignSelf: 'center' }}
                    >
                        Reorder Favorites
                    </Button>
                }
                {(type !== 'FAVORITES') ? <View>
                    <Text style={{fontSize:24, fontWeight:'bold', color:colors.text, textAlign:'center'}}>Layout</Text>
                    <View style={{borderWidth:1, borderColor:colors.border, marginHorizontal:80}} />
                    <Text style={{fontSize:20, fontWeight:'bold', color:colors.text, marginLeft:10, marginTop:10}}>Display</Text>
                    <View style={{flexDirection:'row', justifyContent:'flex-start', marginLeft:10}}>
                        <View style={{borderRadius:12, overflow:'hidden'}}>
                            <RadioButton fontSize={16} colors={{colors, dark}} iconSize={28} activeItem={listLayout} text='Compact' onPress={() => updateLayout('compact')} />
                        </View>
                        <View style={{paddingLeft:20, borderRadius:12, overflow:'hidden'}}>
                            <RadioButton fontSize={16} colors={{colors, dark}} iconSize={28} activeItem={listLayout} text='List' onPress={() => updateLayout('list')} />
                        </View>
                    </View>
                    <Text style={{fontSize:20, fontWeight:'bold', color:colors.text, marginLeft:10}}>Tags</Text>
                    <View style={{marginLeft:15}}>
                        <TagCheckBoxes />
                    </View>
                </View> : null}
            </BottomSheetScrollView>
        </BottomSheet>
    );
}