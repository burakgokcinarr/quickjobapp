import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#07203e'
    },
    button: {
        height: 50,
        width: '90%',
        //backgroundColor: '#1D51EF',
        color: 'grey',
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: 'white',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    },
    inputContainer: {
        width: '90%',
        marginBottom: 20

    },
    containerTexts: {
        alignItems: 'center',
        marginBottom: 40
    },
    welcomeTitle: {
        color: '#C7C6CD',
        fontWeight: 'bold',
        fontSize: 28,
        marginBottom: 8
    },
    welcomeText: {
        color: '#C7C6CD',
        fontSize: 15,
    },
    input: {
        height: 55,
        //backgroundColor: '#1D1B25',
        padding: 15,
        color: 'white',
        borderWidth: 0.5,
        borderColor: 'white',
        borderRadius: 6,
        marginBottom: 10
    },
})
