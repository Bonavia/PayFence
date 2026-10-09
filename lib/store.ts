import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { seed, type State } from './model.ts';

// Reuse connections across development hot reloads.
const connections = globalThis as typeof globalThis & {
  payfenceDatabases?: Map<string, DatabaseSync>;
};

export function db() {
  const filename = resolve(process.env.PAYFENCE_DB_PATH || '.data/payfence.sqlite');
  const databases = connections.payfenceDatabases ??= new Map();
  let database = databases.get(filename);
  if (!database) {
    mkdirSync(dirname(filename), { recursive: true });
    database = new DatabaseSync(filename);
    database.exec(`
      PRAGMA busy_timeout = 5000;
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS workspaces (
        id TEXT PRIMARY KEY, version INTEGER NOT NULL DEFAULT 0, data TEXT NOT NULL
      );
    `);
    databases.set(filename, database);
  }
  return database;
}

export async function read(id: string) {
  const database = db();
  database.prepare('INSERT OR IGNORE INTO workspaces (id,version,data) VALUES (?,0,?)')
    .run(id, JSON.stringify(seed()));
  const row = database.prepare('SELECT version,data FROM workspaces WHERE id=?').get(id);
  if (!row) throw new Error('Workspace unavailable');
  return { version: Number(row.version), state: JSON.parse(String(row.data)) as State };
}

export async function write(id: string, version: number, state: State) {
  const result = db().prepare('UPDATE workspaces SET data=?,version=version+1 WHERE id=? AND version=?')
    .run(JSON.stringify(state), id, version);
  if (!result.changes) throw new Error('Workspace changed in another tab. Refresh and try again.');
}
