import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { Button } from '@rneui/themed';

export default function ShadowButton({ title, onPress, size = 'sm', radius = 10, color = 'transparent' }) {

    const buttonStyle = Platform.OS === 'android' ? styles.shadowAndroid : styles.buttonContainer;

    return (
        <Button color={color} radius={radius} size={size} titleStyle={styles.title} containerStyle={buttonStyle} onPress={onPress}>{title}</Button>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        shadowColor: '#047bb4',
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 1,
        shadowOpacity: 0.29, 
        borderWidth: 0.5, 
        borderColor: '#047bb4'
    },
    title: {
        fontSize: 13, 
        color: '#047bb4'
    },
    shadowAndroid: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 3,
        backgroundColor: 'white',
    }
})