import { index, mysqlTable as table } from 'drizzle-orm/mysql-core';

export const positions = table(
  'positions',
  (d) => ({
    id: d.bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    userId: d.varchar('user_id', { length: 256 }).notNull(),
    name: d.varchar('name', { length: 256 }).notNull(),
    wage: d.float('wage').notNull(),
  }),
  (t) => [index('wage_idx').on(t.wage)],
);

export const jobs = table(
  'jobs',
  (d) => ({
    id: d.bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    userId: d.varchar('user_id', { length: 256 }).notNull(),
    location: d.varchar('location', { length: 256 }).notNull(),
    event: d.varchar('event', { length: 256 }),
    date: d.date('date').notNull(),
    hours: d.float('hours').notNull(),
    positionId: d
      .bigint('position_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => positions.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
  }),
  (t) => [index('by_wage_idx').on(t.positionId)],
);

export const expenses = table(
  'expenses',
  (d) => ({
    id: d.bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    userId: d.varchar('user_id', { length: 256 }).notNull(),
    name: d.varchar('name', { length: 256 }).notNull(),
    amount: d.float('amount').notNull(),
    date: d.date('date').notNull(),
  }),
  (t) => [index('by_user_idx').on(t.userId)],
);

export const userPreferences = table('user_preferences', (d) => ({
  userId: d.varchar('user_id', { length: 256 }).primaryKey(),
  currency: d.varchar('currency', { length: 16 }).notNull(),
  locale: d.varchar('locale', { length: 16 }).notNull(),
  precision: d.int('precision').notNull(),
}));
