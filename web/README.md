# JobKeeper - Dokumentáció

App elérése: [job-keeper.znagy.hu](https://job-keeper.znagy.hu)

Ugrás a [Felhasználói Dokumentációra](#2-felhasználói-dokumentáció)

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
- **Clerk**: Autentikáció és felhasználókezelés

---

### 1.2. Projekt Struktúra

A projekt főbb könyvtárai és fájljai a következők:

```
web/
├── public/ # Statikus fájlok (képek, ikonok, stb.)
├── src/
│ ├── app/
│ │ ├── api/ # Backend API útvonalak (pl. TRPC endpointok)
│ │ ├── dashboard/ # Felhasználói dashboard és ahhoz tartozó oldalak
│ │ ├── home/ # Landing page és hozzá tartozó komponensek
│ │ ├── privacy-policy/ # Adatvédelmi nyilatkozat
│ │ ├── layout.tsx # Globális oldalelrendezés
│ │ └── page.tsx # Főoldal
│ │
│ ├── components/ # Újrafelhasználható UI-elemek és logikai komponensek
│ │ ├── ui/ # Alacsony szintű felhasználói interfész elemek (gombok, táblázatok, dialógusok)
│ │ └── ... # Magasabb szintű komponensek (pl. jobs-table, position-dialog)
│ │
│ └── contexts/ # React Context-ek (pl. felhasználói beállítások kezelése)
│
├── .env, .env.prod.local, .env-example # Környezeti változók különböző környezetekhez
├── .gitignore # Git által figyelmen kívül hagyott fájlok
├── eslint.config.js # ESLint szabályok
├── next.config.js # Next.js konfiguráció (build, routing, stb.)
├── prettier.config.js # Prettier formázási beállítások
├── postcss.config.cjs # PostCSS konfiguráció a Tailwind CSS-hez
├── tailwind.config.ts # Tailwind CSS testreszabott stílusbeállítások
├── drizzle.config.ts # Drizzle ORM beállítások (adatbázis kapcsolat és migráció)
├── tsconfig.json # TypeScript konfiguráció
├── next-env.d.ts # Next.js típusdefiníciók importálása
├── components.json # ShadCN UI konfiguráció
├── package.json # Projekt metaadatai, scriptek és függőségek
├── pnpm-lock.yaml # PNPM lockfile a pontos verziókhoz
└── README.md # Dokumentáció
```

---

### 1.3. Adatbázis Séma

Az alkalmazás négy fő adatbázis táblát használ:

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

#### 1.3.3. Kiadások (`expenses`)

```typescript
export const expenses = createTable(
  'expenses',
  (d) => ({
    id: d.bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: d.varchar('user_id', { length: 256 }).notNull(),
    name: d.varchar('name', { length: 256 }).notNull(),
    amount: d.float('amount').notNull(),
    date: d.date('date', { mode: 'string' }).notNull(),
  }),
  (t) => [index('by_user_idx').on(t.userId)],
);
```

#### 1.3.4. Felhasználói beállítások (`user_preferences`)

```typescript
export const userPreferences = createTable('user_preferences', (d) => ({
  userId: d.varchar('user_id', { length: 256 }).primaryKey(),
  currency: d.varchar('currency', { length: 16 }).notNull(),
  locale: d.varchar('locale', { length: 16 }).notNull(),
  precision: d.int('precision').notNull(),
}));
```

---

### 1.4. Futtatás és Fejlesztés

#### 1.4.1. Előkészületek

- `.env-example` fájlban találhatóak a szükséges környezeti változók. Ezt a fájlt át kell nevezni `.env`-re.
  - `DATABASE_URL` felülírása amennyiben a hostolt adatbázist szeretnénk használni.
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` és `CLERK_SECRET_KEY` felülírása a saját Clerk kulcsainkkal.
- Amennyiben még nincs, Node.js telepítése: [https://nodejs.org/](https://nodejs.org/)
- Amennyiben még nincs, pnpm telepítése (opcionális lépes): `npm install -g pnpm`
- Függőségek telepítése: `pnpm install` vagy `npm install`

#### 1.4.2. Dev szerver futtatása

```bash
pnpm dev

# amennyiben nincs pnpm telepítve
# npm run dev
```

#### 1.4.3. Buildelés és futtatás

```bash
pnpm build
pnpm start

# amennyiben nincs pnpm telepítve
# npm run build
# npm run start
```

## 2. Felhasználói Dokumentáció

Üdvözlünk a JobKeeperben! Ez az útmutató segít neked abban, hogy a legtöbbet hozd ki az alkalmazásból. A JobKeeper célja, hogy egyszerűsítse a munkáid, a ledolgozott óráid és a bevételeid nyomon követését.

### 📋 Tartalomjegyzék

1. [Első Lépések: Az Első Belépés](#21-első-lépések-az-első-belépés)
2. [Az Alapok: Pozíciók, Munkák és Kiadások](#22-az-alapok-pozíciók-munkák-és-kiadások)
3. [Pozíciók Kezelése](#23-pozíciók-kezelése)
4. [Munkák (Jobs) Kezelése](#24-munkák-jobs-kezelése)
5. [Kiadások (Expenses) Kezelése](#25-kiadások-expenses-kezelése)
6. [Profilbeállítások Módosítása](#26-profilbeállítások-módosítása)

---

### 2.1. Első Lépések: Az Első Belépés

Amikor először lépsz be a JobKeeper fiókodba, az alkalmazás megkér, hogy állítsd be a személyes preferenciáidat. Ezek a beállítások biztosítják, hogy az adatok a számodra legmegfelelőbb formátumban jelenjenek meg.

#### Ezeket az adatokat kell megadnod:

**Dátum- és Időformátum (Locale):** Itt választhatod ki a régiódat (pl. Magyarország, `hu` / `hu-HU`). Ez határozza meg, hogy a dátumok és számok milyen formátumban jelennek meg.

- **Például:** A magyar (`hu`) beállítás esetén a dátum `2023. 12. 24.` formátumú lesz, míg az amerikai angol (`en-US`) esetén `12/24/2023`.

**Pénznem (Currency):** Válaszd ki azt a pénznemet, amelyben a fizetésedet kapod (pl. `HUF`, `EUR`, `USD`). Az alkalmazás ebben a pénznemben fogja megjeleníteni az órabéreket és a teljes keresetet.

**Kerekítés (Precision):** Itt adhatod meg, hogy a pénzösszegek (órabéred, fizetésed) hány tizedesjegy pontossággal jelenjenek meg.

Opciók:

- **0:** Nincs tizedesjegy (pl. €8).
- **1:** Egy tizedesjegy (pl. €7.5).
- **2:** Két tizedesjegy (pl. €6.25).

> 💡 **Tipp:** Ezeket a beállításokat később bármikor módosíthatod a profilodban.

---

### 2.2. Az Alapok: Pozíciók, Munkák és Kiadások

Az alkalmazás három fő fogalom köré épül: **Pozíciók (Positions)**, **Munkák (Jobs)** és **Kiadások (Expenses)**.

**Pozíció (Position):** Ez egy általános munkakör, amihez egy adott órabér tartozik. Például: "Pincér", "Grafikus", "Futár".

**Munka (Job):** Ez egy konkrét, elvégzett munkaalkalom vagy műszak. Egy munkához mindig tartozik egy dátum, helyszín és a ledolgozott órák száma. Minden munkát egy már létező pozícióhoz kell hozzárendelned.

> ⚠️ **FONTOS:** Mielőtt rögzítenél egy munkát (Job), létre kell hoznod legalább egy pozíciót. A rendszer nem is engedi másképp, a munkák felvételénél csak a már meglévő pozícióid közül választhatsz.

**Kiadás (Expense):** Ez egy olyan költség, ami a fizetésedből hónap végén levonásra kerül. Például: "Diákszövetkezeti tagdíj", "Adóelőleg", "Levonás (mert egy adott munkán nem jelentél meg)".

---

### 2.3. Pozíciók Kezelése

A pozícióidat a **Positions** fülön kezelheted. Itt láthatod az összes eddig létrehozott pozíciódat, a hozzájuk tartozó órabért és az azokban ledolgozott összesített óraszámot.

#### Új pozíció létrehozása

1. Navigálj a **Positions** fülre.
2. Kattints az **Add new** gombra.
3. A felugró ablakban add meg a következőket:
   - **Name:** A pozíció megnevezése (pl. "Rendezvényszervező").
   - **Hourly Wage:** Az ehhez a pozícióhoz tartozó órabér. (>0)
4. Kattints a **Save changes** gombra a mentéshez.

#### Pozíció szerkesztése és törlése

**Szerkesztés:** Kattints a táblázatban a szerkeszteni kívánt pozíció sorára. A felugró ablakban módosíthatod a megnevezést vagy az órabért.

**Törlés:** Egy pozíciót csak akkor tudsz törölni, ha még egyetlen munkát (Job) sem rögzítettél hozzá. Ha a pozíció törölhető, a szerkesztő ablakban megjelenik a **Delete** gomb.

---

### 2.4. Munkák (Jobs) Kezelése

Az elvégzett munkáidat a **Jobs** fülön rögzítheted és tekintheted meg. A felület alapértelmezetten az aktuális havi munkáidat mutatja.

- **Navigáció a hónapok között:** A dátum feletti `<` és `>` nyilakkal tudsz váltani az előző és a következő hónap között.
- **Havi összegzés:** A táblázat alján láthatod az adott hónapban ledolgozott órák és a teljes kereset összegzését, pozíciónként lebontva is.

#### Új munka hozzáadása

1. Navigálj a **Jobs** fülre.
2. Kattints az **Add new** gombra.
3. A felugró ablakban töltsd ki a mezőket:
   - **Date:** A munka dátuma.
   - **Location:** A munka helyszíne.
   - **Event:** Az esemény vagy feladat rövid leírása (pl. "Céges karácsony", "Logótervezés") - opcionális.
   - **Position:** A legördülő listából válaszd ki azt a pozíciót, amelyben a munkát végezted. _(Ezért kell először pozíciót létrehozni!)_
   - **Hours:** A ledolgozott órák száma. (tört óra esetén, .-al vagy ,-vel elválastva, >0; <=24)
4. Kattints a **Save changes** gombra.

#### Munka szerkesztése és törlése

Kattints a táblázatban a módosítani vagy törölni kívánt munka sorára. A felugró ablakban módosíthatod az adatokat, vagy a **Delete** gombbal véglegesen törölheted a bejegyzést.

---

### 2.5. Kiadások (Expenses) Kezelése

A kiadásaidat is a **Jobs** fülön rögzítheted és tekintheted meg. A kiadások a havi összesítésben levonásra kerülnek a teljes keresetből.

#### Új kiadás hozzáadása

1. Navigálj a **Jobs** fülre.
2. Kattints az **Add expense** gombra.
3. A felugró ablakban töltsd ki a mezőket:
   - **Name:** A kiadás megnevezése (pl. "Diákszövetkezeti tagdíj").
   - **Amount:** A kiadás összege. (>0)
4. Kattints a **Save changes** gombra.

#### Kiadás szerkesztése és törlése

Kattints a táblázatban a módosítani vagy törölni kívánt kiadás sorára. A felugró ablakban módosíthatod az adatokat, vagy a **Delete** gombbal véglegesen törölheted a bejegyzést.

### 2.6. Profilbeállítások Módosítása

Ha módosítani szeretnéd a dátumformátumot, a pénznemet vagy a kerekítési beállításokat, azt egyszerűen megteheted a profilodban.

1. Kattints a jobb felső sarokban található profil ikonra.
2. A lenyíló menüben válaszd az **Update Locale & Currency** opciót.
3. A felugró ablakban módosíthatod a kívánt beállításokat, majd a **Save changes** gombra kattintva mentheted a változtatásokat.

---

### 🎉 Készen állsz!

Most már minden eszköz a kezedben van ahhoz, hogy hatékonyan kövesd a munkáidat és bevételeidet a JobKeeper segítségével. Kellemes használatot!
