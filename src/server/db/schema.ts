import {
  bigint,
  float,
  index,
  mysqlTableCreator,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const createTable = mysqlTableCreator((name) => name);

export const positions = createTable(
  'wages',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 256 }).notNull(),
    wage: smallint('wage').notNull(),
  },
  (item) => ({
    wageIndex: index('wage_idx').on(item.wage),
  }),
);

export const jobs = createTable(
  'jobs',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    location: varchar('location', { length: 256 }),
    event: varchar('event', { length: 256 }),
    date: timestamp('date').notNull(),
    hours: float('hours').notNull(),
    wageId: bigint('wage_id', { mode: 'number' })
      .notNull()
      .references(() => positions.id, { onDelete: 'no action' }),
  },
  (item) => ({
    nameIndex: index('by_wage_idx').on(item.wageId),
  }),
);
