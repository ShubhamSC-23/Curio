import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Target, Award, Heart, Zap } from "lucide-react";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Quality Content",
      description: "Curated articles from talented writers around the world",
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Connect with readers and writers who share your interests",
    },
    {
      icon: Target,
      title: "Easy Publishing",
      description: "Intuitive tools to write, edit, and publish your stories",
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Get discovered and build your audience with our platform",
    },
  ];

  const stats = [
    { value: "10K+", label: "Articles Published" },
    { value: "5K+", label: "Active Writers" },
    { value: "50K+", label: "Monthly Readers" },
    { value: "100+", label: "Topics Covered" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description:
        "We believe in fostering a supportive community where everyone can share their voice and grow together.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We continuously improve our platform with the latest technologies to provide the best writing and reading experience.",
    },
    {
      icon: Target,
      title: "Quality Over Quantity",
      description:
        "We prioritize meaningful, well-crafted content that educates, inspires, and entertains our readers.",
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
            <h1 className="text-5xl font-bold mb-6">About Curio</h1>
            <p className="text-xl text-primary-100 mb-8">
              A modern platform where ideas come to life through the power of
              words
            </p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-16">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
            Curio is dedicated to empowering writers and connecting them with
            engaged readers. We believe that everyone has a story to tell, and
            we're here to provide the platform and tools to share those stories
            with the world.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
            Whether you're an experienced author or just starting your writing
            journey, Curio offers a welcoming space to express yourself, engage
            with a community of like-minded individuals, and grow your audience.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardBody className="p-6 text-center">
                    <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                      <feature.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardBody className="p-8">
                    <div className="inline-flex p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg mb-4">
                      <value.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start sharing your stories and connect with thousands of readers
            around the world
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/register"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </a>
            <a
              href="/articles"
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition border border-primary-500"
            >
              Explore Articles
            </a>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default About;
