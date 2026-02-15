import React from "react";
import { motion } from "framer-motion";
import { FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";

const Terms = () => {
  const lastUpdated = "February 13, 2026";

  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content:
        "By accessing and using Curio, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our platform.",
    },
    {
      icon: CheckCircle,
      title: "User Accounts",
      subsections: [
        {
          subtitle: "Account Creation",
          text: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.",
        },
        {
          subtitle: "Account Eligibility",
          text: "You must be at least 13 years old to use Curio. By creating an account, you represent that you meet this age requirement.",
        },
        {
          subtitle: "Account Responsibility",
          text: "You are responsible for all activity that occurs under your account. Notify us immediately of any unauthorized use of your account.",
        },
      ],
    },
    {
      icon: FileText,
      title: "Content Guidelines",
      subsections: [
        {
          subtitle: "Your Content",
          text: "You retain all rights to the content you post on Curio. By posting content, you grant Curio a license to display, distribute, and promote your content on our platform.",
        },
        {
          subtitle: "Prohibited Content",
          text: "You may not post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.",
        },
        {
          subtitle: "Copyright",
          text: "You must own or have the necessary rights to all content you post. Respect the intellectual property rights of others.",
        },
      ],
    },
    {
      icon: XCircle,
      title: "Prohibited Activities",
      subsections: [
        {
          subtitle: "No Spam",
          text: "Do not post spam, engage in mass marketing, or otherwise use Curio for commercial purposes without our permission.",
        },
        {
          subtitle: "No Impersonation",
          text: "Do not impersonate others or misrepresent your affiliation with any person or organization.",
        },
        {
          subtitle: "No Abuse",
          text: "Do not harass, threaten, or harm other users. Respect the community and maintain a positive environment.",
        },
        {
          subtitle: "No Hacking",
          text: "Do not attempt to gain unauthorized access to our systems, interfere with our services, or engage in any malicious activities.",
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
            <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-primary-100">
              Please read these terms carefully before using Curio.
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
                  Welcome to Curio! These Terms of Service ("Terms") govern your
                  access to and use of our platform, including any content,
                  functionality, and services offered on or through Curio. By
                  using our platform, you agree to comply with and be bound by
                  these Terms.
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

                    {section.content && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {section.content}
                      </p>
                    )}

                    {section.subsections && (
                      <div className="space-y-6">
                        {section.subsections.map((item, itemIndex) => (
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
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 space-y-8"
          >
            <Card>
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Termination
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We reserve the right to suspend or terminate your account at
                  any time for any reason, including violation of these Terms.
                  You may also delete your account at any time.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Upon termination, your right to use Curio will immediately
                  cease. However, content you have posted may remain visible on
                  the platform.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Disclaimer of Warranties
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Curio is provided "as is" without any warranties, express or
                  implied. We do not guarantee that our platform will be
                  uninterrupted, secure, or error-free.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We are not responsible for the content posted by users. Each
                  user is solely responsible for their own content.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Limitation of Liability
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To the maximum extent permitted by law, Curio shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages, or any loss of profits or revenues,
                  whether incurred directly or indirectly, or any loss of data,
                  use, goodwill, or other intangible losses resulting from your
                  use of our platform.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Changes to Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. We
                  will notify users of any material changes by posting the
                  updated Terms on this page and updating the "Last updated"
                  date.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your continued use of Curio after any changes indicates your
                  acceptance of the new Terms.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Governing Law
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  These Terms shall be governed by and construed in accordance
                  with the laws of the jurisdiction in which Curio operates,
                  without regard to its conflict of law provisions.
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
                <AlertCircle className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  If you have any questions about these Terms of Service, please
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

export default Terms;
