# Next.js TesloShop

To run locally, the database is needed

```
docker-compose up -d
```

* The -d, means __detached__

* Local Mongo URL

```
mongodb://localhost:27017/teslodb
```

## To configure environment variables

Rename file: __.env.template__ to __.env__

## Calling up database with test information

Call:
```http://localhost:3000/api/seed```
