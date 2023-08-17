import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import MapView, { Marker, Callout } from 'react-native-maps';
import { realDB } from '../../config/FirebaseConfig'
import { ref, onValue, query, orderByChild } from "firebase/database";
import { MaterialCommunityIcons, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { typeWork } from '../../utility/Utility';

export default function JobMap() {

  const navigation      = useNavigation();
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
        title: '',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={45} color="brown" />
          </TouchableOpacity>
        )
    })
  }, [])

  useEffect(() => {
    const jobRef = query(ref(realDB, 'jobs/'), orderByChild('createTime'));
    onValue(jobRef, (snapshot) => {
      const jobData = snapshot.val();
      //console.log(Object.entries(data).length)
      if (jobData) {
        const newData = Object.entries(jobData);
        setData(newData);
      } else {
        setData([]);
      }
    });
    
  }, [])

  const jobDetail = (item) => {
    navigation.navigate("detail", { detailData: item });
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {
          data && data.map((job, index) => {
            return (
              <Marker 
                key={index} 
                coordinate = {{latitude: job[1].lat, longitude: job[1].long}}
                pinColor = {"purple"} // any color
                title={job[1].jobTitle}
                image={require('../../../assets/mm2.png')}
                description={job[1].locationName} >
                <Callout style={styles.customView} onPress={() => jobDetail(job)}>
                  <Text style={styles.calloutText}>{job[1].jobTitle}</Text>
                  <Text style={[styles.subText, {color: 'brown'}]}>{job[1].companyName}</Text>
                  <Text style={styles.subText}>{job[1].locationName} ({typeWork(job[1].typeOfWorkplace)})</Text>
                </Callout>
              </Marker>
            )
          })
        }
      </MapView>
      <Text>Merhaba</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customView: {
    backgroundColor: 'white',
    padding: 7,
    borderRadius: 10
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  calloutText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#047bb4'
  },
  subText: {
    fontSize: 13,
    color: 'gray'
  }
});