-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Token kind
do $$ begin
  create type token_kind as enum ('filtered', 'verified');
exception
  when duplicate_object then null;
end $$;

-- Tokens master table
create table if not exists public.tokens (
  mint text primary key,
  kind token_kind not null,
  name text not null,
  symbol text not null,
  creator_wallet text,         -- for filtered
  dev_handle text,             -- for verified
  created_at timestamptz not null default now()
);

create index if not exists tokens_kind_created_idx
  on public.tokens (kind, created_at desc);

-- Latest/cached stats snapshots (we'll update these later via cron)
create table if not exists public.token_snapshots (
  id uuid primary key default gen_random_uuid(),
  mint text not null references public.tokens(mint) on delete cascade,
  price text not null,
  mcap text not null,
  liquidity text not null,
  vol24h text not null,
  age text not null,
  created_at timestamptz not null default now()
);

create index if not exists token_snapshots_mint_created_idx
  on public.token_snapshots (mint, created_at desc);

-- Dev applications (later: payment + social proof)
create table if not exists public.dev_applications (
  id uuid primary key default gen_random_uuid(),
  wallet text not null,
  handle text not null,
  twitter text,
  telegram text,
  verification_code text not null,
  status text not null default 'started', -- started | paid_detected | proof_submitted | approved
  created_at timestamptz not null default now()
);

create index if not exists dev_applications_wallet_idx
  on public.dev_applications (wallet);

-- Public dev profiles (later: approved devs only)
create table if not exists public.dev_profiles (
  handle text primary key,
  wallet text not null,
  twitter text,
  telegram text,
  verification_code text not null,
  joined_at timestamptz not null default now()
);

-- Votes (later: must own token + one per wallet per coin)
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  mint text not null references public.tokens(mint) on delete cascade,
  voter_wallet text not null,
  vote text not null check (vote in ('fire','flag')),
  created_at timestamptz not null default now(),
  unique (mint, voter_wallet)
);

-- Comments (later: must own token + cooldown + max per coin)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  mint text not null references public.tokens(mint) on delete cascade,
  commenter_wallet text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_mint_created_idx
  on public.comments (mint, created_at desc);

-- Watchlist
create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  wallet text not null,
  mint text not null references public.tokens(mint) on delete cascade,
  created_at timestamptz not null default now(),
  unique (wallet, mint)
);
