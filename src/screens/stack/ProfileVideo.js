import * as React from 'react';
import { View, StyleSheet, Button, Dimensions, Pressable } from 'react-native';
import { Video } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const windowWidth   = Dimensions.get('window').width;
const windowHeight  = Dimensions.get('window').height;

export default function ProfileVideo() {

  const video               = React.useRef(null);
  //const [status, setStatus] = React.useState({});
  const route               = useRoute();
  const { videoUri }        = route.params;
  const navigation          = useNavigation();

  return (
    <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={{alignItems: 'flex-end', marginTop: 50}}>
            <AntDesign name="closecircle" size={35} color="white" />
        </Pressable>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: videoUri,
        }}
        useNativeControls={true}
        resizeMode='contain'
        shouldPlay
        usePoster
        //onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    backgroundColor: 'black',
  },
  video: {
    flex:1,
    //alignSelf: 'center',
    width: windowWidth,
    height: windowHeight,
  }
});
