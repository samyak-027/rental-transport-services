// src/components/Loader.jsx
import React from 'react';
import { spiral } from 'ldrs';

spiral.register();

function Loader() {
  return (
    <div className="flex justify-center items-center">
      <l-spiral size="40" speed="0.9" color="white"></l-spiral>
    </div>
  );
}

export default Loader;
