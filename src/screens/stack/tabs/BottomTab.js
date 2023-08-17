import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Job, AddJobs, MyJob } from '../';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import i18n from '../../../language/_i18n';

import  {tabBarbackgroundColor,
            iconSize,
            tabBarActiveTintColor,
            tabBarInactiveTintColor,
            firstTabName,
            secondTabName}  from '../../../navigation/NavigationStyle';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (
        <Tab.Navigator screenOptions={{tabBarStyle: {backgroundColor: tabBarbackgroundColor}, headerShown: true, headerTitleAlign: 'center'}}>
            <Tab.Screen name="job" component={Job} options={{
                title: i18n.t("job_title"),
                tabBarLabel: i18n.t("job_title"),
                tabBarActiveTintColor: tabBarActiveTintColor,
                tabBarInactiveTintColor:  tabBarInactiveTintColor,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="list" color={color} size={iconSize} />
                ),
            }}/>
            <Tab.Screen name="addjobDetail" component={AddJobs} options={{
                title: '',
                tabBarLabel: '',
                tabBarActiveTintColor: tabBarActiveTintColor,
                tabBarInactiveTintColor:  tabBarInactiveTintColor,
                tabBarIcon: ({ color, size }) => (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 2, // space from bottombar
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <AntDesign name="plussquare" color="#4b86b4" size={60}/>
                    </View>
                )
            }}
            listeners={({ navigation }) => ({
                tabPress: (e) => {
                    e.preventDefault()
                    navigation.navigate("addJob")
                },
            })}
            />
            <Tab.Screen name="myjob" component={MyJob} options={{
                title: i18n.t("my_job_title"),
                tabBarLabel: i18n.t("my_job_title"),
                tabBarActiveTintColor: tabBarActiveTintColor,
                tabBarInactiveTintColor:  tabBarInactiveTintColor,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="bookmark" color={color} size={iconSize} />
                )
            }}/>
        </Tab.Navigator>
    )
}