import { View, Text } from 'react-native'
import React from 'react'
import { SearchBar } from '@rneui/themed';

export default function SearchInput({placeholderText, onChangeText, value}) {
    return (
        <SearchBar
            placeholder={placeholderText}
            onChangeText={onChangeText}
            value={value}
            containerStyle={{backgroundColor: 'white'}}
            inputContainerStyle={{backgroundColor: 'white', height: 30}}
            inputStyle={{backgroundColor: 'white', color: 'black', height: 30}}
            style={{backgroundColor: 'white', height: 30}}
        />
    )
}