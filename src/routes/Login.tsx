import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="w-64 h-64 bg-white rounded-full"></div>
      <button className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Login
      </button>
    </div>
  );
};

export default LoginPage;