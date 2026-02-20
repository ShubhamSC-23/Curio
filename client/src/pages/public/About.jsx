import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Target,
  Award,
  Heart,
  Zap,
  Sparkles,
  TrendingUp,
  Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Quality Content",
      description: "Curated articles from talented writers around the world",
      color: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Connect with readers and writers who share your interests",
      color:
        "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
    },
    {
      icon: Target,
      title: "Easy Publishing",
      description: "Intuitive tools to write, edit, and publish your stories",
      color:
        "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Get discovered and build your audience with our platform",
      color:
        "from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
    },
  ];

  const stats = [
    { value: "10K+", label: "Articles Published", icon: BookOpen },
    { value: "5K+", label: "Active Writers", icon: Users },
    { value: "50K+", label: "Monthly Readers", icon: TrendingUp },
    { value: "100+", label: "Topics Covered", icon: Target },
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description:
        "We believe in fostering a supportive community where everyone can share their voice and grow together.",
      color: "from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We continuously improve our platform with the latest technologies to provide the best writing and reading experience.",
      color:
        "from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600",
    },
    {
      icon: Target,
      title: "Quality Over Quantity",
      description:
        "We prioritize meaningful, well-crafted content that educates, inspires, and entertains our readers.",
      color:
        "from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600",
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
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Our Story</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              About Curio
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 dark:text-primary-200 mb-6 leading-relaxed">
              A modern platform where ideas come to life through the power of
              words
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
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-2xl">
            <CardBody className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Curio is dedicated to empowering writers and connecting them
                with engaged readers. We believe that everyone has a story to
                tell, and we're here to provide the platform and tools to share
                those stories with the world.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Whether you're an experienced author or just starting your
                writing journey, Curio offers a welcoming space to express
                yourself, engage with a community of like-minded individuals,
                and grow your audience.
              </p>
            </CardBody>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                  <CardBody className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl mb-4">
                      <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
            What Makes Us Different
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Discover the features that make Curio the perfect platform for
            writers and readers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <Card
                  hover
                  className="h-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                >
                  <CardBody className="p-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Our Values
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            The principles that guide everything we do at Curio
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="h-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all group">
                  <CardBody className="p-8">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <value.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
          transition={{ delay: 0.7 }}
          className="relative overflow-hidden rounded-3xl"
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

          <div className="relative p-12 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Community Today
            </h2>
            <p className="text-xl text-primary-100 dark:text-primary-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start sharing your stories and connect with thousands of readers
              around the world
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-xl hover:shadow-2xl"
              >
                <Rocket className="h-5 w-5" />
                Get Started
              </Link>
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 dark:hover:bg-white/10 transition-all border-2 border-white/20 dark:border-white/10"
              >
                <BookOpen className="h-5 w-5" />
                Explore Articles
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default About;
