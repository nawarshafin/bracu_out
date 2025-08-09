"use client";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const getRedirectUrl = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'alumni':
        return '/alumni';
      case 'recruiter':
        return '/recruiter';
      case 'student':
        return '/user';
      case 'graduate':
        return '/alumni'; // Graduates go to alumni dashboard
      default:
        return '/';
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (!formData.email && !formData.username) {
      setError("Please provide either email or username");
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', {
        email: formData.email,
        username: formData.username,
        hasPassword: !!formData.password
      });

      const result = await signIn("credentials", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        redirect: false, // Handle redirect manually
      });

      console.log('Login result:', result);

      if (result?.error) {
        setError("Invalid credentials. Please check your email/username and password.");
      } else if (result?.ok) {
        // Get session to check user role
        const session = await getSession();
        console.log('Session after login:', session);
        
        if (session?.user?.role) {
          setSuccess(`Login successful! Redirecting to ${session.user.role} dashboard...`);
          
          // Redirect based on user role
          const redirectUrl = getRedirectUrl(session.user.role);
          console.log(`Redirecting ${session.user.role} to: ${redirectUrl}`);
          
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1000);
        } else {
          setError("Login successful but unable to determine user role. Please contact support.");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-sky-600 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-cyan-600 mb-2">BRACU Out</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username (optional if email provided)
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-cyan-600 text-white py-3 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>


        {/* Role-specific Login Links */}
        <div className="mt-6 text-center">
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">Or use role-specific login:</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/auth/student" className="text-xs bg-green-50 text-green-700 py-2 px-3 rounded hover:bg-green-100">
                Student Portal
              </Link>
              <Link href="/auth/alumni" className="text-xs bg-purple-50 text-purple-700 py-2 px-3 rounded hover:bg-purple-100">
                Alumni Portal
              </Link>
              <Link href="/auth/recruiter" className="text-xs bg-blue-50 text-blue-700 py-2 px-3 rounded hover:bg-blue-100">
                Recruiter Portal
              </Link>
              <Link href="/auth/admin" className="text-xs bg-red-50 text-red-700 py-2 px-3 rounded hover:bg-red-100">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
