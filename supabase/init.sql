-- 1) Drops table
create table if not exists public.drops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 5000),
  link text,
  tag text check (char_length(tag) <= 24),
  tag_color text,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists drops_user_created_idx
  on public.drops (user_id, created_at desc);
create index if not exists drops_user_tag_idx
  on public.drops (user_id, tag);

-- 2) Enable Row Level Security
alter table public.drops enable row level security;

-- 3) RLS policies — each user can only see/manage their own drops
create policy "Users can read their own drops"
  on public.drops for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own drops"
  on public.drops for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own drops"
  on public.drops for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own drops"
  on public.drops for delete
  to authenticated
  using (auth.uid() = user_id);


create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$ begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
 $$;

revoke all on function public.delete_my accountability() from public, anon;
grant execute on function public.delete_my_account() to authenticated;