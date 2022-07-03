import 'expo-dev-client';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LinkingOptions, NavigationContainer, PathConfigMap } from '@react-navigation/native';
import { BottomNav } from './src/navigation/root/bottomNav';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getTheme } from './src/Storage/themeStorage';
import { useAnilistAuth } from './src/auth/auth';
import { RefreshContext, ThemeContext, AccountContext } from './src/contexts/context';
import useNotification from './src/Notifications/notifications';
import { Portal, Provider as PaperProvider } from 'react-native-paper';
import * as NavigationBar from 'expo-navigation-bar';
import { themeSwitch } from './src/Themes/themes';
import DownloadDialog from './src/Components/dialogs/downloadDialog';
import { useRelease } from './src/Api/github/github';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableFreeze } from 'react-native-screens';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as Font from 'expo-font';

enableFreeze(true);

const prefix = Linking.createURL('/');
const config: PathConfigMap<ReactNavigation.RootParamList> = {
  ExploreStack: {
    screens: {
      Explore: 'explore',
      Info: {
        path: 'info/:type/:id',
        parse: {
          id: Number,
        }
      },
      StaffExplore: {
        path: 'staff/:id',
        parse: {
          id: Number,
        }
      },
      CharacterExplore: {
        path: 'character/:id',
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

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: true,
//   }),
// });

const App = () => {
  const systemTheme = Appearance.getColorScheme();
  let [fontsLoaded] = useFonts({Inter_900Black,})
  const [appReady, setAppReady] = useState<boolean>(false);
  const [theme, setTheme] = useState((systemTheme === 'light') ? 'Light' : 'Dark');
  const [refresh, setRefresh] = useState();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { newVersion } = useRelease();
  const { isAuth, setIsAuth } = useAnilistAuth();
  // const {receivedSubscription, responseSubscription} = useNotification(isAuth);

  const valueReset = useMemo(() => ({ refresh, setRefresh }), [refresh]);
  const valueAuth = useMemo(() => ({ isAuth, setIsAuth }), [isAuth]);
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [prefix],
    config: { screens: config },
  }

  const prepare = async() => {
    try{
      await SplashScreen.preventAutoHideAsync();
      await Font.loadAsync({Inter_900Black});
    } catch(e) {
      console.log('Start Error:', e);
    } finally {
      setAppReady(true);
    }
  }

  const onLayoutRoot = useCallback(async() => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    getTheme().then(theme => { (theme !== null) ? setTheme(theme) : setTheme((systemTheme === 'light') ? 'Light' : 'Dark'); });
  }, [isAuth]);

  useEffect(() => {
    if (newVersion.isNew) {
      setShowDialog(true);
    }
  }, [newVersion.isNew]);

  useEffect(() => {
    prepare();
    // return () => {
    //   receivedSubscription.remove();
    //   responseSubscription.remove();
    // }
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* @ts-ignore */}
          <RefreshContext.Provider value={valueReset}>
            <ThemeContext.Provider value={value}>
              <AccountContext.Provider value={valueAuth}>
                <BottomSheetModalProvider>
                  {/* @ts-ignore */}
                  <NavigationContainer onReady={onLayoutRoot} linking={linking} theme={themeSwitch(theme)}>
                    <BottomNav isAuth={isAuth} />
                    <StatusBar style={(theme.toLowerCase().includes('dark')) ? "light" : "dark"} translucent />
                    <Portal>
                      <DownloadDialog release={newVersion.release} visible={showDialog} onDismiss={() => setShowDialog(false)} colors={themeSwitch(theme).colors} />
                    </Portal>
                  </NavigationContainer>
                </BottomSheetModalProvider>
              </AccountContext.Provider>
            </ThemeContext.Provider>
          </RefreshContext.Provider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;