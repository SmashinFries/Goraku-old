import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StaffInfo } from "../../containers/staff/staffPage";

const Stack = createNativeStackNavigator();

export const StaffStack = ({route}) => {
    const {id, name, malId, type, inStack} = route.params;
    return(
        <Stack.Navigator initialRouteName="Staff" screenOptions={{headerShown:true}} >
            <Stack.Screen name="Staff" component={StaffInfo} initialParams={{id, name, malId, type, inStack}} />
        </Stack.Navigator>
    );
}