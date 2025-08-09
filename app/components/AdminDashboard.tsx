"use client";
import React from "react";
import { useSession } from "next-auth/react";

const AdminDashboard = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Welcome back, {session?.user?.name || "Administrator"}!
          </h1>
          <p className="text-gray-600">System administration dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Alumni Network</h3>
                <p className="text-2xl font-bold text-gray-900">3,892</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Recruiters</h3>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">System Activity</h3>
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent System Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent System Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New student registration</p>
                    <p className="text-xs text-gray-500">Emily Rodriguez - Computer Science</p>
                  </div>
                  <span className="text-xs text-gray-400">5 min ago</span>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New recruiter approved</p>
                    <p className="text-xs text-gray-500">TechCorp Inc. - HR Department</p>
                  </div>
                  <span className="text-xs text-gray-400">12 min ago</span>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Alumni network update</p>
                    <p className="text-xs text-gray-500">Monthly newsletter sent to 3,892 alumni</p>
                  </div>
                  <span className="text-xs text-gray-400">1 hour ago</span>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Security alert resolved</p>
                    <p className="text-xs text-gray-500">Suspicious login attempt blocked</p>
                  </div>
                  <span className="text-xs text-gray-400">3 hours ago</span>
                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management Overview</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-400 pl-4 py-2 bg-green-50 rounded-r">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Students</p>
                      <p className="text-xs text-gray-500">Active registrations and enrollments</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">1,247</p>
                      <p className="text-xs text-green-600">+23 this week</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50 rounded-r">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Alumni</p>
                      <p className="text-xs text-gray-500">Verified alumni network members</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">3,892</p>
                      <p className="text-xs text-purple-600">+12 this week</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 rounded-r">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recruiters</p>
                      <p className="text-xs text-gray-500">Approved corporate recruiters</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">156</p>
                      <p className="text-xs text-blue-600">+5 this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                  User Management
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  System Settings
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Generate Reports
                </button>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Security Logs
                </button>
                <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                  Backup System
                </button>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Approvals</h2>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                  <p className="text-sm font-medium text-gray-900">Recruiter Applications</p>
                  <p className="text-xs text-yellow-600">3 pending review</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r">
                  <p className="text-sm font-medium text-gray-900">Alumni Verifications</p>
                  <p className="text-xs text-blue-600">7 pending verification</p>
                </div>
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r">
                  <p className="text-sm font-medium text-gray-900">Reported Content</p>
                  <p className="text-xs text-red-600">2 reports to review</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-sm font-medium text-green-600">✓ Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Services</span>
                  <span className="text-sm font-medium text-green-600">✓ Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Authentication</span>
                  <span className="text-sm font-medium text-green-600">✓ Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm font-medium text-yellow-600">⚠ 82% Full</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Alerts</h2>
              <div className="space-y-3">
                <div className="p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                  <p className="text-sm font-medium text-gray-900">Storage Warning</p>
                  <p className="text-xs text-yellow-600">Disk usage above 80%</p>
                </div>
                <div className="p-2 bg-green-50 border-l-4 border-green-400 rounded-r">
                  <p className="text-sm font-medium text-gray-900">Backup Complete</p>
                  <p className="text-xs text-green-600">Daily backup successful</p>
                </div>
                <div className="p-2 bg-blue-50 border-l-4 border-blue-400 rounded-r">
                  <p className="text-sm font-medium text-gray-900">Update Available</p>
                  <p className="text-xs text-blue-600">Security patch v2.1.3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
