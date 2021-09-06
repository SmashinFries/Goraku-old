import 'react-native-gesture-handler';
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from "react-native";
import { Icon, Text } from 'react-native-elements';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { DefaultTheme, DarkTheme, NavigationContainer, useTheme } from '@react-navigation/native';
import { HomeStack } from "./Screens/hmtabs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { SearchNav } from './Screens/search';
import { SettingsPage, ThemeContext } from './Screens/settings';
import { UserPage } from './Screens/userinfo';

const BTab = createMaterialBottomTabNavigator();

const config = {
  screens: {
    Explore: 'explore/',
    Find: 'search/',
    Setting: 'settings/',
    UserTab: 'user/'
  },
};

const linking = {
  prefixes: ['goraku://'],
  config,
};

const BottomNav = () => {
  const { colors } = useTheme();
  return(
    <BTab.Navigator initialRouteName='Explore' activeColor={colors.primary} inactiveColor={colors.text} shifting={true} >
      <BTab.Screen name='Explore' component={HomeStack} 
        options={{
          tabBarColor: colors.background,
          tabBarIcon: ({color}) => <Icon name='explore' type='material' color={color} size={25} />
        }} 
      />
      <BTab.Screen name='Find' component={SearchNav} 
        options={{
          title:'Search',
          tabBarColor: colors.background,
          tabBarIcon: ({color}) => <Icon name='search' type='material' color={color} size={25} />
        }} 
      />
      {/* <BTab.Screen name='UserTab' component={UserPage} 
        options={{
          title:'User',
          tabBarColor: colors.background,
          tabBarIcon: ({color}) => <Icon name='account-circle' type='material' color={color} size={25} />
        }} 
      /> */}
      <BTab.Screen name='Setting' component={SettingsPage} 
        options={{
          title:'Settings',
          tabBarColor: colors.background,
          tabBarIcon: ({color}) => <Icon name='settings' type='material' color={color} size={25} />
        }} 
      />
    </BTab.Navigator>
  );
}

const App = () => {
  const [theme, setTheme] = useState();
  const value = { theme, setTheme };

  const getTheme = async () => {
    try {
      const themeSet = await AsyncStorage.getItem('@Theme');
      setTheme((themeSet !== null) ? themeSet : 'Light');
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getTheme();
  }, []);

  return(
    <ThemeContext.Provider value={value} >
      <SafeAreaProvider>
        <NavigationContainer linking={linking} theme={(theme === 'Light') ? DefaultTheme : DarkTheme}>
          <StatusBar translucent={true} backgroundColor='rgba(0,0,0,0)' barStyle={((theme === 'Light')) ? 'dark-content' : 'light-content'} />
          <BottomNav />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

export default App;