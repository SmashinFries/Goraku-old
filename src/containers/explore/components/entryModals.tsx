import React, { useEffect, useState } from "react";
import { View, Text, Pressable, useWindowDimensions, Modal, ToastAndroid, FlatList, StatusBar, ViewStyle } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Theme, useTheme } from "@react-navigation/native";
import { AniMalType } from "../../../Api/types";
import { updateMediaListEntry } from "../../../Api";
import { ScrollView } from "react-native-gesture-handler";
import { RadioButton } from "../../../Components/buttons/radio";
import { Button, Dialog, HelperText, TextInput } from "react-native-paper";

const STATUS_OPTIONS = ['CURRENT', 'PLANNING', 'COMPLETED', 'DROPPED', 'PAUSED', 'REPEATING'];
type visibleState = {
    vis: boolean;
    type: string;
}

type EntryModalProps = {
    children: React.ReactNode;
    visible: visibleState;
    setVisible: React.Dispatch<React.SetStateAction<visibleState>>;
    transparent?: boolean; 
    style?:ViewStyle;
}
const EntryModal = ({children, visible, setVisible, transparent=true, style={}}:EntryModalProps) => {
    const { width, height } = useWindowDimensions();
    const { colors } = useTheme();
    const statusBarHeight = StatusBar.currentHeight;
    return(
        <Modal visible={visible.vis} statusBarTranslucent presentationStyle="overFullScreen" transparent={transparent}>
            <View style={[{position:'absolute', height:height, width:width, justifyContent:'center', alignItems:'center'}, style]}>
                {(transparent) && <Pressable onPress={() => setVisible({...visible, vis:false})} style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'rgba(0,0,0,.65)'}} />}
                {children}
                {(!transparent) &&
                    <Pressable onPress={() => setVisible({...visible, vis:false})} style={{ position: 'absolute', top: 15+statusBarHeight, right: 20, justifyContent:'center', alignItems:'center', borderRadius: 35 / 2 }}>
                        <MaterialIcons name="close" size={35} color={colors.text} />
                    </Pressable>
                }
            </View>
        </Modal>
    );
}

type StatusProps = {
    data:AniMalType
    setData: React.Dispatch<React.SetStateAction<AniMalType>>;
    onClose: () => void;
    totalEP?: number[];
    colors: Theme;
}
const StatusList = ({data, setData, onClose, colors}:StatusProps) => {
    const currentStatus = data.anilist.mediaListEntry.status;

    const changeStatus = async(status:string) => {
        setData({...data, anilist:{...data.anilist, mediaListEntry:{...data.anilist.mediaListEntry, status:status.toUpperCase()}}});
        const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, status.toUpperCase());
        if(!res) {
            ToastAndroid.show('Error updating status', ToastAndroid.SHORT);
        }
    }

    return(
        <>
            <Dialog.Title style={{color:colors.colors.text}}>Status</Dialog.Title>
            {/* <Text style={{marginLeft:20, fontSize:34,  color:colors.text}}>Status</Text> */}
            <Dialog.Content>
                {STATUS_OPTIONS.map((status, index) =>
                    <RadioButton key={index} text={status} colors={colors} onPress={() => changeStatus(status)} activeItem={currentStatus} />
                )}
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onClose} color={colors.colors.primary}>Done</Button>
            </Dialog.Actions>
        </>
    );
}

const ProgressList = ({data, setData, totalEP, onClose, colors}:StatusProps) => {
    const current = (data.anilist.mediaListEntry.progress) ? data.anilist.mediaListEntry.progress : 0;

    const changeProgress = async(progress:number) => {
        if (data.anilist.format !== 'NOVEL') {
            if (data.anilist.status === 'PLANNING' && progress > 0) {
                setData({ ...data, anilist: { ...data.anilist, mediaListEntry: { ...data.anilist.mediaListEntry, progress: progress } } });
            } else {
                setData({ ...data, anilist: { ...data.anilist, mediaListEntry: { ...data.anilist.mediaListEntry, progress: progress, status: 'CURRENT' } } });
            }
            const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, (progress > 0 && data.anilist.mediaListEntry.status === 'PLANNING') ? 'CURRENT' : undefined, undefined, progress);
        } else {
            setData({ ...data, anilist: { ...data.anilist, mediaListEntry: { ...data.anilist.mediaListEntry, progress: progress } } });
            const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, (progress > 0 && data.anilist.mediaListEntry.status === 'PLANNING') ? 'CURRENT' : undefined, undefined, undefined, undefined, undefined, undefined, undefined, progress);
        }
    }

    const RenderItem = ({item, index}) => {
        return(
            <Pressable onPress={() => changeProgress(item)} style={{height:80, width:120, borderRadius:12, margin:5, backgroundColor:(current >= index) ? colors.colors.primary : colors.colors.card, borderWidth:1, borderColor:colors.colors.primary, justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:(current >= index) ? '#FFF' : colors.colors.text, fontSize:24, fontWeight:'bold'}}>{item}</Text>
            </Pressable>
        );
    }

    return(
        <>
            <Dialog.Title style={{color:colors.colors.text}}>{(data.anilist.type === 'ANIME') ? 'Episodes' : (data.anilist.format === 'NOVEL') ? 'Volumes' : 'Chapters'}</Dialog.Title>
            <Dialog.ScrollArea>
                <FlatList 
                key={2}
                    data={totalEP}
                    renderItem={({item, index}) => <RenderItem item={item} index={index} />}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{alignItems:'center'}}
                    columnWrapperStyle={{padding:5}}
                    numColumns={2}
                />
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button onPress={onClose} color={colors.colors.primary}>Done</Button>
            </Dialog.Actions>
        </>
    );
}

const ScoreList = ({data, setData, onClose, colors}:StatusProps) => {
    const [score, setScore] = useState(data.anilist.mediaListEntry.score);
    const scores = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

    const changeScore = async(rating:number) => {
        setScore(rating);
        setData({...data, anilist:{...data.anilist, mediaListEntry:{...data.anilist.mediaListEntry, score:rating}}});
        const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, undefined, rating);
        if(!res) {
            setScore(data.anilist.mediaListEntry.score);
            ToastAndroid.show('Error updating status', ToastAndroid.SHORT);
        }
    }

    return(
        <>
            <Dialog.Title style={{ color: colors.colors.text }}>Score</Dialog.Title>
            <Dialog.ScrollArea>
                <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 35 }}>
                    {scores.map((rating, idx) =>
                        <Pressable
                            key={idx}
                            onPress={() => changeScore(rating)}
                            android_ripple={{ color: colors.colors.primary, borderless: true }}
                            style={{ height: 50, width: 50, borderRadius: 50 / 3, backgroundColor: (score === rating) ? colors.colors.primary : undefined, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Text style={{ color: colors.colors.text }}>{rating}</Text>
                        </Pressable>)}
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button onPress={onClose} color={colors.colors.primary}>Done</Button>
            </Dialog.Actions>
        </>
    );
}

const RepeatList = ({data, setData, onClose, colors}:StatusProps) => {
    const [value, setValue] = useState<string>();

    // const hasErrors = () => {
    //     if (!value) return null;
    //     return Number(value) > 0;
    // }

    // const errorMessage = () => {
    //     if (Number(value) <= 5) {
    //         return ''
    //     }
    // }

    const changeRepeat = async() => {
        setData({...data, anilist:{...data.anilist, mediaListEntry:{...data.anilist.mediaListEntry, repeat:Number(value)}}});
        const result = await updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, undefined, undefined, undefined, Number(value));
        onClose();
    }
    return(
        <>
            <Dialog.Title style={{ color: colors.colors.text }}>Repeats</Dialog.Title>
            <Dialog.Content>
                <TextInput underlineColor={colors.colors.primary} defaultValue={data.anilist.mediaListEntry.repeat?.toString() ?? '0'} value={value} onChangeText={(txt) => setValue(txt)} mode='flat' keyboardType='number-pad' theme={{colors:{background:colors.colors.background, text:colors.colors.text, primary:colors.colors.primary}}} />
                {/* <HelperText type="info" visible={hasErrors()}>
                    Email address is invalid!
                </HelperText> */}
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onClose} color={colors.colors.text}>Cancel</Button>
                <Button onPress={() => changeRepeat()} color={colors.colors.primary}>Set</Button>
            </Dialog.Actions>
        </>
    );
}

type ListEntryModalProps = {
    visible: visibleState;
    setVisible: React.Dispatch<React.SetStateAction<visibleState>>;
    data:AniMalType
    setData: React.Dispatch<React.SetStateAction<AniMalType>>;
    totalEP?: number[];
    colors: Theme;
}
export const EditListEntryModal = ({visible, setVisible, data, setData, colors, totalEP}:ListEntryModalProps) => {
    switch (visible.type) {
        case 'STATUS':
            return(
                <Dialog style={{backgroundColor:colors.colors.card}} visible={visible.vis} onDismiss={() => setVisible({...visible, vis:false})} >
                    <StatusList data={data} setData={setData} colors={colors} onClose={() => setVisible({...visible, vis:false})} />
                </Dialog>
            );
        case 'PROGRESS':
            return(
                // <EntryModal visible={visible} setVisible={setVisible} transparent={false} style={{backgroundColor:colors.colors.card, position:'relative'}}>
                <Dialog style={{backgroundColor:colors.colors.card, maxHeight:'80%'}} visible={visible.vis} onDismiss={() => setVisible({...visible, vis:false})} >
                    <ProgressList data={data} setData={setData} colors={colors} totalEP={totalEP} onClose={() => setVisible({...visible, vis:false})}/>
                </Dialog>
                // </EntryModal>
            );
        case 'SCORE':
            return(
                <Dialog style={{backgroundColor:colors.colors.card, maxHeight:'40%'}} visible={visible.vis} onDismiss={() => setVisible({...visible, vis:false})} >
                    <ScoreList data={data} setData={setData} colors={colors} onClose={() => setVisible({...visible, vis:false})}/>
                </Dialog>
            );
        case 'REPEAT':
            return(
                <Dialog style={{backgroundColor:colors.colors.card, maxHeight:'40%'}} visible={visible.vis} onDismiss={() => setVisible({...visible, vis:false})}>
                    <RepeatList data={data} setData={setData} colors={colors} onClose={() => setVisible({...visible, vis:false})}/>
                </Dialog>
            )
        default:
            return null;
    }
}