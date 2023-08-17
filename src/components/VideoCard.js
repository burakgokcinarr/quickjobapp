import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

export default function VideoCard({ data, uuid }) {

    const navigation = useNavigation();
    
    const onCameraScreen = (index) => {
        navigation.navigate("camera")
    }

    const onVideoScreen = (index) => {
        navigation.navigate("video", { videoUri: data[index][1].video_uri})
        //console.log(data[index][1].userId);
    }

    const videoItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.container} onPress={() => onVideoScreen(index)}>
                <Video
                    source={{
                        uri: item[1].video_uri,
                    }}
                    rate={1.0}
                    volume={1.0}
                    muted={true}
                    resizeMode="cover"
                    useNativeControls={false}
                    repeat={false}
                    usePoster
                    style={{ width: 100, height: 100 }}
                />
            </TouchableOpacity>
        )
    }
    
    return (
        <View style={styles.listContainer}>
            <TouchableOpacity style={styles.containerPlus} onPress={() => onCameraScreen()}>
                <View style={styles.add}>
                    <Entypo name="plus" size={50} color="#047bb4" />
                </View>
            </TouchableOpacity>
            <FlatList
                data={data}
                renderItem={(item, index) => videoItem(item, index)}
                estimatedItemSize={100}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 100,
        maxHeight: 100,
        borderRadius: 5,
        //marginHorizontal: 5,
        borderWidth: 0.7,
        borderColor: '#047bb4'
    },
    containerPlus: {
        //flex: 1,
        width: '25%',
        maxHeight: 100,
        borderRadius: 5,
        marginHorizontal: 10,
        borderWidth: 0.7,
        borderColor: '#047bb4'
    },
    add: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'row'
    },
    listContainer: {
        height: '10%',
        maxHeight: '10%',
        flexDirection: 'row',
        paddingVertical: 5
    }
})