import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, useWindowDimensions, Pressable, Animated } from "react-native";
import FastImage from "react-native-fast-image";
import { Button, Card, IconButton } from 'react-native-paper';
import { getNews } from "../../../Api/mal";
import { MalNews, MalNewsData } from "../../../Api/types";
import { MediaHeader } from "../../../Components/header/mediaHeader";
import { openURL } from "expo-linking";
import { LoadingView } from "../../../Components";
import { HeaderBackButton, HeaderRightButtons } from "../../../Components/header/headers";
import { useHeaderHeight } from "@react-navigation/elements";

type renderProp = {item: MalNewsData}

const NewsTab = ({navigation, route}) => {
    const [ news, setNews ] = useState<MalNews | number>(null);
    const [ loading, setLoading ] = useState(true);
    const [newsLoading, setNewsLoading] = useState(true);

    const mal_id = route.params.mal_id;
    const coverImage = route.params.coverImage;
    const type = route.params.type;
    const { width, height } = useWindowDimensions();
    const { colors, dark } = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerHeight = useHeaderHeight();

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 70],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    }); 

    const fetchNews = async (page=1) => {
        const result = await getNews(mal_id, page, type);
        setNews(result);
        setNewsLoading((typeof(result) !== 'number') ? false : null);
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading((typeof(result) === 'number') ? null : false);
    }

    const retryFetch = async() => {
        setLoading(true);
        const result = await getNews(mal_id, 1, type);
        setNews(result);
        setLoading(false);
    }

    const newsCard = ({item}:renderProp) => {
        return(
            <Card style={{ width:'95%', alignSelf:'center', marginVertical:10, backgroundColor:colors.card }}>
                <Card.Title title={item.title} titleNumberOfLines={2} subtitle={`By ${item.author_username} @ ${item.date.slice(0, 10)}`} right={props => <IconButton icon={'account'} onPress={() => openURL(item.author_url)} />} style={{backgroundColor:colors.primary}} />
                <Card.Content style={{ padding:5 }}>
                    <View style={{ width:'70%', flexDirection:'row', paddingTop:10 }}>
                        <Card.Cover source={{ uri:item.images.jpg.image_url }} resizeMode='cover' style={{ width:90, height:140 }} />
                        <Text style={{ color:colors.text, paddingLeft:20, width:'100%', textAlignVertical:'center' }}>{item.excerpt}</Text>
                    </View>
                </Card.Content>
                <Card.Actions style={{ justifyContent:'flex-end' }}>
                    <Button onPress={() => openURL(item.forum_url)} color={colors.primary}>Forum</Button>
                    <Button onPress={() => openURL(item.url)} color={colors.primary}>Read More</Button>
                </Card.Actions>
            </Card>
        );
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Animated.Text style={{textAlign:'center', fontSize:20, color:colors.text}}>News</Animated.Text>
            ),
            headerRight: () => <HeaderRightButtons colors={colors} navigation={navigation} drawer style={{paddingRight:15}} />,
            headerLeft: () => <HeaderBackButton colors={colors} navigation={navigation} style={{paddingLeft:15}} />,
            headerBackground: () => (
                <Animated.View 
                    style={{ 
                        backgroundColor: colors.card,  
                        justifyContent: 'flex-end', 
                        height: '100%' 
                    }}
                />
            ),
        });
    },[navigation, headerOpacity, dark])

    useEffect(() => {
        fetchNews();
    } , []);

    const RetryView = () => {
        return(
            <View style={{height:height-headerHeight, width:width, justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:colors.text}}>Server had an issue!</Text>
                <Pressable onPress={() => retryFetch()} style={{ width:100, height:35, padding:5, backgroundColor:colors.background, borderWidth:1, borderColor:colors.primary, borderRadius:12}}>
                    <Text style={{color:colors.text, textAlign:'center', fontWeight:'bold'}}>RETRY</Text>
                </Pressable>
            </View>
        );
    }

    const EmptyView = () => {
        return(
            <View style={{height:height-headerHeight, width:width, justifyContent:'center', alignItems:'center'}}>
                <View style={{padding:10, paddingRight:20, borderWidth:1, borderColor:colors.border, flexDirection:'row', alignItems:'center', backgroundColor:colors.background, borderRadius:12}}>
                    <IconButton icon={'alert-circle-outline'} size={26} color={'red'} />
                    <Text style={{color:colors.text, textAlign:'center', fontSize:16}}>No news found!</Text>
                </View>
            </View>
        );
    }

    if (loading) return <LoadingView colors={{colors, dark}} titleData={[{title:'MAL News', loading:newsLoading}]} />;

    return(
        <View style={{flex:1}}>
            <MediaHeader coverImage={coverImage} loc={[0, .8]} />
            <Animated.FlatList 
            // @ts-ignore
                data={(news !== 500) ? news?.data : []}
                renderItem={newsCard}
                keyExtractor={(item) => item.mal_id.toString()}
                contentContainerStyle={{paddingTop:100}}
                ItemSeparatorComponent={() => <View style={{height:10}}/>}
                ListEmptyComponent={() => (news === 500) ? <RetryView /> : <EmptyView />}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {
                                y: scrollY,
                            }
                        }
                    }
                ], { useNativeDriver: true })}
            />
        </View>
    );
}

export default NewsTab;