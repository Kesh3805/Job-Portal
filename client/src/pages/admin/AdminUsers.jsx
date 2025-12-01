import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiUsers, FiUserCheck, FiUserX, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users', { params: filters });
      setUsers(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-active`);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage all platform users</p>
          </div>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <select
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <option value="">All Roles</option>
                <option value="seeker">Seeker</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                value={filters.isActive}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({ role: '', isActive: '', search: '' })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            {user.company && (
                              <p className="text-xs text-muted-foreground">{user.company.name}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                          user.role === 'recruiter' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(user._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive 
                                ? 'text-orange-500 hover:bg-orange-500/10' 
                                : 'text-green-500 hover:bg-green-500/10'
                            }`}
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
                          </button>
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiUsers size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
