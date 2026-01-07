'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, User } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';
import { useToast } from '../../../contexts/ToastContext';

export default function AdminUsersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const userData = await api.getProfile();
        setUser(userData);

        if (userData.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        const usersData = await api.getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to load data:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      showToast('User role updated successfully', 'success');
      const usersData = await api.getAllUsers();
      setUsers(usersData);
    } catch (error: any) {
      showToast(error.message || 'Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.deleteUser(userId);
      showToast('User deleted successfully', 'success');
      const usersData = await api.getAllUsers();
      setUsers(usersData);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete user', 'error');
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar activePage="admin-users" />
      <div style={{ flex: 1, background: '#fbfaf8' }}>
        <Navbar />
        <div style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#a65b2b' }}>User Management</h1>

          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Username</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Role</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Joined</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#333' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', color: '#333' }}>{u.name || 'N/A'}</td>
                    <td style={{ padding: '16px', color: '#333' }}>{u.email}</td>
                    <td style={{ padding: '16px', color: '#333' }}>{u.username || 'N/A'}</td>
                    <td style={{ padding: '16px' }}>
                      <select
                        value={u.role || 'user'}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', color: '#666', fontSize: '14px' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        style={{
                          padding: '6px 12px',
                          background: 'white',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

