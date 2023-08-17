import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Image, Avatar, Badge } from '@rneui/themed';
import i18n from '../language/_i18n';

const defaultImagePlus = 'https://static-00.iconduck.com/assets.00/plus-icon-256x256-x29mkiw7.png';

export default function ImageView({ imageUri, width = 200, height = 200, resizeMode = 'cover', onPress, size = 100, imageViewType = 'image', urgentStatus = false}) {
    
    return (
        <View style={styles.container}>
            {
                imageViewType === 'image' 
                    ? 
                    <View>
                        <Image source={{uri: imageUri ? imageUri : defaultImagePlus}} style={{width: width, height: height, borderRadius: 15}} resizeMode={resizeMode} onPress={onPress}/>
                        {
                            urgentStatus && <Badge
                                status="error"
                                value={i18n.t('urgent')}
                                containerStyle={{ position: 'absolute', top: 5, left: width - 10 }}
                            />
                        }
                    </View>
                    :
                    <Avatar
                        size={size}
                        rounded
                        source={{uri: imageUri ? imageUri : defaultImagePlus}}
                        onPress={onPress}
                    >
                    <Avatar.Accessory size={20} />
                    </Avatar>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 3
    }
})