import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react";
import { articlesAPI } from "../../api/articles";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import Card, { CardBody } from "../../components/common/Card";
import { PageLoader } from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatDate";

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const [featured, recent] = await Promise.all([
        articlesAPI.getArticles({ featured: true, limit: 3 }),
        articlesAPI.getArticles({ limit: 6 }),
      ]);

      setFeaturedArticles(featured.data || []);
      setRecentArticles(recent.data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section - Enhanced with Perfect Dark Mode */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900">
        {/* Animated background pattern */}
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

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/30" />

        <Container className="relative py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Welcome Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white mb-6 border border-white/20 dark:border-white/10"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Welcome to Curio</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Discover Amazing
              <span className="block text-primary-200 dark:text-primary-300 mt-2">
                Articles
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-100 dark:text-primary-200 mb-10 max-w-2xl leading-relaxed">
              Read, write, and share stories that matter. Join our community of
              passionate readers and writers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/articles">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-shadow"
                >
                  Explore Articles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-white/30 dark:border-white/20 text-white hover:bg-white/10 dark:hover:bg-white/5 backdrop-blur-sm"
                >
                  Start Writing
                </Button>
              </Link>
            </div>
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

      {/* Stats Section - Enhanced with Glass Effect */}
      <Container className="py-20 -mt-16 md:-mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              hover
              className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-primary-500/10 transition-all duration-300"
            >
              <CardBody className="text-center p-8">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-4 ring-primary-50 dark:ring-primary-900/20">
                  <TrendingUp className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  1000+
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Articles Published
                </p>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              hover
              className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-secondary-500/10 transition-all duration-300"
            >
              <CardBody className="text-center p-8">
                <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-4 ring-secondary-50 dark:ring-secondary-900/20">
                  <Users className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  500+
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Active Writers
                </p>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              hover
              className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-purple-500/10 transition-all duration-300"
            >
              <CardBody className="text-center p-8">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-50 dark:ring-purple-900/20">
                  <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  10k+
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Monthly Readers
                </p>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </Container>

      {/* Featured Articles - Enhanced Dark Mode */}
      {featuredArticles.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 py-20 transition-colors duration-300">
          <Container>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Featured Articles
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Hand-picked stories from our community
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/articles/${article.slug}`}
                    className="group block h-full"
                  >
                    <Card
                      hover
                      className="h-full overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300"
                    >
                      {article.featured_image && (
                        <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-gray-700">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      <CardBody className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {article.username}
                          </span>
                          <span className="text-gray-500 dark:text-gray-500">
                            {formatRelativeTime(article.published_at)}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* Recent Articles - Enhanced Dark Mode */}
      <Container className="py-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Recent Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Latest stories from our writers
            </p>
          </div>
          <Link to="/articles" className="hidden sm:block">
            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentArticles.map((article, index) => (
            <motion.div
              key={article.article_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/articles/${article.slug}`}
                className="group block h-full"
              >
                <Card
                  hover
                  className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300"
                >
                  <CardBody className="p-6">
                    {article.category_name && (
                      <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-full mb-3 border border-primary-200 dark:border-primary-800">
                        {article.category_name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {article.username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-500">
                        {article.reading_time} min read
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/articles">
            <Button
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>

      {/* CTA Section - Enhanced with Gradient & Dark Mode */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900 text-white py-20">
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

        {/* Animated gradient orbs for depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400 dark:bg-primary-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 dark:opacity-20 animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-400 dark:bg-secondary-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 dark:opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Writing?
            </h2>
            <p className="text-xl text-primary-100 dark:text-primary-200 mb-10 leading-relaxed">
              Join thousands of writers sharing their stories and insights with
              the world. It's free, forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-shadow"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/articles">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-white/30 dark:border-white/20 text-white hover:bg-white/10 dark:hover:bg-white/5 backdrop-blur-sm"
                >
                  Browse Articles
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
