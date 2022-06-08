import { View, ScrollView, Pressable, Text } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Dialog, Button, Portal, IconButton } from 'react-native-paper';
import { TagsType } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import React, { useState } from "react";
import { color } from "react-native-reanimated";

type Props = {
    genres: string[];
    tags: TagsType[];
    colors: ThemeColors;
}
const TagScroll = ({genres, tags, colors}:Props) => {
    const [visible, setVisible] = useState({vis:false, idx:null});

    const closeDialog = () => setVisible({vis:false, idx:null});
    return (
        <View style={{marginTop:10}}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {genres.map((genre, idx) =>
                    <Pressable key={idx} style={{ padding: 5, height: 35, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10, marginHorizontal: 5, marginVertical: 10, backgroundColor: colors.primary, borderRadius: 12 }}>
                        <Text style={{ color: '#FFF' }}>{genre}</Text>
                    </Pressable>
                )}
                {tags.map((tag, index) =>
                    <Pressable onPress={() => setVisible({vis:true, idx:index})} key={index} style={{ flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginHorizontal: 5, marginVertical: 10, backgroundColor: colors.primary, borderRadius: 12 }}>
                        {/* <IconButton icon={'tag-outline'} size={18} color={'#000'} /> */}
                        <Text style={{ color: '#FFF' }}>{tag.name}</Text>
                        <View style={{ marginLeft: 5, width: 30, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>{tag.rank}%</Text>
                        </View>
                    </Pressable>
                )}
            </ScrollView>
            <Portal>
                <Dialog style={{backgroundColor:colors.card}} visible={visible.vis} onDismiss={closeDialog}>
                    <Dialog.Title style={{color:colors.text}}>{(visible.vis) ? tags[visible.idx].name : null}</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{color:colors.text}}>{(visible.vis) ? tags[visible.idx].description : null}</Text>
                        <Text style={{color:colors.text}}>{'\n'}Category: {(visible.vis) ? tags[visible.idx].category : null}</Text>
                        <Text style={{color:colors.text}}>{'\n'}Ranking: {(visible.vis) ? tags[visible.idx].rank+'%' : null}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button color={colors.primary} onPress={closeDialog}>Nice</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

export default TagScroll;