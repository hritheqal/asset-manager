import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export function Skeleton({ className = '', width, height, circle = false }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse bg-gray-200 rounded
        ${circle ? 'rounded-full' : ''}
        ${className}
      `}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton width={48} height={48} circle />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <Skeleton width="100%" height={60} />
      <div className="flex justify-between">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4 pb-4 border-b border-gray-200">
        <Skeleton width={50} height={20} />
        <Skeleton className="flex-1" height={20} />
        <Skeleton className="flex-1" height={20} />
        <Skeleton className="flex-1" height={20} />
        <Skeleton width={80} height={20} />
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 py-3">
          <Skeleton width={50} height={20} />
          <Skeleton className="flex-1" height={20} />
          <Skeleton className="flex-1" height={20} />
          <Skeleton className="flex-1" height={20} />
          <Skeleton width={80} height={20} />
        </div>
      ))}
    </div>
  );
}
