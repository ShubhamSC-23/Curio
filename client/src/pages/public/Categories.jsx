import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Folder,
  FileText,
  TrendingUp,
  Search,
  Grid,
  List,
  Sparkles,
} from "lucide-react";
import { categoriesAPI } from "../../api/categories";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Input from "../../components/common/Input";
import { PageLoader } from "../../components/common/Spinner";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Sort categories by article count
  const sortedCategories = [...filteredCategories].sort(
    (a, b) => (b.article_count || 0) - (a.article_count || 0),
  );

  // Get category color based on index
  const getCategoryColor = (index) => {
    const colors = [
      {
        bg: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        hover: "hover:border-blue-300 dark:hover:border-blue-700",
      },
      {
        bg: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
        hover: "hover:border-purple-300 dark:hover:border-purple-700",
      },
      {
        bg: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        hover: "hover:border-green-300 dark:hover:border-green-700",
      },
      {
        bg: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        hover: "hover:border-orange-300 dark:hover:border-orange-700",
      },
      {
        bg: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30",
        text: "text-pink-600 dark:text-pink-400",
        border: "border-pink-200 dark:border-pink-800",
        hover: "hover:border-pink-300 dark:hover:border-pink-700",
      },
      {
        bg: "from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200 dark:border-indigo-800",
        hover: "hover:border-indigo-300 dark:hover:border-indigo-700",
      },
    ];
    return colors[index % colors.length];
  };

  if (loading) return <PageLoader />;

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

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/30" />

        <Container className="relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white mb-6 border border-white/20 dark:border-white/10"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Explore Topics</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Browse by
              <span className="block text-primary-200 dark:text-primary-300 mt-2">
                Category
              </span>
            </h1>

            <p className="text-xl text-primary-100 dark:text-primary-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover articles organized by topics that interest you
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-md border-2 border-white/20 dark:border-white/10 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 dark:focus:border-white/20 transition-all"
                />
              </div>
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

      <Container className="py-12 -mt-8 md:-mt-16 relative z-10">
        {/* Stats & View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Folder className="h-5 w-5" />
              <span className="font-medium">
                {filteredCategories.length}{" "}
                {filteredCategories.length === 1 ? "Category" : "Categories"}
              </span>
              {searchQuery && (
                <span className="text-sm">
                  (filtered from {categories.length})
                </span>
              )}
            </div>
          </motion.div>

          {/* View Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </motion.div>
        </div>

        {/* Categories Grid/List */}
        {sortedCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
              <Search className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? `No categories match "${searchQuery}"`
                : "No categories available yet"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {sortedCategories.map((category, index) => {
              const colors = getCategoryColor(index);

              return (
                <motion.div
                  key={category.category_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/articles?category=${category.slug}`}
                    className="group block h-full"
                  >
                    <Card
                      hover
                      className={`h-full overflow-hidden bg-white dark:bg-gray-800 border-2 ${colors.border} ${colors.hover} transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl`}
                    >
                      <CardBody
                        className={
                          viewMode === "grid"
                            ? "p-6"
                            : "p-5 flex items-center gap-4"
                        }
                      >
                        {/* Icon */}
                        <div
                          className={`bg-gradient-to-br ${colors.bg} ${viewMode === "grid" ? "w-14 h-14 mb-4" : "w-12 h-12 flex-shrink-0"} rounded-xl flex items-center justify-center ring-4 ring-white/50 dark:ring-gray-800/50 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Folder className={`h-7 w-7 ${colors.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3
                            className={`${viewMode === "grid" ? "text-xl mb-3" : "text-lg mb-1"} font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors`}
                          >
                            {category.name}
                          </h3>

                          {category.description && (
                            <p
                              className={`text-sm text-gray-600 dark:text-gray-400 ${viewMode === "grid" ? "mb-4 line-clamp-2" : "mb-2 line-clamp-1"} leading-relaxed`}
                            >
                              {category.description}
                            </p>
                          )}

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                              <FileText className="h-4 w-4" />
                              <span className="font-semibold">
                                {category.article_count || 0}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {category.article_count === 1
                                  ? "article"
                                  : "articles"}
                              </span>
                            </div>

                            {/* Trending indicator for top categories */}
                            {index < 3 && category.article_count > 0 && (
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs font-medium">
                                  Popular
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Arrow indicator for list view */}
                        {viewMode === "list" && (
                          <div className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Total Stats */}
        {sortedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full border border-primary-200 dark:border-primary-800">
              <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  {categories.reduce(
                    (sum, cat) => sum + (cat.article_count || 0),
                    0,
                  )}
                </span>
                {" total articles across all categories"}
              </span>
            </div>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Categories;
