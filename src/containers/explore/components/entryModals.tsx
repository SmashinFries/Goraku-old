import React, { useState } from "react";
import { Text, Pressable, ToastAndroid, FlatList } from "react-native";
import { Theme } from "@react-navigation/native";
import { AniMalType } from "../../../Api/types";
import { updateMediaListEntry } from "../../../Api";
import { ScrollView } from "react-native-gesture-handler";
import { RadioButton } from "../../../Components/buttons/radio";
import { Button, Dialog, IconButton, TextInput } from "react-native-paper";
import { range, rgbConvert } from "../../../utils";

const STATUS_OPTIONS = ['CURRENT', 'PLANNING', 'COMPLETED', 'DROPPED', 'PAUSED', 'REPEATING'];
type visibleState = {
    vis: boolean;
    type: string;
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
    const [active, setActive] = useState<number>((data.anilist.mediaListEntry.progress && data.anilist.format !== 'NOVEL') ? data.anilist.mediaListEntry.progress : (data.anilist.mediaListEntry.progressVolumes) ? data.anilist.mediaListEntry.progressVolumes : 0);
    const current = (data.anilist.mediaListEntry.progress) ? data.anilist.mediaListEntry.progress : 0;

    const changeProgress = async(progress:number) => {
        if (data.anilist.format !== 'NOVEL') {
            if (data.anilist.status === 'PLANNING' && progress > 0) {
                setData({ ...data, anilist: { ...data.anilist, mediaListEntry: { ...data.anilist.mediaListEntry, progress: progress, status: 'CURRENT' } } });
                const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, 'CURRENT', undefined, progress);
            } else if (progress === data.anilist.episodes || progress === data.anilist.chapters || (data.anilist.format === 'NOVEL' && progress === data.anilist.volumes)) {
                setData({ ...data, anilist: { ...data.anilist, mediaListEntry: { ...data.anilist.mediaListEntry, progress: progress, status: 'COMPLETED' } } });
                const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, 'COMPLETED', undefined, progress);
            } else {
                setData({ ...data, anilist: { ...data.anilist, mediaListEntry: { ...data.anilist.mediaListEntry, progress: progress } } });
                const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, undefined, undefined, progress);
            }
        } else {
            setData({ ...data, anilist: { ...data.anilist, mediaListEntry: { ...data.anilist.mediaListEntry, progressVolumes: progress } } });
            const res = updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, (progress > 0 && data.anilist.mediaListEntry.status === 'PLANNING') ? 'CURRENT' : undefined, undefined, undefined, undefined, undefined, undefined, undefined, progress);
        }
    }

    const onPress = (index:number) => {
        setActive(index);
    }

    const onConfirm = () => {
        changeProgress(active);
        onClose();
    }

    const RenderItem = ({item, index}) => {
        return(
            <Pressable onPress={() => onPress(index)} style={{height:80, width:120, borderRadius:12, margin:5, backgroundColor:(active >= index) ? colors.colors.primary : colors.colors.card, borderWidth:1, borderColor:colors.colors.primary, justifyContent:'center', alignItems:'center'}}>
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
                <Button onPress={onClose} color={colors.colors.primary}>Cancel</Button>
                <Button onPress={onConfirm} color={colors.colors.primary}>Confirm</Button>
            </Dialog.Actions>
        </>
    );
}

const ScoreList = ({data, setData, onClose, colors}:StatusProps) => {
    const [score, setScore] = useState(data.anilist.mediaListEntry.score);
    const scoress = Array.from(Array(100).keys()).map(decimal => Math.round(.1*decimal));
    const scores = range(1, 100).map(number => (Math.round((.1*number)*100)/100));
    // const scores = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

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
export const ListEntryDialog = ({visible, setVisible, data, setData, colors, totalEP}:ListEntryModalProps) => {
    switch (visible.type) {
        case 'STATUS':
            return(
                <Dialog style={{backgroundColor:colors.colors.card}} visible={visible.vis} onDismiss={() => setVisible({...visible, vis:false})} >
                    <StatusList data={data} setData={setData} colors={colors} onClose={() => setVisible({...visible, vis:false})} />
                </Dialog>
            );
        case 'PROGRESS':
            return(
                <Dialog style={{backgroundColor:colors.colors.card, maxHeight:'80%'}} visible={visible.vis} onDismiss={() => setVisible({...visible, vis:false})} >
                    <ProgressList data={data} setData={setData} colors={colors} totalEP={totalEP} onClose={() => setVisible({...visible, vis:false})}/>
                </Dialog>
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