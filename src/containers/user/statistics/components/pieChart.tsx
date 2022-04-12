import React, { useState } from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Card, List } from "react-native-paper";
import { ThemeColors } from "../../../../Components/types";
import { rgbConvert } from "../../../../utils";
import { listColor } from "../../../../utils/colors/scoreColors";

type PieChartProps = {
    data: any[];
    itemName: string;
    graphColors: string[];
    width: number;
    height: number;
    backgroundColor?: string;
}
const AnilistPieChart = ({data, itemName, graphColors, width, height, backgroundColor}:PieChartProps) => {
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    const dataSet = data.map((stat, index) => {
        return {
            name: stat[itemName], 
            count: stat.count,
            color: (itemName === 'status') ? listColor(stat[itemName]) : graphColors[index], 
            legendFontColor: "#7F7F7F",
            legendFontSize: 14
        }
    });

    return(
        <PieChart data={dataSet} width={width} height={height} chartConfig={chartConfig} backgroundColor={backgroundColor ?? 'transparent'} accessor={"count"} paddingLeft={'0'} />
    );
}

const MetaInfo = ({title, info, colors}) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    
    return (
        <List.Accordion title={title} theme={{colors:{primary:colors.primary, background:colors.background, text:colors.text}}} expanded={expanded} onPress={() => setExpanded(!expanded)}>
            <List.Item title={'Count'} titleStyle={{color:colors.text}} right={(props) => <Text style={{color: colors.text, textAlignVertical:'center'}}>{info.count}</Text>} />
            <List.Item title={(info.minutesWatched) ? 'Hours Watched' : 'Chapters Read'} titleStyle={{color:colors.text}} right={(props) => <Text style={{color: colors.text, textAlignVertical:'center'}}>{(info.minutesWatched) ? (info.minutesWatched / 60).toFixed(0) : info.chaptersRead}</Text>} />
            <List.Item title={'Mean Score'} titleStyle={{color:colors.text}} right={(props) => <Text style={{color: colors.text, textAlignVertical:'center'}}>{info.meanScore}</Text>} />
        </List.Accordion>
    );
}

type PieChartCardProps = {
    data: any;
    title: string;
    itemName: string;
    itemType: string;
    colors:ThemeColors;
    width:number;
} 
const PieChartCard = ({data, title, itemName, itemType, colors, width}:PieChartCardProps) => {
    const graphColors:string[] = ((1 / data[itemType].length) !== 1) ? 
        data[itemType].map((value, index) => rgbConvert(colors.primary, (1 / data[itemType].length) * index)).reverse()
        : [colors.primary];

    return (
        <View style={{flex:1, marginTop:15}}>
            <Card style={{backgroundColor:colors.card}}>
                <Card.Title title={title} style={{ backgroundColor: colors.primary }} />
                <Card.Content>
                    <View>
                        <AnilistPieChart data={data[itemType]} itemName={itemName} graphColors={graphColors} height={150} width={width - 10} />
                        {data[itemType].map((info, index) =>
                            <MetaInfo key={index} colors={colors} title={info[itemName]} info={info} />
                        )}
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}

export { AnilistPieChart, PieChartCard };