# Playwright E2E tesztek

## Előkészületek

- `.env-example` fájlban találhatóak a szükséges környezeti változók. Ezt a fájlt át kell nevezni `.env`-re. És a váltókat megfelelő értékekre cserélni.
- Amennyiben még nincs, Node.js telepítése: [https://nodejs.org/](https://nodejs.org/)
- Amennyiben még nincs, pnpm telepítése (opcionális lépes): `npm install -g pnpm`
- Függőségek telepítése: `pnpm install` vagy `npm install`

## Futtatás lokális környezetben

### Előkészületek

[Webalkalmazás dokumentáció](../web/README.md) 1.4.1. pontját követve.

PNPM:

```bash
pnpm run test
```

NPM:

```bash
npm run test
```

## Futtatás production környezetben

PNPM:

```bash
pnpm run test:prod
```

NPM:

```bash
npm run test:prod
```

## További futtatási lehetőségek

Megtalálhatóak a `package.json` fájlban a `scripts` szekció alatt.
