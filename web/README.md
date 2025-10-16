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

Üdvözlünk a JobKeeperben! Ez az útmutató segít neked abban, hogy a legtöbbet hozd ki az alkalmazásból. A JobKeeper célja, hogy egyszerűsítse a munkáid, a ledolgozott óráid és a bevételeid nyomon követését.

## 📋 Tartalomjegyzék

1. [Első Lépések: Az Első Belépés](#1-első-lépések-az-első-belépés)
2. [Az Alapok: Pozíciók és Munkák](#2-az-alapok-pozíciók-és-munkák-jobs)
3. [Pozíciók Kezelése](#3-pozíciók-kezelése)
4. [Munkák (Jobs) Kezelése](#4-munkák-jobs-kezelése)
5. [Profilbeállítások Módosítása](#5-profilbeállítások-módosítása)

---

## 2.1. Első Lépések: Az Első Belépés

Amikor először lépsz be a JobKeeper fiókodba, az alkalmazás felkér, hogy állítsd be a személyes preferenciáidat. Ezek a beállítások biztosítják, hogy az adatok a számodra legmegfelelőbb formátumban jelenjenek meg.

### Ezeket az adatokat kell megadnod:

**Dátum- és Időformátum (Locale):** Itt választhatod ki a régiódat (pl. Magyarország, hu). Ez határozza meg, hogy a dátumok és számok milyen formátumban jelennek meg.
- **Például:** A magyar (hu) beállítás esetén a dátum `2023. 12. 24.` formátumú lesz, míg az amerikai angol (en-US) esetén `12/24/2023`.

**Pénznem (Currency):** Válaszd ki azt a pénznemet, amelyben a fizetésedet kapod (pl. HUF, EUR, USD). Az alkalmazás ebben a pénznemben fogja megjeleníteni az órabéreket és a teljes keresetet.

**Kerekítés (Precision):** Itt adhatod meg, hogy a számok (például a ledolgozott órák) hány tizedesjegy pontossággal jelenjenek meg.

Opciók:
- **0:** Nincs tizedesjegy (pl. 8 óra).
- **1:** Egy tizedesjegy (pl. 7,5 óra).
- **2:** Két tizedesjegy (pl. 6,25 óra).

> 💡 **Tipp:** Ezeket a beállításokat később bármikor módosíthatod a profilodban.

---

## 2.2. Az Alapok: Pozíciók és Munkák (Jobs)

Az alkalmazás két fő fogalom köré épül: **Pozíciók (Positions)** és **Munkák (Jobs)**.

**Pozíció (Position):** Ez egy általános munkakör, amihez egy adott órabér tartozik. Például: "Pincér", "Grafikus", "Futár". Lényegében ez a *"milyen munkát végzel"* kérdésre a válasz.

**Munka (Job):** Ez egy konkrét, elvégzett munkaalkalom vagy műszak. Egy munkához mindig tartozik egy dátum, helyszín és a ledolgozott órák száma. Minden munkát egy már létező pozícióhoz kell hozzárendelned.

> ⚠️ **FONTOS:** Mielőtt rögzítenél egy munkát (Job), létre kell hoznod legalább egy pozíciót. A rendszer nem is engedi másképp, a munkák felvételénél csak a már meglévő pozícióid közül választhatsz.

---

## 2.3. Pozíciók Kezelése

A pozícióidat a **Positions** fülön kezelheted. Itt láthatod az összes eddig létrehozott pozíciódat, a hozzájuk tartozó órabért és az azokban ledolgozott összesített óraszámot.

### Új pozíció létrehozása

1. Navigálj a **Positions** fülre.
2. Kattints az **Add new** gombra.
3. A felugró ablakban add meg a következőket:
   - **Name:** A pozíció neve (pl. "Rendezvényszervező").
   - **Hourly Wage:** Az ehhez a pozícióhoz tartozó órabér.
4. Kattints a **Save changes** gombra a mentéshez.

### Pozíció szerkesztése és törlése

**Szerkesztés:** Kattints a táblázatban a szerkeszteni kívánt pozíció sorára. A felugró ablakban módosíthatod a nevet vagy az órabért.

**Törlés:** Egy pozíciót csak akkor tudsz törölni, ha még egyetlen munkát (Job) sem rögzítettél hozzá. Ha a pozíció törölhető, a szerkesztő ablakban megjelenik a **Delete** gomb.

---

## 2.4. Munkák (Jobs) Kezelése

Az elvégzett munkáidat a **Jobs** fülön rögzítheted és tekintheted meg. A felület alapértelmezetten az aktuális havi munkáidat mutatja.

- **Navigáció a hónapok között:** A dátum feletti `<` és `>` nyilakkal tudsz váltani az előző és a következő hónap között.
- **Havi összegzés:** A táblázat alján láthatod az adott hónapban ledolgozott órák és a teljes kereset összegzését, pozíciónként lebontva is.

### Új munka hozzáadása

1. Navigálj a **Jobs** fülre.
2. Kattints az **Add new** gombra.
3. A felugró ablakban töltsd ki a mezőket:
   - **Date:** A munka dátuma.
   - **Location:** A munka helyszíne.
   - **Event:** Az esemény vagy feladat rövid leírása (pl. "Céges karácsony", "Logótervezés").
   - **Position:** A legördülő listából válaszd ki azt a pozíciót, amelyben a munkát végezted. *(Ezért kell először pozíciót létrehozni!)*
   - **Hours:** A ledolgozott órák száma.
4. Kattints a **Save changes** gombra.

### Munka szerkesztése és törlése

Kattints a táblázatban a módosítani vagy törölni kívánt munka sorára. A felugró ablakban módosíthatod az adatokat, vagy a **Delete** gombbal véglegesen törölheted a bejegyzést.

---

## 2.5. Profilbeállítások Módosítása

Ha módosítani szeretnéd a dátumformátumot, a pénznemet vagy a kerekítési beállításokat, azt egyszerűen megteheted a profilodban.

1. Kattints a jobb felső sarokban található profil ikonodra.
2. A lenyíló menüben válaszd az **Update Locale & Currency** opciót.
3. A felugró ablakban módosíthatod a kívánt beállításokat, majd a **Save changes** gombra kattintva mentheted a változtatásokat.

---

## 🎉 Készen állsz!

Most már minden eszköz a kezedben van ahhoz, hogy hatékonyan kövesd a munkáidat és bevételeidet a JobKeeper segítségével. Kellemes használatot!