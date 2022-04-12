import React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { ChartConfig } from "react-native-chart-kit/dist/HelperTypes";
import { Card } from "react-native-paper";
import { ThemeColors } from "../../../../Components/types";
import { rgbConvert } from "../../../../utils";

type Props = {
    data: any[];
    title: string;
    itemTitle: string;
    colors: ThemeColors;
}
const BarChartCard = ({data, title, itemTitle, colors}:Props) => {
    const { width, height } = useWindowDimensions();

    const chartConfig:ChartConfig = {
        labelColor: (opacity = 1) => rgbConvert(colors.primary, opacity),
        backgroundGradientFrom: "transparent",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "transparent",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        useShadowColorFromDataset: false // optional
    };

    const dataSet = {
        labels: data.map((item, index) => {return item[itemTitle]?.toString() ?? 'Unknown'}),
        datasets: [
          {
            data: data.map((item) => {return item.count.toString()})
          }
        ]
      };

    return(
        <View style={{flex:1, marginTop:15, marginHorizontal:20}}>
            <Card>
                <Card.Title title={title} style={{ backgroundColor: colors.primary }} />
                <Card.Content>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                        <BarChart
                            data={dataSet}
                            width={width*1.2}
                            height={220}
                            chartConfig={chartConfig}
                            withHorizontalLabels={false}
                            yAxisLabel=''
                            yAxisSuffix=""
                            showValuesOnTopOfBars
                            withInnerLines={false}
                        />
                    </ScrollView>
                </Card.Content>
            </Card>
        </View>
    );
}

export default BarChartCard;