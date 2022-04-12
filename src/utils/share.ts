import { Share } from 'react-native';

export const handleShare = async(url:string, title='') => {
    try {
        await Share.share({ 
            title:title,
            message:url,
        });
    } catch (error) {
        console.log(error);
    }
}