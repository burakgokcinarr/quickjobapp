import { View, Text, StyleSheet, ScrollView, Linking, Platform, Alert } from 'react-native'
import React, {useState,  useEffect, useLayoutEffect } from 'react'
import { Card, Divider, Button, Icon } from '@rneui/themed'
import { MaterialCommunityIcons, Entypo, MaterialIcons, Fontisto, FontAwesome5 } from '@expo/vector-icons';
import { timeSince, typeWork, workType } from '../../utility/Utility'
import i18n from '../../language/_i18n';
import { useNavigation, useRoute } from '@react-navigation/native'
import * as MailComposer from 'expo-mail-composer';
import { ImageView } from '../../components';

export default function JobDetail() {

    const navigation     = useNavigation();
    const route          = useRoute();
    const { detailData } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: detailData[1].jobTitle + ' / ' + detailData[1].companyName,
            headerTitleStyle: {
                fontSize: 15
            }
        })
    }, [])

    const sendMail = (data) => {
        if (MailComposer.isAvailableAsync()) {
            MailComposer.composeAsync({
                recipients: [data.email],
                subject: i18n.t("mail_title") + ' - ' + data.jobTitle,
                body: i18n.t("mail_body_content"),
            }).then((data) => {
                if (data.status == 'sent') {
                    // YOUR CODE
                    Alert.alert(i18n.t("success"), i18n.t("success_mail_job_content"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
                }
            })
        } else {
            console.log("Mail desteklenmemektedir.")
        }
    }

    const callPhone = (phone) => {
        Linking.openURL(`tel:${phone}`);
    }

    return (
        <View style={style.container}>
            <View style={style.card1}>
                    {
                            detailData[1].firmImage ? 
                            <ImageView imageUri={detailData[1].firmImage} width={100} height={100} onPress={null} urgentStatus={detailData[1].urgent}/>
                            :
                            <MaterialCommunityIcons name="bag-checked" size={100} color="#808000"/>
                    }
                <Text style={style.cardTitle}>{detailData[1].jobTitle} - {workType(detailData[1].workType)}</Text>
                <Text style={style.time}><Fontisto name="date" size={20} color="black" /> {timeSince(detailData[1].createTime)}</Text>
            </View>
            <Text style={style.company}><MaterialCommunityIcons name="factory" size={20} color="black" /> {detailData[1].companyName}  </Text>
            <Text style={{color: 'black'}}><Entypo name="location" size={18} color="black" /> {detailData[1].locationName} ({typeWork(detailData[1].typeOfWorkplace)})</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10}}>
                    <Button containerStyle={style.detailButton} radius={'lg'} size={"sm"} type="solid" color={"#047bb4"} onPress={() => sendMail(detailData[1])}>
                        <MaterialIcons name="mark-email-read" size={32} color="white" /> {i18n.t('email')}
                    </Button>
                {
                    detailData[1].givePhone && 
                        <Button containerStyle={style.detailButton} radius={'lg'} size={"sm"} type="solid" color={"purple"} onPress={() => callPhone(detailData[1].phone)}>
                            <Entypo name="old-phone" size={32} color="white" /> {i18n.t("phone_call")}
                        </Button>
                }
            </View>
            <Card.Divider color='#808000' style={{paddingVertical: 5}}/>
            <Card.Title style={{color: 'black', fontSize: 30, textAlign: 'left'}}>{i18n.t("description")}</Card.Title>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false} howsHorizontalScrollIndicator={false}>
                <Text style={style.description}>{detailData[1].description}</Text>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        marginBottom: 15,
        paddingHorizontal: 5
    },  
    card1: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    cardDetail: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    detailButton: {
        width: 120,
    },
    time: {
        fontSize: 14
    },
    company: {
        fontSize: 20,
        color: 'black'
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
        fontSize: 21,
        paddingHorizontal: 5
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    description: {
        fontSize: 18,
        color: 'black'
    }
})