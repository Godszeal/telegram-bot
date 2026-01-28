'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UsersList from '@/components/dashboard/UsersList';

export default function UsersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage bot users and permissions</p>
        </div>

        <UsersList />
      </div>
    </DashboardLayout>
  );
}
