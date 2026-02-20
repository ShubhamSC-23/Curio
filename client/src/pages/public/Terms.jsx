import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Scale,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";

const Terms = () => {
  const lastUpdated = "February 20, 2026";

  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      color: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
      content:
        "By accessing and using Curio, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our platform. Your continued use of Curio constitutes your acceptance of these Terms and any future modifications.",
    },
    {
      icon: CheckCircle,
      title: "User Accounts",
      color:
        "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
      subsections: [
        {
          subtitle: "Account Creation",
          text: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        },
        {
          subtitle: "Account Eligibility",
          text: "You must be at least 13 years old to use Curio. By creating an account, you represent that you meet this age requirement and have the legal capacity to enter into this agreement.",
        },
        {
          subtitle: "Account Responsibility",
          text: "You are responsible for all activity that occurs under your account. Notify us immediately of any unauthorized use of your account or any other breach of security.",
        },
        {
          subtitle: "Account Security",
          text: "You must not share your account credentials with anyone. We recommend using a strong, unique password and enabling two-factor authentication if available.",
        },
      ],
    },
    {
      icon: FileText,
      title: "Content Guidelines",
      color:
        "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      subsections: [
        {
          subtitle: "Your Content",
          text: "You retain all rights to the content you post on Curio. By posting content, you grant Curio a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your content on our platform.",
        },
        {
          subtitle: "Prohibited Content",
          text: "You may not post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of privacy, hateful, or otherwise objectionable.",
        },
        {
          subtitle: "Copyright",
          text: "You must own or have the necessary rights to all content you post. Respect the intellectual property rights of others. We will respond to legitimate copyright infringement claims.",
        },
        {
          subtitle: "Content Moderation",
          text: "We reserve the right to remove or modify any content that violates these Terms or is otherwise objectionable, without prior notice.",
        },
      ],
    },
    {
      icon: XCircle,
      title: "Prohibited Activities",
      color: "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
      subsections: [
        {
          subtitle: "No Spam",
          text: "Do not post spam, engage in mass marketing, or otherwise use Curio for commercial purposes without our explicit permission.",
        },
        {
          subtitle: "No Impersonation",
          text: "Do not impersonate others or misrepresent your affiliation with any person or organization. Be authentic and honest in your interactions.",
        },
        {
          subtitle: "No Abuse",
          text: "Do not harass, threaten, or harm other users. Respect the community and maintain a positive, constructive environment for all users.",
        },
        {
          subtitle: "No Hacking",
          text: "Do not attempt to gain unauthorized access to our systems, interfere with our services, or engage in any malicious activities including distributing malware or viruses.",
        },
        {
          subtitle: "No Manipulation",
          text: "Do not artificially inflate views, likes, or other engagement metrics. Do not create multiple accounts to circumvent restrictions or bans.",
        },
      ],
    },
  ];

  const additionalSections = [
    {
      icon: Shield,
      title: "Termination",
      color:
        "from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
      content: [
        {
          text: "We reserve the right to suspend or terminate your account at any time for any reason, including violation of these Terms. You may also delete your account at any time through your account settings.",
        },
        {
          text: "Upon termination, your right to use Curio will immediately cease. However, content you have posted may remain visible on the platform unless you specifically request its removal.",
        },
        {
          text: "Termination of your account does not relieve you of any obligations incurred prior to termination, including any payment obligations if applicable.",
        },
      ],
    },
    {
      icon: AlertCircle,
      title: "Disclaimer of Warranties",
      color:
        "from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700",
      content: [
        {
          text: "Curio is provided 'as is' without any warranties, express or implied. We do not guarantee that our platform will be uninterrupted, secure, or error-free.",
        },
        {
          text: "We are not responsible for the content posted by users. Each user is solely responsible for their own content and the consequences of posting it.",
        },
        {
          text: "We make no warranties about the accuracy, reliability, completeness, or timeliness of the content, software, text, graphics, or communications provided on or through Curio.",
        },
      ],
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      color:
        "from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700",
      content: [
        {
          text: "To the maximum extent permitted by law, Curio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.",
        },
        {
          text: "We are not liable for any loss of data, use, goodwill, or other intangible losses resulting from your use of our platform, unauthorized access to your account, or any errors or omissions in content.",
        },
        {
          text: "In no event shall our total liability to you for all damages, losses, and causes of action exceed the amount you have paid to us in the last six months, or $100, whichever is greater.",
        },
      ],
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
              <Scale className="w-4 h-4" />
              <span className="text-sm font-medium">Legal Agreement</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 dark:text-primary-200 mb-4 leading-relaxed">
              Please read these terms carefully before using Curio
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
                      Welcome to Curio's Terms of Service
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      These Terms of Service ("Terms") govern your access to and
                      use of our platform, including any content, functionality,
                      and services offered on or through Curio. By using our
                      platform, you agree to comply with and be bound by these
                      Terms.
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

                    {section.content && (
                      <div className="pl-16">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    )}

                    {section.subsections && (
                      <div className="space-y-6">
                        {section.subsections.map((item, itemIndex) => (
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
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Sections */}
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
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                          {section.title}
                        </h2>
                        <div className="space-y-4">
                          {section.content.map((item, itemIndex) => (
                            <p
                              key={itemIndex}
                              className="text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-2"
                            >
                              <span className="text-primary-600 dark:text-primary-400 mt-1.5">
                                •
                              </span>
                              <span className="flex-1">{item.text}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="h-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
                <CardBody className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Changes to Terms
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    We reserve the right to modify these Terms at any time. We
                    will notify users of any material changes by posting the
                    updated Terms on this page.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your continued use of Curio after any changes indicates your
                    acceptance of the new Terms.
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Card className="h-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
                <CardBody className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Governing Law
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    These Terms shall be governed by and construed in accordance
                    with applicable laws, without regard to conflict of law
                    provisions.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Any disputes arising from these Terms will be resolved
                    through binding arbitration.
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
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
              <AlertCircle className="h-12 w-12 mx-auto mb-6 opacity-80" />
              <h3 className="text-3xl font-bold mb-4">
                Questions About These Terms?
              </h3>
              <p className="text-xl text-primary-100 dark:text-primary-200 mb-8 max-w-2xl mx-auto">
                If you have any questions about these Terms of Service, please
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

export default Terms;
