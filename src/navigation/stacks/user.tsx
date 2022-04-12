import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { DrawerStack } from "../drawers/mediaDrawer";
import ActivitiesScreen from "../../containers/user/activities/activitiesScreen";
import UserDrawer from "../drawers/userDrawer";

const Stack = createNativeStackNavigator();

const UserStack = () => {
    return(
        <View style={{flex:1}} collapsable={false}>
            <Stack.Navigator initialRouteName="User" screenOptions={{headerShown:false}}>
                <Stack.Screen name="User" component={UserDrawer} options={{title:'Activity'}} />
                <Stack.Screen name="MediaDetail" component={DrawerStack} options={{headerShown:false}} />
            </Stack.Navigator>
        </View>
    );
}

export default UserStack;