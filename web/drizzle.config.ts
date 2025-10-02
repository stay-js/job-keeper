import type { Config } from 'drizzle-kit';
import { env } from '~/env';

const config = {
  schema: './src/server/db/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;

export default config;
