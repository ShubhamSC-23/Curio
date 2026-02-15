import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import { articlesAPI } from "../../api/articles";
import { categoriesAPI } from "../../api/categories";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Spinner from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatDate";
import { getImageUrl } from "../../utils/imageUtils";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "latest",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (filters.search || filters.category) {
      fetchResults();
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);

      const params = {
        limit: 20,
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;

      // Sorting
      if (filters.sortBy === "popular") {
        params.sortBy = "view_count";
        params.order = "desc";
      } else if (filters.sortBy === "trending") {
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
    updateURL();
    fetchResults();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const updateURL = () => {
    const params = {};
    if (filters.search) params.q = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.sortBy !== "latest") params.sortBy = filters.sortBy;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", sortBy: "latest" });
    setSearchParams({});
    setArticles([]);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Search Articles
          </h1>
          <p className="text-gray-600">
            Find articles on topics you're interested in
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search articles by title, content, or author..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" variant="primary" size="lg">
              <SearchIcon className="h-5 w-5 mr-2" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg p-6 mb-6 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Most Liked</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button variant="outline" fullWidth onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Filters */}
        {(filters.search || filters.category) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="ml-2 hover:text-primary-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                Category:{" "}
                {categories.find((c) => c.slug === filters.category)?.name}
                <button
                  onClick={() => handleFilterChange("category", "")}
                  className="ml-2 hover:text-primary-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filters.search || filters.category
                ? "No articles found"
                : "Start searching"}
            </h3>
            <p className="text-gray-600">
              {filters.search || filters.category
                ? "Try different keywords or filters"
                : "Enter a search term or select filters to find articles"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Found {articles.length} article{articles.length !== 1 ? "s" : ""}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/articles/${article.slug}`}>
                    <Card hover shadow="medium" className="h-full">
                      {article.featured_image && (
                        <img
                          src={getImageUrl(article.featured_image)}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      )}
                      <CardBody>
                        {article.category_name && (
                          <span className="inline-block px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded mb-2">
                            {article.category_name}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                          <span className="font-medium">
                            {article.username}
                          </span>
                          <span>
                            {formatRelativeTime(article.published_at)}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Search;
