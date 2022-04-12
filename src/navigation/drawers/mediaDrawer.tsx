import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getMediaInfo, getMalData } from "../../Api";
import { AniMalType } from "../../Api/types";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { InfoProps } from "../../containers/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getMalImages } from "../../Api/mal";
import { StaffInfo } from "../../containers/staff/staffPage";
import { CharDetailScreen } from "../../containers/character";
import { MediaInfoScreen, MusicTab, NewsTab, StudioInfo, WatchTab } from "../../containers/mediadrawer";
import CharacterStack from "../stacks/character";
import { LoadingView } from "../../Components";
import FollowingTab from "../../containers/mediadrawer/following/following";
import { getIsAuth } from "../../Storage/authToken";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const InfoDrawer = ({ navigation, route }:InfoProps) => {
    const [data, setData] = useState<AniMalType>();
    const [loading, setLoading] = useState(true);
    const [aniLoading, setAniLoading] = useState(true);
    const [malLoading, setMalLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const { auth } = getIsAuth();
    const { id } = route.params;
    const { colors, dark } = useTheme();

    const fetchInfo = async () => {
        try{
            const result = await getMediaInfo(id);
            setAniLoading(result.res.data ? false : null);
            
            const maldata = await getMalData(result.res.data.data.Media.idMal, result.res.data.data.Media.type);
            setMalLoading(maldata.data?.data ? false : null);

            const images = await getMalImages(result.res.data.data.Media.idMal, result.res.data.data.Media.type);
            setImageLoading(images ? false : null);

            await new Promise(resolve => setTimeout(resolve, 500));

            return {anilist: result.res.data.data.Media, mal: maldata.data !== null ? maldata.data : {data: null}, images: images, isAuth: result.isAuth};
        } catch(err) {
            console.log('Drawer Fetch:', err);
            return null;
        }
    }

    useEffect(() => {
        if (data === undefined) {
            fetchInfo().then(res => {
                if (res !== null) {
                    setData(res);
                    setLoading(false);
                } else {
                    setData(null);
                }
            });
        }
    }, []);

    if (loading) return <LoadingView titleData={[{title:'Anilist Data', loading:aniLoading}, {title:'MAL Data', loading:malLoading}, {title:'MAL Images', loading:imageLoading}]} colors={{colors, dark}} />;
    if (data === null) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{color:colors.text, fontSize:18}}>Error</Text></View>
    return (
        <Drawer.Navigator initialRouteName="Overview" backBehavior="firstRoute" screenOptions={({ navigation, route }) => ({
            drawerPosition: 'right',
            drawerType: 'back',
            headerTransparent: true,
            swipeEdgeWidth: 10,
            drawerStatusBarAnimation: 'slide',
            drawerStyle: { width: '40%' }
        })}>
            <Drawer.Screen name="Overview" component={MediaInfoScreen} initialParams={{ data:data }} />
            {(data.anilist.characters.edges.length > 0) ? <Drawer.Screen name="CharacterStack" component={CharacterStack} initialParams={{ data:data }} options={{drawerLabel:'Characters', headerShown:false}} /> : null}
            {(data.anilist.type === 'ANIME' && data.anilist.streamingEpisodes.length > 0) ? <Drawer.Screen name="Watch" component={WatchTab} initialParams={{ data:data }} options={{headerTransparent: false, headerTitle:'Watch'}} /> : null}
            {(auth) && <Drawer.Screen name="Following" component={FollowingTab} initialParams={{id:data.anilist.id}} options={{headerShown:true, headerTransparent:false, headerTitle:'Following', headerStyle:{elevation:8}}}/>}
            {(data.anilist.type === 'ANIME') ? <Drawer.Screen name="Music" component={MusicTab} initialParams={{ id, coverImage: data.anilist.coverImage.extraLarge }} /> : null}
            {(data.mal) && <Drawer.Screen name="News" component={NewsTab} initialParams={{ mal_id:data.anilist.idMal, coverImage: data.anilist.coverImage.extraLarge, type: data.anilist.type }} />}
            {(data.anilist.studios.nodes.length > 0) ? <Drawer.Screen name="StudioInfo" component={StudioInfo} initialParams={{id: data.anilist.studios.nodes[0].id, name: data.anilist.studios.nodes[0].name}} options={{headerTitle:`${data.anilist.studios.nodes[0].name}`, drawerLabel:`${data.anilist.studios.nodes[0].name}`, headerStyle:{backgroundColor:colors.card}, headerTransparent:false}} /> : null}
        </Drawer.Navigator>
    );
}

export const DrawerStack = ({navigation, route}) => {
    const id = route.params.id;
    return(
        <Stack.Navigator >
            <Stack.Screen name="DrawerInfo" component={InfoDrawer} options={{headerShown:false}} initialParams={{id: id}} />
            <Stack.Screen name='Character' component={CharDetailScreen} options={{ headerTransparent:false}} />
            <Stack.Screen name="Staff" component={StaffInfo} options={{ headerTransparent:false}} />
        </Stack.Navigator>
    );
}
