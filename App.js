// React
import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
// UI
import { Icon } from 'react-native-elements';
// Navigation
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer, useTheme, useNavigation } from '@react-navigation/native';
// Components
import { SearchNav } from './Screens/search';
import { SettingsPage, ThemeContext } from './Screens/settings';
import { HomeStack } from "./Screens/hmtabs";
import { UserPage } from './Screens/userinfo';
import { ListPage } from './Screens/lists';
// Data
import BackgroundFetch from 'react-native-background-fetch';
import { getTheme, LightTheme } from './Utils/themes';



const BTab = createMaterialBottomTabNavigator();

const config = {
  screens: {
    Explore: 'explore/',
    Find: 'search/',
    Setting: 'settings/',
    Lists: 'list/',
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
  const navigation = useNavigation();
  useEffect(() => {
    if (global.NotifNav === true) {
      navigation.navigate('UserTab', {
        screen: 'UserPage',
        params: {
          screen: 'Notifications'
        }
      });
    }
  },[]);

  return(
    <BTab.Navigator initialRouteName='Explore' activeColor={colors.primary} inactiveColor={colors.inactive} labeled={false} shifting={true} barStyle={{height:50, backgroundColor:colors.background}} >
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
  const [theme, setTheme] = useState({theme:'Light', object:LightTheme});
  const value = { theme, setTheme };

  useEffect(() => {
    getTheme().then(themes => {
      setTheme({theme:themes.theme, object:themes.object});
    });
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 60,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        stopOnTerminate:false,
        enableHeadless:true,
      },
      async (taskId) => {
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.error('Background fetch failed:', error);
      }
    );
  }, []);

  return(
    <ThemeContext.Provider value={value} >
      <NavigationContainer linking={linking} theme={theme.object}>
        <StatusBar translucent={true} backgroundColor='rgba(0,0,0,0)' barStyle={((theme.object.dark === false)) ? 'dark-content' : 'light-content'} />
        <BottomNav />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

export default App;