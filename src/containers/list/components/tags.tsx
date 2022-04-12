import { Theme } from "@react-navigation/native";
import { View, Text } from "react-native";

type ProgressTagType = {
    progress: number;
    total: number;
    colors: Theme;
}
const ProgressTag = ({progress, total, colors}:ProgressTagType) => {
    return(
        <View style={{height:22, borderRadius:6, paddingHorizontal:5, backgroundColor:colors.colors.primary}}>
            <Text style={{textAlign:'center'}}>
                {total - progress}
            </Text>
        </View>
    );
}

type StatusTagProps = {
    mediaStatus: string;
}
const StatusTag = ({mediaStatus}:StatusTagProps) => {
    const status = (mediaStatus === 'RELEASING') ? 'Ongoing' 
        : (mediaStatus === 'FINISHED') ? 'Completed' 
        : (mediaStatus === 'NOT_YET_RELEASED') ? 'Upcoming' : mediaStatus;

    return(
        <View style={{height:22, borderRadius:6, paddingHorizontal:5, backgroundColor:'rgba(138, 240, 134,1)'}}>
            <Text style={{textTransform:'capitalize', textAlign:'center'}}>
                {status}
            </Text>
        </View>
    );
}

export { ProgressTag, StatusTag };