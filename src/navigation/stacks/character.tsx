import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { CharacterTab, CharDetailScreen } from "../../containers/character";
import { StaffInfo } from "../../containers/staff/staffPage";
import { CharStackProps } from "../../containers/types";

const Stack = createNativeStackNavigator();

const CharacterStack = ({navigation, route}: CharStackProps) => {
    const { data } = route.params;
    return(
        <Stack.Navigator initialRouteName="Character" screenOptions={{headerTransparent:false}} >
            <Stack.Screen name="Character" component={CharacterTab} initialParams={{ data:data }} options={{headerTransparent:true}} />
            <Stack.Screen name="CharDetail" component={CharDetailScreen} initialParams={{inStack: true}} />
            <Stack.Screen name="StaffDetail" component={StaffInfo} initialParams={{inStack: true}}/>
        </Stack.Navigator>
    );
}

export default CharacterStack;