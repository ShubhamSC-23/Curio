import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ← Added
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { t } = useTranslation(); // ← Added
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.get(`${API_URL}/auth/verify-reset-token/${token}`);
      setValidToken(true);
    } catch (error) {
      console.error("Token verification error:", error);
      setValidToken(false);
      toast.error(t("resetPassword.invalidToken.toast"));
    } finally {
      setVerifying(false);
    }
  };

  const validatePassword = () => {
    if (!password) {
      toast.error(t("resetPassword.validation.passwordRequired"));
      return false;
    }

    if (password.length < 6) {
      toast.error(t("resetPassword.validation.passwordMinLength"));
      return false;
    }

    if (password !== confirmPassword) {
      toast.error(t("resetPassword.validation.passwordMismatch"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });

      setSuccess(true);
      toast.success(t("resetPassword.success.toast"));

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);
      const message =
        error.response?.data?.message || t("resetPassword.error.failed");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while verifying token
  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("resetPassword.verifying")}
          </p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!validToken) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card>
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("resetPassword.invalidToken.title")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t("resetPassword.invalidToken.message")}
                </p>
                <Link to="/forgot-password">
                  <Button variant="primary" size="lg" fullWidth>
                    {t("resetPassword.invalidToken.button")}
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        </Container>
      </div>
    );
  }

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card>
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("resetPassword.success.title")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t("resetPassword.success.message")}
                </p>
                <Link to="/login">
                  <Button variant="primary" size="lg" fullWidth>
                    {t("resetPassword.success.button")}
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        </Container>
      </div>
    );
  }

  // Show reset password form
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card>
            <CardBody className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("resetPassword.title")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("resetPassword.subtitle")}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <Input
                    label={t("resetPassword.form.newPassword.label")}
                    type={showPassword ? "text" : "password"}
                    placeholder={t(
                      "resetPassword.form.newPassword.placeholder",
                    )}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    label={t("resetPassword.form.confirmPassword.label")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t(
                      "resetPassword.form.confirmPassword.placeholder",
                    )}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={Lock}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("resetPassword.requirements.title")}
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li
                      className={
                        password.length >= 6
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }
                    >
                      • {t("resetPassword.requirements.minLength")}
                    </li>
                    <li
                      className={
                        password &&
                        confirmPassword &&
                        password === confirmPassword
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }
                    >
                      • {t("resetPassword.requirements.match")}
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading}
                >
                  {loading
                    ? t("resetPassword.form.resetting")
                    : t("resetPassword.form.resetButton")}
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("resetPassword.footer.remember")}{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                {t("resetPassword.footer.backToLogin")}
              </Link>
            </p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default ResetPassword;
