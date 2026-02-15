import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, Trash2, Save } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import axios from "axios";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { Sun } from "lucide-react";
import ProfileImageUpload from "../../components/user/ProfileImageUpload";

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.put(`${API_URL}/users/me`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local user state
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (updateUser) updateUser(updatedUser);

      toast.success("Profile updated successfully");
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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Password changed successfully");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE" to confirm account deletion:',
    );

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
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "theme", label: "Theme", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Settings</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardBody className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-4 py-3 text-sm font-medium transition ${
                            activeTab === tab.id
                              ? "bg-primary-50 text-primary-600 border-r-2 border-primary-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </CardBody>
              </Card>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              <Card>
                <CardBody className="p-6">
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Profile Information
                        </h2>
                        <p className="text-gray-600 text-sm mb-6">
                          Update your account profile information
                        </p>
                      </div>

                      {/* Profile Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                          setProfileData({
                            ...profileData,
                            full_name: e.target.value,
                          })
                        }
                        placeholder="Enter your full name"
                      />

                      <Input
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter your email"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              bio: e.target.value,
                            })
                          }
                          placeholder="Tell us about yourself"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <Input
                        label="Location"
                        type="text"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            location: e.target.value,
                          })
                        }
                        placeholder="e.g., New York, USA"
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        fullWidth
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </form>
                  )}

                  {/* Password Tab */}
                  {activeTab === "password" && (
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Change Password
                        </h2>
                        <p className="text-gray-600 text-sm mb-6">
                          Update your password to keep your account secure
                        </p>
                      </div>

                      <Input
                        label="Current Password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            current_password: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        required
                      />

                      <Input
                        label="New Password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        required
                      />

                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirm_password: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        required
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        fullWidth
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </form>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Notification Preferences
                        </h2>
                        <p className="text-gray-600 text-sm mb-6">
                          Manage how you receive notifications
                        </p>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              Email Notifications
                            </p>
                            <p className="text-sm text-gray-600">
                              Receive email updates about new comments and likes
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-primary-600"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              New Followers
                            </p>
                            <p className="text-sm text-gray-600">
                              Get notified when someone follows you
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-primary-600"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              Article Recommendations
                            </p>
                            <p className="text-sm text-gray-600">
                              Receive personalized article recommendations
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-primary-600"
                          />
                        </label>
                      </div>

                      <Button variant="primary" fullWidth>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  )}
                  {activeTab === "theme" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          Appearance
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                          Customize how the app looks on your device
                        </p>
                      </div>
                      <ThemeToggle />
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Danger Zone */}
              <Card className="mt-6 border-2 border-red-200">
                <CardBody className="p-6">
                  <h3 className="text-lg font-bold text-red-600 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button variant="danger" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Settings;
