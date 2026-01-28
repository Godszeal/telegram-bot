-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bot config table
CREATE TABLE IF NOT EXISTS bot_config (
    id SERIAL PRIMARY KEY,
    bot_token VARCHAR(255) NOT NULL,
    bot_name VARCHAR(255) NOT NULL,
    prefix VARCHAR(10) NOT NULL DEFAULT '/',
    owner_id BIGINT NOT NULL,
    admin_ids TEXT NOT NULL DEFAULT '[]',
    only_admin BOOLEAN DEFAULT FALSE,
    port INTEGER DEFAULT 3000,
    greet_members_enabled BOOLEAN DEFAULT TRUE,
    greet_gif_url TEXT,
    farewell_members_enabled BOOLEAN DEFAULT TRUE,
    farewell_gif_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create bot commands table
CREATE TABLE IF NOT EXISTS bot_commands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    role INTEGER DEFAULT 0,
    cooldown INTEGER DEFAULT 3,
    only_admin BOOLEAN DEFAULT FALSE,
    enabled BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users management table
CREATE TABLE IF NOT EXISTS managed_users (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    banned_at TIMESTAMP,
    global_ban BOOLEAN DEFAULT FALSE,
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create statistics table
CREATE TABLE IF NOT EXISTS bot_statistics (
    id SERIAL PRIMARY KEY,
    total_users INTEGER DEFAULT 0,
    total_commands_executed INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    active_chats INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create command usage statistics
CREATE TABLE IF NOT EXISTS command_statistics (
    id SERIAL PRIMARY KEY,
    command_id INTEGER NOT NULL,
    user_id BIGINT NOT NULL,
    chat_id BIGINT NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (command_id) REFERENCES bot_commands(id)
);

-- Create chat/thread management
CREATE TABLE IF NOT EXISTS chat_threads (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin action logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_managed_users_user_id ON managed_users(user_id);
CREATE INDEX idx_managed_users_banned ON managed_users(banned);
CREATE INDEX idx_bot_commands_enabled ON bot_commands(enabled);
CREATE INDEX idx_command_statistics_executed_at ON command_statistics(executed_at);
CREATE INDEX idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);
