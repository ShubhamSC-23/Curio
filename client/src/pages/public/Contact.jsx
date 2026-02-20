import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import api from "../../api/axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@curio.com",
      link: "mailto:support@curio.com",
      color: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Writing Street, Blog City, BC 12345",
      link: null,
      color:
        "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      color:
        "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 9AM - 6PM",
      link: null,
      color:
        "from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
    },
  ];

  const faqs = [
    {
      question: "How do I start writing on Curio?",
      answer:
        "Simply create an account, and you'll have access to our powerful editor to start writing and publishing your articles immediately.",
    },
    {
      question: "Is Curio free to use?",
      answer:
        "Yes! Curio is free for all writers and readers. We believe in making quality content accessible to everyone.",
    },
    {
      question: "How can I report inappropriate content?",
      answer:
        "Each article and comment has a report button. Click it to submit a report, and our team will review it promptly.",
    },
    {
      question: "Can I customize my author profile?",
      answer:
        "Absolutely! You can upload a profile picture, write a bio, and customize your profile to showcase your work.",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/contact", formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">We're Here to Help</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 dark:text-primary-200 leading-relaxed">
              Have a question or feedback? We'd love to hear from you!
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl h-full">
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Fill out the form and our team will get back to you within 24
                  hours.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-4 group"
                    >
                      <div
                        className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            {info.content}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="mt-12 pt-8 border-t-2 border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {[
                      {
                        name: "Twitter",
                        path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                      },
                      {
                        name: "GitHub",
                        path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
                      },
                      {
                        name: "LinkedIn",
                        path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
                      },
                    ].map((social, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all hover:scale-110"
                      >
                        <svg
                          className="h-5 w-5 text-gray-700 dark:text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d={social.path} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl">
              <CardBody className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Send us a Message
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Quick answers to common questions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="h-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                  <CardBody className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-9">
                      {faq.answer}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Contact;
