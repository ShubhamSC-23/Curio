import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Check,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.full_name) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-3">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-xl mb-6"
          >
            <UserPlus className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Create Account
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join our community today
            </p>
          </motion.div>
        </div>

        {/* Register Card */}
        <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-2xl dark:shadow-none">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two Column Layout for Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 ${
                        errors.full_name
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      } rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all`}
                      required
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.full_name}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 ${
                        errors.username
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      } rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all`}
                      required
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 ${
                      errors.email
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-200 dark:border-gray-700"
                    } rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border-2 ${
                        errors.password
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      } rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border-2 ${
                        errors.confirmPassword
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      } rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  I want to
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center p-4 cursor-pointer border-2 rounded-xl transition-all ${
                      formData.role === "user"
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Read articles
                        </span>
                        {formData.role === "user" && (
                          <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Explore and save articles
                      </p>
                    </div>
                  </label>

                  <label
                    className={`relative flex items-center p-4 cursor-pointer border-2 rounded-xl transition-all ${
                      formData.role === "author"
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="author"
                      checked={formData.role === "author"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Write & publish
                        </span>
                        {formData.role === "author" && (
                          <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Share your stories
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  "Creating account..."
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          By creating an account, you agree to our{" "}
          <Link
            to="/terms"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
