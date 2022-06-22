import { openURL } from 'expo-linking';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'

const _openBrowserUrl = async (url:string, primaryColor:string, textColor:string, disableBackButton=false) => {
    try {
        if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url,
                {
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right'
                    },
                    showTitle: true,
                    toolbarColor: primaryColor,
                    secondaryToolbarColor: textColor,
                    navigationBarColor: primaryColor,
                    enableUrlBarHiding: true,
                    hasBackButton: disableBackButton,
                });
        } else {
            openURL(url);
        }
    } catch (error) {
        console.log('Browser:', error);
    }
}

type AccountType = 'Anilist' | 'DeviantArt';
const getAuthURL = (type:AccountType):string => {
    const aniUrl = 'https://anilist.co/api/v2/oauth/authorize?client_id=7515&response_type=token';
    const devUrl = 'https://www.deviantart.com/oauth2/authorize?response_type=token&client_id=20047&scope=browse%20user&state=gorakuApp&redirect_uri=goraku://auth/';
    if (type === 'Anilist') {
        return aniUrl;
    }
    if (type === 'DeviantArt') {
        return devUrl;
    }
}
const _openAuthBrowser = async (type:AccountType) => {
    const deepLink = 'goraku://auth/';
    const url = getAuthURL(type);
    try {
        if (await InAppBrowser.isAvailable()) {
            InAppBrowser.openAuth(url, deepLink, {
                showTitle: true,
                enableUrlBarHiding: true,
                enableDefaultShare: false,
            });
        } else {
            openURL(url);
        }
    } catch (error) {
        openURL(url);
        console.log('AuthBrowser:', error);
    }
}

export { _openBrowserUrl, _openAuthBrowser }