import React from 'react';

const LoadingPage: React.FC = () => {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-100'>
			<div className="flex flex-col items-center space-y-4">
				<div className='h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent border-solid' />
				<p className='text-gray-700 text-lg'>Carregando...</p>
			</div>
		</div>
	);
};

export default LoadingPage;
