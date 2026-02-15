import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, FileText } from "lucide-react";
import { categoriesAPI } from "../../api/categories";
import Container from "../../components/layout/Container";
import Card, { CardBody } from "../../components/common/Card";
import { PageLoader } from "../../components/common/Spinner";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse Categories
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore articles by topic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.category_id}
                to={`/articles?category=${category.slug}`}
              >
                <Card hover className="h-full">
                  <CardBody className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
                        <Folder className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {category.description}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{category.article_count || 0} articles</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No categories available
              </p>
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default Categories;
