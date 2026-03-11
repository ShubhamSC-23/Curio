import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Globe,
  Type,
  AlignLeft,
  FileText,
  Link as LinkIcon,
  Eye,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TranslationForm = () => {
  const navigate = useNavigate();
  const { articleId, languageCode } = useParams();
  const isEditMode = window.location.pathname.includes("/edit/");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    slug: "",
    meta_description: "",
  });

  const LANGUAGES = {
    hi: { name: "Hindi", flag: "🇮🇳", nativeName: "हिंदी" },
    mr: { name: "Marathi", flag: "🇮🇳", nativeName: "मराठी" },
  };

  const language = LANGUAGES[languageCode];

  useEffect(() => {
    fetchData();
  }, [articleId, languageCode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
      const token = localStorage.getItem("token");

      // Fetch article from author's articles (by ID, not slug)
      // Since the backend doesn't have a direct "get by ID" endpoint,
      // we fetch all author articles and find the one we need
      const articlesResponse = await axios.get(`${API_URL}/author/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const authorArticles = articlesResponse.data.data || [];
      const foundArticle = authorArticles.find(
        (a) => a.article_id === parseInt(articleId),
      );

      if (!foundArticle) {
        toast.error("Article not found");
        navigate("/dashboard/translations");
        return;
      }

      setArticle(foundArticle);

      // If editing, fetch existing translation
      if (isEditMode) {
        try {
          const translationResponse = await axios.get(
            `${API_URL}/article-translations/${articleId}/${languageCode}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (translationResponse.data.data) {
            const translation = translationResponse.data.data;
            setFormData({
              title: translation.title || "",
              excerpt: translation.excerpt || "",
              content: translation.content || "",
              slug: translation.slug || "",
              meta_description: translation.meta_description || "",
            });
          }
        } catch (error) {
          // Translation doesn't exist yet
          console.log("No existing translation found");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load article");
      navigate("/dashboard/translations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title
    if (field === "title" && !isEditMode) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setSaving(true);
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/article-translations/${articleId}`,
        {
          language_code: languageCode,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(
        isEditMode
          ? "Translation updated successfully"
          : "Translation added successfully",
      );
      navigate("/dashboard/translations");
    } catch (error) {
      console.error("Error saving translation:", error);
      toast.error(
        error.response?.data?.message || "Failed to save translation",
      );
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article not found
          </h2>
          <Button onClick={() => navigate("/dashboard/translations")}>
            Back to Translations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard/translations")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <Globe className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? "Edit" : "Add"} {language.name} Translation
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {language.flag} {language.nativeName}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/translations")}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Translation"}
              </Button>
            </div>
          </div>

          {/* Original Article Reference */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Original Article (English)
                  </p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {article.title}
                  </p>
                  {article.excerpt && (
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                <a
                  href={`/articles/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Eye className="h-5 w-5" />
                </a>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Translation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Type className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Title *
                </label>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder={`Enter ${language.name} title...`}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
                required
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Original: <span className="font-medium">{article.title}</span>
              </p>
            </CardBody>
          </Card>

          {/* Slug */}
          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Slug
                </label>
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="article-slug-in-language"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Auto-generated from title. Used in the URL for this translation.
              </p>
            </CardBody>
          </Card>

          {/* Excerpt */}
          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlignLeft className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Excerpt
                </label>
              </div>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder={`Enter ${language.name} excerpt...`}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent resize-none"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Original: <span className="font-medium">{article.excerpt}</span>
              </p>
            </CardBody>
          </Card>

          {/* Content */}
          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Content *
                </label>
              </div>
              <div className="prose-editor">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => handleInputChange("content", value)}
                  modules={quillModules}
                  placeholder={`Write your ${language.name} content here...`}
                  className="bg-white dark:bg-gray-900 rounded-lg"
                />
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Translate the full content of the article into {language.name}.
              </p>
            </CardBody>
          </Card>

          {/* Meta Description */}
          <Card className="bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Meta Description
                </label>
              </div>
              <textarea
                value={formData.meta_description}
                onChange={(e) =>
                  handleInputChange("meta_description", e.target.value)
                }
                placeholder={`Enter SEO meta description in ${language.name}...`}
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent resize-none"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                SEO description for search engines (recommended 150-160
                characters).
              </p>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/translations")}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <Button type="submit" variant="primary" disabled={saving} size="lg">
              <Save className="h-5 w-5 mr-2" />
              {saving ? "Saving..." : `Save ${language.name} Translation`}
            </Button>
          </div>
        </form>
      </Container>

      {/* Custom Styles for React Quill in Dark Mode */}
      <style>{`
        .dark .ql-toolbar {
          background: rgb(17, 24, 39);
          border-color: rgb(55, 65, 81) !important;
        }
        .dark .ql-container {
          background: rgb(17, 24, 39);
          border-color: rgb(55, 65, 81) !important;
          color: white;
        }
        .dark .ql-editor.ql-blank::before {
          color: rgb(156, 163, 175);
        }
        .dark .ql-stroke {
          stroke: rgb(156, 163, 175);
        }
        .dark .ql-fill {
          fill: rgb(156, 163, 175);
        }
        .dark .ql-picker-label {
          color: rgb(156, 163, 175);
        }
        .dark .ql-picker-options {
          background: rgb(31, 41, 55);
          border-color: rgb(55, 65, 81);
        }
        .ql-editor {
          min-height: 400px;
          font-size: 16px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default TranslationForm;
