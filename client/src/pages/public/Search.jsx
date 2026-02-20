import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  Filter,
  X,
  SlidersHorizontal,
  Clock,
  Eye,
  Heart,
  Sparkles,
  TrendingUp,
  Grid,
  List,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { articlesAPI } from "../../api/articles";
import { categoriesAPI } from "../../api/categories";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "latest",
  });

  const [inputValue, setInputValue] = useState(filters.search);

  useEffect(() => {
    fetchCategories();
    // Auto-fetch if there's a query in URL on mount
    if (filters.search || filters.category) {
      fetchResults(filters);
      setHasSearched(true);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchResults = async (activeFilters = filters) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const params = { limit: 20 };

      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.category) params.category = activeFilters.category;

      if (activeFilters.sortBy === "popular") {
        params.sortBy = "view_count";
        params.order = "desc";
      } else if (activeFilters.sortBy === "trending") {
        params.sortBy = "like_count";
        params.order = "desc";
      }

      const data = await articlesAPI.getArticles(params);
      setArticles(data.data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, search: inputValue };
    setFilters(newFilters);
    updateURL(newFilters);
    fetchResults(newFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
    if (hasSearched || newFilters.search || newFilters.category) {
      fetchResults(newFilters);
    }
  };

  const updateURL = (activeFilters = filters) => {
    const params = {};
    if (activeFilters.search) params.q = activeFilters.search;
    if (activeFilters.category) params.category = activeFilters.category;
    if (activeFilters.sortBy !== "latest") params.sortBy = activeFilters.sortBy;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", sortBy: "latest" });
    setInputValue("");
    setSearchParams({});
    setArticles([]);
    setHasSearched(false);
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters, [key]: key === "sortBy" ? "latest" : "" };
    setFilters(newFilters);
    if (key === "search") setInputValue("");
    updateURL(newFilters);
    if (newFilters.search || newFilters.category) {
      fetchResults(newFilters);
    } else {
      setArticles([]);
      setHasSearched(false);
    }
  };

  const hasActiveFilters = filters.search || filters.category || filters.sortBy !== "latest";

  const sortOptions = [
    { value: "latest", label: "Latest", icon: Clock },
    { value: "popular", label: "Most Viewed", icon: Eye },
    { value: "trending", label: "Most Liked", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-800 dark:via-primary-900 dark:to-secondary-900">
        {/* Background dot pattern */}
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

        {/* Bottom gradient overlay */}
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
              <span className="text-sm font-medium">Advanced Search</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover
              <span className="block text-primary-200 dark:text-primary-300 mt-2">
                Knowledge
              </span>
            </h1>

            <p className="text-xl text-primary-100 dark:text-primary-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Search across our entire collection of Indian heritage articles
            </p>

            {/* Inline search form in hero */}
            <motion.form
              onSubmit={handleSearchSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 max-w-2xl mx-auto"
            >
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles by title, content, or author..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-2 border-transparent focus:border-primary-400 dark:focus:border-primary-500 focus:outline-none shadow-xl text-base transition-all"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="px-6 py-4 rounded-xl shadow-xl bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm font-semibold transition-all"
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
            </motion.form>
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
        {/* ── Filter & Controls Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-2xl">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sort By */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    {sortOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => handleFilterChange("sortBy", value)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm font-medium transition-all border ${
                          filters.sortBy === value
                            ? "bg-primary-600 dark:bg-primary-700 text-white border-primary-600 dark:border-primary-700 shadow-md"
                            : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode + Clear */}
                <div className="flex items-end gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      View
                    </label>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid"
                            ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list"
                            ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      title="Clear all filters"
                      className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* ── Active Filter Chips ── */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active filters:
              </span>

              {filters.search && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800"
                >
                  <SearchIcon className="h-3.5 w-3.5" />
                  <span>"{filters.search}"</span>
                  <button
                    onClick={() => removeFilter("search")}
                    className="hover:text-primary-900 dark:hover:text-primary-300 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.span>
              )}

              {filters.category && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 rounded-full text-sm font-medium border border-secondary-200 dark:border-secondary-800"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>{categories.find((c) => c.slug === filters.category)?.name}</span>
                  <button
                    onClick={() => removeFilter("category")}
                    className="hover:text-secondary-900 dark:hover:text-secondary-300 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.span>
              )}

              {filters.sortBy !== "latest" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{sortOptions.find((s) => s.value === filters.sortBy)?.label}</span>
                  <button
                    onClick={() => removeFilter("sortBy")}
                    className="hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.span>
              )}

              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results Count ── */}
        {!loading && hasSearched && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                {articles.length}
              </span>{" "}
              article{articles.length !== 1 ? "s" : ""}
            </p>
          </motion.div>
        )}

        {/* ── Results Area ── */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">
              Searching...
            </p>
          </div>
        ) : !hasSearched ? (
          /* ── Empty State: Not yet searched ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full mb-6 ring-8 ring-primary-50 dark:ring-primary-900/10">
              <SearchIcon className="h-12 w-12 text-primary-400 dark:text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Start Exploring
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
              Type a keyword above and press Search, or pick a category and sort to discover articles
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Architecture", "Festivals", "Art", "History"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setInputValue(tag);
                    const newFilters = { ...filters, search: tag };
                    setFilters(newFilters);
                    updateURL(newFilters);
                    fetchResults(newFilters);
                  }}
                  className="px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-100 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        ) : articles.length === 0 ? (
          /* ── Empty State: No results ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
              <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Articles Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search terms, changing the category, or clearing filters
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          /* ── Results Grid / List ── */
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {articles.map((article, index) => (
              <motion.div
                key={article.article_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
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
                    {/* Image */}
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
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Category badge on image (grid only) */}
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
                      {/* Category badge for list view or articles without images */}
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

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {article.username}
                        </span>

                        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 ml-auto">
                          {article.reading_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{article.reading_time} min</span>
                            </div>
                          )}

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

                          <span>{formatRelativeTime(article.published_at)}</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Search;
