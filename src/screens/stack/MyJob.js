import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { auth, realDB } from '../../config/FirebaseConfig'
import { ref, onValue, query, equalTo, orderByChild, orderByValue, remove } from "firebase/database";
import { JobCard } from '../../components'
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { Dialog, Button } from '@rneui/themed';
import i18n from '../../language/_i18n';
import * as Location from 'expo-location';

export default function MyJob() {

  const navigation            = useNavigation();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
        title: i18n.t("my_job_title")
    })
  }, [])

  useEffect(() => {
    const jobRef = query(ref(realDB, 'jobs'), orderByChild('userId') ,equalTo(auth.currentUser.uid));
    onValue(jobRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newData = Object.entries(data);
        // Güncel tarihe göre yayınlanan iş ilanını sırala
        const last    = newData.sort(function(x, y){
          return y[1].createTime - x[1].createTime;
        })
        setData(last);
      } else {
        setData([]);
      }

      setLoading(false);
    });
  }, [])

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(i18n.t("warning"),i18n.t("location_permission_message"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
        //setLocationLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      //setLocationLoading(false);
    })();
  }, []);

  const onPressClicked = (item, index) => {
    //alert(item)
    switch (index) {
      case 1: // Detayı Gör
        navigation.navigate('myjobdetail', { detailData: item });
        break;
      case 2: // İlanı Kaldır
        Alert.alert(item[1].jobTitle, i18n.t("job_remove_message"), [
          {
            text: i18n.t("yes"),
            onPress: () => removeJob(item),
          },
          {
            text: i18n.t("no"),
            onPress: () => console.log('Cancel Pressed'),
            style: "destructive",
          }
        ]);
        break;
      default:
        break;
    }
  }

  const removeJob = (item) => {
    const removeItemId =  item[0];
    remove(ref(realDB, 'jobs/' + removeItemId)).then(() => {
      Alert.alert(i18n.t("success"),i18n.t("success_remove_message"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
    })
    .catch(() => {
      Alert.alert(i18n.t("success"),i18n.t("success_remove_message_err"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
    })
  }

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#047bb4" />
      </View>
    )
  }

  return (
    <View style={{flex: 1}}>
      <JobCard data={data} onPressClicked={onPressClicked} edited={true} locationInfo={location}/>
    </View>
  )
}