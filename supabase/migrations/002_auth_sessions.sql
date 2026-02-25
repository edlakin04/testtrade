create table if not exists public.auth_sessions (
  id uuid primary key default gen_random_uuid(),
  wallet text not null,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists auth_sessions_wallet_idx
  on public.auth_sessions (wallet);

create index if not exists auth_sessions_expires_idx
  on public.auth_sessions (expires_at);
