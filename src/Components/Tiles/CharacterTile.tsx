import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { IconButton } from "react-native-paper";
import { CharacterSearchTile } from "../../Api/types";
import { checkBD } from "../../utils";

type CharacterTile = {
    character: CharacterSearchTile;
    date: Date;
    primaryColor: string;
    onPress: () => void;
}
export const CharacterTile = ({character, date, onPress, primaryColor}:CharacterTile) => {
    return(
        <View style={{borderRadius:8}}>
            <FastImage fallback source={{uri: character.image.large}} style={{height:210, width:130, borderRadius:8}}  resizeMode='cover' />
            <LinearGradient colors={['transparent', (character.isFavourite) ? 'rgba(255, 0, 0,.85)' : 'rgba(0,0,0,.8)']} locations={[.75, 1]} style={{position:'absolute', borderRadius:8, justifyContent:'flex-end', alignItems:'center', width:'100%', height:'100%'}}>
                <Text style={{color:'#FFF', paddingBottom:5}} numberOfLines={2}>{character.name.userPreferred}</Text>
                {(checkBD(date, character.dateOfBirth)) && <IconButton icon={'cake-variant'} color={primaryColor} style={{position:'absolute', top:-10, right:-5}} />}
            </LinearGradient>
            <Pressable onPress={onPress} style={{position:'absolute', height:'100%', width:'100%', borderRadius:8}} android_ripple={{color:primaryColor}} />
        </View>
    );
}