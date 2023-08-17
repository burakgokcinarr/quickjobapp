import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        //backgroundColor: '#07203e'
        backgroundColor: 'white'
    },
    settingsContainer: {
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'center',
        padding: 10,
        backgroundColor: '#24222F'
    },
    containerTexts: {
        alignItems: 'center',
        marginBottom: 80
    },
    inputContainer: {
        width: '90%',
        height: 130,
        marginBottom: 30
    },
    button: {
        height: 50,
        width: '90%',
        //backgroundColor: '#07203e',
        color: 'grey',
        borderRadius: 6,
        //borderBottomWidth: 0,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoutButton: {
        height: 50,
        width: '90%',
        backgroundColor: '#E3286F',
        color: 'grey',
        borderRadius: 10,
        borderBottomWidth: 0,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    infoButton: {
        height: 50,
        width: '90%',
        backgroundColor: '#0492C2',
        color: 'grey',
        borderRadius: 10,
        borderBottomWidth: 0,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    input: {
        height: 55,
        flex: 1,
        backgroundColor: '#f3f6f4',
        padding: 15,
        color: 'black',
        opacity: 0.9,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 10
    },
    settingsinput: {
        height: 55,
        //flex: 1,
        backgroundColor: '#1D1B25',
        padding: 15,
        color: 'white',
        borderRadius: 6,
        borderBottomWidth: 0,
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 18
    },
    welcomeTitle: {
        color: '#C7C6CD',
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 8
    },
    welcomeText: {
        color: 'grey',
        fontSize: 15,
        marginTop: 10
    },
    titleText: {
        fontSize: 18,
        margin: 10,
        color: 'white'
    },
    video: {
        height: height + 100,
        width: 20000,
        position: "absolute",
        top: 0,
        //left: 0,
        alignItems: "stretch",
        bottom: 0,
        //right: 0
    },
    hairline: {
        backgroundColor: '#A2A2A2',
        height: 2,
        width: '25%'
    },
})