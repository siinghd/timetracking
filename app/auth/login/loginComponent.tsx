'use client';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

const LoginComponent = () => {
  const { data: session } = useSession();

  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setError(null); // Reset error state
      await signIn('google', {
        redirect: true,
        callbackUrl: '/',
      });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <h5 className="mt-6 text-center  font-extrabold text-gray-900">
            Only @redergo.com is ALLOWED
          </h5>
        </div>
        <div>
          <button
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={handleLogin}
          >
            Sign in with Google
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default LoginComponent;
