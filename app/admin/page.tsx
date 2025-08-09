"use client";
import React from "react";
import { useSession } from "next-auth/react";
import AdminDashboard from "../components/AdminDashboard";
import { signIn } from "next-auth/react";

const AdminPage = () => {
  const { data: session } = useSession();

  // If user is logged in, show dashboard
  if (session) {
    return <AdminDashboard />;
  }

  // If not logged in, show login prompt
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Admin Access Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in with your administrator credentials to access the admin panel.
          </p>
          <button
            onClick={() => signIn()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign In as Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
