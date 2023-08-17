import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Text, View, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, Platform, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/FirebaseConfig';
import i18n from '../../language/_i18n';
import { styles } from '../../styles/LoginScreenStyles';
import { Video, AVPlaybackStatus } from 'expo-av';

const login_video = require("../../../assets/login2.mp4");

const SignInScreen = ({ navigation }) => {

    const [email, setEmail]         = useState('')
    const [password, setPassword]   = useState('')
    const [loading, setLoading]     = useState(true)

    useEffect(() => {
        //auth.signOut()
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace('home')
            } else {
                setLoading(false);
            }
        })

        return unsubscribe
    }, [])

    const SignIn = () => {

        if (email == "" || password == "") {
            Alert.alert(i18n.t("warning"),i18n.t("message_1"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }])
            return
        }
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => setLoading(false))
            .catch(error => {
                Alert.alert(i18n.t("warning"), i18n.t("message_2"), [{ text: i18n.t("ok"), onPress: () => console.log("OK Pressed") }]);
                setLoading(false)
            })
    }
    
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#24222F' }}>
                <ActivityIndicator size='large' color={'#fff'}/>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={-90}>

            <StatusBar style="light" />

            <Video
                style={styles.video}
                source={login_video}
                shouldPlay
                isMuted
                rate={1}
                resizeMode="contain"
                isLooping
                onLoad={() => {
                    console.log("yüklendi.")
                    setLoading(false)
                }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={i18n.t("input_1")}
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                    placeholderTextColor='black'
                    onSubmitEditing={() => {
                        Keyboard.dismiss();
                    }}
                />

                <TextInput
                    placeholder={i18n.t("input_2")}
                    secureTextEntry
                    type="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    placeholderTextColor='black'
                    onSubmitEditing={() => {
                        Keyboard.dismiss();
                    }}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={SignIn}
            >
                <Text style={styles.buttonText}>
                {i18n.t("login_btn")}
                </Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.hairline} />
                <TouchableOpacity onPress={() => navigation.navigate('passchange')}>
                    <Text style={{ color: '#2babf1', fontWeight: 'bold',textDecorationLine: 'underline', fontSize: 16, padding: 2}}>{i18n.t("forget_password")}</Text>
                </TouchableOpacity>
                <View style={styles.hairline} />
            </View>

            {loading ? <ActivityIndicator size="large" color="#C7C6CD" /> : null}
            
            <TouchableOpacity
                style={{ position: 'absolute', bottom: 40 }}
                onPress={() => navigation.navigate('signup')}
            >
                <Text style={{ color: 'white', fontSize: 16 }}>
                    {i18n.t("no_account")} <Text style={{ color: '#2babf1', fontWeight: 'bold',textDecorationLine: 'underline', fontSize: 18 }}>{i18n.t("signup")}</Text>
                </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    )
}

export default SignInScreen;

