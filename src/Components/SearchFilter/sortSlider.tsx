import MultiSlider, { LabelProps } from "@ptomasroos/react-native-multi-slider";
import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { AnimPressable } from "../animated/AnimPressable";

type SliderProps = {
    header: string;
    values: number[];
    range: number[];
    activeColor: string;
    markerColor: string;
    onValueChange: (value: number[]) => void;
    textColor: string;
    width: number;
}
export const SliderFilter = ({header, values, range, width, activeColor, markerColor, textColor, onValueChange }:SliderProps) => {
    const animValue = useRef(new Animated.Value(0)).current;
    const scaleButton = (scale:number) => {
        Animated.spring(animValue, {
            toValue: scale,
            useNativeDriver: true,
        }).start();
    }

    const CustomLabel = (props:LabelProps) => {
        return(
            <View style={{position:'relative'}}>
                
                {Number.isFinite(props.oneMarkerLeftPosition) && 
                <View style={[{ position: 'absolute', left: props.oneMarkerLeftPosition -45 /2 , width:45, bottom:-65,  backgroundColor:'#FFF', borderRadius:30/3, paddingHorizontal:5}]}>
                    <Text style={{textAlign:'center'}}>{props.oneMarkerValue}</Text>
                </View>}

                {Number.isFinite(props.twoMarkerLeftPosition) && 
                <View style={[{ position: 'absolute', left: props.twoMarkerLeftPosition -45 /2 , width:45, bottom:-65,  backgroundColor:'#FFF', borderRadius:30/3, paddingHorizontal:5}]}>
                    <Text style={{textAlign:'center'}}>{props.twoMarkerValue}</Text>
                </View>}
            </View>
        );
    }

    useEffect(() => {
        if (values[0] === range[0] && values[1] === range[1]) {
            scaleButton(0);
        }
    },[values]);

    return(
        <View style={{flex:1, alignItems:'center', marginTop:20}}>
            <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:18, color:textColor}}>{header}</Text>
                {(values[0] !== range[0] || values[1] !== range[1]) ? 
                    <AnimPressable onLayout={() => scaleButton(1)} onPress={() => {onValueChange(range);}} style={{position:'absolute', transform:[{scale:animValue}], right:-55, backgroundColor:'red', borderRadius:12, alignItems:'center', paddingHorizontal:5}}>
                        <Text style={{color:'#FFF'}}>Reset</Text>
                    </AnimPressable> 
                : null}
            </View>
            <MultiSlider 
                values={values}
                min={range[0]}
                max={range[1]}
                onValuesChange={onValueChange}
                customLabel={(props) => <CustomLabel {...props} />}
                trackStyle={{height:5}}
                selectedStyle={{backgroundColor:activeColor}}
                markerStyle={{height:20, width:20, borderRadius:10, backgroundColor:markerColor}}
                enableLabel={true}
                snapped={false}
                isMarkersSeparated={true}
                sliderLength={width - ((width/100)*15)}
            />
        </View>
    );
}