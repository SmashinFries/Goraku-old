import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Portal, Card, Modal, Colors, ActivityIndicator, List, Button, Divider, RadioButton } from "react-native-paper";
import { ThemeColors } from "../../../Components/types";

type Props = {
    tags: {
        active: string|null;
        tags: string[];
    };
    setActive: (tag:string) => void;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    colors: ThemeColors;
}
export const TagSelector = ({setActive, visible, setVisible, tags, colors}:Props) => {
    const [enabled, setEnabled] = useState<string>(tags.active);
    const [loading, setLoading] = useState<boolean>(true);

    const onEnable = () => {setActive(enabled); setVisible(false);};
    const onSelect = (tag:string|null) => {
        setEnabled(tag);
    }

    useEffect(() => {
        if (tags.tags.length > 0) {
            setEnabled(tags.active);
            setLoading(false);
        }
    },[tags.tags]);

    const MappedTag = (item:string, idx?:number) => {
        return(
            <List.Item 
                key={idx}
                title={item} 
                onPress={() => onSelect(item)}
                titleStyle={{color:colors.text}}
                right={() => <RadioButton.Android value={item} status={(enabled === item) ? 'checked' : 'unchecked'} onPress={() => onSelect(item)} />}
            />
        );
    }
    
    return(
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)}>
                <Card style={{width:'90%', height:'80%', alignSelf:'center'}}>
                    <Card.Title title="Related Tags" />
                    <Divider />
                    <Card.Content style={{flex:1,}}>
                        <ScrollView contentContainerStyle={{justifyContent:'flex-start'}}>
                            {(loading) ? <ActivityIndicator size={'large'} />
                            : 
                            <View>
                                <List.Item
                                    title={'None'}
                                    titleStyle={{ color: colors.text }}
                                    onPress={() => onSelect(null)}
                                    right={() => <RadioButton.Android value={'None'} color={colors.primary} status={(!enabled) ? 'checked' : 'unchecked'} onPress={() => onSelect(null)} />}
                                />
                                {tags.tags.map(MappedTag)}
                            </View>}
                        </ScrollView>
                    </Card.Content>
                    <Card.Actions style={{justifyContent:'flex-end'}}>
                        <Button color={colors.primary} onPress={() => {setEnabled(tags.active); setVisible(false);}}>Cancel</Button>
                        <Button color={colors.primary} onPress={onEnable}>Search</Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
}