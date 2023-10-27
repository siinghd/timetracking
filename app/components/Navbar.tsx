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
    <nav className="bg-indigo-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl text-white">Your App</h1>
        {session ? (
          <button
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        ) : (
          <p className="text-white">Not signed in</p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
