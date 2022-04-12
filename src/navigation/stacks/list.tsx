import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { DrawerStack } from "../drawers/mediaDrawer";
import { StaffInfo } from "../../containers/staff/staffPage";
import { ListTabs } from "../tabs/listTabs";
import { CharDetailScreen } from "../../containers/character";
import { View } from "react-native";
import { ListSearchProvider } from "../../Storage/listStorage";

const Stack = createNativeStackNavigator();

export const ListStack = ({navigation}) => {
    return(
        <View style={{flex:1}} collapsable={false}>
            <ListSearchProvider>
            <Stack.Navigator initialRouteName="UserList" screenOptions={{headerShown:false}}>
                <Stack.Screen name="UserList" component={ListTabs} options={{headerShown:true,}} initialParams={{type: 'ANIME', format:'Any', layout:'column'}} />
                <Stack.Screen name="UserListDetail" component={DrawerStack} />
                <Stack.Screen name='UserCharDetail' component={CharDetailScreen} options={{ headerShown:true, headerTintColor:'#FFF' }} />
                <Stack.Screen name='UserStaffDetail' component={StaffInfo} options={{ headerShown:true }} />
            </Stack.Navigator>
            </ListSearchProvider>
        </View>
    );
}