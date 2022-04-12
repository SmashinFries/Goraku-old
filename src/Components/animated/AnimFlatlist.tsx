import { Animated, FlatListProps, ListRenderItem } from "react-native";

type FlatListAnimProps = {
    animValue: Animated.Value;
    data: any[];
    keyExtractor: (item: any, index: number) => string;
    renderItem: ListRenderItem<any>;
}
export const FlatListAnim = ({animValue, data, keyExtractor, renderItem, ...rest}:FlatListAnimProps&FlatListProps<any>) => {
    return(
        <Animated.FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={Animated.event([
                {
                    nativeEvent: {
                        contentOffset: {
                            y: animValue,
                        }
                    }
                }
            ], { useNativeDriver: true })}
            {...rest}
        />
    );
}