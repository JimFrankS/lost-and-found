import { Tabs } from 'expo-router'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Linking, Platform, Modal } from 'react-native'
import { Feather } from '@expo/vector-icons' // icon library
import { useSafeAreaInsets } from 'react-native-safe-area-context' // to handle safe area insets which is useful for devices with notches or rounded corners


const TabsLayout = () => {

    const insets = useSafeAreaInsets(); // get the safe area insets
    const [showDonateModal, setShowDonateModal] = useState(false);

    const handleContactDeveloper = () => {
        const email = 'jimmakayikayi@gmail.com';
        const url = `mailto:${email}`;
        Linking.openURL(url).catch(err => console.error('Failed to open email client:', err));
    };

    const handleDonate = () => {
        if (Platform.OS === 'web') {
            setShowDonateModal(true);
        } else {
            const phoneNumber = '*153*1*1*0779729537#';
            const url = `tel:${phoneNumber}`;
            Linking.openURL(url).catch(err => console.error('Failed to open dialer:', err));
        }
    };

    return (
        <>
            <Tabs screenOptions={{
                headerShown: false, // hide headers for each tab
                tabBarShowLabel: false, // hide tab labels for each tab
                tabBarActiveTintColor: '#1DA1F2', // active tab color
                tabBarInactiveTintColor: '#657786', // inactive tab color

                tabBarStyle: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    height: 80 + insets.bottom,
                    paddingTop: 8,
                    paddingBottom: insets.bottom,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
            }}>
                <Tabs.Screen
                    name='index'
                    options={{
                        title: "",
                        tabBarLabel: () => null,
                        tabBarButton: (props) => (
                            <View style={styles.tabBarContainer}>
                                <TouchableOpacity
                                    onPress={handleContactDeveloper}
                                    style={styles.buttonContainer}
                                    accessibilityRole="button"
                                    accessibilityLabel="Contact Developer"
                                >
                                    <Feather name='user' size={24} color="#333" />
                                    <Text style={styles.buttonText}>Contact</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleDonate}
                                    style={styles.buttonContainer}
                                    accessibilityRole="button"
                                    accessibilityLabel="Donate"
                                >
                                    <Feather name='heart' size={24} color="#333" />
                                    <Text style={styles.buttonText}>Donate</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />

            </Tabs>
            <Modal
                visible={showDonateModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDonateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Donate</Text>
                        <Text style={styles.modalText}>
                            Ecocash: 0779729537{'\n'}
                            Inbucks: 0719729537{'\n'}
                            Name: Jim-Frank S. Makayikayi
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowDonateModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 32,
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonText: {
        fontSize: 12,
        color: '#4B5563',
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        width: "100%",
        maxWidth: 600, // Constrain width on large screens
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
    },
    modalText: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 6,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#3B82F6",
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
});

export default TabsLayout
