import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, ScrollView, TextInput } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { IconButton, Portal } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { getURLtrace, searchCameraImage, searchLocalImage } from "../../Api/tracemoe";
import { TraceMoeType } from "../../Api/types";
import { LoadingView, TraceMoeUI } from "../../Components";
import FastImage from "react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import QrScanner from "../../Components/qrScanner";

export const TraceMoeScreen = ({navigation, route}) => {
    const [moeImage, setMoeImage] = useState<TraceMoeType>();
    const [image, setImage] = useState<ImagePicker.ImageInfo>();
    const [scanVis, setScanVis] = useState<boolean>(false);
    const [searchUrl, setSearchUrl] = useState<string>('');
    const [currentImage, setCurrentImage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [status, requestPermission] = ImagePicker.useCameraPermissions();

    const { colors, dark } = useTheme();

    const openGallery = async () => {
        const res = await searchLocalImage();
        if (res?.result) {
            setLoading(true);
            setCurrentImage(res.image);
            setMoeImage(res.result);
            setLoading(false);
        }
    }

    const openCamera = async () => {
        if (status) {
            try {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    base64: true,

                });
                if (!result.cancelled) {
                    setLoading(true);
                    // @ts-ignore
                    setImage(result);
                    // @ts-ignore
                    setCurrentImage('data:image/jpeg;base64,' + result.base64);
                    // @ts-ignore
                    const res = await searchCameraImage(result.uri)
                    if (res) {
                        setMoeImage(res);
                        setLoading(false);
                    }
                }
            } catch (e) {
                console.warn(e);
            }

        } else {
            console.log('No perm');
            await requestPermission();
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => 
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <IconButton icon='qrcode-scan' size={26} onPress={() => setScanVis(true)} color={colors.text} rippleColor={colors.primary} />
                <IconButton icon={'image-search-outline'} size={26} onPress={() => openGallery()} color={colors.text} rippleColor={colors.primary} />
                <IconButton icon={'camera-outline'} size={26} onPress={() => openCamera()} color={colors.text} rippleColor={colors.primary} />
            </View>,
        });
    },[navigation, dark])

    const handleURLTrace = async(url:string) => {
        try{
            setLoading(true);
            setCurrentImage(url);
            const res = await getURLtrace(url);
            setMoeImage(res);
            setLoading(false);
        } catch(err){
            console.log(err);
        }
    }

    const CurrentImage = () => {
        return(
            <View style={{ alignSelf:'center', marginTop:10, alignItems: 'center', height:180, width:300, borderRadius:12 }}>
                
                <FastImage source={{ uri: currentImage }} style={{ height: 180, width: 300, borderRadius:12 }} resizeMode={'cover'} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,.8)']} style={{position:'absolute', height:'100%', width:'100%', borderRadius:12, justifyContent:'flex-end'}}>
                    <Text style={{ textAlign: 'center', color:'#FFF', fontWeight:'bold', fontSize:18}}>Current Search</Text>
                </LinearGradient>
            </View>
        );
    }
    
    return(
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={{flex:1, height:40, marginHorizontal:30, marginTop:15, justifyContent:'center'}}>
                <TextInput keyboardType="url" value={searchUrl} placeholderTextColor={colors.text} onChangeText={(txt) => setSearchUrl(txt)} onSubmitEditing={({nativeEvent}) => handleURLTrace(nativeEvent.text)} placeholder="Enter image URL" style={{height:40, color:colors.text, backgroundColor:colors.card, borderWidth:1, borderRadius:12, paddingHorizontal:40}} />
                <AntDesign name="search1" size={20} color={colors.primary} style={{position:'absolute', left:10}} />
                {(searchUrl.length > 0) ? <AntDesign onPress={() => setSearchUrl('')} name="close" size={16} color="black" style={{position:'absolute', right:10}} /> : null}
            </View>
            {(currentImage.length > 0) ? <CurrentImage /> : null}
            {(loading) ? 
                <View style={{flex:1, justifyContent:'center'}}>
                    <LoadingView colors={{colors, dark}} />
                </View>
            : null}
            {(moeImage && !loading) ? <TraceMoeUI data={moeImage.result} /> : null}
            <Portal>
                {scanVis ?
                <View style={{height:'100%', justifyContent:'center', width:'100%'}}>
                    <QrScanner visible={scanVis} onDismiss={() => setScanVis(false)} color={{colors, dark}} />
                </View>
                : null}
            </Portal>
        </ScrollView>
    );
}