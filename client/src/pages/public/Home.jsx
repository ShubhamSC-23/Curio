import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, BookOpen, Users } from 'lucide-react';
import { articlesAPI } from '../../api/articles';
import Container from '../../components/layout/Container';
import Button from '../../components/common/Button';
import Card, { CardBody } from '../../components/common/Card';
import { PageLoader } from '../../components/common/Spinner';
import { formatRelativeTime } from '../../utils/formatDate';

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
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <Container className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-bold mb-6">
              Discover Amazing Articles
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Read, write, and share stories that matter. Join our community of readers and writers.
            </p>
            <div className="flex space-x-4">
              <Link to="/articles">
                <Button variant="secondary" size="lg">
                  Explore Articles <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  Start Writing
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card hover>
              <CardBody className="text-center">
                <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">1000+</h3>
                <p className="text-gray-600">Articles Published</p>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hover>
              <CardBody className="text-center">
                <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">500+</h3>
                <p className="text-gray-600">Active Writers</p>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card hover>
              <CardBody className="text-center">
                <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">10k+</h3>
                <p className="text-gray-600">Monthly Readers</p>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </Container>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="bg-gray-50 py-16">
          <Container>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/articles/${article.slug}`}>
                    <Card hover shadow="medium">
                      {article.featured_image && (
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardBody>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{article.username}</span>
                          <span>{formatRelativeTime(article.published_at)}</span>
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

      {/* Recent Articles */}
      <Container className="py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Articles</h2>
          <Link to="/articles">
            <Button variant="ghost">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article, index) => (
            <motion.div
              key={article.article_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/articles/${article.slug}`}>
                <Card hover>
                  <CardBody>
                    {article.category_name && (
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded mb-2">
                        {article.category_name}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.username}</span>
                      <span>{article.reading_time} min read</span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Writing?</h2>
            <p className="text-primary-100 mb-8">
              Join thousands of writers sharing their stories and insights with the world.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
