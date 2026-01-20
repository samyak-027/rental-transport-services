// src/components/Skeleton.jsx
import React from 'react';

function Skeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="skeleton h-32 w-full bg-gray-300 rounded"></div>
      <div className="skeleton h-4 w-28 bg-gray-300 rounded"></div>
      <div className="skeleton h-4 w-full bg-gray-300 rounded"></div>
      <div className="skeleton h-4 w-full bg-gray-300 rounded"></div>
    </div>
  );
}

export default Skeleton;