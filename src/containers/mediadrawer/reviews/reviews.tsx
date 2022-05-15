import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { ReviewsNode } from "../../../Api/types";
import { ReviewProps } from "../../types";
import { SummaryCard } from "./components/summaryCard";

const ReviewsTab = ({navigation, route}:ReviewProps) => {
    const [data, setData] = useState<ReviewsNode[]>(route.params.reviews);
    const { colors } = useTheme();
    
    const renderItem = ({item}:{item:ReviewsNode}) => {
        return(
            // @ts-ignore
            <SummaryCard colors={colors} review={item} onPress={() => navigation.navigate('ReviewBody', {review: item, setData:setData})} />
        );
    }
    return(
        <View style={{flex:1}}>
            <FlatList 
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.node.id.toString()}
                ItemSeparatorComponent={() => <View style={{height:10}}/>}
            />
            
        </View>
    );
}

export default ReviewsTab;