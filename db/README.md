# Adatbázis

## Előkészületek

- `.env.example` fájlban találhatóak a szükséges környezeti változók. Ezt a fájlt le kell másolni és átnevezni `.env`-re.

## Futtatás lokálisan

```bash
docker compose up -d
```

## Első indítás esetén

- Táblák létrehozása a `Drizzle` schema alapján:

```bash
cd ../web
# projekt futtatásához szükséges előészületek után:
pnpm db:push

# amennyiben nincs pnpm telepítve
# npm run db:push
```

## Hostolt development adatbázis elérése

- Host: `mysql-znagy-gh-znagy-gh.g.aivencloud.com`
- Port: `25828`
