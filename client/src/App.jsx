import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { NotFound } from "./components/error/ErrorComponents";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import FollowingFeed from "./pages/user/FollowingFeed";
import ReadingList from "./pages/user/ReadingList";

// Public Pages
import Home from "./pages/public/Home";
import Articles from "./pages/public/Articles";
import ArticleDetail from "./pages/public/ArticleDetail";
import Search from "./pages/public/Search";
import UserProfile from "./pages/public/UserProfile";
import Categories from "./pages/public/Categories";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// User Pages
import Profile from "./pages/user/Profile";
import Bookmarks from "./pages/user/Bookmarks";
import Settings from "./pages/user/Settings";
import DiscoverAuthors from "./pages/user/DiscoverAuthors";

// Author Pages
import CreateArticle from "./pages/dashboard/CreateArticle";
import EditArticle from "./pages/dashboard/EditArticle";
import AuthorDashboard from "./pages/dashboard/AuthorDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ArticleModeration from "./pages/admin/ArticleModeration";
import CommentModeration from "./pages/admin/CommentModeration";
import CategoryManagement from "./pages/admin/CategoryManagement";

function App() {
  // useKeyboardShortcuts();
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/reading-list" element={<ReadingList />} />
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/user/:username" element={<UserProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              {/* Admin Routes - Require admin role */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/articles"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <ArticleModeration />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/comments"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CommentModeration />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />
              {/* Author Routes: */}
              <Route path="/dashboard" element={<AuthorDashboard />} />
              <Route path="/dashboard/articles" element={<AuthorDashboard />} />
              <Route
                path="/dashboard/articles/create"
                element={<CreateArticle />}
              />
              <Route
                path="/dashboard/articles/edit/:slug"
                element={<EditArticle />}
              />
              {/* Protected Routes */}
              <Route
                path="/reading-list"
                element={
                  <ProtectedRoute>
                    <ReadingList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <FollowingFeed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <Bookmarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discover-authors"
                element={
                  <ProtectedRoute>
                    <DiscoverAuthors />
                  </ProtectedRoute>
                }
              />
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
