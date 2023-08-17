import { View, StyleSheet, ScrollView, Text } from 'react-native'
import React from 'react'
import { SettingsItem } from '../../components'
import i18n from '../../language/_i18n'
import * as WebBrowser from 'expo-web-browser';
import { version } from '../../../package.json'
import { auth } from '../../config/FirebaseConfig'
import { useNavigation } from '@react-navigation/native';

export default function Settings() {

    const navigation = useNavigation();

    const openprivacyDocument = async() => {
        let result = await WebBrowser.openBrowserAsync('https://www.privacypolicyonline.com/live.php?token=n5oPpxg2ZTgJtRJ5BHIUN8DKDEfhEpKC');
    }

    const opentermsofServiceDocument = async() => {
        let result = await WebBrowser.openBrowserAsync('https://www.privacypolicyonline.com/live.php?token=iteaaC162oNH3fCKX2OnWyBtKKwNaBDr');
    }

    const logoutApp = async() => {
        auth.signOut().then(()=> {
            navigation.navigate('signin');
        })
    }

    return (
        <ScrollView style={style.container}>
            <SettingsItem itemText={i18n.t('settings_privacy_title')} iconClass={'material'} iconName={'privacy-tip'} iconSize={28} onPress={openprivacyDocument} color={'#047bb4'}/>
            <SettingsItem itemText={i18n.t("settings_terms_of_title")} iconClass={'entypo'} iconName={'text-document'} iconSize={28} onPress={opentermsofServiceDocument} color={'#047bb4'}/>
            <SettingsItem itemText={i18n.t("app_settings_app_version_title") + ' ( v' + version + ' ) '} iconClass={'antdesign'} iconName={'appstore1'} iconSize={27} onPress={null} color={'#047bb4'}/>
            <SettingsItem itemText={i18n.t("logout")} iconClass={'antdesign'} iconName={'logout'} iconSize={27} onPress={logoutApp} color={'red'}/>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20
    }
})