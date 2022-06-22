import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useWindowDimensions, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import { getReviewUserRating, rateReview } from "../../../Api/anilist/anilist";
import { ReviewsNode, userRatingReview } from "../../../Api/types";
import { UserModal } from "../../../Components";
import { getAuthContext } from "../../../Storage/authToken";
import { FinalScore, RateReview } from "./components/reviewBottom";
import { customHTMLElementModel } from "./elements/customElements";

const ReviewBody = ({ navigation, route }) => {
    const review:ReviewsNode = route.params.review;
    const {auth} = getAuthContext();
    const [visible, setVisible] = useState(false);
    const [userRating, setUserRating] = useState<userRatingReview>();
    const { colors, dark } = useTheme();
    const { width } = useWindowDimensions();

    useEffect(() => {
        const fetchUserRating = async() => {
            const newRating = await getReviewUserRating(review.node.id);
            setUserRating(newRating);
        }
        fetchUserRating();
    },[]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: review.node.user.name + "'s Review",
            headerRight: () => <Pressable onPress={() => {setVisible(true)}}><Avatar.Image source={{uri:review.node.user.avatar.large}} size={42 } style={{backgroundColor:review.node.user.options.profileColor}} /></Pressable>
        });
    },[navigation, dark]);

    return(
            <ScrollView contentContainerStyle={{paddingHorizontal:10}}>
                <RenderHtml
                    contentWidth={width}
                    source={{html:review.node.body.replace(/[\[\]']+/g,'').replace(/\(\)+/g,'')}}
                    customHTMLElementModels={customHTMLElementModel}
                    baseStyle={{color:colors.text}}
                />
                <FinalScore score={review.node.score} />
                {(userRating && auth) && <RateReview action={(vote:userRatingReview) => {rateReview(review.node.id, vote)}} userRating={userRating} rating={review.node.rating} totalRatings={review.node.ratingAmount} colors={colors} />}
                <UserModal user={review.node.user} visible={visible} onDismiss={() => setVisible(false)} colors={colors} />
            </ScrollView>
    );
}

export default ReviewBody;