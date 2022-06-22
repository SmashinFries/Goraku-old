import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react";
import { MoreScreen } from "../../containers/more/moreUI";
import { SettingsStack } from "../../containers/more/settings";
import { MoreStackProps } from "../../containers/types";
import AccountStack from "./account";
import About from "../../containers/more/about/about";
import DataSources from "../../containers/more/datasources";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export const MoreStack = ({ navigation, route }: MoreStackProps) => {
    return (
        // Collapsable=false fixes blank screen
        <GestureHandlerRootView style={{flex:1}} collapsable={false}>
            <Stack.Navigator initialRouteName="MoreHome" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MoreHome" component={MoreScreen} options={{title: 'More'}} />
                <Stack.Screen name="AccountStack" component={AccountStack} />
                <Stack.Screen name="SettingsStack" component={SettingsStack} options={{ title: 'Settings' }} />
                <Stack.Screen name="About" component={About} />
                <Stack.Screen name='DataSources' component={DataSources} options={{ headerShown: true, title: 'Data Sources' }} />
            </Stack.Navigator>
        </GestureHandlerRootView>
    );
}