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

const _openAuthBrowser = async () => {
    const deepLink = 'goraku://auth/';
    const url = 'https://anilist.co/api/v2/oauth/authorize?client_id=7515&response_type=token';
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