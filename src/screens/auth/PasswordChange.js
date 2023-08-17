import { View, Text, KeyboardAvoidingView, TextInput, Keyboard, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React, {useState} from 'react'
import { styles } from '../../styles/LoginScreenStyles';
import i18n from '../../language/_i18n';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../config/FirebaseConfig';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function PasswordChange() {

    const navigation          = useNavigation();
    const [email, setEmail]   = useState('')

    const updateUserPassword = async() => {

        if (email == "") {
            Alert.alert(i18n.t("warning"),i18n.t("email_required"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
            return
        }

        try {
            await sendPasswordResetEmail(auth, email).then(() => {
                //console.log('Password reset email sent successfully')
                Alert.alert(i18n.t("warning"),i18n.t("reset_pass_message"), [{ text: i18n.t("ok"), onPress: () =>  navigation.navigate('signin') }])
            }).catch((err) => {
                alert(err);
            })
        } catch (error) {
            //alert("Hata")
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={-90}>

        <StatusBar style="light" />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={i18n.t("input_pass")}
                    keyboardType='email-address'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={[styles.input, {backgroundColor: 'rgba(244, 244, 235, 0.5)', borderWidth: 0.3, color: 'black', borderColor: 'rgba(78, 116, 289, 1)'}]}
                    placeholderTextColor='black'
                    onSubmitEditing={() => {
                        Keyboard.dismiss();
                    }}
                />
                <Button
                    title={i18n.t("send")}
                    buttonStyle={{
                        backgroundColor: 'rgba(78, 116, 289, 1)',
                        borderRadius: 3,
                    }}
                    containerStyle={{
                        //width: 200,
                        marginHorizontal: 50,
                        marginVertical: 10,
                    }}
                    onPress={() => updateUserPassword()}
                />
            </View>

        </KeyboardAvoidingView>
    )
}