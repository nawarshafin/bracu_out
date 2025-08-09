"use client";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Button from "@elements/Button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
}

const LogoutModal = ({ isOpen, onClose, redirectUrl }: LogoutModalProps) => {
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Default redirect based on role if not provided
      const defaultRedirect = redirectUrl || (() => {
        switch (session?.user?.role) {
          case 'admin': return '/auth/admin';
          case 'alumni': return '/auth/alumni'; 
          case 'recruiter': return '/auth/recruiter';
          case 'student': return '/auth/student';
          default: return '/auth/login';
        }
      })();

      await signOut({
        redirect: true,
        callbackUrl: defaultRedirect
      });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth/login';
    } finally {
      setIsLoggingOut(false);
    }
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

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Sign Out</h2>
              <p className="text-gray-600 text-sm">Are you sure you want to sign out?</p>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{session.user.name}</p>
                  <p className="text-xs text-gray-500">@{session.user.userName}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(session.user.role)}`}>
                  {getRoleDisplayName(session.user.role)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="danger"
                className="w-full"
              >
                {isLoggingOut ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing Out...
                  </div>
                ) : (
                  "Sign Out"
                )}
              </Button>

              <Button 
                onClick={onClose}
                variant="outline"
                className="w-full"
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
            </div>

            {/* Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                You'll be redirected to the {getRoleDisplayName(session.user.role)} login page
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
