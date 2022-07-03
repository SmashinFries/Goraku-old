import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { DrawerStack } from "../drawers/mediaDrawer";
import { StaffInfo } from "../../containers/staff/staffPage";
import { ListTabs } from "../tabs/listTabs";
import { CharDetailScreen } from "../../containers/character";
import { View } from "react-native";
import { ListSearchProvider } from "../../Storage/listStorage";
import FavTabs from "../tabs/favoritesTab";
import DeviantArtPage from "../../containers/deviantArt/devartPage";
import DevArtDetail from "../../containers/deviantArt/devartDetail";

const Stack = createNativeStackNavigator();

export const ListStack = ({navigation}) => {
    return(
        <View style={{flex:1}} collapsable={false}>
            <ListSearchProvider>
                <Stack.Navigator initialRouteName="UserList" screenOptions={{headerShown:false}}>
                    <Stack.Screen name="UserList" component={ListTabs} options={{headerShown:true}} initialParams={{ format:'Any', type:'ANIME'}} />
                    <Stack.Screen name='Favorites' component={FavTabs} options={{headerShown:true}} />
                    <Stack.Screen name="UserListDetail" component={DrawerStack} initialParams={{isList:true}} />
                    <Stack.Screen name='UserCharDetail' component={CharDetailScreen} initialParams={{isList:true}} options={{ headerTintColor:'#FFF', headerShown:true }} />
                    <Stack.Screen name='UserStaffDetail' component={StaffInfo} options={{headerShown:true}} />
                    <Stack.Screen name="DeviantArtList" component={DeviantArtPage} initialParams={{isList:true}} options={{headerShown:true}}/>
                    <Stack.Screen name="DeviantArtListDetail" component={DevArtDetail} initialParams={{isList:true}} options={{headerShown:true}}/>
                </Stack.Navigator>
            </ListSearchProvider>
        </View>
    );
}