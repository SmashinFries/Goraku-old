import React, { Dispatch, SetStateAction, useState } from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import { ThemeColors } from "../../../../Components/types";
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateType } from "../../../../Api/types";
import { updateMediaListEntry } from "../../../../Api";

type ShowDate = {
    visible: boolean;
    time: 'start' | 'end' | undefined;
}
type Props = {
    data: any;
    dates: {start:DateType, end:DateType};
    setDates: Dispatch<SetStateAction<{start:DateType, end:DateType}>>;
    modalVisible: any;
    setModalVisible: Dispatch<SetStateAction<any>>;
    colors: ThemeColors;
}
const ListEntryUI = ({data, dates, setDates, modalVisible, setModalVisible, colors}:Props) => {
    const [showDate, setShowDate] = useState<ShowDate>({visible:false, time:undefined});
    type ItemProps = {
        entryVal: string | number;
        tempText: string;
        style?: ViewStyle;
        onPress?: () => void;
        onLongPress?: () => void;
    }

    const changeDate = async(time:'start'|'end', date:DateType) => {
        if (time === 'start') {
            setDates({...dates, start:date});
            const response = await updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, undefined, undefined, undefined, undefined, date);
        } else {
            setDates({...dates, end:date});
            const response = await updateMediaListEntry(undefined, data.anilist.mediaListEntry.id, undefined, undefined, undefined, undefined, undefined, date);
        }
        setShowDate({...showDate, visible:false});
    }

    const getDate = (time: 'start' | 'end') => {
        switch (time) {
            case 'start':
                if (!dates.start.year) return '?';
                return `${dates.start.year}-${dates.start.month}-${dates.start.day}`;
            case 'end':
                if (!dates.end.year) return '?';
                return `${dates.end.year}-${dates.end.month}-${dates.end.day}`;
        }
    }
    const EntryItem = ({ entryVal, tempText, style = {}, onLongPress=() => {}, onPress = () => {} }:ItemProps) => {
        return (
            <Pressable onLongPress={onLongPress} onPress={onPress} android_ripple={{ foreground: true, color: colors.primary, radius: 25 }} style={[style, { backgroundColor: colors.card, width: 120, height: 60, justifyContent: 'center', alignItems: 'center', borderColor: colors.border }]}>
                <Text style={{ color: (entryVal && entryVal !== '?') ? colors.text : '#b0b0b0', fontSize: 16, textTransform: 'capitalize' }}>{(entryVal && entryVal !== '?') ? entryVal : tempText}</Text>
                {/* {(entryVal && entryVal !== '?') ? <Text style={{fontSize:12, backgroundColor:colors.card, borderColor:colors.primary, borderWidth:.5, position:'absolute', paddingHorizontal:5, borderRadius:12, top:3, alignSelf:'center'}}>{tempText}</Text> : null} */}
            </Pressable>
        );
    }
    return (
        <View style={{ marginHorizontal: 8, paddingTop: 5, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <EntryItem entryVal={data.anilist.mediaListEntry.status} onPress={() => setModalVisible({ vis: true, type: 'STATUS' })} tempText='Status' style={{ borderTopLeftRadius: 12 }} />
                <EntryItem entryVal={data.anilist.mediaListEntry.score} onPress={() => setModalVisible({ vis: true, type: 'SCORE' })} tempText='Score' style={{ borderLeftWidth: 1 }} />
                <EntryItem entryVal={(data.anilist.format === 'NOVEL') ? data.anilist.mediaListEntry.progressVolumes : data.anilist.mediaListEntry.progress} onPress={() => setModalVisible({ vis: true, type: 'PROGRESS' })} tempText={(data.anilist.type === 'ANIME') ? 'Progress' : (data.anilist.format === 'NOVEL') ? 'Volumes' : 'Chapters'} style={{ borderLeftWidth: 1, borderTopRightRadius: 12 }} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <EntryItem entryVal={getDate('start')} tempText='Started' onPress={() => setShowDate({visible:true, time:'start'})} style={{ borderBottomLeftRadius: 12 }} />
                <EntryItem entryVal={getDate('end')} tempText='Ended' onPress={() => setShowDate({visible:true, time:'end'})} style={{ borderLeftWidth: 1 }} />
                <EntryItem entryVal={data.anilist.mediaListEntry.repeat} tempText='Repeats' onPress={() => setModalVisible({ vis: true, type: 'REPEAT' })} style={{ borderLeftWidth: 1, borderBottomRightRadius: 12 }} />
            </View>
            {showDate.visible && <DateTimePicker
                display="default"
                value={new Date()}
                onChange={(event, date) => {
                    (date) ? changeDate(showDate.time, {year:date.getFullYear(), month:date.getMonth()+1, day:date.getDate()}) : setShowDate({...showDate, visible:false});
                    (event.type === 'neutralButtonPressed') && changeDate(showDate.time, {day:null, month:null, year:null});
                }}
                neutralButtonLabel="clear"
            />}
        </View>
    )
}

export default ListEntryUI;