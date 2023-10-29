'use client';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  if (!session) {
    return null;
  }

  return (
    <nav className="bg-teal-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-white font-semibold text-xl tracking-tight"
            >
              Time Tracking
            </Link>
          </div>

          {/* Hamburger menu */}
          <div className="block lg:hidden">
            <button
              className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <div className="hidden space-x-8 lg:ml-8 lg:block">
            <Link
              href="/time-entry"
              className="text-white hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Register Time
            </Link>

            {session.user.role === 'admin' && (
              <Link
                href="/manage-projects"
                className="text-white hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Manage Projects
              </Link>
            )}

            {/* Sign out button */}
            <button
              className="text-white hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? '' : 'hidden'} lg:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/time-entry"
            className="text-white hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Register Time
          </Link>
          {session.user.role === 'admin' && (
            <Link
              href="/manage-projects"
              className="text-white hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Manage Projects
            </Link>
          )}

          {/* Sign out button */}
          <button
            className="text-white hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
