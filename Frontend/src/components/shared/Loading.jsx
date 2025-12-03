import React from "react";

const Loading = ({ text = "" }) => {
  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center`}>
      <div className="text-center">
        {/* Animated Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-200 animate-ping"></div>
            <div className="relative rounded-full">
              <img src="/logo.png" alt="wander wise" className="h-20 w-20 " />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-xl text-gray-600 mb-2">
          {text || "Preparing your journey"}
        </p>
        <p className="text-sm text-gray-500">This won't take long</p>
      </div>
    </div>
  );
};

export default Loading;
