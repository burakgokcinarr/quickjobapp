import { View, Text } from 'react-native'
import React from 'react'
import i18n from '../language/_i18n';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Auth
import { SignIn, SignUp, PasswordChange } from '../screens/auth'
// Stack
import { BottomTab } from '../screens/stack/tabs';

import { AddJobs, JobDetail, MyJobDetail, Settings, JobMap, CameraView, ProfileVideo } from '../screens/stack';

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
    headerStyle: { backgroundColor: 'white', elevation: 0 },
    headerTitleStyle: { color: '#047bb4' },
    headerTintColor: '#047bb4',
    headerTitleAlign: 'center',
    gestureEnabled: false,
    headerBackTitle: ''
};

export default function RouteNavigation() {
    return (
        <Stack.Navigator initialRouteName='signin' screenOptions={globalScreenOptions}>
            <Stack.Screen name="signin" component={SignIn} options={{headerShown: false, title: ''}}/>
            <Stack.Screen name="signup" component={SignUp} options={{headerShown: false, title: ''}}/>
            <Stack.Screen name="passchange" component={PasswordChange} options={{headerShown: true, title: ''}}/>
            <Stack.Screen name="home" component={BottomTab} options={{headerShown: false, title: ''}}/>
            <Stack.Screen name="addJob" component={AddJobs} options={{headerShown: true, title: i18n.t("job_stack_title")}}/>
            <Stack.Screen name="detail" component={JobDetail} options={{headerShown: true, title: ''}}/>
            <Stack.Screen name="myjobdetail" component={MyJobDetail} options={{headerShown: true, title: ''}}/>
            <Stack.Screen name="settings" component={Settings} options={{headerShown: true, title: ''}}/>
            <Stack.Screen name="map" component={JobMap} options={{headerShown: true, title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' }}}/>
            <Stack.Screen name="camera" component={CameraView} options={{headerShown: true, title: ''}}/>
            <Stack.Screen name="video" component={ProfileVideo} options={{headerShown: false, title: '', presentation: 'modal'}}/>
        </Stack.Navigator>
    )
}