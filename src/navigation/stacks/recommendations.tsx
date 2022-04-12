import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { DrawerStack } from "../drawers/mediaDrawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RecommendationScreen } from "../../containers/recommendation/recommendationScreen";

const Stack = createNativeStackNavigator();

export const RecommendationStack = ({route}) => {
    const { isAuth } = route.params;
    return (
        <GestureHandlerRootView style={{flex:1}} collapsable={false}>
            <Stack.Navigator initialRouteName="Recommendations">
                <Stack.Screen name="Recommendations" component={RecommendationScreen} initialParams={{isAuth:isAuth}} options={{title:'Suggestions'}}/>
                <Stack.Screen name='RecInfo' component={DrawerStack} options={{headerShown: false}}/>
            </Stack.Navigator>
        </GestureHandlerRootView>
    );
}