import React from "react";

// Article Card Skeleton
export const ArticleCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-blue-200"></div>
      <div className="p-6">
        <div className="h-4 bg-blue-200 rounded w-20 mb-3"></div>
        <div className="h-6 bg-blue-200 rounded w-full mb-2"></div>
        <div className="h-6 bg-blue-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-blue-200 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between items-center border-t pt-3">
          <div className="h-4 bg-blue-200 rounded w-24"></div>
          <div className="h-4 bg-blue-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

// Article Detail Skeleton
export const ArticleDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-blue-200 rounded w-32 mb-6"></div>
      <div className="h-12 bg-blue-200 rounded w-full mb-4"></div>
      <div className="h-12 bg-blue-200 rounded w-3/4 mb-6"></div>
      <div className="flex gap-4 mb-6 pb-6 border-b">
        <div className="h-4 bg-blue-200 rounded w-32"></div>
        <div className="h-4 bg-blue-200 rounded w-32"></div>
        <div className="h-4 bg-blue-200 rounded w-24"></div>
      </div>
      <div className="h-96 bg-blue-200 rounded mb-8"></div>
      <div className="space-y-3">
        <div className="h-4 bg-blue-200 rounded w-full"></div>
        <div className="h-4 bg-blue-200 rounded w-full"></div>
        <div className="h-4 bg-blue-200 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export const CommentSkeleton = () => {
  return (
    <div className="flex space-x-3 animate-pulse">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-blue-200"></div>
      </div>
      <div className="flex-1 bg-blue-50 rounded-lg p-4">
        <div className="h-4 bg-blue-200 rounded w-32 mb-3"></div>
        <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-blue-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

// User Profile Skeleton
export const UserProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
      <div className="flex items-start gap-6">
        <div className="h-24 w-24 rounded-full bg-blue-200"></div>
        <div className="flex-1">
          <div className="h-8 bg-blue-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-4"></div>
          <div className="flex gap-4">
            <div className="h-4 bg-blue-200 rounded w-24"></div>
            <div className="h-4 bg-blue-200 rounded w-24"></div>
            <div className="h-4 bg-blue-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// List Skeleton
export const ListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="flex gap-4">
            <div className="h-32 w-48 bg-blue-200 rounded flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-blue-200 rounded w-20 mb-3"></div>
              <div className="h-6 bg-blue-200 rounded w-full mb-2"></div>
              <div className="h-6 bg-blue-200 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Grid Skeleton
export const GridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-100 p-4 border-b">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 border-b">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Results Skeleton
export const SearchResultsSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="flex gap-4">
            <div className="h-32 w-48 bg-blue-200 rounded flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-blue-200 rounded w-24 mb-3"></div>
              <div className="h-6 bg-blue-200 rounded w-full mb-2"></div>
              <div className="h-6 bg-blue-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-blue-200 rounded w-5/6 mb-4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-blue-200 rounded w-20"></div>
                <div className="h-4 bg-blue-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  ArticleCardSkeleton,
  ArticleDetailSkeleton,
  CommentSkeleton,
  UserProfileSkeleton,
  ListSkeleton,
  GridSkeleton,
  TableSkeleton,
  SearchResultsSkeleton,
};
