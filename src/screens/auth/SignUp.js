import React, { useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, View, TouchableOpacity, Text, TextInput, Keyboard, ActivityIndicator, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/FirebaseConfig';
import i18n from '../../language/_i18n';
import { styles } from '../../styles/RegisterScreenStyles'

const SignUp = ({ navigation }) => {

    const [email, setEmail]             = useState('')
    const [password, setPassword]       = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [loading, setLoading]         = useState(false)

    const register = () => {

        if (email == "" || password == "" || confirmPass == "") {
            Alert.alert(i18n.t("warning"),i18n.t("account_info"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
            return
        }

        if (password != confirmPass) {
            Alert.alert(i18n.t("warning"),i18n.t("pass_valid"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
            return
        }

        setLoading(true)
        
        createUserWithEmailAndPassword(auth,email, password)
            .then((authUser) => {
                Alert.alert(i18n.t("success"), i18n.t("register_success_message"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
                setLoading(false);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert(i18n.t("warning"), i18n.t("user_valid"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
                }
                if (error.code === 'auth/invalid-email') {
                    Alert.alert(i18n.t("warning"), i18n.t("email_valid"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
                }
                if (error.code === 'auth/weak-password') {
                    Alert.alert(i18n.t("warning"), i18n.t("password_valid"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
                }
                setLoading(false);
            })
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <StatusBar style="light" />

            <View style={styles.containerTexts}>
                <Text style={styles.welcomeTitle}>
                    {i18n.t("create_account")}
                </Text>
                <Text style={styles.welcomeText}>
                    {i18n.t("account_info")}
                </Text>
            </View>

            <View style={styles.inputContainer}>

                <TextInput
                    placeholder={i18n.t("input_1")}
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                    placeholderTextColor='white'
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                />

                <TextInput
                    placeholder={i18n.t("input_3")}
                    type="password"
                    value={password}
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    placeholderTextColor='white'
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                />

                <TextInput
                    placeholder={i18n.t("re_pass")}
                    type="password"
                    value={confirmPass}
                    secureTextEntry
                    onChangeText={(text) => setConfirmPass(text)}
                    style={styles.input}
                    placeholderTextColor='white'
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                />

            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={register}
            >
                <Text style={styles.buttonText}>
                    {i18n.t("signup")}
                </Text>
            </TouchableOpacity>

            {loading ? <ActivityIndicator size="large" color="#C7C6CD" /> : null}

            <TouchableOpacity
                style={{ position: 'relative' }}
                onPress={() => navigation.navigate('signin')}
            >
                <Text style={{ color: 'white', }}>
                  {i18n.t("have_account")} <Text style={{ color: '#2babf1', fontWeight: 'bold',textDecorationLine: 'underline', fontSize: 17 }}>{i18n.t("login_btn")}</Text>
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default SignUp;
