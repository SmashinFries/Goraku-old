import { Theme } from "@react-navigation/native";
import { View, Text } from "react-native";
import { nextAiringEpisodeType } from "../../../Api/types";
import { MaterialIcons } from '@expo/vector-icons';
import { getTime } from "../../../utils";

type ProgressTagType = {
    progress: number;
    colors: Theme;
}
const ProgressTag = ({progress, colors}:ProgressTagType) => {
    if (progress <= 0) return null;
    return(
        <View style={{height:22, borderRadius:6, paddingHorizontal:5, backgroundColor:colors.colors.primary}}>
            <Text style={{textAlign:'center'}}>
                {progress}
            </Text>
        </View>
    );
}

type StatusTagProps = {
    mediaStatus: string;
    nextAiringEpisode: nextAiringEpisodeType;
}
const StatusTag = ({mediaStatus, nextAiringEpisode}:StatusTagProps) => {
    const status = (mediaStatus === 'RELEASING') ? 'Ongoing' 
        : (mediaStatus === 'FINISHED') ? 'Completed' 
        : (mediaStatus === 'NOT_YET_RELEASED') ? 'Upcoming' : mediaStatus;

    return(
        <View style={{height:22, borderRadius:6, paddingHorizontal:5, backgroundColor:'rgba(138, 240, 134,1)'}}>
            {(status === 'Ongoing' && nextAiringEpisode) ? 
                <Text style={{ textAlign: 'center' }}>
                    <Text style={{ textAlign: 'center', fontWeight:'bold' }}>
                        {nextAiringEpisode.episode + ' '} 
                    </Text>
                     | {getTime(nextAiringEpisode.timeUntilAiring)}
                </Text>
                :
                <Text style={{ textAlign: 'center' }}>
                    {status}
                </Text>
            }
        </View>
    );
}

export { ProgressTag, StatusTag };