import { openURL } from "expo-linking";
import React from "react";
import { View, Text } from "react-native";
import { Avatar, Button, IconButton } from "react-native-paper";
import { handleCopy, _openBrowserUrl } from "../../utils";
import { ThemeColors } from "../types";

type Props = {
    type: 'ANIME' | 'MANGA' | 'CHARACTER' | 'STAFF';
    id: number;
    colors: ThemeColors;
}
const EditButton = ({type, id, colors}:Props) => {
    const manual_url = 'https://submission-manual.anilist.co';
    const edit_url = () => {return(`https://anilist.co/edit/${type}/${id}`);}

    const handleEdit = (link:string) => {
        openURL(link);
    }

    return(
        <View style={{marginVertical: 20,}}>
                <Text style={{color:colors.text, textAlign:'center', fontWeight:'bold', fontSize:16}}>
                    <Text style={{color:colors.text, fontWeight:'bold', fontSize:16, textTransform:'capitalize'}}>
                        {type}{' '} 
                    </Text>
                    lacking information?{'\n'}Feel free to contribute, but be sure to check the manual first!
                </Text>
            <View style={{flex:1, flexDirection:'row', justifyContent:'center', marginTop:3}}>
                <Button onLongPress={() => handleCopy(edit_url())} onPress={() => handleEdit(edit_url())} mode='contained' icon={'pencil'} style={{marginHorizontal: 10, borderRadius:12}}>Edit Content</Button>
                <Button onLongPress={() => handleCopy(manual_url)} onPress={() => handleEdit(manual_url)} mode='contained' icon={'book-open-page-variant'} style={{marginHorizontal: 10, borderRadius:12}}>View Manual</Button>
            </View>
        </View>
    );
}

export default EditButton;