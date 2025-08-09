"use client";
import React from "react";
import { useSession } from "next-auth/react";

const AlumniDashboard = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            Welcome back, {session?.user?.name || "Alumni"}!
          </h1>
          <p className="text-gray-600">Your alumni network dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Mentoring Students</h3>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Network Connections</h3>
                <p className="text-2xl font-bold text-gray-900">248</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 6v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Events Attended</h3>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Job Referrals</h3>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentoring Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Mentoring Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Career guidance session</p>
                    <p className="text-xs text-gray-500">with Sarah Johnson - Computer Science</p>
                  </div>
                  <span className="text-xs text-gray-400">1 hour ago</span>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Resume review completed</p>
                    <p className="text-xs text-gray-500">for Michael Chen - Business Administration</p>
                  </div>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Job referral sent</p>
                    <p className="text-xs text-gray-500">Software Engineer position at Tech Corp</p>
                  </div>
                  <span className="text-xs text-gray-400">3 days ago</span>
                </div>
              </div>
            </div>

            {/* Alumni Network Updates */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Alumni Network Updates</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-400 pl-4 py-2">
                  <p className="text-sm font-medium text-gray-900">Alumni Reunion 2024</p>
                  <p className="text-xs text-gray-500">Save the date: June 15-16, 2024. Registration opens March 1st.</p>
                  <span className="text-xs text-purple-600">5 days ago</span>
                </div>
                <div className="border-l-4 border-blue-400 pl-4 py-2">
                  <p className="text-sm font-medium text-gray-900">New Alumni Directory Feature</p>
                  <p className="text-xs text-gray-500">Enhanced search and connection capabilities now available.</p>
                  <span className="text-xs text-blue-600">1 week ago</span>
                </div>
                <div className="border-l-4 border-green-400 pl-4 py-2">
                  <p className="text-sm font-medium text-gray-900">Mentorship Program Success</p>
                  <p className="text-xs text-gray-500">95% of mentored students report improved career readiness.</p>
                  <span className="text-xs text-green-600">2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Find Students to Mentor
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Browse Network
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Post Job Opportunity
                </button>
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                  Alumni Events
                </button>
              </div>
            </div>

            {/* Your Mentees */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Mentees</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-800">SJ</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Computer Science, Senior</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-800">MC</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Michael Chen</p>
                    <p className="text-xs text-gray-500">Business Admin, Junior</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-800">AR</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Alex Rodriguez</p>
                    <p className="text-xs text-gray-500">Engineering, Sophomore</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                <div className="p-2 bg-purple-50 border-l-4 border-purple-400 rounded">
                  <p className="text-sm font-medium text-gray-900">Virtual Networking</p>
                  <p className="text-xs text-purple-600">Tomorrow, 7:00 PM</p>
                </div>
                <div className="p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm font-medium text-gray-900">Career Fair</p>
                  <p className="text-xs text-blue-600">March 15, 10:00 AM</p>
                </div>
                <div className="p-2 bg-green-50 border-l-4 border-green-400 rounded">
                  <p className="text-sm font-medium text-gray-900">Alumni Mixer</p>
                  <p className="text-xs text-green-600">March 22, 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
