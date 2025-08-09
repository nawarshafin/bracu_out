import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const AppBar = () => {
  const { data: session } = useSession();
  console.log({ session });

  // Helper function to check if user can access a route
  const canAccess = (route: string) => {
    const userRole = session?.user?.role;
    
    switch (route) {
      case 'admin':
        return userRole === 'admin';
      case 'student':
        return userRole === 'student' || userRole === 'recruiter' || userRole === 'admin';
      case 'alumni':
        return userRole === 'alumni' || userRole === 'recruiter' || userRole === 'admin';
      case 'recruiter':
        return userRole === 'recruiter' || userRole === 'admin';
      default:
        return false;
    }
  };

  return (
    <div className="bg-gradient-to-b from-cyan-50 to-cyan-200 p-2 flex gap-5 ">
      <Link className="text-sky-600 hover:text-sky-700" href={'/'}>
        Home
      </Link>

      {/* Admin Panel - Admin only */}
      {canAccess('admin') && (
        <Link className="text-sky-600 hover:text-sky-700" href={"/admin/panel"}>
          Admin Panel
        </Link>
      )}

      {/* Student Panel - Students, Recruiters, and Admins */}
      {canAccess('student') && (
        <Link className="text-sky-600 hover:text-sky-700" href={"/user"}>
          Student Panel
        </Link>
      )}

      {/* Alumni Panel - Alumni, Recruiters, and Admins */}
      {canAccess('alumni') && (
        <Link className="text-sky-600 hover:text-sky-700" href={"/alumni"}>
          Alumni Panel
        </Link>
      )}

      {/* Recruiter Panel - Recruiters and Admins */}
      {canAccess('recruiter') && (
        <Link className="text-sky-600 hover:text-sky-700" href={"/recruiter"}>
          Recruiter Panel
        </Link>
      )}
      <div className="ml-auto flex gap-2">
        {session?.user ? (
          <>
            <p className="text-sky-600"> {session.user.name}</p>
            <Link 
              href="/auth/logout" 
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              Sign Out
            </Link>
            <button className="text-red-600 opacity-50" onClick={() => signOut()}>
              Quick Logout
            </button>
          </>
        ) : (
          <button className="text-green-600" onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default AppBar;
