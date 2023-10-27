'use client';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  if (!session) {
    return null;
  }

  return (
    <nav className="bg-indigo-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl text-white font-bold">Your App</h1>
        <div className="flex items-center">
          {session.user.role === 'admin' && (
            <a
              href="/manage-projects"
              className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md mr-4"
            >
              Manage Projects
            </a>
          )}
          {session?.user.role === 'user' && (
            <a
              href="/register-time"
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md mr-4"
            >
              Register Time
            </a>
          )}
          <button
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
