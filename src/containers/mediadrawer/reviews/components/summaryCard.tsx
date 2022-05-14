import { openURL } from "expo-linking";
import React from "react";
import { Pressable, View } from "react-native";
import { Avatar, Button, Card, IconButton, Text } from "react-native-paper";
import { ReviewsNode } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import { getScoreColor } from "../../../../utils";

type Props = {
    review: ReviewsNode;
    colors: ThemeColors;
    onPress: () => void;
}
export const SummaryCard = ({ review, colors, onPress }:Props) => {
    return(
        <Card style={{ width:'90%', alignSelf:'center', marginVertical:10, backgroundColor:colors.card }}>
            <Card.Title
                title={review.node.user.name} 
                titleStyle={{color:'#FFF'}}
                left={(props) => <Pressable onPress={() => openURL(review.node.user.siteUrl)}><Avatar.Image {...props} source={{uri:review.node.user.avatar.large}} /></Pressable>}
                right={() => <View style={{flexDirection:'row', alignItems:'center', padding:10, marginRight:10, borderRadius:8, backgroundColor:getScoreColor(review.node.score)}}><Text style={{color:'#FFF'}}>{review.node.score}</Text></View>}
                style={{backgroundColor:colors.primary}}
            />
            <Card.Content style={{paddingTop:10}}>
                <Text style={{color:colors.text}}>{review.node.summary}</Text>
            </Card.Content>
            <Card.Actions style={{justifyContent:'space-between'}}>
                {/* <View style={{padding:5, backgroundColor:getScoreColor(review.node.score), borderRadius:8}}>
                    <Text style={{color:colors.text}}>{review.node.score}</Text>
                </View> */}
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <IconButton icon={'thumb-up'} color={colors.text} size={18} />
                    <Text style={{color:colors.text}}>{`${review.node.rating}`}</Text>
                </View>
                <Button color={colors.primary} onPress={onPress}>View</Button>
            </Card.Actions>
        </Card>
    );
}