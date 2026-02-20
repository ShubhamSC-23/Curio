import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Trash2,
  Save,
  Sun,
  Settings as SettingsIcon,
  Sparkles,
  Shield,
  MapPin,
  Mail,
  AlertTriangle,
  Check,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import axios from "axios";
import ThemeToggle from "../../components/theme/ThemeToggle";
import ProfileImageUpload from "../../components/user/ProfileImageUpload";
import { getImageUrl } from "../../utils/imageUtils";

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [notifData, setNotifData] = useState({
    email_comments: true,
    email_followers: true,
    email_recommendations: false,
  });

  /* ── Handlers ── */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/users/me`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (updateUser) updateUser(updatedUser);
      toast.success("Profile updated successfully");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/auth/password`,
        {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;
    const doubleConfirm = window.prompt('Type "DELETE" to confirm account deletion:');
    if (doubleConfirm !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted");
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  const handleImageUpdate = (imageUrl) => {
    const updatedUser = { ...user, profile_image: imageUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    if (updateUser) updateUser(updatedUser);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, description: "Name, bio, location" },
    { id: "password", label: "Password", icon: Lock, description: "Change your password" },
    { id: "theme", label: "Appearance", icon: Sun, description: "Light & dark mode" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Email preferences" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/30" />

        <Container className="relative py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-6"
          >
            {/* Avatar preview */}
            <div className="flex-shrink-0">
              {user?.profile_image ? (
                <img
                  src={getImageUrl(user.profile_image)}
                  alt={user.full_name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-white/40 shadow-2xl"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm ring-4 ring-white/40 shadow-2xl flex items-center justify-center">
                  <User className="h-10 w-10 text-white/80" />
                </div>
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white mb-3 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Account Settings</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                Settings
              </h1>
              <p className="text-primary-100 dark:text-primary-200">
                Manage your account, password, and preferences
              </p>
            </div>
          </motion.div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 md:h-20 text-white dark:text-gray-900"
            viewBox="0 0 1440 80"
            fill="none"
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <Container className="py-8 -mt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* ── Sidebar ── */}
            <div className="md:col-span-1">
              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-lg dark:shadow-2xl sticky top-6">
                <CardBody className="p-2">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              isActive
                                ? "bg-primary-100 dark:bg-primary-900/50"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                isActive
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                          </div>
                          <div className="text-left hidden sm:block md:hidden lg:block">
                            <p className="font-semibold leading-tight">{tab.label}</p>
                            <p
                              className={`text-xs mt-0.5 ${
                                isActive
                                  ? "text-primary-500 dark:text-primary-500"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              {tab.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </CardBody>
              </Card>
            </div>

            {/* ── Content ── */}
            <div className="md:col-span-3 space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-lg dark:shadow-2xl">
                <CardBody className="p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    {/* ── Profile Tab ── */}
                    {activeTab === "profile" && (
                      <motion.form
                        key="profile"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleProfileUpdate}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                              Profile Information
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              Update your display name, bio, and location
                            </p>
                          </div>
                        </div>

                        {/* Profile Image */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Profile Image
                          </label>
                          <ProfileImageUpload
                            currentImage={user?.profile_image}
                            onImageUpdate={handleImageUpdate}
                          />
                        </div>

                        <Input
                          label="Full Name"
                          type="text"
                          value={profileData.full_name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, full_name: e.target.value })
                          }
                          placeholder="Enter your full name"
                        />

                        <Input
                          label="Email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({ ...profileData, email: e.target.value })
                          }
                          placeholder="Enter your email"
                        />

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) =>
                              setProfileData({ ...profileData, bio: e.target.value })
                            }
                            placeholder="Tell us about yourself…"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all resize-none"
                          />
                        </div>

                        <div className="relative">
                          <MapPin className="absolute left-3 top-9 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            label="Location"
                            type="text"
                            value={profileData.location}
                            onChange={(e) =>
                              setProfileData({ ...profileData, location: e.target.value })
                            }
                            placeholder="e.g., Mumbai, India"
                            className="pl-10"
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          loading={loading}
                          fullWidth
                          className="py-3"
                        >
                          {saved ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Saved!
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </motion.form>
                    )}

                    {/* ── Password Tab ── */}
                    {activeTab === "password" && (
                      <motion.form
                        key="password"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handlePasswordChange}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                              Change Password
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              Keep your account secure with a strong password
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                          <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                            Use a strong password with at least 6 characters
                          </p>
                        </div>

                        <Input
                          label="Current Password"
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, current_password: e.target.value })
                          }
                          placeholder="Enter current password"
                          required
                        />
                        <Input
                          label="New Password"
                          type="password"
                          value={passwordData.new_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, new_password: e.target.value })
                          }
                          placeholder="Enter new password"
                          required
                        />
                        <Input
                          label="Confirm New Password"
                          type="password"
                          value={passwordData.confirm_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirm_password: e.target.value })
                          }
                          placeholder="Re-enter new password"
                          required
                        />

                        <Button
                          type="submit"
                          variant="primary"
                          loading={loading}
                          fullWidth
                          className="py-3"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                      </motion.form>
                    )}

                    {/* ── Appearance Tab ── */}
                    {activeTab === "theme" && (
                      <motion.div
                        key="theme"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                            <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                              Appearance
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              Choose how Curio looks on your device
                            </p>
                          </div>
                        </div>

                        <ThemeToggle />
                      </motion.div>
                    )}

                    {/* ── Notifications Tab ── */}
                    {activeTab === "notifications" && (
                      <motion.div
                        key="notifications"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                              Notification Preferences
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              Control what you hear about and when
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {[
                            {
                              key: "email_comments",
                              icon: Mail,
                              label: "Comments & Likes",
                              desc: "Get notified when someone comments or likes your articles",
                            },
                            {
                              key: "email_followers",
                              icon: User,
                              label: "New Followers",
                              desc: "Get notified when someone starts following you",
                            },
                            {
                              key: "email_recommendations",
                              icon: SettingsIcon,
                              label: "Article Recommendations",
                              desc: "Receive personalized article recommendations by email",
                            },
                          ].map(({ key, icon: Icon, label, desc }) => (
                            <label
                              key={key}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 flex-shrink-0 mt-0.5">
                                  <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {label}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {desc}
                                  </p>
                                </div>
                              </div>
                              <div className="relative flex-shrink-0 ml-4">
                                <input
                                  type="checkbox"
                                  checked={notifData[key]}
                                  onChange={(e) =>
                                    setNotifData({ ...notifData, [key]: e.target.checked })
                                  }
                                  className="sr-only"
                                />
                                <div
                                  onClick={() =>
                                    setNotifData({ ...notifData, [key]: !notifData[key] })
                                  }
                                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                                    notifData[key]
                                      ? "bg-primary-600 dark:bg-primary-500"
                                      : "bg-gray-200 dark:bg-gray-700"
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-all ${
                                      notifData[key] ? "left-6" : "left-1"
                                    }`}
                                  />
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>

                        <Button variant="primary" fullWidth className="py-3">
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardBody>
              </Card>

              {/* ── Danger Zone ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-900/50 shadow-lg">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                          Danger Zone
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Irreversible and destructive actions
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/40">
                      Once you delete your account, all your data including articles, comments and bookmarks will be permanently removed. This cannot be undone.
                    </p>

                    <Button
                      variant="danger"
                      onClick={handleDeleteAccount}
                      className="border-red-600 dark:border-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete My Account
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Settings;
