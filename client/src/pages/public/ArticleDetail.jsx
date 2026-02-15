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

  // ✅ FIX: Proper state management
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

      // ✅ FIX: Check user interactions when logged in
      if (isAuthenticated) {
        checkUserInteractions(data.data.article_id);
      }

      // Fetch related articles
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

  // ✅ NEW: Check if user has liked/bookmarked/added to reading list
  const checkUserInteractions = async (articleId) => {
    try {
      // Check liked status
      const likeRes = await api
        .get(`/articles/${articleId}/like-status`)
        .catch(() => ({ data: { data: { isLiked: false } } }));
      setLiked(likeRes.data.data?.isLiked || false);

      // Check bookmarked status
      const bookmarkRes = await api
        .get(`/bookmarks/check/${articleId}`)
        .catch(() => ({ data: { data: { isBookmarked: false } } }));
      setBookmarked(bookmarkRes.data.data?.isBookmarked || false);

      // Check reading list status
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

  // ✅ NEW: Handle Reading List
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

  // ✅ NEW: Handle Report Article
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
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Article not found</h2>
      </Container>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container className="py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Article Header */}
          <header className="mb-8">
            {article.category_name && (
              <Link
                to={`/articles?category=${article.category_slug}`}
                className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition"
              >
                {article.category_name}
              </Link>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {article.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 pb-6 border-b dark:border-gray-800">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <Link
                  to={`/author/${article.username}`}
                  className="font-medium hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {article.full_name || article.username}
                </Link>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{article.reading_time} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{article.view_count || 0} views</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.featured_image && (
            <img
              src={getImageUrl(article.featured_image)}
              alt={article.title}
              className="w-full h-auto rounded-lg mb-8 shadow-lg"
            />
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b dark:border-gray-800">
              {(typeof article.tags === "string"
                ? article.tags.split(",")
                : Array.isArray(article.tags)
                  ? article.tags
                  : []
              ).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                >
                  #{typeof tag === "string" ? tag.trim() : tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions - ✅ FIXED WITH ALL BUTTONS */}
          <div className="flex items-center justify-between py-6 border-t border-b dark:border-gray-800 mb-8">
            <div className="flex items-center flex-wrap gap-3">
              {/* Like Button */}
              <Button
                variant={liked ? "primary" : "outline"}
                onClick={handleLike}
                className={
                  liked
                    ? "bg-red-500 hover:bg-red-600 border-red-500 dark:bg-red-600 dark:hover:bg-red-700"
                    : ""
                }
              >
                <Heart
                  className={`h-5 w-5 mr-2 transition-all ${
                    liked ? "fill-current" : ""
                  }`}
                />
                <span>{likeCount}</span>
              </Button>

              {/* Bookmark Button */}
              <Button
                variant={bookmarked ? "primary" : "outline"}
                onClick={handleBookmark}
                className={
                  bookmarked
                    ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                    : ""
                }
              >
                <Bookmark
                  className={`h-5 w-5 mr-2 ${bookmarked ? "fill-current" : ""}`}
                />
                {bookmarked ? "Saved" : "Save"}
              </Button>

              {/* ✅ NEW: Reading List Button */}
              <Button
                variant={inReadingList ? "primary" : "outline"}
                onClick={handleReadingList}
                className={
                  inReadingList
                    ? "bg-blue-500 hover:bg-blue-600 border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                    : ""
                }
              >
                <BookmarkPlus
                  className={`h-5 w-5 mr-2 ${inReadingList ? "fill-current" : ""}`}
                />
                {inReadingList ? "In Reading List" : "Read Later"}
              </Button>

              {/* Share Button */}
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>

              {/* ✅ NEW: Report Button */}
              <Button
                variant="outline"
                onClick={handleReport}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Flag className="h-5 w-5 mr-2" />
                Report
              </Button>
            </div>
          </div>

          {/* Comments */}
          <div className="mb-12">
            <CommentList articleId={article.article_id} />
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.slug} to={`/articles/${related.slug}`}>
                    <Card hover className="h-full">
                      {related.featured_image && (
                        <img
                          src={getImageUrl(related.featured_image)}
                          alt={related.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                      )}
                      <CardBody className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
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
