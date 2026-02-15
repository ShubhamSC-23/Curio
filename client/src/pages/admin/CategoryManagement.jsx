import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, Plus, Edit, Trash2, Save, X } from "lucide-react";
import axios from "axios";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      if (editingId) {
        // Update
        await axios.put(`${API_URL}/admin/categories/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Category updated");
      } else {
        // Create
        await axios.post(`${API_URL}/admin/categories`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Category created");
      }

      setFormData({ name: "", slug: "", description: "" });
      setShowAddForm(false);
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setEditingId(category.category_id);
    setShowAddForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", slug: "", description: "" });
    setShowAddForm(false);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Category Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage article categories
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {editingId ? "Edit Category" : "Add New Category"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Category Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: name
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      });
                    }}
                    placeholder="e.g., Technology"
                    required
                  />

                  <Input
                    label="Slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="e.g., technology"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Category description..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" variant="primary">
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? "Update" : "Create"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.category_id} hover>
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Folder className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(category.category_id, category.name)
                        }
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    /{category.slug}
                  </p>
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {category.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.article_count || 0} articles
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          {categories.length === 0 && (
            <Card>
              <CardBody className="p-12 text-center">
                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No categories yet
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowAddForm(true)}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Category
                </Button>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default CategoryManagement;
