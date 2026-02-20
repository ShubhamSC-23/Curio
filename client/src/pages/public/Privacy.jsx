import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Cookie,
  Bell,
  Database,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";

const Privacy = () => {
  const lastUpdated = "February 20, 2026";

  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      color: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
      content: [
        {
          subtitle: "Account Information",
          text: "When you create an account, we collect your name, email address, username, and password. You may also choose to provide additional information such as a profile picture and bio.",
        },
        {
          subtitle: "Content",
          text: "We store the articles you write, comments you post, and other content you create on our platform.",
        },
        {
          subtitle: "Usage Data",
          text: "We collect information about how you use Curio, including the articles you read, authors you follow, and features you interact with.",
        },
        {
          subtitle: "Device Information",
          text: "We collect information about the devices you use to access Curio, including IP address, browser type, and operating system.",
        },
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      color:
        "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      content: [
        {
          subtitle: "Provide Our Services",
          text: "We use your information to operate and improve Curio, including displaying your content, personalizing your experience, and providing customer support.",
        },
        {
          subtitle: "Communication",
          text: "We may send you important updates about your account, new features, and content recommendations based on your interests.",
        },
        {
          subtitle: "Safety and Security",
          text: "We use your information to protect our community, prevent fraud, and enforce our Terms of Service.",
        },
        {
          subtitle: "Analytics and Improvements",
          text: "We analyze usage patterns to understand how people use Curio and to improve our platform.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Information Sharing",
      color:
        "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
      content: [
        {
          subtitle: "Public Content",
          text: "Articles, comments, and profile information you choose to make public will be visible to other Curio users and may be indexed by search engines.",
        },
        {
          subtitle: "Service Providers",
          text: "We may share your information with third-party service providers who help us operate Curio, such as hosting and email services. These providers are bound by confidentiality agreements.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law or to protect the rights and safety of Curio and our users.",
        },
        {
          subtitle: "Business Transfers",
          text: "If Curio is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.",
        },
      ],
    },
    {
      icon: Eye,
      title: "Your Privacy Rights",
      color:
        "from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
      content: [
        {
          subtitle: "Access and Update",
          text: "You can access and update your account information at any time through your profile settings.",
        },
        {
          subtitle: "Delete Your Account",
          text: "You can request deletion of your account and associated data by contacting our support team. Some information may be retained for legal or operational purposes.",
        },
        {
          subtitle: "Data Export",
          text: "You can request a copy of your data, including all articles and comments you've created.",
        },
        {
          subtitle: "Marketing Preferences",
          text: "You can opt out of marketing communications at any time by adjusting your notification settings or clicking unsubscribe in our emails.",
        },
      ],
    },
  ];

  const additionalSections = [
    {
      icon: Cookie,
      title: "Cookies and Tracking Technologies",
      color: "from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700",
      content:
        "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.",
    },
    {
      icon: Database,
      title: "Data Security",
      color:
        "from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700",
      content:
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      icon: Bell,
      title: "Data Retention",
      color: "from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700",
      content:
        "We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your information, except where we need to retain it for legal, tax, or regulatory purposes.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900">
        {/* Background pattern */}
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

        <Container className="relative py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white mb-6 border border-white/20 dark:border-white/10"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Your Privacy Matters</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 dark:text-primary-200 mb-4 leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and
              protect your information.
            </p>
            <p className="text-sm text-primary-200 dark:text-primary-300">
              Last updated: <span className="font-semibold">{lastUpdated}</span>
            </p>
          </motion.div>
        </Container>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 md:h-24 text-white dark:text-gray-900"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <Container className="py-16 -mt-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl">
              <CardBody className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome to Our Privacy Policy
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      At Curio, we respect your privacy and are committed to
                      protecting your personal information. This Privacy Policy
                      explains how we collect, use, disclose, and safeguard your
                      information when you use our platform. Please read this
                      policy carefully to understand our practices regarding
                      your information.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Main Sections */}
          <div className="space-y-8 mb-16">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                  <CardBody className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex} className="pl-16">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
                            {item.subtitle}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="space-y-8 mb-16">
            {additionalSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
                  <CardBody className="p-8">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          {section.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Changes Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mb-12"
          >
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Changes to This Privacy Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date at the top of
                  this policy.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  You are advised to review this Privacy Policy periodically for
                  any changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>
              </CardBody>
            </Card>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900" />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative p-12 text-center text-white">
              <Shield className="h-12 w-12 mx-auto mb-6 opacity-80" />
              <h3 className="text-3xl font-bold mb-4">
                Questions About Our Privacy Policy?
              </h3>
              <p className="text-xl text-primary-100 dark:text-primary-200 mb-8 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy, please
                don't hesitate to contact us.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-xl"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Privacy;
