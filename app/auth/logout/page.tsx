"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@elements/Button";

interface IProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LogoutPage = ({ searchParams }: IProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [autoLogout, setAutoLogout] = useState(false);

  // Get redirect URL from search params or default to home page
  const getRedirectUrl = () => {
    if (searchParams?.callbackUrl && searchParams.callbackUrl !== '/auth/admin' && searchParams.callbackUrl !== '/auth/alumni' && searchParams.callbackUrl !== '/auth/recruiter' && searchParams.callbackUrl !== '/auth/student') {
      return searchParams.callbackUrl as string;
    }
    
    // Always redirect to home page after logout
    return '/';
  };

  // Auto countdown for logout
  useEffect(() => {
    if (autoLogout && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoLogout && countdown === 0) {
      handleLogout();
    }
  }, [autoLogout, countdown]);

  // Redirect to login if already logged out
  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const redirectUrl = getRedirectUrl();
      
      await signOut({ 
        redirect: true,
        callbackUrl: redirectUrl
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect
      router.push('/auth/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    // Redirect back to appropriate dashboard
    switch (session?.user?.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'alumni':
        router.push('/alumni');
        break;
      case 'recruiter':
        router.push('/recruiter');
        break;
      case 'student':
        router.push('/user');
        break;
      default:
        router.push('/');
    }
  };

  const startAutoLogout = () => {
    setAutoLogout(true);
    setCountdown(10);
  };

  const stopAutoLogout = () => {
    setAutoLogout(false);
    setCountdown(10);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'alumni': return 'Alumni';
      case 'recruiter': return 'Recruiter';
      case 'student': return 'Student';
      default: return 'User';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'alumni': return 'text-blue-600 bg-blue-100';
      case 'recruiter': return 'text-green-600 bg-green-100';
      case 'student': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You are not logged in.</p>
          <Button onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="max-w-md w-full mx-4">
        {/* Confirmation Message */}
        {searchParams?.message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-300 text-blue-700 rounded-md text-center">
            {searchParams.message}
          </div>
        )}

        {/* Main Logout Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign Out</h1>
            <p className="text-gray-600">Are you sure you want to sign out?</p>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{session.user.name}</p>
                <p className="text-sm text-gray-500">@{session.user.userName}</p>
                {session.user.email && (
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                )}
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(session.user.role)}`}>
                {getRoleDisplayName(session.user.role)}
              </span>
            </div>
          </div>

          {/* Auto Logout Section */}
          {autoLogout && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Auto logout in {countdown} seconds
                  </p>
                  <p className="text-xs text-yellow-600">
                    Click cancel to stop automatic logout
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Logout Button */}
            <Button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              variant="danger"
              className="w-full"
            >
              {isLoggingOut ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing Out...
                </div>
              ) : (
                "Sign Out Now"
              )}
            </Button>

            {/* Auto Logout Toggle */}
            {!autoLogout ? (
              <Button 
                onClick={startAutoLogout}
                variant="secondary"
                className="w-full"
              >
                Sign Out in 10 seconds
              </Button>
            ) : (
              <Button 
                onClick={stopAutoLogout}
                variant="secondary"
                className="w-full"
              >
                Cancel Auto Logout
              </Button>
            )}

            {/* Cancel Button */}
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="w-full"
              disabled={isLoggingOut}
            >
              Stay Signed In
            </Button>
          </div>

          {/* Redirect Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              After signing out, you'll be redirected to the home page
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
            >
              Different User
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => router.push('/')}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
            >
              Home Page
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={handleCancel}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
