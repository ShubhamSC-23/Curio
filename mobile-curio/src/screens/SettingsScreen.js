import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    Lock,
    Trash2,
    Info,
    Shield,
    Bell,
    Sun,
    ChevronRight,
    LogOut
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../api/auth';
import { userAPI } from '../api/user';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';
import { Card, CardBody } from '../components/Card';

const SettingsScreen = ({ navigation }) => {
    const { logout, user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const handlePasswordUpdate = async () => {
        if (!passwordData.current_password || !passwordData.new_password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            await authAPI.updatePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            });
            Alert.alert('Success', 'Password updated successfully');
            setShowPasswordForm(false);
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await userAPI.deleteAccount();
                            logout();
                            // Navigation will happen via Auth guard in App.js
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete account');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const SettingItem = ({ icon: Icon, label, onPress, rightElement, color = colors.text.primary }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={styles.settingMain}>
                <View style={[styles.iconBox, { backgroundColor: colors.background.tertiary }]}>
                    <Icon size={20} color={color === colors.text.primary ? colors.text.secondary : color} />
                </View>
                <Text style={[styles.settingLabel, { color }]}>{label}</Text>
            </View>
            {rightElement || <ChevronRight size={20} color={colors.text.tertiary} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Container>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <Card style={styles.menuCard}>
                        <SettingItem
                            icon={Sun}
                            label="Dark Mode"
                            rightElement={<Switch value={false} disabled />}
                        />
                        <SettingItem
                            icon={Bell}
                            label="Notifications"
                        />
                    </Card>

                    <Text style={styles.sectionTitle}>Security</Text>
                    <Card style={styles.menuCard}>
                        <SettingItem
                            icon={Lock}
                            label="Change Password"
                            onPress={() => setShowPasswordForm(!showPasswordForm)}
                        />

                        {showPasswordForm && (
                            <View style={styles.passwordForm}>
                                <Input
                                    label="Current Password"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={passwordData.current_password}
                                    onChangeText={text => setPasswordData(prev => ({ ...prev, current_password: text }))}
                                />
                                <Input
                                    label="New Password"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={passwordData.new_password}
                                    onChangeText={text => setPasswordData(prev => ({ ...prev, new_password: text }))}
                                />
                                <Input
                                    label="Confirm New Password"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={passwordData.confirm_password}
                                    onChangeText={text => setPasswordData(prev => ({ ...prev, confirm_password: text }))}
                                />
                                <Button
                                    variant="primary"
                                    onPress={handlePasswordUpdate}
                                    loading={loading}
                                    style={styles.formBtn}
                                >
                                    Update Password
                                </Button>
                            </View>
                        )}

                        <SettingItem
                            icon={Shield}
                            label="Privacy Policy"
                        />
                    </Card>

                    <Text style={styles.sectionTitle}>Account</Text>
                    <Card style={styles.menuCard}>
                        <SettingItem
                            icon={LogOut}
                            label="Logout"
                            onPress={() => logout()}
                            color={colors.status.error}
                        />
                        <SettingItem
                            icon={Trash2}
                            label="Delete Account"
                            onPress={handleDeleteAccount}
                            color={colors.status.error}
                        />
                    </Card>

                    <View style={styles.infoSection}>
                        <Text style={styles.version}>Curio v1.0.0</Text>
                        <Text style={styles.copy}>© 2026 Indian Heritage Hub</Text>
                    </View>
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
    },
    scrollContent: {
        paddingVertical: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.text.tertiary,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    menuCard: {
        marginBottom: 24,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    settingMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    passwordForm: {
        padding: 16,
        backgroundColor: colors.background.secondary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    formBtn: {
        marginTop: 8,
    },
    infoSection: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 40,
    },
    version: {
        fontSize: 14,
        color: colors.text.tertiary,
        fontWeight: '600',
    },
    copy: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginTop: 4,
    }
});

export default SettingsScreen;
