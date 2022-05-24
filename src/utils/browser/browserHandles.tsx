import * as WebBrowser from 'expo-web-browser';

const _openBrowserUrl = async (url:string) => {
    let result = await WebBrowser.openBrowserAsync(url);
    return result
}

export { _openBrowserUrl }