"use client";
import Button from "@elements/Button";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User } from "types/interfaces";

interface DatabaseUser {
  _id: string;
  username: string;
  name: string;
  role: 'admin' | 'alumni' | 'recruiter' | 'student';
  email?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewUser {
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'alumni' | 'recruiter' | 'student';
  email: string;
}

const AdminPanelPage = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<DatabaseUser | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    password: '',
    name: '',
    role: 'student',
    email: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    alumni: 0,
    recruiter: 0,
    student: 0
  });

  const fetchUsers = async () => {
    if (!session?.user?.role) {
      console.error('No valid session');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setUsers(data);
      
      // Calculate stats
      const stats = {
        total: data.length,
        admin: data.filter((u: DatabaseUser) => u.role === 'admin').length,
        alumni: data.filter((u: DatabaseUser) => u.role === 'alumni').length,
        recruiter: data.filter((u: DatabaseUser) => u.role === 'recruiter').length,
        student: data.filter((u: DatabaseUser) => u.role === 'student').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.username || !newUser.password || !newUser.name) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      setNewUser({ username: '', password: '', name: '', role: 'student', email: '' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (!confirm(`Are you sure you want to delete user: ${username}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${username}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'alumni': return 'text-blue-600 bg-blue-100';
      case 'recruiter': return 'text-green-600 bg-green-100';
      case 'student': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome, {session?.user?.name}! Manage your BRACU OUT platform users.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-900 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700">Admins</h3>
          <p className="text-3xl font-bold text-red-600">{stats.admin}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700">Alumni</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.alumni}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700">Recruiters</h3>
          <p className="text-3xl font-bold text-green-600">{stats.recruiter}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700">Students</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.student}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <Button 
          onClick={fetchUsers} 
          disabled={loading}
          variant="primary"
        >
          {loading ? 'Loading...' : 'Refresh Users'}
        </Button>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant="success"
        >
          {showCreateForm ? 'Cancel' : 'Create New User'}
        </Button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-semibold mb-4">Create New User</h3>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="success" className="w-full">
                Create User
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">All Users ({users.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        disabled={user.username === session?.user?.userName}
                        className={`text-red-600 hover:text-red-900 ${
                          user.username === session?.user?.userName 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer'
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
