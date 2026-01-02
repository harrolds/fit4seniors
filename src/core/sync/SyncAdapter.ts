export interface SyncAdapter {
  pull(userId: string): Promise<void>;
  push(userId: string): Promise<void>;
}

