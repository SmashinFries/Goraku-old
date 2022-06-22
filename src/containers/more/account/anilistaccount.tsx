import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Caption } from "react-native-paper";
import { changeNSFW, getUserOptions } from "../../../Api";
import { UserOptionViewer } from "../../../Api/types";
import { LoadingView } from "../../../Components";
import { NotificationContext } from "../../../contexts/context";
import useNotification from "../../../Notifications/notifications";
import { checkTokenExpiration } from "../../../Storage/authToken";
import { storeNSFW } from "../../../Storage/nsfw";
import { _openBrowserUrl } from "../../../utils";
import { MLMenuButton, NSFWswitch, ProfileMenuButton } from "./components/buttons";
import UserHeader from "./components/userHeading";

const AnilistAccount = ({navigation, route}) => {
    const isAuth:boolean = route.params.auth;
    const [ userData, setUserData ] = useState<UserOptionViewer>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const { isAllowed, toggleFetchTask } = useNotification(isAuth);
    const { colors, dark } = useTheme();

    const value =  useMemo(() => ({ isAllowed, toggleFetchTask }), [isAllowed]);

    const adultContentWarning = () => {
        return 'The uncensored version on Github is required.';
    }

    const handleNSFW = async() => {
        await changeNSFW(!userData.options.displayAdultContent);
        setUserData({...userData, options: {...userData.options, displayAdultContent: !userData.options.displayAdultContent}});        
    }

    const editProfile = async() => {
        await _openBrowserUrl('https://anilist.co/settings', colors.primary, colors.text);
        setLoading(true);
        const data = await getUserOptions()
        setUserData(data);
        storeNSFW(data.options.displayAdultContent);
        setLoading(false);
    }

    useEffect(() => {
        let isMount = true;
        getUserOptions().then(data => {
            if(isMount) {
                setUserData(data);
                storeNSFW(data.options.displayAdultContent);
                setLoading(false);
            }
        });

        return () => {
            isMount = false;
        }
    },[]);

    if (loading) return <LoadingView titleData={[{title:'AnilistAccount', loading:loading}]} colors={colors} />

    return(
        <NotificationContext.Provider value={value}>
            <ScrollView style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
                {(userData && isAuth) && 
                    <UserHeader userData={userData} colors={colors} />
                }
                {(isAuth) &&
                    <View>
                        <MLMenuButton userData={userData} navigation={navigation} colors={colors} />
                        <ProfileMenuButton 
                            userData={userData}
                            onPress={editProfile} 
                            colors={colors}
                        />
                        <NSFWswitch userData={userData} adultContentWarning={adultContentWarning} handleNSFW={handleNSFW} colors={colors} />
                    </View>
                }
                {/* Disabling Notifications */}
                {/* {(isAuth) && 
                        <List.Item 
                            title="Notifications" 
                            titleStyle={{color:colors.text}} 
                            left={props => <List.Icon {...props} icon="bell" color={colors.primary} />}
                            right={() => <Switch value={isAllowed} onValueChange={toggleFetchTask} color={colors.primary} />}
                        /> 
                    } */}
            </ScrollView>
        </NotificationContext.Provider>
    );
}

export default AnilistAccount;