import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AccountHome, ChooseLanguage } from "../../containers/more/account/account";
import AnilistAccount from "../../containers/more/account/anilistaccount";

const Stack = createNativeStackNavigator();

const AccountStack = () => {
    const { colors, dark } = useTheme();
    return(
        <Stack.Navigator initialRouteName="AccountHome" screenOptions={{headerStyle:{backgroundColor:colors.card}}}>
            <Stack.Screen name="AccountHome" component={AccountHome} initialParams={{token:''}} options={{title:'Account'}} />
            <Stack.Screen name="AnilistAccount" component={AnilistAccount} options={{title:'Anilist'}} />
            <Stack.Screen name="Languages" component={ChooseLanguage} options={{title:'Account'}} />
        </Stack.Navigator>
    );
}

export default AccountStack;