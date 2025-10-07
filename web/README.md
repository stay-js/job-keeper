# JobKeeper - Dokumentáció

## Production app elérése: [job-keeper.znagy.hu](https://job-keeper.znagy.hu) (Clerk is prod módba, prod adatbázissal)

## 1. Fejlesztői Dokumentáció

### 1.1. Projekt Áttekintés

A JobKeeper egy Next.js-alapú webalkalmazás, amely a különböző diákmunkákből származó jövedelmek összegzésére, rendszerezésére szolgál.

A projekt a Next.js keretrendszeren alapul, TypeScript nyelven íródott, és a következő főbb technológiákat használja:

- **Next.js**: React keretrendszer szerver oldali renderelési képességekkel
- **Drizzle ORM**: TypeScript alapú ORM adatbázis-kezeléshez
- **Zod**: Séma-validáció
- **React Hook Form**: Űrlapkezelés
- **Tailwind CSS**: CSS keretrendszer
- **Shadcn UI**: UI komponens könyvtár
- **MySQL**: Relációs adatbázis-kezelő rendszer

### 1.2. Projekt Struktúra

TODO

### 1.3. Adatbázis Séma

Az alkalmazás két fő adatbázis táblát használ, egyelőre (TODO felhasználó kezelés):

#### 1.3.1. Pozíciók (`positions`)

```typescript
export const positions = createTable(
  'positions',
  (d) => ({
    id: d.bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: d.varchar('user_id', { length: 256 }).notNull(),
    name: d.varchar('name', { length: 256 }).notNull(),
    wage: d.float('wage').notNull(),
  }),
  (t) => [index('wage_idx').on(t.wage)],
);
```

#### 1.3.2. Munkák (`jobs`)

```typescript
export const jobs = createTable(
  'jobs',
  (d) => ({
    id: d.bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: d.varchar('user_id', { length: 256 }).notNull(),
    location: d.varchar('location', { length: 256 }).notNull(),
    event: d.varchar('event', { length: 256 }),
    date: d.date('date', { mode: 'string' }).notNull(),
    hours: d.float('hours').notNull(),
    positionId: d
      .bigint('position_id', { mode: 'number' })
      .notNull()
      .references(() => positions.id, { onDelete: 'no action' }),
  }),
  (t) => [index('by_wage_idx').on(t.positionId)],
);
```

#### 1.3.3. Felhasználói beállítások (`user_preferences`)

```typescript
export const userPreferences = createTable('user_preferences', (d) => ({
  userId: d.varchar('user_id', { length: 256 }).primaryKey(),
  currency: d.varchar('currency', { length: 16 }).notNull(),
  locale: d.varchar('locale', { length: 16 }).notNull(),
  precision: d.int('precision').notNull(),
}));
```

### 1.4. Futtatás és Fejlesztés

#### 1.4.1. Előkészületek

- `.env-example` fájlban találhatóak a szükséges környezeti változók. Ezt a fájlt át kell nevezni `.env`-re.
  - `DATABASE_URL` felülírása amennyiben a hostolt adatbázist szeretnénk használni.
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` és `CLERK_SECRET_KEY` felülírása a saját Clerk kulcsainkkal.
- Amennyiben még nincs, Node.js telepítése: [https://nodejs.org/](https://nodejs.org/)
- Amennyiben még nincs, pnpm telepítése (opcionális lépes): `npm install -g pnpm`
- Függőségek telepítése: `pnpm install` vagy `npm install`

#### 1.4.2. Dev szerver futtatása

PNPM:

```bash
pnpm dev
```

NPM:

```bash
npm run dev
```

#### 1.4.3. Buildelés és futtatás

PNPM:

```bash
pnpm build
pnpm start
```

NPM:

```bash
npm run build
npm run start
```

## 2. Felhasználói Dokumentáció

TODO
