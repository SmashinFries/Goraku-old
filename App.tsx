import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import React, { useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { LinkingOptions, NavigationContainer, PathConfigMap } from '@react-navigation/native';
import { BottomNav } from './src/navigation/root/bottomNav';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getTheme } from './src/Storage/themeStorage';
import { useAnilistAuth } from './src/auth/auth';
import { RefreshContext, ThemeContext, AccountContext } from './src/contexts/context';
import useNotification from './src/Notifications/notifications';
import { Provider as PaperProvider } from 'react-native-paper';
import { themeSwitch } from './src/Themes/themes';

const prefix = Linking.createURL('/');
const config:PathConfigMap<ReactNavigation.RootParamList> = {
    ExploreStack: {
      screens: {
        Explore: 'explore',
        Info: {
          path:'info/:type/:id',
          parse: {
            id: Number,
          }
        },
        StaffExplore: {
          path:'staff/:id',
          parse: {
            id: Number,
          }
        },
        CharacterExplore: {
          path:'character/:id',
          parse: {
            id: Number,
          }
        }
      }
    },
    MoreStack: {
      screens: {
        AccountStack: {
          screens: {
            AccountHome: {
              path: 'auth/:token?',
              parse: {
                access_token: (token) => `${token}`,
              },
            }
          }
        }
      }
    }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

const App = () => {
  const systemTheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState((systemTheme === 'light') ? 'Light' : 'Dark');
  const {isAuth, setIsAuth} = useAnilistAuth();
  const [refresh, setRefresh] = useState();
  const {receivedSubscription, responseSubscription} = useNotification(isAuth);

  const valueReset =  useMemo(() => ({ refresh, setRefresh }), [refresh]);
  const valueAuth =  useMemo(() => ({ isAuth, setIsAuth }), [isAuth]);
  const value =  useMemo(() => ({ theme, setTheme }), [theme]);
  const linking:LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [prefix],
    config: {screens:config},
  }

  useEffect(() => {
    getTheme().then(theme => {(theme !== null) ? setTheme(theme) : setTheme((systemTheme === 'light') ? 'Light' : 'Dark');});
  },[isAuth]);

  useEffect(() => {
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    }
  }, []);

  return (
    <PaperProvider>
    <GestureHandlerRootView style={{flex:1}}>
      {/* @ts-ignore */}
        <RefreshContext.Provider value={valueReset}>
          <ThemeContext.Provider value={value}>
            <AccountContext.Provider value={valueAuth}>
              <BottomSheetModalProvider>
                {/* @ts-ignore */}
                <NavigationContainer linking={linking} theme={themeSwitch(theme)}>
                  <BottomNav isAuth={isAuth} />
                  <StatusBar style={(theme.includes('Dark')) ? "light" : "dark"} translucent />
                </NavigationContainer>
              </BottomSheetModalProvider>
            </AccountContext.Provider>
          </ThemeContext.Provider>
        </RefreshContext.Provider>
    </GestureHandlerRootView>
    </PaperProvider>
  );
}

export default App;