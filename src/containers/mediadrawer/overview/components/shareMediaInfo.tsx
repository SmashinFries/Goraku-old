import { LinearGradient } from "expo-linear-gradient";
import React, { MutableRefObject } from "react";
import { View, Text } from 'react-native';
import FastImage from "react-native-fast-image";
import QRCode from "react-native-qrcode-svg";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GorakuLabelVertSVG } from "../../../../Components/svg/svgs";
import { ThemeColors } from "../../../../Components/types";

export type SharedImageData = {
    title: string;
    cover: string;
    link: string;
    aniScore: number | null;
    malScore: number | null;
    format: string;
    genres: string;
    status: string;
    releaseDate: string | null;
    contentAmount: string | null;
}

type Props = {
    screenWidth: number;
    data: SharedImageData;
    shareRef: MutableRefObject<View>;
    colors:ThemeColors;
}
export const ShareMediaInfo = ({ screenWidth, data, shareRef, colors }: Props) => {
    const size = 1080;
    const statusOrAmount = data.contentAmount ?? data.status;
    const fontFamily = 'Inter_900Black'

    const BackgroundView = () => {
        return(
            <View>
                <FastImage source={{ uri: data.cover }} style={{ position: 'absolute', height: size, width: size }} resizeMode='cover' />
                <View style={{ position: 'absolute', height: size, width: size, backgroundColor:'rgba(0,0,0,.78)' }} />
                {/* <LinearGradient colors={['rgba(0,0,0,0.70)', 'rgba(0,0,0,0)']} locations={[.5, 1]} style={{ position: 'absolute', height: size, width: size }} /> */}
            </View>
        );
    }

    const QRView = () => {
        const qr_size = 142+10;
        const logo_size = 55;
        return(
            <View style={{ position:"absolute", flexDirection:'row', alignItems:'center', right:0, bottom:0, height: qr_size, }}>
                <View style={{width:logo_size, height:qr_size}}>
                    <GorakuLabelVertSVG primColor="#FFF" />
                </View>
                <View style={{ width:qr_size, height:qr_size, backgroundColor:'#FFF', justifyContent:'center', alignItems:'center'}}>
                    <QRCode value={data.link} size={142} backgroundColor={'#FFF'} color={'#000'} />
                </View>
            </View>
        );
    }

    const TitleView = () => {
        return(
            <View style={{height:298, width:size, justifyContent:'center', paddingHorizontal:20}}>
                <Text style={{color:'#FFF', fontFamily:fontFamily, textAlign:'center', fontSize:64,}}>{data.title}</Text>
            </View>
        );
    }

    type InfoRowProps = {
        width: number | string;
        icon: any;
        textHeight: number | string;
        text: string;
        secondaryText?: string;
        capitalize?: boolean;
    }
    const InfoRow = ({width, icon, textHeight, text, secondaryText, capitalize}:InfoRowProps) => {
        const color = '#02BAE3'
        const iconSize = 100
        return(
            <View style={{width:width, height:textHeight, flexDirection:'row', alignItems:'center', paddingLeft:30 }}>
                <View style={{justifyContent:'flex-start', height:iconSize, paddingLeft:20}}>
                    <MaterialCommunityIcons name={icon} color={colors.primary} size={iconSize} />
                </View>
                <View style={{flex:1, width:481, alignItems:'center', justifyContent:'center', height:textHeight, paddingHorizontal:20}}>
                    <Text style={{color:'#FFF', fontSize:48,  textTransform:(capitalize) ? 'capitalize' : undefined, textAlign:'center'}}>
                        {text}
                    </Text>
                    {(secondaryText) ? <Text style={{color:'#FFF', fontSize:48,  textTransform:(capitalize) ? 'capitalize' : undefined, textAlign:'center'}}>
                        {secondaryText}
                    </Text> : null}
                </View>
            </View>
        );
    }

    const BodyView = () => {
        const cover_width = 398;
        const cover_height = 595;
        return(
            <View style={{width:size, height:cover_height, justifyContent:'flex-start'}}>
                <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly'}}>
                    <View style={{paddingLeft:20}}>
                        <FastImage source={{ uri: data.cover }} style={{ height: cover_height, width: cover_width, borderRadius:16 }} resizeMode='cover' />
                    </View>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <View style={{width:655, height:527, justifyContent:'space-evenly'}}>
                            <InfoRow icon={(['MANGA', 'NOVEL', 'ONE_SHOT'].includes(data.format)) ? 'book-multiple-outline' : 'television-classic'} width={'100%'} textHeight={145} text={data.format} secondaryText={`(${statusOrAmount})`} capitalize  />
                            <View style={{height:20}} />
                            <InfoRow icon={'shape-outline'} width={'100%'} textHeight={198} text={data.genres} />
                            <View style={{height:20}} />
                            <InfoRow icon={'calendar-month'} width={'100%'} textHeight={145} text={data.releaseDate} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
<<<<<<< HEAD
        <View ref={shareRef} style={{position:'absolute', display:'none', right:screenWidth+size, height:size, width:size, backgroundColor:'#FFFFFF'}}>
=======
        <View ref={shareRef} style={{position:'absolute', right:-screenWidth-size, height:size, width:size, backgroundColor:'#FFFFFF'}}>
>>>>>>> 0c9012c66097ecdd51e17ef422f672d34bc9de29
            <View style={{flex:1, height:size, width:size}}>
                <BackgroundView />
                <TitleView />
                <QRView />
                <BodyView />
            </View>
        </View>
    );
}

