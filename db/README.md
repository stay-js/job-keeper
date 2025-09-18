# Adatbázis

## Előkészületek

- `.env-example` fájlban találhatóak a szükséges környezeti változók. Ezt a fájlt át kell nevezni `.env`-re.

## Futtatás lokálisan

```bash
docker compose up -d
```

## Első indítás esetén

- Táblák létrehozása a `Drizzle` schema alapján:

```bash
cd ../web
# projekt futtatásához szükséges előészületek után:
pnpm run db:push
# amennyiben nincs pnpm telepítve
# npm run db:push
```

## Hostolt adatbázis elérése

- Host: `mysql-znagy-gh-znagy-gh.g.aivencloud.com`
- Port: `25828`
