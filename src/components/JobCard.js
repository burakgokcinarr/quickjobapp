import { View, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { Card, Divider, Text, Button, Icon } from '@rneui/themed'
import { MaterialCommunityIcons, Entypo, MaterialIcons, Fontisto, FontAwesome } from '@expo/vector-icons';
import { timeSince, typeWork, workType, calculateJobDistanceKm } from '../utility/Utility'
import i18n from '../language/_i18n';
import { ImageView } from '../components'
import { FlashList } from "@shopify/flash-list";

export default function JobCard({ data, onPressClicked, edited = false, locationInfo }) {

    const cardItem = ({ item }) => {
        
        return(
            <Card>
                <View>
                    <View style={style.card1}>
                        {
                            item[1].firmImage ? 
                            <ImageView imageUri={item[1].firmImage} width={75} height={75} onPress={null} urgentStatus={item[1].urgent}/>
                            :
                            <MaterialCommunityIcons name="bag-checked" size={60} color="#808000"/>
                        }
                        <Card.Title style={style.cardTitle}>{item[1].jobTitle}</Card.Title>
                        <Text style={style.time}><Fontisto name="date" size={14} color="black" /> {timeSince(item[1].createTime)}</Text>
                    </View>
                    <View style={style.cardDetail}>
                        <Card.Divider color='#808000'/>
                        <Text style={style.company}><MaterialCommunityIcons name="factory" size={15} color="black" /> {item[1].companyName}</Text>
                        <Card.Divider color='#808000' style={{paddingVertical: 5}}/>
                        <View style={style.jobInfo}>
                            <Text><MaterialCommunityIcons name="clock-time-ten" size={15} color="black" /> {workType(item[1].workType)}</Text>
                            <Text><MaterialIcons name="directions-run" size={15} color="black" /> {typeWork(item[1].typeOfWorkplace)}</Text>
                        </View>
                        <View style={style.jobInfo}>
                            <Text><Entypo name="location" size={15} color="black" /> {item[1].locationName}</Text>
                            <Text><FontAwesome name="location-arrow" size={15} color="black" /> {locationInfo == null ? '---' : calculateJobDistanceKm(locationInfo.coords.latitude, locationInfo.coords.longitude, item[1].lat, item[1].long)} Km</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignSelf: 'center', paddingVertical: 5}}>
                        <Button containerStyle={[style.detailButton, {marginRight: 5}]} radius={'lg'} type="solid" color={"#047bb4"} onPress={() => onPressClicked(item, 1)}>
                            {i18n.t("detailButtonTitle")}
                        </Button>
                        {
                            edited && <Button containerStyle={style.detailButton} radius={'lg'} type="solid" color={"#d30000"} onPress={() => onPressClicked(item, 2)}>
                                        {i18n.t("remove_title")}
                                    </Button>
                        }
                    </View>
                </View>
            </Card>
        )
    }
    /*
    if (data.length === 0) {
        return (
            <View style={style.loading}>
                <ActivityIndicator size="large" color="#047bb4" />
            </View>
        )
    }
    */
    return (
        <FlashList
            data={data}
            renderItem={(item) => cardItem(item)}
            estimatedItemSize={250}
            extraData={locationInfo} // Listenin yeniden işlenmesi (yüklenmesi) için gerekli olan tetiklemedir. (extraData) böylece liste yüklendikten sonra bir renderItem içerisinde bir değişiklik olursa liste yeniden işlenmesi sağlanır.
        />
    )
}

const style = StyleSheet.create({
    card1: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    cardDetail: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    detailButton: {
        width: '50%',
        alignSelf: 'center',
        paddingVertical: 7
    },
    time: {
        fontSize: 11
    },
    company: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    jobInfo: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 5
    },
    cardTitle: {
        flex: 1, 
        flexWrap: 'wrap',
        fontWeight: 'bold', 
        fontSize: 16
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})