import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native'
import i18n from '../language/_i18n';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { auth, realDB } from '../config/FirebaseConfig'
import { ref as dbRef, set } from "firebase/database";

export const timeSince = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " " + i18n.t("years");
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " " + i18n.t("months");
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " " + i18n.t("days");
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " " + i18n.t("hours");
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " " + i18n.t("minutes");
    }
    
    return Math.floor(seconds) + " " + i18n.t("seconds");
}

export const workType = (index) => {
    return i18n.t("workType_" + index);
}

export const typeWork = (index) => {
    return i18n.t("typeWork_" + index);
}

export const calculateJobDistanceKm = (lat1,lon1,lat2,lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return parseInt(d, 10);
}

const deg2rad = (deg) => deg * (Math.PI/180)

export const imagePicker = async() => {

    let selectedImageUri = null;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        Alert.alert(i18n.t("warning"),i18n.t("image_permission_message"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
        //setLocationLoading(false);
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,   // 0 - 1 arası
    });

    console.log(result);

    if (!result.canceled) {
        //console.log("Image Url = ", result.assets[0].uri);
        selectedImageUri = result.assets[0].uri;
    }

    return selectedImageUri;
}

export const uploadImageAsync = async(uri, authFirmId, isVideo = false) => {
    let image_url   = null;
    let media_name  = isVideo ? ('video_' + authFirmId) : authFirmId;
    const fileRef   = ref(getStorage(), media_name);

    const response  = await fetch(uri);
    const blob      = await response.blob();

    const metadata = {
        contentType: isVideo ? 'video/mp4' : 'image/png',
    };

    const uploadTask = uploadBytesResumable(fileRef, blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',(snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    
    switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
        break;
        case 'running':
            console.log('Upload is running');
        break;
    }

    if (progress == 100) {
        if (isVideo) {
            Alert.alert(i18n.t("success"),i18n.t("success_upload_video"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
        } else {
            Alert.alert(i18n.t("success"),i18n.t("upload_firm_logo_success"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
        }
    }

    },
    (error) => {
        switch (error.code) {
            case 'storage/unauthorized':
                console.log("User doesn't have permission to access the object");
            break;
            case 'storage/canceled':
                console.log("User canceled the upload");
            break;
            case 'storage/unknown':
                console.log("Unknown error occurred, inspect error.serverResponse");
            break;
        }
    },
    async() => {
        // Upload completed successfully, now we can get the download URL
        console.log("İndiriliyor...")
        image_url   = await getDownloadURL(fileRef);

        if (isVideo) {
            const randomUUD = await generateUUID();
            if (authFirmId && randomUUD) {
                const time = Date.now();
                set(dbRef(realDB, 'jobsVideo/' + authFirmId), {
                    userId: authFirmId,
                    createTime: time,
                    video_uri: image_url    // Video Url
                }).then(() => {
                    // Success
                    console.log("Video DB'ye kayıt başarılı...")
                })
            }
        }

        return image_url;
    });
    
    return image_url;
}

async function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}