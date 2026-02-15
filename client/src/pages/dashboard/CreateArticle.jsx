import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, Eye, Upload, X, ArrowLeft } from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import RichTextEditor from "../../components/editor/RichTextEditor";
import toast from "react-hot-toast";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category_id: "",
    featured_image: "",
    tags: "",
    meta_description: "",
    status: "draft",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setFeaturedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadFeaturedImage = async () => {
    if (!featuredImage) return null;

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");

      const uploadFormData = new FormData();
      uploadFormData.append("image", featuredImage); // Your backend expects 'image'

      const response = await axios.post(
        `${API_URL}/upload/article`, // Your existing endpoint
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Your backend returns: { success, data: { path } }
      return response.data.data.path;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (status) => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = formData.featured_image;
      if (featuredImage) {
        imageUrl = await uploadFeaturedImage();
      }

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");

      const articleData = {
        ...formData,
        featured_image: imageUrl,
        status: status,
      };

      const response = await axios.post(
        `${API_URL}/articles`,
        articleData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(
        status === "published"
          ? "Article published successfully!"
          : "Article saved as draft!",
      );

      if (status === "published") {
        navigate(`/articles/${response.data.data.slug}`);
      } else {
        navigate("/dashboard/articles");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error(error.response?.data?.message || "Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  if (previewMode) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Preview
              </h1>
              <Button variant="outline" onClick={() => setPreviewMode(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            </div>

            <Card>
              <CardBody className="p-8">
                {featuredImagePreview && (
                  <img
                    src={featuredImagePreview}
                    alt={formData.title}
                    className="w-full h-96 object-cover rounded-lg mb-6"
                  />
                )}

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {formData.title || "Untitled Article"}
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  {formData.excerpt || "No excerpt provided"}
                </p>

                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </CardBody>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Create New Article
            </h1>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardBody className="p-8">
              <div className="mb-6">
                <Input
                  label="Article Title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter an engaging title..."
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of your article (2-3 sentences)..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Featured Image
                </label>

                {featuredImagePreview ? (
                  <div className="relative">
                    <img
                      src={featuredImagePreview}
                      alt="Featured"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setFeaturedImage(null);
                        setFeaturedImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG or GIF (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your article content here..."
                />
              </div>

              <div className="mb-6">
                <Input
                  label="Tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g., javascript, react, programming (comma separated)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate tags with commas
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SEO Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                  placeholder="Description for search engines (150-160 characters)..."
                  rows={2}
                  maxLength={160}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleSubmit("published")}
                  loading={loading}
                  disabled={loading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Publish Article
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSubmit("draft")}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(true)}
                  disabled={loading}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default CreateArticle;
