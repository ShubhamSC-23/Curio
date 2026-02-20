import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Grid,
  List,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { articlesAPI } from "../../api/articles";
import { categoriesAPI } from "../../api/categories";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Spinner from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "latest",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;

      // Handle sorting
      if (filters.sortBy === "popular") {
        params.sortBy = "view_count";
        params.order = "desc";
      } else if (filters.sortBy === "trending") {
        params.sortBy = "like_count";
        params.order = "desc";
      }

      const data = await articlesAPI.getArticles(params);
      setArticles(data.data || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleCategoryChange = (categorySlug) => {
    setFilters({ ...filters, category: categorySlug, page: 1 });
  };

  const handleSortChange = (sortBy) => {
    setFilters({ ...filters, sortBy, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({ ...filters, search: "", category: "", page: 1 });
  };

  const removeFilter = (key) => {
    setFilters({ ...filters, [key]: "", page: 1 });
  };

  const hasActiveFilters = filters.search || filters.category;

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
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white mb-6 border border-white/20 dark:border-white/10"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Discover Stories</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Explore
              <span className="block text-primary-200 dark:text-primary-300 mt-2">
                Articles
              </span>
            </h1>

            <p className="text-xl text-primary-100 dark:text-primary-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              {pagination
                ? `Discover ${pagination.totalItems} articles from talented writers`
                : "Discover amazing articles from talented writers"}
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

      <Container className="py-8 -mt-16 md:-mt-20 relative z-10">
        {/* Search and Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-2xl">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search */}
                <div className="md:col-span-5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={filters.search}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="md:col-span-3">
                  <select
                    value={filters.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="md:col-span-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Popular</option>
                    <option value="trending">Most Liked</option>
                  </select>
                </div>

                {/* Advanced Search Link */}
                <div className="md:col-span-2">
                  <Link to="/search">
                    <Button
                      variant="outline"
                      fullWidth
                      className="h-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Advanced
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Active Filters & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilters && (
              <>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active filters:
                </span>
                <AnimatePresence>
                  {filters.search && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800"
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span>"{filters.search}"</span>
                      <button
                        onClick={() => removeFilter("search")}
                        className="hover:text-primary-900 dark:hover:text-primary-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  )}
                  {filters.category && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 rounded-full text-sm font-medium border border-secondary-200 dark:border-secondary-800"
                    >
                      <Filter className="h-3.5 w-3.5" />
                      <span>
                        {
                          categories.find((c) => c.slug === filters.category)
                            ?.name
                        }
                      </span>
                      <button
                        onClick={() => removeFilter("category")}
                        className="hover:text-secondary-900 dark:hover:text-secondary-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
                >
                  Clear all
                </button>
              </>
            )}
          </div>

          {/* View Toggle & Stats */}
          <div className="flex items-center gap-4">
            {/* Stats */}
            {pagination && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {articles.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {pagination.totalItems}
                </span>{" "}
                articles
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Articles Grid/List */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading articles...
            </p>
          </div>
        ) : articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
              <Search className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms"
                : "No articles available yet"}
            </p>
            {hasActiveFilters && (
              <Button variant="primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </motion.div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                  : "space-y-6 mb-12"
              }
            >
              {articles.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/articles/${article.slug}`}
                    className="group block h-full"
                  >
                    <Card
                      hover
                      className={`h-full overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 ${
                        viewMode === "list" ? "flex flex-row" : ""
                      }`}
                    >
                      {article.featured_image && (
                        <div
                          className={`relative overflow-hidden bg-gray-100 dark:bg-gray-700 ${
                            viewMode === "grid"
                              ? "h-56"
                              : "w-64 h-full flex-shrink-0"
                          }`}
                        >
                          <img
                            src={getImageUrl(article.featured_image)}
                            alt={article.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Category badge on image */}
                          {article.category_name && viewMode === "grid" && (
                            <div className="absolute top-3 left-3">
                              <span className="inline-block px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold border border-primary-200 dark:border-primary-800">
                                {article.category_name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <CardBody className="p-6 flex-1">
                        {/* Category badge for list view or no image */}
                        {article.category_name &&
                          (viewMode === "list" || !article.featured_image) && (
                            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-semibold mb-3 border border-primary-200 dark:border-primary-800">
                              {article.category_name}
                            </span>
                          )}

                        <h3
                          className={`font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 ${
                            viewMode === "grid" ? "text-xl" : "text-2xl"
                          }`}
                        >
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p
                            className={`text-gray-600 dark:text-gray-400 mb-4 leading-relaxed ${
                              viewMode === "grid"
                                ? "text-sm line-clamp-3"
                                : "text-base line-clamp-2"
                            }`}
                          >
                            {article.excerpt}
                          </p>
                        )}

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                            <span className="font-medium">
                              {article.username}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{article.reading_time} min</span>
                            </div>

                            {article.view_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5" />
                                <span>{article.view_count}</span>
                              </div>
                            )}

                            {article.likes_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5" />
                                <span>{article.likes_count}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 text-right text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(article.published_at)}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              pagination.currentPage === pageNum
                                ? "bg-primary-600 dark:bg-primary-700 text-white shadow-lg"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <Button
                    variant="outline"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Page{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pagination.currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pagination.totalPages}
                  </span>
                </p>
              </motion.div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Articles;
