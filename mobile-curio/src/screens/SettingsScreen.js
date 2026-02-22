import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Switch, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft, Lock, Trash2, Info, Shield, Bell, Sun,
    ChevronDown, ChevronRight, LogOut, Moon
} from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../api/auth';
import { userAPI } from '../api/user';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';

const SettingsScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { isDarkMode, toggleTheme } = useThemeStore();
    const { logout } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '', new_password: '', confirm_password: '',
    });

    const handlePasswordUpdate = async () => {
        if (!passwordData.current_password || !passwordData.new_password) {
            Alert.alert('Error', 'Please fill in all fields'); return;
        }
        if (passwordData.new_password !== passwordData.confirm_password) {
            Alert.alert('Error', 'Passwords do not match'); return;
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
                    text: 'Delete', style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await userAPI.deleteAccount();
                            logout();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete account');
                        } finally { setLoading(false); }
                    }
                }
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
        ]);
    };

    const SettingItem = ({ icon: Icon, label, onPress, rightElement, danger, hideBottomBorder }) => (
        <TouchableOpacity
            style={[styles.settingItem, hideBottomBorder && { borderBottomWidth: 0 }]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconBox, { backgroundColor: danger ? '#fee2e2' : colors.primary[50] }]}>
                <Icon size={18} color={danger ? colors.status.error : colors.primary[600]} />
            </View>
            <Text style={[styles.settingLabel, danger && { color: colors.status.error }]}>{label}</Text>
            {rightElement || (onPress && <ChevronRight size={18} color={colors.text.tertiary} />)}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Container>
                    {/* Preferences Group */}
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.cardGroup}>
                        <SettingItem
                            icon={isDarkMode ? Moon : Sun}
                            label="Dark Mode"
                            rightElement={
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: colors.border.tertiary, true: colors.primary[500] }}
                                    thumbColor="#fff"
                                />
                            }
                        />
                        <SettingItem
                            icon={Bell}
                            label="Notifications"
                            onPress={() => navigation.navigate('Notifications')}
                            hideBottomBorder
                        />
                    </View>

                    {/* Security Group */}
                    <Text style={styles.sectionTitle}>Security</Text>
                    <View style={styles.cardGroup}>
                        <SettingItem
                            icon={Lock}
                            label="Change Password"
                            onPress={() => setShowPasswordForm(!showPasswordForm)}
                            rightElement={showPasswordForm ? <ChevronDown size={18} color={colors.text.tertiary} /> : null}
                            hideBottomBorder={!showPasswordForm}
                        />

                        {showPasswordForm && (
                            <View style={styles.passwordForm}>
                                <Input
                                    label="Current Password" placeholder="••••••••" secureTextEntry
                                    value={passwordData.current_password}
                                    onChangeText={t => setPasswordData(p => ({ ...p, current_password: t }))}
                                />
                                <Input
                                    label="New Password" placeholder="••••••••" secureTextEntry
                                    value={passwordData.new_password}
                                    onChangeText={t => setPasswordData(p => ({ ...p, new_password: t }))}
                                />
                                <Input
                                    label="Confirm New Password" placeholder="••••••••" secureTextEntry
                                    value={passwordData.confirm_password}
                                    onChangeText={t => setPasswordData(p => ({ ...p, confirm_password: t }))}
                                />
                                <Button variant="primary" onPress={handlePasswordUpdate} loading={loading} style={styles.formBtn}>
                                    Update Password
                                </Button>
                            </View>
                        )}

                        {!showPasswordForm && <View style={styles.cardDivider} />}
                        <SettingItem icon={Shield} label="Privacy Policy" hideBottomBorder />
                    </View>

                    {/* Account Group */}
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.cardGroup}>
                        <SettingItem icon={LogOut} label="Log Out" onPress={handleLogout} />
                        <SettingItem icon={Trash2} label="Delete Account" onPress={handleDeleteAccount} danger hideBottomBorder />
                    </View>

                    {/* Footer Info */}
                    <View style={styles.infoSection}>
                        <Info size={40} color={colors.primary[200]} style={{ marginBottom: 12 }} />
                        <Text style={styles.version}>Curio App 1.0.0</Text>
                        <Text style={styles.copy}>© 2026 Indian Heritage Hub</Text>
                    </View>

                    <View style={{ height: 40 }} />
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.secondary },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.background.primary,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
    scrollContent: { paddingTop: 24, paddingBottom: 40 },
    sectionTitle: {
        fontSize: 12, fontWeight: '700', color: colors.text.tertiary,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 16,
        marginLeft: 4,
    },
    cardGroup: {
        backgroundColor: colors.background.primary, borderRadius: 16,
        borderWidth: 1, borderColor: colors.border.primary, overflow: 'hidden',
        marginBottom: 8,
    },
    cardDivider: { height: 1, backgroundColor: colors.border.primary, marginLeft: 64 },
    settingItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    settingLabel: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.text.primary },
    passwordForm: { padding: 16, backgroundColor: colors.background.tertiary },
    formBtn: { marginTop: 8, borderRadius: 12 },
    infoSection: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
    version: { fontSize: 14, color: colors.text.secondary, fontWeight: '700', marginBottom: 4 },
    copy: { fontSize: 12, color: colors.text.tertiary, fontWeight: '500' },
});

export default SettingsScreen;
