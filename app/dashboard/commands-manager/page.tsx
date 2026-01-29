'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface BotCommand {
  name: string;
  description: string;
  enabled: boolean;
  cooldown: number;
  onlyAdmin: boolean;
  category: string;
}

export default function CommandsManagerPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commands, setCommands] = useState<BotCommand[]>([]);
  const [search, setSearch] = useState('');

  const availableCommands = [
    { name: 'help', description: 'Show available commands', category: 'Info', onlyAdmin: false, cooldown: 3 },
    { name: 'start', description: 'Start the bot', category: 'Info', onlyAdmin: false, cooldown: 1 },
    { name: 'ping', description: 'Check bot responsiveness', category: 'Utility', onlyAdmin: false, cooldown: 2 },
    { name: 'stats', description: 'Show bot statistics', category: 'Info', onlyAdmin: false, cooldown: 5 },
    { name: 'admin', description: 'Admin only commands', category: 'Admin', onlyAdmin: true, cooldown: 1 },
    { name: 'gpt', description: 'AI powered responses', category: 'AI', onlyAdmin: false, cooldown: 3 },
    { name: 'gemini', description: 'Google Gemini AI', category: 'AI', onlyAdmin: false, cooldown: 3 },
    { name: 'imagine', description: 'Generate images with AI', category: 'AI', onlyAdmin: false, cooldown: 5 },
    { name: 'ytb', description: 'YouTube downloader', category: 'Media', onlyAdmin: false, cooldown: 5 },
    { name: 'tikdl', description: 'TikTok downloader', category: 'Media', onlyAdmin: false, cooldown: 5 },
    { name: 'igdl', description: 'Instagram downloader', category: 'Media', onlyAdmin: false, cooldown: 5 },
    { name: 'weather', description: 'Get weather info', category: 'Utility', onlyAdmin: false, cooldown: 3 },
    { name: 'translate', description: 'Translate text', category: 'Utility', onlyAdmin: false, cooldown: 2 },
    { name: 'eval', description: 'Evaluate JavaScript (admin only)', category: 'Admin', onlyAdmin: true, cooldown: 1 },
  ];

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setAuthorized(true);
          loadCommands();
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('[v0] Auth check failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  function loadCommands() {
    // Load from localStorage or set default state
    const stored = localStorage.getItem('bot_commands');
    if (stored) {
      setCommands(JSON.parse(stored));
    } else {
      const defaultCommands = availableCommands.map(cmd => ({
        ...cmd,
        enabled: true,
      }));
      setCommands(defaultCommands);
      localStorage.setItem('bot_commands', JSON.stringify(defaultCommands));
    }
  }

  function toggleCommand(commandName: string) {
    const updated = commands.map(cmd =>
      cmd.name === commandName ? { ...cmd, enabled: !cmd.enabled } : cmd
    );
    setCommands(updated);
    localStorage.setItem('bot_commands', JSON.stringify(updated));
  }

  function updateCooldown(commandName: string, cooldown: number) {
    const updated = commands.map(cmd =>
      cmd.name === commandName ? { ...cmd, cooldown } : cmd
    );
    setCommands(updated);
    localStorage.setItem('bot_commands', JSON.stringify(updated));
  }

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['All', ...new Set(filteredCommands.map(cmd => cmd.category))];
  const enabledCount = commands.filter(cmd => cmd.enabled).length;

  if (loading) return null;
  if (!authorized) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Bot Commands Manager</h1>
            <p className="text-muted-foreground text-sm">
              {enabledCount} of {commands.length} commands enabled
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base w-full text-sm"
          />
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommands.map(cmd => (
            <div key={cmd.name} className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base truncate">/{cmd.name}</h3>
                    {cmd.onlyAdmin && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 text-xs rounded">Admin</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{cmd.description}</p>
                </div>
                <button
                  onClick={() => toggleCommand(cmd.name)}
                  className={`flex-shrink-0 w-12 h-6 rounded-full transition flex items-center px-1 ml-2 ${
                    cmd.enabled ? 'bg-green-500/30' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition transform ${
                      cmd.enabled ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-muted-foreground block mb-1">Cooldown (s)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={cmd.cooldown}
                    onChange={(e) => updateCooldown(cmd.name, parseInt(e.target.value))}
                    className="input-base w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Category</label>
                  <div className="px-2 py-1.5 bg-secondary rounded text-xs">
                    {cmd.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No commands found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
