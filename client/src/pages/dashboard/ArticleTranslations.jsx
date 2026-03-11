import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Languages,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import { PageLoader } from "../../components/common/Spinner";
import { toast } from "react-hot-toast";

const ArticleTranslations = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, translated, untranslated

  const LANGUAGES = [
    { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिंदी" },
    { code: "mr", name: "Marathi", flag: "🇮🇳", nativeName: "मराठी" },
  ];

  useEffect(() => {
    fetchArticlesWithTranslations();
  }, []);

  const fetchArticlesWithTranslations = async () => {
    try {
      setLoading(true);
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
      const token = localStorage.getItem("token");

      // Fetch user's articles using the same pattern as AuthorDashboard
      const response = await axios.get(`${API_URL}/author/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userArticles = response.data.data || [];

      // Fetch translation status for each article
      const articlesWithTranslations = await Promise.all(
        userArticles.map(async (article) => {
          try {
            const translationsResponse = await axios.get(
              `${API_URL}/article-translations/${article.article_id}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            const translations = translationsResponse.data.data || [];

            // Map translations by language code
            const translationMap = {};
            translations.forEach((t) => {
              translationMap[t.language_code] = t;
            });

            return {
              ...article,
              translations: translationMap,
            };
          } catch (error) {
            return {
              ...article,
              translations: {},
            };
          }
        }),
      );

      setArticles(articlesWithTranslations);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTranslation = async (articleId, languageCode) => {
    if (!window.confirm("Are you sure you want to delete this translation?")) return;

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/article-translations/${articleId}/${languageCode}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Translation deleted successfully");
      fetchArticlesWithTranslations();
    } catch (error) {
      console.error("Error deleting translation:", error);
      toast.error("Failed to delete translation");
    }
  };

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    // Search filter
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Status filter
    const translationCount = Object.keys(article.translations || {}).length;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "translated" && translationCount > 0) ||
      (filterStatus === "untranslated" && translationCount === 0);

    return matchesSearch && matchesStatus;
  });

  const getTranslationProgress = (article) => {
    const total = LANGUAGES.length;
    const completed = Object.keys(article.translations || {}).length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Languages className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Article Translations
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage translations for your articles in Hindi and Marathi
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Articles
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {articles.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Fully Translated
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {
                      articles.filter(
                        (a) =>
                          Object.keys(a.translations || {}).length ===
                          LANGUAGES.length,
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Needs Translation
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {
                      articles.filter(
                        (a) =>
                          Object.keys(a.translations || {}).length <
                          LANGUAGES.length,
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white dark:bg-gray-800 mb-6">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === "all"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("translated")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === "translated"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Translated
                </button>
                <button
                  onClick={() => setFilterStatus("untranslated")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === "untranslated"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Untranslated
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first article to start adding translations"}
              </p>
              <Link to="/dashboard/articles/create">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Article
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredArticles.map((article, index) => {
                const progress = getTranslationProgress(article);

                return (
                  <motion.div
                    key={article.article_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                      <CardBody className="p-6">
                        {/* Article Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {article.status}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  article.created_at,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Edit Article Link */}
                          <Link
                            to={`/dashboard/articles/edit/${article.slug}`}
                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                              Translation Progress
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {progress.completed} / {progress.total} languages
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Language Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {LANGUAGES.map((language) => {
                            const translation =
                              article.translations?.[language.code];
                            const exists = !!translation;

                            return (
                              <div
                                key={language.code}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  exists
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                    : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">
                                      {language.flag}
                                    </span>
                                    <div>
                                      <p className="font-semibold text-gray-900 dark:text-white">
                                        {language.name}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {language.nativeName}
                                      </p>
                                    </div>
                                  </div>

                                  {exists ? (
                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>

                                {exists ? (
                                  <div className="flex gap-2">
                                    <Link
                                      to={`/dashboard/translations/edit/${article.article_id}/${language.code}`}
                                      className="flex-1"
                                    >
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        fullWidth
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </Button>
                                    </Link>
                                    <Link
                                      to={`/articles/${translation.slug}`}
                                      target="_blank"
                                      className="flex-1"
                                    >
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        fullWidth
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                      </Button>
                                    </Link>
                                    <button
                                      onClick={() =>
                                        handleDeleteTranslation(
                                          article.article_id,
                                          language.code,
                                        )
                                      }
                                      className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <Link
                                    to={`/dashboard/translations/new/${article.article_id}/${language.code}`}
                                  >
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      fullWidth
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Translation
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ArticleTranslations;
