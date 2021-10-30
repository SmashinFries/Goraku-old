import * as Keychain from 'react-native-keychain';

export const getToken = async() => {
    try {
        const token = await Keychain.getGenericPassword();
        if (token !== false) {
            return token.password;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

export const storeToken = async(token) => {
    if (typeof token === 'string') {
        let auth = token.slice(14).split('&');
        try {
            await Keychain.setGenericPassword('Bearer ', auth[0]);
        } catch (error) {
            console.log(error);
        }
    }
}