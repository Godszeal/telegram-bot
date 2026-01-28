'use client';

import { useEffect, useState } from 'react';

interface Command {
  id: string;
  name: string;
  description: string;
  is_enabled: boolean;
  usage_count: number;
  last_used: string | null;
  created_at: string;
}

export default function CommandsList() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  useEffect(() => {
    fetchCommands();
  }, []);

  async function fetchCommands() {
    try {
      const response = await fetch('/api/commands');
      if (response.ok) {
        const data = await response.json();
        setCommands(data.commands);
      }
    } catch (err) {
      console.error('Error fetching commands:', err);
      setError('Failed to load commands');
    } finally {
      setLoading(false);
    }
  }

  async function toggleCommand(commandId: string, currentStatus: boolean) {
    try {
      const response = await fetch('/api/commands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command_id: commandId, is_enabled: !currentStatus }),
      });

      if (response.ok) {
        fetchCommands();
      }
    } catch (err) {
      console.error('Error updating command:', err);
    }
  }

  const filteredCommands = commands.filter((cmd) => {
    if (filter === 'enabled') return cmd.is_enabled;
    if (filter === 'disabled') return !cmd.is_enabled;
    return true;
  });

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

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['all', 'enabled', 'disabled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === f
                ? 'bg-accent text-accent-foreground'
                : 'btn-secondary'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCommands.map((cmd) => (
          <div key={cmd.id} className="card-base space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg">/{cmd.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{cmd.description || 'No description'}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                cmd.is_enabled
                  ? 'bg-green-500/20 text-green-600'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {cmd.is_enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-xs">
              <div>
                <p className="text-muted-foreground">Used</p>
                <p className="font-semibold">{cmd.usage_count} times</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Used</p>
                <p className="font-semibold">{cmd.last_used ? new Date(cmd.last_used).toLocaleDateString() : 'Never'}</p>
              </div>
            </div>

            <button
              onClick={() => toggleCommand(cmd.id, cmd.is_enabled)}
              className={`w-full py-2 rounded-md font-medium transition-colors text-sm ${
                cmd.is_enabled
                  ? 'btn-secondary hover:bg-destructive/20'
                  : 'btn-secondary hover:bg-green-500/20'
              }`}
            >
              {cmd.is_enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        ))}
      </div>

      {filteredCommands.length === 0 && (
        <div className="text-center py-8 text-muted-foreground card-base">
          No commands found
        </div>
      )}
    </div>
  );
}
