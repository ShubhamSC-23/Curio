import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ← Added
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
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
import BuyMeCoffee from "../../components/payment/BuyMeCoffee";

const ArticleDetail = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation(); // ← Added

  // ✅ Get language from i18n (which is controlled by language selector)
  const lang = i18n.language || "en";

  const { isAuthenticated } = useAuthStore();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [inReadingList, setInReadingList] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // ✅ FIXED: Refetch when slug OR language changes
  useEffect(() => {
    fetchArticle();
  }, [slug, lang, i18n.language]); // ← Added i18n.language

  const fetchArticle = async () => {
    try {
      setLoading(true);

      // ✅ Use current language from i18n
      const currentLang = i18n.language || "en";
      const res = await articlesAPI.getArticle(slug, currentLang);

      const data = res.data;

      setArticle(data);
      setLikeCount(data.like_count || 0);

      if (isAuthenticated) {
        checkUserInteractions(data.article_id);
      }

      // Fetch related articles in the same language
      if (data.category_slug) {
        const related = await articlesAPI.getArticles({
          category: data.category_slug,
          limit: 3,
          lang: currentLang,
        });

        setRelatedArticles(
          related.data.filter((a) => a.slug !== slug).slice(0, 3),
        );
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setArticle(null);
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
      toast.error(t("article.loginToLike")); // ← Translated
      return;
    }

    try {
      await articlesAPI.likeArticle(article.article_id);

      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);

      toast.success(liked ? t("article.unliked") : t("article.liked")); // ← Translated
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error(t("article.loginToBookmark")); // ← Translated
      return;
    }

    try {
      await articlesAPI.bookmarkArticle(article.article_id);

      setBookmarked(!bookmarked);

      toast.success(
        bookmarked ? t("article.bookmarkRemoved") : t("article.bookmarkAdded"), // ← Translated
      );
    } catch (error) {
      console.error("Error bookmarking article:", error);
    }
  };

  const handleReadingList = async () => {
    if (!isAuthenticated) {
      toast.error(t("article.loginToReadingList")); // ← Translated
      return;
    }

    try {
      if (inReadingList) {
        await api.delete(`/reading-list/${article.article_id}`);
        setInReadingList(false);
        toast.success(t("article.readingListRemoved")); // ← Translated
      } else {
        await api.post(`/reading-list/${article.article_id}`);
        setInReadingList(true);
        toast.success(t("article.readingListAdded")); // ← Translated
      }
    } catch (error) {
      console.error("Error updating reading list:", error);
      toast.error(t("article.readingListError")); // ← Translated
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) {
      toast.error(t("article.loginToReport")); // ← Translated
      return;
    }

    const reason = window.prompt(t("article.reportPrompt")); // ← Translated

    if (!reason || !reason.trim()) return;

    try {
      await api.post(`/articles/${article.article_id}/report`, {
        reason: reason.trim(),
      });

      toast.success(t("article.reportSuccess")); // ← Translated
    } catch (error) {
      toast.error(error.response?.data?.message || t("article.reportError")); // ← Translated
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
      } catch (error) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t("article.linkCopied")); // ← Translated
    }
  };

  if (loading) return <PageLoader />;

  if (!article) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("article.notFound")} {/* ← Translated */}
        </h2>
        <Link to="/articles">
          <Button className="mt-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("article.backToArticles")} {/* ← Translated */}
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Container className="py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* ✅ Show language indicator if translated */}
          {article.translated && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                {t("article.translatedFrom")} {article.original_title}
              </p>
            </div>
          )}

          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {article.excerpt}
            </p>
          )}

          {/* Author & Meta Info */}
          <div className="flex items-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(article.published_at || article.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {article.reading_time} {t("articleDetail.minRead")} {/* ← Translated */}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {article.view_count} {t("articleDetail.views")} {/* ← Translated */}
            </div>
          </div>

          {article.featured_image && (
            <img
              src={getImageUrl(article.featured_image)}
              alt={article.title}
              className="w-full rounded-xl mb-10"
            />
          )}

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Action Buttons */}
          <Card className="mt-10">
            <CardBody className="flex flex-wrap gap-4">
              <Button
                onClick={handleLike}
                variant={liked ? "primary" : "outline"}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`}
                />
                {likeCount} {t("articleDetail.likes")} {/* ← Translated */}
              </Button>

              <Button
                onClick={handleBookmark}
                variant={bookmarked ? "primary" : "outline"}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${bookmarked ? "fill-current" : ""}`}
                />
                {t("articleDetail.save")} {/* ← Translated */}
              </Button>

              <Button
                onClick={handleReadingList}
                variant={inReadingList ? "primary" : "outline"}
              >
                <BookmarkPlus className="h-4 w-4 mr-2" />
                {t("articleDetail.readLater")} {/* ← Translated */}
              </Button>

              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                {t("articleDetail.share")} {/* ← Translated */}
              </Button>

              <Button onClick={handleReport} variant="outline">
                <Flag className="h-4 w-4 mr-2" />
                {t("articleDetail.report")} {/* ← Translated */}
              </Button>
            </CardBody>
          </Card>

          <BuyMeCoffee
            article={article}
            author={{
              user_id: article.author_id,
              username: article.username,
              full_name: article.full_name,
            }}
          />

          {/* Comments Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <MessageCircle className="h-6 w-6" />
              {t("articleDetail.comments")} {/* ← Translated */}
            </h2>

            <CommentList articleId={article.article_id} />
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <TrendingUp className="h-6 w-6" />
                {t("articleDetail.relatedArticles")} {/* ← Translated */}
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.slug} to={`/articles/${related.slug}`}>
                    <Card hover>
                      <CardBody>
                        <h3 className="font-semibold line-clamp-2 text-gray-900 dark:text-white">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
