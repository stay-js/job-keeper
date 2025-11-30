# Playwright E2E tesztek

[Tesztelési jegyzőkönyv](https://docs.google.com/spreadsheets/d/1b-or4NJnWaIDnzoBL1KeDcjVB5-IcsmRzyQjqHdfRU0/edit?usp=sharing)

## Előkészületek

- `.env.example` fájlban találhatóak a szükséges környezeti változók. Ezt a fájlt le kell másolni és átnevezni `.env`-re. Valamint a váltókat megfelelő értékekre cserélni.
- Amennyiben még nincs, Node.js telepítése: <https://nodejs.org/>
- Amennyiben még nincs, pnpm telepítése (opcionális lépes): `npm install -g pnpm`
- Függőségek telepítése: `pnpm install` vagy `npm install`

## Futtatás lokális környezetben

### Előkészületek

[Webalkalmazás dokumentáció](../web/README.md#241-előkészületek) 2.4.1. pontját követve.

```bash
pnpm test

# amennyiben nincs pnpm telepítve
# npm run test
```

## Futtatás production környezetben

```bash
pnpm test:prod

# amennyiben nincs pnpm telepítve
# npm run test:prod
```

## További futtatási lehetőségek

Megtalálhatóak a `package.json` fájlban a `scripts` szekció alatt.
