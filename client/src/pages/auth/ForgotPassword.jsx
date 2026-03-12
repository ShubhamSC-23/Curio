import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ← Added
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Check } from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { t } = useTranslation(); // ← Added
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("forgotPassword.validation.emailRequired"));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("forgotPassword.validation.emailInvalid"));
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.post(`${API_URL}/auth/forgot-password`, { email });

      setSubmitted(true);
      toast.success(t("forgotPassword.success"));
    } catch (error) {
      console.error("Forgot password error:", error);
      // Always show success message for security (don't reveal if email exists)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {!submitted ? (
            <Card>
              <CardBody className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                    <Mail className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("forgotPassword.title")}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("forgotPassword.subtitle")}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label={t("forgotPassword.form.email.label")}
                    type="email"
                    placeholder={t("forgotPassword.form.email.placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={loading}
                  >
                    {loading
                      ? t("forgotPassword.form.sending")
                      : t("forgotPassword.form.sendLink")}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t("forgotPassword.backToLogin")}
                  </Link>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="p-8">
                {/* Success Message */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("forgotPassword.emailSent.title")}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t("forgotPassword.emailSent.message", { email })}
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>
                        {t("forgotPassword.emailSent.noEmail.title")}
                      </strong>
                      <br />
                      {t("forgotPassword.emailSent.noEmail.message")}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => setSubmitted(false)}
                    >
                      {t("forgotPassword.emailSent.tryAnother")}
                    </Button>
                    <Link to="/login">
                      <Button variant="outline" size="lg" fullWidth>
                        {t("forgotPassword.backToLogin")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("forgotPassword.footer.needHelp")}{" "}
              <Link
                to="/contact"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                {t("forgotPassword.footer.contactSupport")}
              </Link>
            </p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default ForgotPassword;
