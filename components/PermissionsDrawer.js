import React, { useState } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Modal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PermissionDrawer = () => {
    const [visible, setVisible] = useState(false);
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isLocationEnabled, setIsLocationEnabled] = useState(false);

    // Toggle Handlers
    const toggleCamera = () => setIsCameraEnabled(!isCameraEnabled);
    const toggleLocation = () => setIsLocationEnabled(!isLocationEnabled);

    // Toggle Drawer Visibility
    const toggleDrawer = () => setVisible(!visible);

    return (
        <>
            <TouchableOpacity style={styles.cogIcon} onPress={toggleDrawer}>
                <MaterialCommunityIcons name="cog" size={30} color="black" />
            </TouchableOpacity>

            <Modal visible={visible} onDismiss={toggleDrawer} contentContainerStyle={styles.containerStyle}>
                <Text style={styles.modalTitle}>Manage Permissions</Text>

                <View style={styles.permissionItem}>
                    <Text style={styles.permissionLabel}>Camera</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isCameraEnabled ? "#f5dd4b" : "#f4f3f4"}
                        onValueChange={toggleCamera}
                        value={isCameraEnabled}
                    />
                </View>

                <View style={styles.permissionItem}>
                    <Text style={styles.permissionLabel}>Location</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isLocationEnabled ? "#f5dd4b" : "#f4f3f4"}
                        onValueChange={toggleLocation}
                        value={isLocationEnabled}
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
    permissionLabel: {
        fontSize: 18,
    },
    cogIcon: {
        position: 'absolute',
        left: 20,
        bottom: 20,
    },
});

export default PermissionDrawer;
