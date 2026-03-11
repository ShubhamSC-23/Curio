import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Plus, TrendingUp, CheckCircle } from "lucide-react";
import axios from "axios";
import Card, { CardBody } from "../common/Card";
import Button from "../common/Button";

const TranslationStatsWidget = ({ horizontal = false }) => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    fullyTranslated: 0,
    partiallyTranslated: 0,
    untranslated: 0,
  });
  const [loading, setLoading] = useState(true);

  const LANGUAGES = ["hi", "mr"]; // Hindi, Marathi

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
      const token = localStorage.getItem("token");

      // Fetch user's articles using axios directly
      const response = await axios.get(`${API_URL}/author/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const articles = response.data.data || [];

      // Fetch translation status for each article
      const articlesWithTranslations = await Promise.all(
        articles.map(async (article) => {
          try {
            const translationsResponse = await axios.get(
              `${API_URL}/article-translations/${article.article_id}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            const translations = translationsResponse.data.data || [];
            return {
              ...article,
              translationCount: translations.length,
            };
          } catch {
            return { ...article, translationCount: 0 };
          }
        }),
      );

      // Calculate stats
      const totalArticles = articlesWithTranslations.length;
      const fullyTranslated = articlesWithTranslations.filter(
        (a) => a.translationCount === LANGUAGES.length,
      ).length;
      const partiallyTranslated = articlesWithTranslations.filter(
        (a) => a.translationCount > 0 && a.translationCount < LANGUAGES.length,
      ).length;
      const untranslated = articlesWithTranslations.filter(
        (a) => a.translationCount === 0,
      ).length;

      setStats({
        totalArticles,
        fullyTranslated,
        partiallyTranslated,
        untranslated,
      });
    } catch (error) {
      console.error("Error fetching translation stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage =
    stats.totalArticles > 0
      ? ((stats.fullyTranslated / stats.totalArticles) * 100).toFixed(0)
      : 0;

  if (horizontal) {
    // Horizontal Layout
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardBody className="p-6">
          <div className="flex items-center gap-8">
            {/* Header */}
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <Globe className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  Translations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hindi & Marathi
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-4 flex-1">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                {/* Progress Circle */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                        className="text-primary-600 dark:text-primary-400 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {completionPercentage}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.fullyTranslated}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Complete
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mb-2">
                        <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.partiallyTranslated}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Partial
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                        <Globe className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.untranslated}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Pending
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ml-auto">
                  {stats.untranslated > 0 && (
                    <Link to="/dashboard/translations">
                      <Button variant="primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Translations
                      </Button>
                    </Link>
                  )}

                  {stats.untranslated === 0 && stats.totalArticles > 0 && (
                    <div className="text-center px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-900 dark:text-green-300">
                        🎉 All articles translated!
                      </p>
                    </div>
                  )}

                  {stats.totalArticles === 0 && (
                    <Link to="/dashboard/translations">
                      <Button variant="outline">View Translations</Button>
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Vertical Layout (original)
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardBody className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Globe className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Translations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hindi & Marathi
              </p>
            </div>
          </div>

          <Link to="/dashboard/translations">
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Progress Circle */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`}
                    className="text-primary-600 dark:text-primary-400 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {completionPercentage}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Complete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.fullyTranslated}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Complete
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mx-auto mb-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.partiallyTranslated}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Partial
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-2">
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.untranslated}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pending
                </p>
              </div>
            </div>

            {/* Action Button */}
            {stats.untranslated > 0 && (
              <Link to="/dashboard/translations">
                <Button variant="primary" fullWidth>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Translations
                </Button>
              </Link>
            )}

            {stats.untranslated === 0 && stats.totalArticles > 0 && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                  🎉 All articles are fully translated!
                </p>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default TranslationStatsWidget;
