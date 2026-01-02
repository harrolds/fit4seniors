# FG-11b Auth & Sync scaffolding

- Hosted BaaS target: Supabase (magic-link auth).
- Required tables (not migrated here):
  - `user_profile`: primary user row (id/uuid primary key from Supabase auth, email, created_at/updated_at).
  - `activity_log`: per-user activity feed for future sync (id uuid, user_id fk -> user_profile.id, action/type, payload jsonb, created_at).
- SyncAdapter is interface-only for now; enable once backend endpoints or RPCs exist.
- Magic-link redirect uses `/login/callback`; ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in the runtime environment.

