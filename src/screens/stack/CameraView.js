import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import i18n from '../../language/_i18n';
import { auth, realDB } from '../../config/FirebaseConfig'
import { uploadImageAsync } from '../../utility/Utility';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MAX_VIDEO_DURATION_SECOND = 15;
const MAX_FILE_SIZE_BYTES       = 1048576;
let downloadTimer               = null;

export default function CameraView() {
    const [hasPermission, setHasPermission]             = useState(null);
    const [hasSoundPermission, setHasSoundPermission]   = useState(null);
    const [cameraRef, setCameraRef]                     = useState(null);
    const [type, setType]                               = useState(Camera.Constants.Type.back);
    const [recording, setRecording]                     = useState(false);
    const [videoCount, setVideoCount]                   = useState(MAX_VIDEO_DURATION_SECOND);
    const navigation                                    = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: i18n.t("camera_title"),
            headerTitleStyle: {
                fontSize: 11
            },
            headerRight: () => (
                <TouchableOpacity onPress={() => { setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)} }>
                    <MaterialCommunityIcons name="camera-flip" size={30} color="#047bb4" />
                </TouchableOpacity>
            )
        })
    }, [type])

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            if (cameraStatus.status !== 'granted') {
                Alert.alert(i18n.t("warning"),i18n.t("camera_permission_message"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
                return;
            }
            setHasPermission(cameraStatus.status === 'granted');

            const soundStatus = await Camera.requestMicrophonePermissionsAsync();
            if (soundStatus.status !== 'granted') {
                Alert.alert(i18n.t("warning"),i18n.t("microphone_permission_message"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
                return;
            }
            setHasSoundPermission(soundStatus.status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    if (hasSoundPermission === null) {
        return <View />;
    }

    if (hasSoundPermission === false) {
        return <Text>No access to microphone</Text>;
    }

    const countDownVideo = () => {
        console.log("Video counter....");
        var timeleft      = MAX_VIDEO_DURATION_SECOND;
        downloadTimer = setInterval(function() {
            if(timeleft <= 0){
                clearInterval(downloadTimer);  
            } 
                setVideoCount(timeleft);
                timeleft -= 1;
        }, 1000);
    }

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <Camera style={{ flex: 1 }} type={type} ref={ref => { setCameraRef(ref)}} ratio={'4:3'}>
            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', paddingVertical: 10, }}>
                <TouchableOpacity style={{alignSelf: 'center'}} onPress={async() => {
                    if(cameraRef) {
                        if (!recording) {
                            console.log("Start Recording Video...")
                            setRecording(true);

                            // 15 sniyelik video geri sayımı başlat
                            countDownVideo();

                            let options = {
                                maxDuration:MAX_VIDEO_DURATION_SECOND,
                                //maxFileSize: MAX_FILE_SIZE_BYTES,
                                quality: Platform.OS == 'android' ? '4:3' : '480p',
                                mute: false,
                                videoBitrate:5000000,
                            };

                            cameraRef.recordAsync(options).then(async(recordedVideo) => {
                                console.log("video", recordedVideo.uri);
                                let user_id     = auth.currentUser.uid;
                                await uploadImageAsync(recordedVideo.uri, user_id, true);
                                setVideoCount(MAX_VIDEO_DURATION_SECOND);
                            });

                        } else {
                            clearInterval(downloadTimer);
                            setVideoCount(MAX_VIDEO_DURATION_SECOND);
                            console.log("Stop Recording Video...")
                            setRecording(false);
                            cameraRef.stopRecording();
                        }
                    }
                    }}>
                    <View style={{ 
                        borderWidth: 3,
                        borderRadius:30,
                        borderColor: recording ? "red" : "white",
                        height: 60,
                        width:60,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'}}
                    >
                        <View style={{
                            borderWidth: 2,
                            borderRadius:25,
                            borderColor: recording ? "red" : "white",
                            height: 50,
                            width:50,
                            borderColor: recording ? "red" : "white"}} >

                        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{ fontSize: 23, color: recording ? "red" : "white", fontWeight: '800' }}>{videoCount}</Text>
                        </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </Camera>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

