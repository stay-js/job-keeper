# Adatbázis

## Előkészületek

- `.env.example` fájlban találhatóak a szükséges környezeti változók. Amennyiben nem az alapértelmezett értékekre van szükség, ezt a fájlt le kell másolni és átnevezni `.env`-re, majd felülírni a szükséges értékeket.

## Futtatás

```bash
bash start.sh
```

### Első indítás esetén

- Táblák létrehozása a `Drizzle` schema alapján:

```bash
cd ../web
# projekt futtatásához szükséges előészületek után:
pnpm db:push

# amennyiben nincs pnpm telepítve
# npm run db:push
```

## Leállítás

```bash
docker compose down
```

## MySQL elérése

- Host: `localhost`
- Port: `3306`
- Felhasználónév: a `.env` fájlban megadott `MYSQL_USER` érték
- Jelszó: a `.env` fájlban megadott `MYSQL_PASSWORD` érték
- Adatbázis: a `.env` fájlban megadott `MYSQL_DATABASE` érték

## PHPMyAdmin elérése

- URL: <http://localhost:8080>
- Szerver: üresen hagyható, amennyiben az `.env` fájlban meg van adva a `PMA_HOST` érték
- Felhasználónév: a `.env` fájlban megadott `MYSQL_USER` érték
- Jelszó: a `.env` fájlban megadott `MYSQL_PASSWORD` érték
