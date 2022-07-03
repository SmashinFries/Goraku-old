import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { CharacterTab, CharDetailScreen } from "../../containers/character";
import DeviantArtPage from "../../containers/deviantArt/devartPage";
import { StaffInfo } from "../../containers/staff/staffPage";
import { CharStackProps } from "../../containers/types";

const Stack = createNativeStackNavigator();

const CharacterStack = ({navigation, route}: CharStackProps) => {
    const { data } = route.params;
    return(
        <Stack.Navigator initialRouteName="Character" >
            <Stack.Screen name="Character" component={CharacterTab} initialParams={{ data:data }} options={{title:'Characters'}}  />
            <Stack.Screen name="CharDetail" component={CharDetailScreen} initialParams={{inStack: true}} />
            <Stack.Screen name="StaffDetail" component={StaffInfo} initialParams={{inStack: true}}/>
            <Stack.Screen name="DeviantArtDetail" component={DeviantArtPage} initialParams={{inStack: false}}/>
        </Stack.Navigator>
    );
}

export default CharacterStack;