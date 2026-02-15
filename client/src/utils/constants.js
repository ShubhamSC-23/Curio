export const APP_NAME = process.env.REACT_APP_NAME || 'Article Publishing Platform';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const ROLES = {
  USER: 'user',
  AUTHOR: 'author',
  ADMIN: 'admin',
};

export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ITEMS_PER_PAGE: [10, 20, 50, 100],
};

export const ROUTES = {
  HOME: '/',
  ARTICLES: '/articles',
  ARTICLE_DETAIL: '/articles/:slug',
  CATEGORY: '/category/:slug',
  SEARCH: '/search',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  AUTHOR_DASHBOARD: '/author/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
};
