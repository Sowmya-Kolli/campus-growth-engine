-- Supabase SQL Schema for Campus Growth Engine
-- Run this script in the Supabase SQL Editor if connecting a live Supabase project

CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  college TEXT NOT NULL,
  branch TEXT NOT NULL,
  branch_label TEXT NOT NULL,
  interest TEXT NOT NULL,
  coding_level TEXT NOT NULL,
  project_id TEXT NOT NULL,
  project_title TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  channel TEXT NOT NULL DEFAULT 'direct',
  channel_label TEXT NOT NULL DEFAULT 'Direct / College Portals',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast lookups & unique constraints
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_referral_code ON registrations(referral_code);
CREATE INDEX IF NOT EXISTS idx_registrations_referred_by ON registrations(referred_by);
CREATE INDEX IF NOT EXISTS idx_registrations_channel ON registrations(channel);
CREATE INDEX IF NOT EXISTS idx_registrations_is_demo ON registrations(is_demo);

-- Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for workshop registrations
CREATE POLICY "Allow public registration inserts"
  ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Allow public read of verified registrations for leaderboard & dashboard statistics
CREATE POLICY "Allow public read access"
  ON registrations
  FOR SELECT
  USING (true);
