'use client'
import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative h-40 md:h-72 bg-gray-200" />
      
      <div className="p-3 md:p-5 flex flex-col flex-grow space-y-3">
        {/* Title Skeleton */}
        <div className="h-4 md:h-6 bg-gray-200 rounded-md w-3/4" />
        
        {/* Description Skeleton (Desktop) */}
        <div className="hidden md:block space-y-2">
          <div className="h-3 bg-gray-100 rounded-md w-full" />
          <div className="h-3 bg-gray-100 rounded-md w-5/6" />
        </div>
        
        <div className="mt-auto flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-0 pt-2">
          <div className="space-y-2">
            {/* Price Skeleton */}
            <div className="h-3 bg-gray-100 rounded-md w-16" />
            <div className="h-5 bg-gray-200 rounded-md w-24" />
          </div>
          
          {/* Button Skeleton */}
          <div className="h-8 md:h-10 bg-gray-200 rounded-lg md:rounded-xl w-full md:w-20" />
        </div>
      </div>
    </div>
  );
}
