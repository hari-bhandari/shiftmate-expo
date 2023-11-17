import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Switch, TouchableOpacity, Animated, Linking, Alert} from 'react-native';
import {Divider, Modal, Text} from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import {sendExpoPushToken, sendOutgoingMessage} from "../utils/outgoingMessageHandlers";
import * as Device from 'expo-device';
import {OUTGOING_MESSAGE_TYPES} from "../constants/MessageTypes";

const PermissionDrawer = ({webViewRef,notificationToken,setNotificationToken,isNotificationEnabled,setIsNotificationEnabled}) => {
    const [visible, setVisible] = useState(false);
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isLocationEnabled, setIsLocationEnabled] = useState(false);


    const rotate = useState(new Animated.Value(0))[0];




    const updateNotificationToken = async () => {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        if (existingStatus !== 'granted') {
            return;
        }
        const tokenData = await Notifications.getExpoPushTokenAsync();
        setNotificationToken(tokenData.data);
        if(isNotificationEnabled&&tokenData.data&&webViewRef?.current){
            sendOutgoingMessage(webViewRef, OUTGOING_MESSAGE_TYPES.EXPO_PUSH_TOKEN, JSON.stringify({
                notificationToken:tokenData.data,
                deviceName: Device.modelName,
                deviceOS: Device.osName,
                deviceType: Device.deviceType,
            }));
        }
    };

    // Check and request permissions
    const checkPermission = async (permissionType) => {
        try {
            let status;
            if (permissionType === 'camera') {
                ({status} = await Camera.getCameraPermissionsAsync());
            } else if (permissionType === 'location') {
                ({status} = await Location.getForegroundPermissionsAsync());
            } else if (permissionType === 'notification') {
                ({status} = await Notifications.getPermissionsAsync());
            }

            return status === 'granted';
        } catch (error) {
            console.error('Error checking permissions:', error);
            return false;
        }
    };

    const requestPermission = async (permissionType) => {
        try {
            let status;
            if (permissionType === 'camera') {
                ({status} = await Camera.requestCameraPermissionsAsync());
            } else if (permissionType === 'location') {
                ({status} = await Location.requestForegroundPermissionsAsync());
            } else if (permissionType === 'notification') {
                ({status} = await Notifications.requestPermissionsAsync());
            }

            return status === 'granted';
        } catch (error) {
            Alert.alert(
                `Update ${permissionType.charAt(0).toUpperCase() + permissionType.slice(1)} Permission`,
                `It seems like the app's ${permissionType} permissions were denied previously. To enable this permission, please open your device settings and grant access manually.`,
                [{text: "Open Settings", onPress: openSettings}, {text: "Cancel"}]
            );

            return false;
        }
    };

    const updatePermissions = async () => {
        const cameraGranted = await checkPermission('camera');
        setIsCameraEnabled(cameraGranted);

        const locationGranted = await checkPermission('location');
        setIsLocationEnabled(locationGranted);

        const notificationGranted = await checkPermission('notification');
        setIsNotificationEnabled(notificationGranted);

    };

    useEffect(() => {
        updatePermissions();
    }, []);

    useEffect(() => {
        if (visible) {
            updatePermissions();
        }
    }, [visible]);


    useEffect(() => {
        updateNotificationToken();

    }, [isNotificationEnabled]);

    // Helper function to open app settings
    const openSettings = async () => {
        await Linking.openSettings();
    };

    const handleTogglePermission = async (permissionType) => {
        const isGranted = await checkPermission(permissionType);
        if (!isGranted) {
            const requestGranted = await requestPermission(permissionType);
            if (permissionType === 'camera') setIsCameraEnabled(requestGranted);
            if (permissionType === 'location') setIsLocationEnabled(requestGranted);
            if (permissionType === 'notification') setIsNotificationEnabled(requestGranted);
        } else {
            Alert.alert(
                `Change ${permissionType.charAt(0).toUpperCase() + permissionType.slice(1)} Permission`,
                `To change ${permissionType} permission, please go to your device settings.`,
                [{text: "Open Settings", onPress: openSettings}, {text: "Cancel"}]
            );
        }
    };

    // Rotate cog continuously with a gap
    const startRotation = () => {
        rotate.setValue(0);
        Animated.timing(rotate, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(startRotation, 2500);
        });
    };

    useEffect(() => {
        startRotation();
    }, []);

    const rotation = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <>
            <TouchableOpacity style={styles.cogIconContainer} onPress={() => setVisible(!visible)}>
                <Animated.View style={{transform: [{rotate: rotation}]}}>
                    <MaterialCommunityIcons name="cog" size={30} color="#4a90e2"/>
                </Animated.View>
            </TouchableOpacity>

            <Modal visible={visible} onDismiss={() => setVisible(!visible)}
                   contentContainerStyle={styles.containerStyle}>
                <Text style={styles.modalTitle}>Manage Permissions</Text>
                <Divider style={styles.divider}/>

                <View style={styles.permissionItem}>
                    <Text style={styles.permissionLabel}>Camera</Text>
                    <Switch
                        trackColor={{false: "#737c7c", true: "#81c784"}}
                        thumbColor={isCameraEnabled ? "#004d40" : "#595959"}
                        onValueChange={() => handleTogglePermission('camera')}
                        value={isCameraEnabled}
                    />
                </View>

                <View style={styles.permissionItem}>
                    <Text style={styles.permissionLabel}>Location</Text>
                    <Switch
                        trackColor={{false: "#737c7c", true: "#81c784"}}
                        thumbColor={isLocationEnabled ? "#004d40" : "#595959"}
                        onValueChange={() => handleTogglePermission('location')}
                        value={isLocationEnabled}
                    />
                </View>

                <View style={styles.permissionItem}>
                    <Text style={styles.permissionLabel}>Notifications</Text>
                    <Switch
                        trackColor={{false: "#737c7c", true: "#81c784"}}
                        thumbColor={isNotificationEnabled ? "#004d40" : "#595959"}
                        onValueChange={() => handleTogglePermission('notification')}
                        value={isNotificationEnabled}
                    />
                </View>
            </Modal>
        </>
    );
};
const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 20,
        bottom: 0,
        position: 'absolute',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    permissionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cogIconContainer: {
        position: 'absolute',
        right: 20,
        top: '50%',
        transform: [{translateY: -15}],
        backgroundColor: 'white',
        borderRadius: "50%",
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    permissionLabel: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    divider: {
        marginBottom: 20,
        color: 'black',
    },
});

export default PermissionDrawer;
