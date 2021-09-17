import 'react-native-gesture-handler';
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from "react-native";
import { Icon } from 'react-native-elements';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { DefaultTheme, DarkTheme, NavigationContainer, useTheme } from '@react-navigation/native';
import { HomeStack } from "./Screens/hmtabs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchNav } from './Screens/search';
import { SettingsPage, ThemeContext } from './Screens/settings';
import { UserPage } from './Screens/userinfo';
import { ListPage } from './Screens/lists';

const BTab = createMaterialBottomTabNavigator();

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#28c922',
    inactive: '#d1d1d1',
  }
};

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#28c922',
    inactive: '#000',
  }
};

const config = {
  screens: {
    Explore: 'explore/',
    Find: 'search/',
    Setting: 'settings/',
    UserTab: {
      screens: {
        UserPage: {
          path: 'user/:access_token?',
          parse: {
            access_token: (access_token) => `${access_token}`,
          },
        },
      },
    },
  },
};

const linking = {
  prefixes: ['goraku://'],
  config,
};

const BottomNav = () => {
  const { colors } = useTheme();

  return(
    <BTab.Navigator initialRouteName='Explore' activeColor={colors.primary} inactiveColor={colors.inactive} shifting={true} barStyle={{height:50, backgroundColor:colors.background}} >
      <BTab.Screen name='Explore' component={HomeStack} 
        options={{
          tabBarIcon: ({color}) => <Icon name='explore' type='material' color={color} size={22} />
        }} 
      />
      <BTab.Screen name='Find' component={SearchNav} 
        options={{
          title:'Search',
          tabBarIcon: ({color}) => <Icon name='search' type='material' color={color} size={22} />
        }} 
      />
      <BTab.Screen name='Lists' component={ListPage}
        options={{
          title:'Lists',
          tabBarIcon: ({color}) => <Icon name='view-list' type='material' color={color} size={22} />
        }} 
      />
      <BTab.Screen name='UserTab' component={UserPage} 
        options={{
          title:'User',
          tabBarIcon: ({color}) => <Icon name='account-circle' type='material' color={color} size={22} />
        }} 
      />
      <BTab.Screen name='Setting' component={SettingsPage} 
        options={{
          title:'Settings',
          tabBarIcon: ({color}) => <Icon name='settings' type='material' color={color} size={22} />
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
        <NavigationContainer linking={linking} theme={(theme === 'Light') ? LightTheme : MyTheme}>
          <StatusBar translucent={true} backgroundColor='rgba(0,0,0,0)' barStyle={((theme === 'Light')) ? 'dark-content' : 'light-content'} />
          <BottomNav />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

export default App;