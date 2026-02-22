import React, { useState, useEffect, useMemo } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, LogOut, Settings, Bookmark, BookOpen, ChevronRight, Edit3, Users } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useAuthStore } from '../store/authStore';
import Container from '../components/Container';
import Button from '../components/Button';
import { userAPI } from '../api/user';

const MenuItem = ({ icon: Icon, label, onPress, iconColor, danger, colors }) => (
    <TouchableOpacity style={{
        flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    }} onPress={onPress} activeOpacity={0.7}>
        <View style={{
            width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
            backgroundColor: danger ? '#fee2e2' : colors.primary[50],
        }}>
            <Icon size={18} color={iconColor || colors.primary[600]} />
        </View>
        <Text style={{
            flex: 1, marginLeft: 12, fontSize: 15, color: danger ? colors.status.error : colors.text.primary, fontWeight: '500',
        }}>{label}</Text>
        <ChevronRight size={16} color={colors.text.tertiary} />
    </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { user, isAuthenticated, isLoading, login, register, logout } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '' });
    const [stats, setStats] = useState({ articles_count: 0, followers_count: 0, following_count: 0 });
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user?.user_id) fetchStats();
    }, [isAuthenticated, user?.user_id]);

    const fetchStats = async () => {
        try {
            const data = await userAPI.getStats(user.user_id);
            setStats(data.data || {});
        } catch (error) { console.error(error); }
    };

    const onRefresh = async () => { setRefreshing(true); await fetchStats(); setRefreshing(false); };

    const handleAuth = async () => {
        try {
            if (isLogin) {
                if (!formData.email || !formData.password) { Alert.alert('Error', 'Please fill in all fields'); return; }
                await login({ email: formData.email, password: formData.password });
            } else {
                if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
                    Alert.alert('Error', 'Please fill in all fields'); return;
                }
                await register({ username: formData.username, email: formData.email, password: formData.password, full_name: formData.fullName });
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
        ]);
    };

    const initials = user ? (user.full_name || user.username || 'U').charAt(0).toUpperCase() : 'U';

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.root} edges={['top']}>
                <ScrollView contentContainerStyle={styles.authWrap}>
                    {/* Branding */}
                    <View style={styles.authBrand}>
                        <View style={styles.brandCircle}>
                            <User size={40} color={colors.primary[600]} />
                        </View>
                        <Text style={styles.brandTitle}>{isLogin ? 'Welcome Back' : 'Join Curio'}</Text>
                        <Text style={styles.brandSub}>
                            {isLogin ? 'Sign in to your account' : 'Create your heritage community account'}
                        </Text>
                    </View>

                    {/* Toggle */}
                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={[styles.toggleTab, isLogin && styles.toggleTabActive]}
                            onPress={() => setIsLogin(true)}
                        >
                            <Text style={[styles.toggleTabText, isLogin && styles.toggleTabTextActive]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleTab, !isLogin && styles.toggleTabActive]}
                            onPress={() => setIsLogin(false)}
                        >
                            <Text style={[styles.toggleTabText, !isLogin && styles.toggleTabTextActive]}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {!isLogin && (
                            <>
                                {[
                                    { placeholder: 'Full Name', key: 'fullName', icon: User },
                                    { placeholder: 'Username', key: 'username', icon: User, lower: true },
                                ].map(({ placeholder, key, icon: Icon, lower }) => (
                                    <View key={key} style={styles.inputRow}>
                                        <Icon size={18} color={colors.text.tertiary} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={placeholder}
                                            placeholderTextColor={colors.text.tertiary}
                                            value={formData[key]}
                                            onChangeText={text => setFormData({ ...formData, [key]: text })}
                                            autoCapitalize={lower ? 'none' : 'words'}
                                        />
                                    </View>
                                ))}
                            </>
                        )}
                        <View style={styles.inputRow}>
                            <Mail size={18} color={colors.text.tertiary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor={colors.text.tertiary}
                                value={formData.email}
                                onChangeText={text => setFormData({ ...formData, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.inputRow}>
                            <Lock size={18} color={colors.text.tertiary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={colors.text.tertiary}
                                value={formData.password}
                                onChangeText={text => setFormData({ ...formData, password: text })}
                                secureTextEntry
                            />
                        </View>
                        <TouchableOpacity style={styles.authBtn} onPress={handleAuth} disabled={isLoading}>
                            {isLoading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.authBtnText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.root} edges={['top']}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />}
            >
                {/* Profile Banner */}
                <View style={styles.banner}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.name}>{user.full_name || user.username}</Text>
                    <Text style={styles.handle}>@{user.username}</Text>
                    {!!user.email && <Text style={styles.email}>{user.email}</Text>}
                    <TouchableOpacity style={styles.editBadge} onPress={() => navigation.navigate('EditProfile')}>
                        <Edit3 size={14} color={colors.primary[600]} />
                        <Text style={styles.editBadgeText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {[
                        { val: stats.articles_count || 0, label: 'Articles' },
                        { val: stats.followers_count || 0, label: 'Followers' },
                        { val: stats.following_count || 0, label: 'Following' },
                    ].map((s, i, arr) => (
                        <React.Fragment key={s.label}>
                            <View style={styles.stat}>
                                <Text style={styles.statNum}>{s.val}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </View>
                            {i < arr.length - 1 && <View style={styles.statDiv} />}
                        </React.Fragment>
                    ))}
                </View>

                {/* Menu */}
                <Container style={{ marginTop: 20 }}>
                    <Text style={styles.section}>Library</Text>
                </Container>
                <View style={styles.menuCard}>
                    <MenuItem icon={Bookmark} label="Saved Articles" onPress={() => navigation.navigate('Bookmarks')} colors={colors} />
                    <MenuItem icon={BookOpen} label="Reading List" onPress={() => navigation.navigate('ReadingList')} colors={colors} />
                    <MenuItem icon={Users} label="Discover Authors" onPress={() => navigation.navigate('Authors')} colors={colors} />
                </View>

                <Container style={{ marginTop: 16 }}>
                    <Text style={styles.section}>Account</Text>
                </Container>
                <View style={styles.menuCard}>
                    <MenuItem icon={Settings} label="Settings" onPress={() => navigation.navigate('Settings')} colors={colors} />
                    <MenuItem icon={LogOut} label="Logout" onPress={handleLogout} danger colors={colors} iconColor={colors.status.error} />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background.secondary },
    authWrap: { flexGrow: 1, paddingBottom: 40 },
    authBrand: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
    brandCircle: {
        width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary[50],
        borderWidth: 2, borderColor: colors.primary[100],
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    },
    brandTitle: { fontSize: 26, fontWeight: '800', color: colors.text.primary, marginBottom: 8 },
    brandSub: { fontSize: 14, color: colors.text.tertiary, textAlign: 'center' },
    toggleRow: {
        flexDirection: 'row', marginHorizontal: 16, marginBottom: 24,
        backgroundColor: colors.background.tertiary, borderRadius: 12, padding: 4,
        borderWidth: 1, borderColor: colors.border.primary,
    },
    toggleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    toggleTabActive: { backgroundColor: colors.primary[600] },
    toggleTabText: { fontWeight: '600', color: colors.text.secondary },
    toggleTabTextActive: { color: '#fff' },
    form: { paddingHorizontal: 16, gap: 12 },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: colors.background.primary, borderRadius: 12, paddingHorizontal: 16,
        height: 54, borderWidth: 1, borderColor: colors.border.primary,
    },
    input: { flex: 1, color: colors.text.primary, fontSize: 15 },
    authBtn: {
        height: 54, borderRadius: 12, backgroundColor: colors.primary[600],
        alignItems: 'center', justifyContent: 'center', marginTop: 8,
    },
    authBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    banner: {
        backgroundColor: colors.background.primary, alignItems: 'center',
        paddingVertical: 32, paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    avatar: {
        width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary[600],
        alignItems: 'center', justifyContent: 'center', marginBottom: 14,
        borderWidth: 3, borderColor: colors.primary[200],
    },
    avatarText: { color: '#fff', fontSize: 38, fontWeight: '800' },
    name: { fontSize: 22, fontWeight: '800', color: colors.text.primary, marginBottom: 4 },
    handle: { fontSize: 14, color: colors.text.tertiary, marginBottom: 4 },
    email: { fontSize: 13, color: colors.text.tertiary, marginBottom: 14 },
    editBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: colors.primary[50], paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 20, borderWidth: 1, borderColor: colors.primary[100],
    },
    editBadgeText: { fontSize: 13, fontWeight: '700', color: colors.primary[600] },
    statsRow: {
        flexDirection: 'row', backgroundColor: colors.background.primary,
        marginTop: 1, paddingVertical: 16, paddingHorizontal: 8,
        borderBottomWidth: 1, borderBottomColor: colors.border.primary,
    },
    stat: { flex: 1, alignItems: 'center' },
    statNum: { fontSize: 18, fontWeight: '800', color: colors.text.primary },
    statLabel: { fontSize: 11, color: colors.text.tertiary, marginTop: 3 },
    statDiv: { width: 1, backgroundColor: colors.border.primary },
    section: {
        fontSize: 12, fontWeight: '700', color: colors.text.tertiary,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
    },
    menuCard: {
        backgroundColor: colors.background.primary,
        borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border.primary,
    },
});

export default ProfileScreen;
