import Link from 'next/link';
import React from 'react';
import 'tailwindcss/tailwind.css';

const ExpiredURL = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow-lg rounded-lg max-w-4xl w-full text-center">
                <h1 className="text-4xl font-semibold text-red-500 mb-4">URL Expired</h1>
                <p className="text-lg mb-8">
                    The URL you are trying to access has expired.
                </p>
                <Link href="/" className="text-blue-500 underline">Go back to Home</Link>
            </div>
        </div>
    );
};

export default ExpiredURL;
