import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Check } from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.post(`${API_URL}/auth/forgot-password`, { email });

      setSubmitted(true);
      toast.success("Check your email for reset instructions");
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
                    Forgot Password?
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    No worries! Enter your email and we'll send you reset
                    instructions.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
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
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
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
                    Check Your Email
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    If an account exists for <strong>{email}</strong>, you'll
                    receive password reset instructions shortly.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Didn't receive the email?</strong>
                      <br />
                      Check your spam folder or try again in a few minutes.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => setSubmitted(false)}
                    >
                      Try Another Email
                    </Button>
                    <Link to="/login">
                      <Button variant="outline" size="lg" fullWidth>
                        Back to Login
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
              Need help?{" "}
              <Link
                to="/contact"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default ForgotPassword;
