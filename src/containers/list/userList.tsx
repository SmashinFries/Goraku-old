import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { Theme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { MediaCollectionEntries } from '../../Api/types';
import { LoadingView } from '../../Components';
import { useListSearch, useTagLayout } from '../../Storage/listStorage';
import { dataTitleFilter } from '../../utils';
import { ListTile, RowTile } from './components/listTile';

type RouteProp = {
    params: {
        data: MediaCollectionEntries[];
        colors: Theme;
        type: string;
        listStatus: string;
        layout: string;
    }
}
type ListProps = {
    navigation: MaterialTopTabNavigationProp<RouteProp>;
    route: RouteProp;
}
export const UserList = ({navigation, route}:ListProps) => {
    const { data, colors, type, listStatus } = route.params;
    const {search} = useListSearch();
    const { tags, listLayout } = useTagLayout();

    useEffect(() => {
        navigation.setOptions({
            tabBarLabel: `${listStatus} (${(search) ? dataTitleFilter(data, search).length : data.length})`,
        });
    },[navigation, search]);

    const renderCompactItem = ({item}) => {
        return(
            <ListTile item={item} listStatus={listStatus} navigation={navigation} colors={colors} tags={tags} />
        );
    }

    const renderRowItem = ({item}) => {
        return(
            <RowTile item={item} listStatus={listStatus} navigation={navigation} colors={colors} tags={tags} />
        );
    }

    if (!listLayout || listLayout === 'none') return <LoadingView colors={colors} />;

    return ( (listLayout === 'compact') ? 
            <FlatList
                key={listLayout}
                contentInsetAdjustmentBehavior="automatic"
                data={(search) ? dataTitleFilter(data, search) : data}
                keyExtractor={(item) => item.media.id.toString()}
                renderItem={renderCompactItem}
                numColumns={2}
                ItemSeparatorComponent={() => <View style={{height:10}} />}
                columnWrapperStyle={{justifyContent:'space-evenly'}}
                contentContainerStyle={{paddingBottom:30, paddingTop:15}}
                showsVerticalScrollIndicator={false}
            />
            :
            <FlatList
                key={listLayout}
                data={(search) ? dataTitleFilter(data, search) : data}
                contentInsetAdjustmentBehavior="automatic"
                renderItem={renderRowItem}
                keyExtractor={(item) => item.media.id.toString()}
                contentContainerStyle={{paddingBottom:30}}
                showsVerticalScrollIndicator={false}
            />
    );
}