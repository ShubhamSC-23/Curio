import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";

const Privacy = () => {
  const lastUpdated = "February 13, 2026";

  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
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
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
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
      ],
    },
    {
      icon: Shield,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Public Content",
          text: "Articles, comments, and profile information you choose to make public will be visible to other Curio users and may be indexed by search engines.",
        },
        {
          subtitle: "Service Providers",
          text: "We may share your information with third-party service providers who help us operate Curio, such as hosting and email services.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law or to protect the rights and safety of Curio and our users.",
        },
      ],
    },
    {
      icon: Eye,
      title: "Your Privacy Rights",
      content: [
        {
          subtitle: "Access and Update",
          text: "You can access and update your account information at any time through your profile settings.",
        },
        {
          subtitle: "Delete Your Account",
          text: "You can request deletion of your account and associated data by contacting our support team.",
        },
        {
          subtitle: "Data Export",
          text: "You can request a copy of your data, including all articles and comments you've created.",
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 text-white py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-primary-100">
              Your privacy is important to us. Learn how we collect, use, and
              protect your information.
            </p>
            <p className="text-sm text-primary-200 mt-4">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card>
              <CardBody className="p-8">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  At Curio, we respect your privacy and are committed to
                  protecting your personal information. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you use our platform. Please read this policy
                  carefully to understand our practices regarding your
                  information.
                </p>
              </CardBody>
            </Card>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card>
                  <CardBody className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
                        <section.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <Card>
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to track
                  activity on our platform and hold certain information. Cookies
                  are files with a small amount of data which may include an
                  anonymous unique identifier.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  You can instruct your browser to refuse all cookies or to
                  indicate when a cookie is being sent. However, if you do not
                  accept cookies, you may not be able to use some portions of
                  our platform.
                </p>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Card>
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

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30">
              <CardBody className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Questions About Our Privacy Policy?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  If you have any questions about this Privacy Policy, please
                  contact us.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
                >
                  Contact Us
                </a>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Privacy;
