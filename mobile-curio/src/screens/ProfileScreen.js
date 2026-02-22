import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { User, Mail, Lock, LogOut, Settings, Bookmark, BookOpen } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import Container from '../components/Container';
import Button from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { userAPI } from '../api/user';

const ProfileScreen = ({ navigation }) => {
    const { user, isAuthenticated, isLoading, login, register, logout } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });
    const [stats, setStats] = useState({ articles: 0, followers: 0, following: 0 });

    useEffect(() => {
        if (isAuthenticated && user?.user_id) {
            fetchStats();
        }
    }, [isAuthenticated, user?.user_id]);

    const fetchStats = async () => {
        try {
            const data = await userAPI.getStats(user.user_id);
            setStats(data.data || { articles: 0, followers: 0, following: 0 });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const handleAuth = async () => {
        try {
            if (isLogin) {
                if (!formData.email || !formData.password) {
                    Alert.alert('Error', 'Please fill in all fields');
                    return;
                }
                await login({ email: formData.email, password: formData.password });
            } else {
                if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
                    Alert.alert('Error', 'Please fill in all fields');
                    return;
                }
                await register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.fullName
                });
            }
        } catch (error) {
            Alert.alert('Authentication Failed', error.response?.data?.message || 'Something went wrong');
        }
    };

    const renderAuthForm = () => (
        <ScrollView contentContainerStyle={styles.authContainer}>
            <View style={styles.authHeader}>
                <View style={styles.iconCircle}>
                    <User size={40} color={colors.primary[600]} />
                </View>
                <Text style={styles.authTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                <Text style={styles.authSubtitle}>
                    {isLogin ? 'Login to continue your journey' : 'Join our heritage community'}
                </Text>
            </View>

            <Container>
                {!isLogin && (
                    <>
                        <View style={styles.inputGroup}>
                            <User size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                                placeholderTextColor={colors.text.tertiary}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <User size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                value={formData.username}
                                onChangeText={(text) => setFormData({ ...formData, username: text })}
                                autoCapitalize="none"
                                placeholderTextColor={colors.text.tertiary}
                            />
                        </View>
                    </>
                )}

                <View style={styles.inputGroup}>
                    <Mail size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={colors.text.tertiary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Lock size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        secureTextEntry
                        placeholderTextColor={colors.text.tertiary}
                    />
                </View>

                <Button
                    style={styles.submitBtn}
                    onPress={handleAuth}
                    loading={isLoading}
                >
                    {isLogin ? 'Login' : 'Get Started'}
                </Button>

                <TouchableOpacity
                    style={styles.toggleBtn}
                    onPress={() => setIsLogin(!isLogin)}
                >
                    <Text style={styles.toggleText}>
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </Text>
                </TouchableOpacity>
            </Container>
        </ScrollView>
    );

    const renderProfile = () => (
        <ScrollView style={styles.profileContainer}>
            <View style={styles.profileHeader}>
                <View style={styles.avatarLarge}>
                    <Text style={styles.avatarTextLarge}>
                        {(user.full_name || user.username).charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.profileName}>{user.full_name || user.username}</Text>
                <Text style={styles.profileHandle}>@{user.username}</Text>
            </View>

            <Container>
                <View style={styles.statsRow}>
                    <View style={styles.miniStat}>
                        <Text style={styles.statNum}>{stats.articles_count || 0}</Text>
                        <Text style={styles.statLabel}>Articles</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.miniStat}>
                        <Text style={styles.statNum}>{stats.followers_count || 0}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.miniStat}>
                        <Text style={styles.statNum}>{stats.following_count || 0}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>

                <Text style={styles.menuTitle}>Account</Text>
                <Card style={styles.menuCard}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <User size={20} color={colors.text.secondary} />
                        <Text style={styles.menuText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Bookmarks')}
                    >
                        <Bookmark size={20} color={colors.text.secondary} />
                        <Text style={styles.menuText}>Saved Articles</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('ReadingList')}
                    >
                        <BookOpen size={20} color={colors.text.secondary} />
                        <Text style={styles.menuText}>My Reading List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Settings size={20} color={colors.text.secondary} />
                        <Text style={styles.menuText}>Settings</Text>
                    </TouchableOpacity>
                </Card>

                <Button
                    variant="outline"
                    style={styles.logoutBtn}
                    onPress={logout}
                >
                    <LogOut size={20} color={colors.status.error} style={{ marginRight: 8 }} />
                    <Text style={{ color: colors.status.error }}>Logout</Text>
                </Button>
            </Container>
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.root}>
            {isAuthenticated ? renderProfile() : renderAuthForm()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    authContainer: {
        paddingVertical: 40,
    },
    authHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    authTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: 8,
    },
    authSubtitle: {
        fontSize: 16,
        color: colors.text.tertiary,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: colors.text.primary,
        fontSize: 16,
    },
    submitBtn: {
        marginTop: 16,
        height: 56,
    },
    toggleBtn: {
        marginTop: 24,
        alignItems: 'center',
    },
    toggleText: {
        color: colors.primary[600],
        fontWeight: '600',
    },
    profileContainer: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: colors.background.secondary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary[600],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#fff',
        elevation: 4,
    },
    avatarTextLarge: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: 4,
    },
    profileHandle: {
        fontSize: 15,
        color: colors.text.tertiary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 24,
    },
    miniStat: {
        alignItems: 'center',
    },
    statNum: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: colors.border.primary,
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text.tertiary,
        textTransform: 'uppercase',
        marginBottom: 12,
        marginTop: 8,
    },
    menuCard: {
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
    },
    menuText: {
        marginLeft: 16,
        fontSize: 16,
        color: colors.text.primary,
        fontWeight: '500',
    },
    logoutBtn: {
        borderColor: colors.status.error,
        marginTop: 8,
        marginBottom: 40,
    }
});

export default ProfileScreen;
