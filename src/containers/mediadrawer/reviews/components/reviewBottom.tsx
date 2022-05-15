import React, { useState } from "react";
import { View, Text } from "react-native";
import { Caption, IconButton } from "react-native-paper";
import { userRatingReview } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import { getScoreColor } from "../../../../utils";

type FinalScoreProps = {
    score: number;
}
export const FinalScore = ({ score }:FinalScoreProps) => {
    return(
        <View style={{alignItems:'center', marginBottom:10, marginTop:15}}>
            <View style={{maxWidth:160, justifyContent:'center', borderRadius:6, flexDirection:'row', alignItems:'flex-end', paddingHorizontal:12, paddingVertical:5, backgroundColor:getScoreColor(score)}}>
                <Text style={{fontSize:58, color:'#FFF'}}>{score}</Text>
                <Text style={{color:'#FFF'}}>/100</Text>
            </View>
        </View>
    );
}

type RateReviewProps = {
    userRating: userRatingReview;
    rating: number;
    totalRatings: number;
    action: (vote:userRatingReview) => void;
    colors: ThemeColors;
}
export const RateReview = ({ userRating, rating, totalRatings, action, colors}:RateReviewProps) => {
    const [thumbs, setThumbs] = useState(userRating);

    const changeVote = (change:userRatingReview) => {
        setThumbs(change);
        action(change);
    }

    const IconBox = ({icon, type}:{icon:string; type:userRatingReview;}) => {
        const color = (type === 'DOWN_VOTE') ? 'red' : '#00d400';
        const background = (thumbs === 'DOWN_VOTE' && type === 'DOWN_VOTE') ? 'red' : (thumbs === 'UP_VOTE' && type==='UP_VOTE') ? '#00d400' : 'rgba(0,0,0,0)';
        return(
            <View style={{ borderWidth:1, borderRadius:8, marginHorizontal:12, borderColor:color, backgroundColor:background}}>
                <IconButton 
                    icon={icon} 
                    color={'#000'} 
                    size={32} 
                    onPress={() => {
                        changeVote(type === thumbs ? 'NO_VOTE' : type);
                    }} 
                />
            </View>
        );
    }
    return(
        <View style={{alignItems:'center', marginBottom:10}}>
            <View style={{padding:10, paddingHorizontal:45, borderRadius:6, backgroundColor:colors.card, maxWidth:'90%', alignItems:'center'}}>
                <View style={{flexDirection:'row'}}>
                    <IconBox icon={(thumbs === 'DOWN_VOTE') ? "thumb-down" : "thumb-down-outline"} type="DOWN_VOTE" />
                    <IconBox icon={(thumbs === 'UP_VOTE') ? "thumb-up" : "thumb-up-outline"} type="UP_VOTE" />
                </View>
                <Caption style={{marginTop:10, color:'rgba(0,0,0,.6)'}}>{rating} / {totalRatings} people liked this</Caption>
            </View>
        </View>
    );
}