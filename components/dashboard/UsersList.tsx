'use client';

import { useEffect, useState } from 'react';

interface BotUser {
  id: string;
  user_id: string;
  username: string;
  is_banned: boolean;
  created_at: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function UsersList() {
  const [users, setUsers] = useState<BotUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  async function fetchUsers(page: number) {
    try {
      const response = await fetch(`/api/users?page=${page}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function toggleBanUser(userId: string, currentBanStatus: boolean) {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, is_banned: !currentBanStatus }),
      });

      if (response.ok) {
        fetchUsers(currentPage);
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  }

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="card-base overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">User ID</th>
              <th className="text-left py-3 px-4 font-semibold">Username</th>
              <th className="text-left py-3 px-4 font-semibold">Joined</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-center py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-card/50 transition-colors">
                <td className="py-3 px-4 font-mono text-xs">{user.user_id}</td>
                <td className="py-3 px-4">{user.username || '-'}</td>
                <td className="py-3 px-4 text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.is_banned
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-green-500/20 text-green-600'
                  }`}>
                    {user.is_banned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleBanUser(user.user_id, user.is_banned)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      user.is_banned
                        ? 'btn-secondary hover:bg-green-500/20'
                        : 'btn-secondary hover:bg-destructive/20'
                    }`}
                  >
                    {user.is_banned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
            disabled={currentPage === pagination.pages}
            className="btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
