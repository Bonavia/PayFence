import { env } from 'cloudflare:workers';
import { seed, type State } from './model';
export function db(){const binding=(env as unknown as {DB:D1Database}).DB;if(!binding)throw new Error('Storage unavailable');return binding;}
export async function read(id:string){ await db().prepare('INSERT OR IGNORE INTO workspaces (id,version,data) VALUES (?,0,?)').bind(id,JSON.stringify(seed())).run();const row=await db().prepare('SELECT version,data FROM workspaces WHERE id=?').bind(id).first<{version:number;data:string}>();if(!row)throw new Error('Workspace unavailable');return {version:row.version,state:JSON.parse(row.data) as State};}
export async function write(id:string,version:number,state:State){const r=await db().prepare('UPDATE workspaces SET data=?,version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(state),id,version).run();if(!r.meta.changes)throw new Error('Workspace changed in another tab. Refresh and try again.');}
