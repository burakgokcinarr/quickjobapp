import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Icon, Divider } from '@rneui/themed';

export default function SettingsItem({ iconClass, iconName, iconSize, itemText, color, onPress }) {
    return (
        <Pressable onPress={onPress}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
                <Icon name={iconName} type={iconClass} color={color} size={iconSize} />
                <Text style={{fontSize: 20, marginLeft: 7, fontWeight: '400'}}>{itemText}</Text>
            </View>
            <Divider color='gray'/>
        </Pressable>
    )
}