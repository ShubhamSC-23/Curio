import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Articles
          </h1>
          <p className="text-gray-600">Explore our collection of articles</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:col-span-3">
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Most Liked</option>
              </select>
            </div>

            {/* Advanced Search Link */}
            <div className="md:col-span-2">
              <Link to="/search">
                <Button variant="outline" fullWidth>
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {pagination && (
          <div className="mb-4 text-gray-600">
            Showing {articles.length} of {pagination.totalItems} articles
            {filters.search && ` for "${filters.search}"`}
            {filters.category &&
              ` in ${categories.find((c) => c.slug === filters.category)?.name}`}
          </div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No articles found</p>
            {(filters.search || filters.category) && (
              <Button
                variant="primary"
                className="mt-4"
                onClick={() =>
                  setFilters({ ...filters, search: "", category: "", page: 1 })
                }
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                                    className="w-full h-auto rounded-lg mb-8 shadow-lg"
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
                          <div className="flex items-center">
                            <span className="font-medium">
                              {article.username}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span>{article.reading_time} min</span>
                            <span>•</span>
                            <span>
                              {formatRelativeTime(article.published_at)}
                            </span>
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
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-2">
                    {/* Page Numbers */}
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
                            className={`px-4 py-2 rounded-lg ${
                              pagination.currentPage === pageNum
                                ? "bg-primary-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
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
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Articles;
