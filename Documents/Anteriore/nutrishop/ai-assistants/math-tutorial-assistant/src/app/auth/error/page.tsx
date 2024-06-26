'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/Loading';

const ErrorPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToHomepage = () => {
    setIsLoading(true);
    window.location.href = '/';
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-start bg-gray-200'>
      <div className='bg-white p-8 mt-16 rounded-lg shadow-md text-center text-black'>
        <h2 className='text-2xl font-bold mb-4'>Something Went Wrong</h2>
        <p className='mb-4'>An error occurred while processing your request. Please try again later.</p>
        <button className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline' onClick={handleGoToHomepage}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
