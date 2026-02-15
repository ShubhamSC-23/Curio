import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Shield,
  Edit,
  Trash2,
  Ban,
  Mail,
  Eye,
  MoreVertical,
  Crown,
  Pen,
  User as UserIcon,
  ChevronDown,
  Check,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { formatDate } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openRoleMenu, setOpenRoleMenu] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      const params = {};
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.status = statusFilter;

      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, username) => {
    if (!window.confirm(`Ban ${username}?`)) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/admin/users/${userId}/ban`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(`${username} banned`);
      fetchUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Failed to ban user");
    }
  };

  const handleUnbanUser = async (userId, username) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/admin/users/${userId}/unban`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(`${username} unbanned`);
      fetchUsers();
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("Failed to unban user");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Delete ${username}? This cannot be undone.`)) return;

    const confirm = window.prompt(`Type "${username}" to confirm:`);
    if (confirm !== username) {
      toast.error("Deletion cancelled");
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${username} deleted`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleChangeRole = async (userId, newRole, username, currentRole) => {
    // Confirm if making someone admin
    if (newRole === "admin") {
      if (
        !window.confirm(
          `Give ${username} admin privileges? This grants full access to the platform.`,
        )
      ) {
        return;
      }
    }

    // Confirm if demoting admin
    if (currentRole === "admin" && newRole !== "admin") {
      if (!window.confirm(`Remove admin privileges from ${username}?`)) {
        return;
      }
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(`${username}'s role updated to ${newRole}`);
      setOpenRoleMenu(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.full_name?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Role configuration with icons and colors
  const roleConfig = {
    user: {
      icon: UserIcon,
      label: "User",
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      hoverColor: "hover:bg-gray-200 dark:hover:bg-gray-700",
      description: "Basic access",
    },
    author: {
      icon: Pen,
      label: "Author",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-900/50",
      description: "Can write articles",
    },
    admin: {
      icon: Crown,
      label: "Admin",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      hoverColor: "hover:bg-purple-200 dark:hover:bg-purple-900/50",
      description: "Full access",
    },
  };

  // ✅ Role Badge Component
  const RoleBadge = ({ role, onClick, showDropdown = false }) => {
    const config = roleConfig[role] || roleConfig.user;
    const Icon = config.icon;

    return (
      <button
        onClick={onClick}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
          ${config.bgColor} ${config.color} ${showDropdown ? config.hoverColor : ""}
          transition-all duration-200
          ${showDropdown ? "cursor-pointer" : "cursor-default"}
        `}
      >
        <Icon className="h-4 w-4" />
        <span>{config.label}</span>
        {showDropdown && <ChevronDown className="h-3 w-3" />}
      </button>
    );
  };

  // ✅ Role Menu Component
  const RoleMenu = ({ user, onClose }) => {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
              Change role for {user.username}
            </div>
            {Object.entries(roleConfig).map(([roleKey, config]) => {
              const Icon = config.icon;
              const isCurrentRole = user.role === roleKey;

              return (
                <button
                  key={roleKey}
                  onClick={() => {
                    if (!isCurrentRole) {
                      handleChangeRole(
                        user.user_id || user.id,
                        roleKey,
                        user.username,
                        user.role,
                      );
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
                    ${
                      isCurrentRole
                        ? "bg-gray-100 dark:bg-gray-700 cursor-default"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    }
                    transition-colors
                  `}
                >
                  <div className={`p-1.5 rounded ${config.bgColor}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      className={`font-medium ${isCurrentRole ? config.color : "text-gray-900 dark:text-white"}`}
                    >
                      {config.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {config.description}
                    </div>
                  </div>
                  {isCurrentRole && (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage users, roles, and permissions
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="author">Authors</option>
                  <option value="admin">Admins</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {users.filter((u) => u.role === "user").length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Users
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Pen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {users.filter((u) => u.role === "author").length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Authors
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {users.filter((u) => u.role === "admin").length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Admins
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {users.filter((u) => u.is_banned).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Banned
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.user_id || user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.profile_image ? (
                              <img
                                src={getImageUrl(user.profile_image)}
                                alt={user.username}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.full_name || user.username}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* ✅ IMPROVED ROLE SELECTOR */}
                          <div className="relative">
                            <RoleBadge
                              role={user.role}
                              onClick={() =>
                                setOpenRoleMenu(
                                  openRoleMenu === user.user_id
                                    ? null
                                    : user.user_id,
                                )
                              }
                              showDropdown={true}
                            />

                            {/* Dropdown Menu */}
                            {openRoleMenu === user.user_id && (
                              <>
                                {/* Backdrop */}
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenRoleMenu(null)}
                                />
                                {/* Menu */}
                                <div className="relative">
                                  <RoleMenu
                                    user={user}
                                    onClose={() => setOpenRoleMenu(null)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.is_banned
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {user.is_banned ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            {user.is_banned ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUnbanUser(
                                    user.user_id || user.id,
                                    user.username,
                                  )
                                }
                                className="text-green-600 hover:text-green-700 dark:text-green-400"
                              >
                                Unban
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleBanUser(
                                    user.user_id || user.id,
                                    user.username,
                                  )
                                }
                                className="text-red-600 hover:text-red-700 dark:text-red-400"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDeleteUser(
                                  user.user_id || user.id,
                                  user.username,
                                )
                              }
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No users found
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default UserManagement;
