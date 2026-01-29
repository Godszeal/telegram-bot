'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function GuidePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Getting Started</h1>
          <p className="text-muted-foreground mt-1">A quick guide to set up your Telegram bot</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1 */}
          <div className="card-base">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">1</div>
              <h3 className="text-xl font-semibold">Get Your Bot Token</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Open Telegram and search for <strong>@BotFather</strong>. Send <code className="bg-card px-2 py-1 rounded">/start</code> and follow the steps to create a new bot. You'll receive your bot token.
            </p>
            <div className="bg-card p-3 rounded border border-border text-sm">
              Token format: <code>123456789:ABCDefGHIjklmnoPqrsTUVwxyzABC</code>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card-base">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">2</div>
              <h3 className="text-xl font-semibold">Get Your Admin ID</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Search for <strong>@userinfobot</strong> on Telegram and send it any message. It will reply with your user ID.
            </p>
            <div className="bg-card p-3 rounded border border-border text-sm">
              Your ID will be a number like: <code>123456789</code>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card-base">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">3</div>
              <h3 className="text-xl font-semibold">Configure Your Bot</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Go to <strong>Bot Setup</strong> page and enter your bot token and admin ID. Click save to connect your bot.
            </p>
            <div className="bg-card p-3 rounded border border-border text-sm">
              You can update these settings anytime without redeploying.
            </div>
          </div>

          {/* Step 4 */}
          <div className="card-base">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">4</div>
              <h3 className="text-xl font-semibold">Manage Everything</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Use the dashboard to manage users, commands, view analytics, and control your bot settings in real-time.
            </p>
            <div className="bg-card p-3 rounded border border-border text-sm">
              All changes take effect immediately.
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="card-base">
          <h3 className="text-2xl font-semibold mb-6">Dashboard Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Bot Setup', desc: 'Connect and configure your bot' },
              { title: 'Configuration', desc: 'Manage bot settings and preferences' },
              { title: 'User Management', desc: 'Ban/unban users and track activity' },
              { title: 'Command Control', desc: 'Enable/disable commands dynamically' },
              { title: 'Analytics', desc: 'View performance and usage stats' },
              { title: 'Settings', desc: 'Customize bot behavior' },
            ].map((feature, idx) => (
              <div key={idx} className="p-3 rounded border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Example */}
        <div className="card-base">
          <h3 className="text-2xl font-semibold mb-4">Quick Integration Example</h3>
          <p className="text-muted-foreground mb-4">
            Load your bot configuration from the database in your bot code:
          </p>
          <pre className="bg-card p-4 rounded overflow-x-auto text-xs sm:text-sm border border-border">
            <code>{`// In your bot.js or bot.py
const config = await fetch('YOUR_DOMAIN/api/config');
const botSettings = await config.json();

// Use the settings
bot.token = botSettings.bot_token;
bot.prefix = botSettings.bot_prefix;
bot.name = botSettings.bot_name;`}</code>
          </pre>
        </div>

        {/* FAQ */}
        <div className="card-base">
          <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: 'Can I update settings without redeploying?',
                a: 'Yes! All changes in the dashboard take effect immediately. Your bot will read the updated config on the next check.',
              },
              {
                q: 'How often should my bot check for config updates?',
                a: 'We recommend checking every 5-10 minutes or whenever needed. More frequent checks will use more resources.',
              },
              {
                q: 'Is my bot token safe?',
                a: 'Yes. Your token is stored encrypted in our database. Never share it with anyone.',
              },
              {
                q: 'Can I manage multiple bots?',
                a: 'Each admin account manages one bot. Create separate accounts for multiple bots.',
              },
            ].map((item, idx) => (
              <div key={idx} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                <h4 className="font-semibold mb-2">{item.q}</h4>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
