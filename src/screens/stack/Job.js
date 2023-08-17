import { View, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { realDB } from '../../config/FirebaseConfig'
import { ref, onValue, query, orderByChild } from "firebase/database";
import { JobCard, SearchInput, ShadowButton, VideoCard } from '../../components'
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo, Feather } from '@expo/vector-icons';
import { Dialog, Button, BottomSheet, ListItem } from '@rneui/themed';
import CountryPicker from 'react-native-country-picker-modal'
import i18n from '../../language/_i18n';
import * as Location from 'expo-location';
import { calculateJobDistanceKm } from '../../utility/Utility';

export default function Job() {

  const navigation                          = useNavigation();
  const [data, setData]                     = useState([]);
  const [data2, setData2]                   = useState([]);
  const [searchText, setSearchText]         = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [visible1, setVisible1]             = useState(false);
  const [loading, setLoading]               = useState(true);
  const [location, setLocation]             = useState(null);
  //const [locationLoading, setLocationLoading] = useState(true);
  const [videoData, setVideoData]           = useState([]);
  const [isVisible, setIsVisible]           = useState(false);
  const [profileVideo, setProfileVideo]     = useState([]);
  const list = [
    { title: i18n.t("typeWork_0") , onPress: () => workTypeFilter(0)},
    { title: i18n.t("typeWork_1") , onPress: () => workTypeFilter(1)},
    { title: i18n.t("typeWork_2") , onPress: () => workTypeFilter(2)},
    {
      title: i18n.t("no"),
      containerStyle: { backgroundColor: '#ff4121' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
        title: '',
        headerRight: () => (
            <View style={{ paddingHorizontal: 20}}>
                <TouchableOpacity onPress={toggleDialog1}>
                  <MaterialCommunityIcons name="text-search" size={35} color="#047bb4" />
                </TouchableOpacity>
            </View>
        ),
        headerLeft: () => (
          <View style={{ paddingHorizontal: 20}}>
              <TouchableOpacity onPress={() => navigation.navigate('settings')}>
                <Feather name="sidebar" size={32} color="#047bb4" />
              </TouchableOpacity>
          </View>
      )
    })
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
          data.length > 0 ? <Button
            title={i18n.t("map_title")}
            icon={{
              name: 'map-pin',
              type: 'feather',
              size: 13,
              color: 'white',
            }}
            titleStyle={{ fontWeight: '300', fontSize: 15 }}
            buttonStyle={{
              backgroundColor: '#047bb4',
              borderRadius: 15,
            }}
            onPress={() => navigation.navigate('map')}
          /> : null
        )
    })
  }, [data])

  useEffect(() => {
    //const jobRef = query(ref(realDB, 'jobs'), orderByChild('userId') ,equalTo('q81iCVgGTNOSnGos7chOgJGlnmu222222'));
    const jobRef = query(ref(realDB, 'jobs/'), orderByChild('createTime'));
    onValue(jobRef, (snapshot) => {
      const data = snapshot.val();
      //console.log(Object.entries(data).length)
      if (data) {
        const newData = Object.entries(data);
        // Güncel tarihe göre yayınlanan iş ilanını sırala
        const last    = newData.sort(function(x, y){
          return y[1].createTime - x[1].createTime;
        })
        setData(last);
        setData2(last);
      } else {
        setData([]);
        setData2([]);
      }

      setLoading(false);
    });
    
  }, [])

  // profile video load
  useEffect(() => {
    //const jobRef = query(ref(realDB, 'jobs'), orderByChild('userId') ,equalTo('q81iCVgGTNOSnGos7chOgJGlnmu222222'));
    const jobRef = query(ref(realDB, 'jobsVideo/'), orderByChild('createTime'));
    onValue(jobRef, (snapshot) => {
      const data = snapshot.val();
      //console.log(Object.entries(data).length)
      if (data) {
        const newData = Object.entries(data);
        // Güncel tarihe göre yayınlanan video ilanını sırala
        const last    = newData.sort(function(x, y){
          return y[1].createTime - x[1].createTime;
        })
        setProfileVideo(last);
      } else {
        setProfileVideo([]);
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

  const toggleDialog1 = () => {
    setVisible1(!visible1);
  };

  const filterDataBtn = () => {
    if  (searchText && filterLocation) {
      var newArray = data.filter(function (el) {
        return ((el[1].jobTitle.search(searchText) > -1) && el[1].locationName.search(filterLocation) > -1 )     // Location & Job Title
      });
      setData(newArray);
    } else if (searchText) {
      var newArray = data.filter(function (el) {
        return el[1].jobTitle.toLocaleLowerCase().search(searchText.toLocaleLowerCase()) > -1     // İş Tanımı/başlık üzerinden arama yapma
      });
      setData(newArray);
    } else if (filterLocation) {
      var newArray = data.filter(function (el) {
        return el[1].locationName.search(filterLocation) > -1     // Location
      });
      setData(newArray);
    } else {
      setData(data2);
    }

    setVisible1(false);
  }

  const clearFilterBtn = () => {
    setFilterLocation('');
    setSearchText('');
  }

  const onPressClicked = (item, index) => {
    navigation.navigate("detail", {detailData: item});
  }
  /*
  if (loading || locationLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#047bb4" />
      </View>
    )
  }
  */

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#047bb4" />
      </View>
    )
  }

  const headerFilterWorkType = () => {
    setIsVisible(true);
  }

  const workTypeFilter = (type) => {
    // 0 => İş yerinde
    // 1 => Hibrit
    // 2 => Uzaktan

    var newArray = data2.filter(function (el) {
      return (el[1].typeOfWorkplace == type)
    });
    setData(newArray);
    setIsVisible(false);
  }

  const headerFilterNearMyHome = () => {  // Evime yakın
    if (location) {
      var newArray = data2.filter(function (el) {
        return (calculateJobDistanceKm(location.coords.latitude, location.coords.longitude, el[1].lat, el[1].long) < 100);  // 100 km sınır
      });
      setData(newArray);
    } else {
      console.warn("Location bilgisini kontrol ediniz..!")
    }
  }

  const headerFilterdDringend = () => {   // Acil İlan

    var newArray = data2.filter(function (el) {
      return (el[1].urgent === true)    // urgent job status
    });
    setData(newArray);
  }

  const headerFilterdAll = () => {        // Tüm ilanlar
    setData(data2);
  }

  return (
    <View style={{flex: 1}}>
      <View style={{padding: 10, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white'}}>
        <ShadowButton title={i18n.t("header_filter_btn_title1")} onPress={headerFilterdAll}/>
        <ShadowButton title={i18n.t("header_filter_btn_title2")} onPress={headerFilterWorkType}/>
        <ShadowButton title={i18n.t("header_filter_btn_title3")} onPress={headerFilterNearMyHome}/>
        <ShadowButton title={i18n.t("header_filter_btn_title4")} onPress={headerFilterdDringend}/>
      </View>
      <VideoCard data={profileVideo}/>
      <JobCard data={data} onPressClicked={onPressClicked} locationInfo={location}/>
      <Dialog isVisible={visible1}>
        <SearchInput placeholderText={i18n.t("search")} onChangeText={setSearchText} value={searchText}/>
        <View style={{borderWidth:0.5, borderColor: 'black', height: 30, marginTop: 5, borderRadius: 10, flexDirection: 'row', paddingHorizontal: 5, paddingVertical: 5}}>
          <Entypo name="location" size={15} color='rgba(199, 43, 98, 1)' />
          <CountryPicker 
            withModal
            withFilter
            placeholder={filterLocation == '' ? i18n.t("location_name_desc") : filterLocation}
            onSelect={((name) => setFilterLocation(name.name))}
            containerButtonStyle={{paddingHorizontal: 7}}
          />
        </View>
        <Button
          title={i18n.t("filter")}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: 'rgba(78, 116, 289, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 20,
          }}
          containerStyle={{
            width: 160,
            marginVertical: 10,
            alignSelf: 'center'
          }}
          onPress={filterDataBtn}
        />
        <Button
          title={i18n.t('cleanTitle')}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: 'rgba(199, 43, 98, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 20,
          }}
          containerStyle={{
            width: 160,
            marginVertical: 10,
            alignSelf: 'center'
          }}
          onPress={clearFilterBtn}
        />
      </Dialog>
      <BottomSheet modalProps={{animationType: 'slide'}} isVisible={isVisible} containerStyle={{paddingVertical: 25}}>
      {list.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={l.containerStyle}
          onPress={l.onPress}
        >
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
    </View>
  )
}