import React, { useState } from "react";
import { useWindowDimensions, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartConfig } from "react-native-chart-kit/dist/HelperTypes";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Dialog, Menu, Portal } from "react-native-paper";
import { Svg, Text as TextSVG } from 'react-native-svg';
import { ThemeColors } from "../../../../Components/types";
import { rgbConvert } from "../../../../utils";

type Props = {
    data: any[];
    colors:ThemeColors;
}
const LineChartCard = ({data, colors}:Props) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [activeItem, setActiveItem] = useState(null);
    const { width, height } = useWindowDimensions();
    const primaryColor = rgbConvert(colors.primary, 1);

    const onDismiss = () => setVisible(false);

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

    const dataSet:LineChartData = {
        labels: (data.map((item, index) => {return item.releaseYear.toString()})),
        datasets: [{
            data: (data.map((item, index) => {return item.count})),
            color: (opacity = 1) => primaryColor, // optional
            strokeWidth: 2 // optional
        }]
    };

    return(
        <View style={{flex:1, marginTop:15, marginHorizontal:20}}>
            <Card style={{backgroundColor:colors.card}}>
                <Card.Title title='Release Year' style={{ backgroundColor: colors.primary }} />
                <Card.Content>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                        <LineChart 
                            data={dataSet}
                            width={width*2.8}
                            height={190}
                            style={{justifyContent:'center'}}
                            chartConfig={chartConfig}
                            onDataPointClick={({index}) => {setActiveItem(data[index]); setVisible(true);}}
                            bezier
                            withShadow={false}
                            renderDotContent={({index, indexData, x, y}) => 
                                <TextSVG
                                    key={index}
                                    x={x}
                                    y={y - 10}
                                    fill={colors.text}
                                    fontSize='16'
                                    fontWeight='normal'
                                    textAnchor='middle'>
                                    {indexData}
                                </TextSVG>
                            }
                            transparent
                            withHorizontalLines={false}
                            withVerticalLines={false}
                            withHorizontalLabels={false}
                        />
                    </ScrollView>
                </Card.Content>
            </Card>
            <Portal>
                <Dialog visible={visible} onDismiss={onDismiss} style={{backgroundColor:colors.card}}>
                    <Dialog.Title>{activeItem?.releaseYear}</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{color:colors.text}}>{`Count: ${activeItem?.count}`}</Text>
                        <Text style={{color:colors.text}}>{`Mean Score: ${activeItem?.meanScore}`}</Text>
                        <Text style={{color:colors.text}}>{`${activeItem?.minutesWatched ? 'Hours Seen' : 'Chapters Read'}: ${activeItem?.minutesWatched ? (activeItem?.minutesWatched / 60).toFixed(0) : activeItem?.chaptersRead}`}</Text>
                        {(activeItem?.standardDeviation) ? <Text style={{color:colors.text}}>{`Standard Deviation: ${activeItem?.standardDeviation}`}</Text> : null}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onDismiss} color={colors.primary}>Cool</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

export default LineChartCard;