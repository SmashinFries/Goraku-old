import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { HeaderBackground, HeaderRightButtons } from "../../Components/header/headers";
import { ActivitiesScreen, StatisticsScreen } from "../../containers/user";

const Drawer = createDrawerNavigator();

const UserDrawer = () => {
    const { colors, dark } = useTheme();
    return(
        <Drawer.Navigator initialRouteName="Overview" backBehavior="firstRoute" screenOptions={({ navigation, route }) => ({
            drawerPosition: 'right',
            drawerType: 'back',
            swipeEdgeWidth: 10,
            headerTransparent: true,
            drawerStatusBarAnimation: 'slide',
            drawerStyle: { width: '40%' },
            headerShadowVisible: true,
            headerLeft: () => null,
            headerBackground: () => <HeaderBackground colors={colors} />,
            headerRight: () => 
                <View style={{ paddingRight: 15 }}>
                    <HeaderRightButtons
                        colors={colors}
                        navigation={navigation}
                        drawer 
                    />
                </View>
        })}>
            <Drawer.Screen name='Activities' component={ActivitiesScreen} />
            <Drawer.Screen name='Statistics' component={StatisticsScreen} options={{headerTransparent:false, title:'Weeb Statistics', drawerLabel:'Statistics'}} />
        </Drawer.Navigator>
    );
}

export default UserDrawer;