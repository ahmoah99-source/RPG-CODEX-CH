import SCHEMA_SQL from './schema';
import SEED_SQL from './seed';

export async function initializeDatabase(db) {
  await db.execAsync(SCHEMA_SQL);
  const { count } = await db.getFirstAsync('SELECT COUNT(*) as count FROM races');
  if (count === 0) {
    await db.execAsync(SEED_SQL);
  }
}
