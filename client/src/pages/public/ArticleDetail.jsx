import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Heart,
  Bookmark,
  Eye,
  Share2,
  BookmarkPlus,
  Flag,
  MessageCircle,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { articlesAPI } from "../../api/articles";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import Card, { CardBody } from "../../components/common/Card";
import { PageLoader } from "../../components/common/Spinner";
import CommentList from "../../components/comment/CommentList";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";
import api from "../../api/axios";

const ArticleDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [inReadingList, setInReadingList] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await articlesAPI.getArticle(slug);
      setArticle(data.data);
      setLikeCount(data.data.like_count || 0);

      if (isAuthenticated) {
        checkUserInteractions(data.data.article_id);
      }

      if (data.data.category_slug) {
        const related = await articlesAPI.getArticles({
          category: data.data.category_slug,
          limit: 3,
        });
        setRelatedArticles(
          related.data.filter((a) => a.slug !== slug).slice(0, 3),
        );
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserInteractions = async (articleId) => {
    try {
      const likeRes = await api
        .get(`/articles/${articleId}/like-status`)
        .catch(() => ({ data: { data: { isLiked: false } } }));
      setLiked(likeRes.data.data?.isLiked || false);

      const bookmarkRes = await api
        .get(`/bookmarks/check/${articleId}`)
        .catch(() => ({ data: { data: { isBookmarked: false } } }));
      setBookmarked(bookmarkRes.data.data?.isBookmarked || false);

      const readingListRes = await api
        .get(`/reading-list/check/${articleId}`)
        .catch(() => ({ data: { data: { inReadingList: false } } }));
      setInReadingList(readingListRes.data.data?.inReadingList || false);
    } catch (error) {
      console.error("Error checking user interactions:", error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like articles");
      return;
    }

    try {
      await articlesAPI.likeArticle(article.article_id);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      toast.success(liked ? "Article unliked" : "Article liked!");
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark articles");
      return;
    }

    try {
      await articlesAPI.bookmarkArticle(article.article_id);
      setBookmarked(!bookmarked);
      toast.success(
        bookmarked ? "Removed from bookmarks" : "Added to bookmarks!",
      );
    } catch (error) {
      console.error("Error bookmarking article:", error);
    }
  };

  const handleReadingList = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to reading list");
      return;
    }

    try {
      if (inReadingList) {
        await api.delete(`/reading-list/${article.article_id}`);
        setInReadingList(false);
        toast.success("Removed from reading list");
      } else {
        await api.post(`/reading-list/${article.article_id}`);
        setInReadingList(true);
        toast.success("Added to reading list!");
      }
    } catch (error) {
      console.error("Error updating reading list:", error);
      toast.error("Failed to update reading list");
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to report articles");
      return;
    }

    const reason = window.prompt(
      "Please provide a reason for reporting this article:",
    );
    if (!reason || !reason.trim()) return;

    try {
      await api.post(`/articles/${article.article_id}/report`, {
        reason: reason.trim(),
      });
      toast.success(
        "Article reported. Thank you for helping keep our community safe.",
      );
    } catch (error) {
      console.error("Error reporting article:", error);
      toast.error(error.response?.data?.message || "Failed to report article");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <PageLoader />;

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Container className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
            <TrendingUp className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Article not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/articles">
            <Button variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Back Button */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <Container className="py-4">
          <Link
            to="/articles"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Back to Articles</span>
          </Link>
        </Container>
      </div>

      <Container className="py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Article Header */}
          <header className="mb-12">
            {/* Category Badge */}
            {article.category_name && (
              <Link
                to={`/articles?category=${article.category_slug}`}
                className="inline-block group"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold mb-6 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all border border-primary-200 dark:border-primary-800 group-hover:border-primary-300 dark:group-hover:border-primary-700">
                  {article.category_name}
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Author Info Card */}
            <Card className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
              <CardBody className="p-6">
                <div className="flex flex-wrap items-center gap-6">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {(article.full_name || article.username)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <Link
                        to={`/author/${article.username}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {article.full_name || article.username}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{article.username}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-600" />

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{article.reading_time} min read</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      <span>{article.view_count || 0} views</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </header>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl dark:shadow-none">
              <img
                src={getImageUrl(article.featured_image)}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b-2 border-gray-200 dark:border-gray-700">
              {(typeof article.tags === "string"
                ? article.tags.split(",")
                : Array.isArray(article.tags)
                  ? article.tags
                  : []
              ).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  #{typeof tag === "string" ? tag.trim() : tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <Card className="mb-12 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border-2 border-gray-200 dark:border-gray-700">
            <CardBody className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Like Button */}
                <Button
                  variant={liked ? "primary" : "outline"}
                  onClick={handleLike}
                  className={`${
                    liked
                      ? "bg-red-500 hover:bg-red-600 border-red-500 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg shadow-red-500/30"
                      : "border-gray-300 dark:border-gray-600"
                  } transition-all`}
                >
                  <Heart
                    className={`h-5 w-5 mr-2 transition-all ${
                      liked ? "fill-current animate-pulse" : ""
                    }`}
                  />
                  <span className="font-semibold">{likeCount}</span>
                </Button>

                {/* Bookmark Button */}
                <Button
                  variant={bookmarked ? "primary" : "outline"}
                  onClick={handleBookmark}
                  className={`${
                    bookmarked
                      ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 shadow-lg shadow-yellow-500/30"
                      : "border-gray-300 dark:border-gray-600"
                  } transition-all`}
                >
                  <Bookmark
                    className={`h-5 w-5 mr-2 ${bookmarked ? "fill-current" : ""}`}
                  />
                  {bookmarked ? "Saved" : "Save"}
                </Button>

                {/* Reading List Button */}
                <Button
                  variant={inReadingList ? "primary" : "outline"}
                  onClick={handleReadingList}
                  className={`${
                    inReadingList
                      ? "bg-blue-500 hover:bg-blue-600 border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                      : "border-gray-300 dark:border-gray-600"
                  } transition-all`}
                >
                  <BookmarkPlus
                    className={`h-5 w-5 mr-2 ${inReadingList ? "fill-current" : ""}`}
                  />
                  {inReadingList ? "In List" : "Read Later"}
                </Button>

                {/* Share Button */}
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="border-gray-300 dark:border-gray-600"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>

                {/* Report Button */}
                <Button
                  variant="outline"
                  onClick={handleReport}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700"
                >
                  <Flag className="h-5 w-5 mr-2" />
                  Report
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Comments Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Comments
              </h2>
            </div>
            <CommentList articleId={article.article_id} />
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Related Articles
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/articles/${related.slug}`}
                    className="group"
                  >
                    <Card
                      hover
                      className="h-full overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                    >
                      {related.featured_image && (
                        <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-gray-700">
                          <img
                            src={getImageUrl(related.featured_image)}
                            alt={related.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      <CardBody className="p-5">
                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatRelativeTime(related.published_at)}
                        </p>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </Container>
    </div>
  );
};

export default ArticleDetail;
