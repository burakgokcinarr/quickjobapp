import { View, Text } from 'react-native'
import React from 'react'
import { Input } from '@rneui/themed';

export default function CustomInput({inputTitle, placeholderText, iconType, iconName, onChangeText, errorStyle = {color: 'crimson'}, errorMessage, isRequired = false, keyboardType="default", value, disabled = false}) {
  return (
    <View>
        <Input
            placeholder={placeholderText}
            leftIcon={{ type: iconType, name: iconName }}
            onChangeText={onChangeText}
            errorStyle={errorStyle}
            errorMessage={errorMessage}
            keyboardType={keyboardType}
            value={value}
            disabled={disabled}
            clearButtonMode='while-editing'
        />
    </View>
  )
}