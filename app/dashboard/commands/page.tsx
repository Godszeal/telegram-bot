'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CommandsList from '@/components/dashboard/CommandsList';

export default function CommandsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Command Management</h1>
          <p className="text-muted-foreground mt-1">Enable/disable commands and view statistics</p>
        </div>

        <CommandsList />
      </div>
    </DashboardLayout>
  );
}
