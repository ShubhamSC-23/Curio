import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, MapPin, AlignLeft, Save, ChevronLeft, Camera } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../api/user';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';

const EditProfileScreen = ({ navigation }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        bio: user?.bio || '',
        location: user?.location || '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            await userAPI.updateProfile(formData);
            const updatedUser = { ...user, ...formData };
            updateUser(updatedUser);
            Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Container>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user?.username?.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.cameraBadge}>
                                <Camera size={14} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.username}>@{user?.username}</Text>
                        <Text style={styles.email}>{user?.email}</Text>
                    </View>

                    <View style={styles.formCard}>
                        <Input
                            label="Full Name"
                            placeholder="Your full name"
                            value={formData.full_name}
                            onChangeText={(text) => handleChange('full_name', text)}
                            icon={User}
                            error={errors.full_name}
                        />

                        <Input
                            label="Bio"
                            placeholder="Tell us about yourself"
                            value={formData.bio}
                            onChangeText={(text) => handleChange('bio', text)}
                            icon={AlignLeft}
                            multiline
                            numberOfLines={4}
                            inputStyle={styles.textArea}
                        />

                        <Input
                            label="Location"
                            placeholder="e.g., Mumbai, India"
                            value={formData.location}
                            onChangeText={(text) => handleChange('location', text)}
                            icon={MapPin}
                        />

                        <Button
                            variant="primary"
                            style={styles.saveBtn}
                            onPress={handleSave}
                            loading={loading}
                        >
                            <Save size={20} color="#fff" style={{ marginRight: 8 }} />
                            Save Changes
                        </Button>
                    </View>
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
    scrollContent: { paddingVertical: 24 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatarWrapper: { position: 'relative', marginBottom: 12 },
    avatar: {
        width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary[100],
        alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.primary[200]
    },
    avatarText: { fontSize: 36, fontWeight: '800', color: colors.primary[600] },
    cameraBadge: {
        position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary[600],
        width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: colors.background.secondary,
    },
    username: { fontSize: 20, fontWeight: '800', color: colors.text.primary, marginBottom: 4 },
    email: { fontSize: 14, color: colors.text.tertiary, fontWeight: '500' },
    formCard: {
        backgroundColor: colors.background.primary, borderRadius: 16, padding: 20,
        borderWidth: 1, borderColor: colors.border.primary,
    },
    textArea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },
    saveBtn: { marginTop: 12, height: 54, borderRadius: 12 },
});

export default EditProfileScreen;
