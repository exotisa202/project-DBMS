# Development guide

## Choose an entry point

- **Database-free UI preview:** `cd demo && npm ci --ignore-scripts && npm start`. Fictional, read-only; no PostgreSQL connection.
- **Database-backed local coursework app:** follow [PostgreSQL setup](POSTGRESQL.md), run `npm ci --ignore-scripts`, `npm run db:setup`, optionally `npm run db:seed`, then `npm start`. The supported runtime is now PostgreSQL.

The application preserves the existing Express/EJS interface and static assets. Some fonts/icons may still rely on external CDNs. No browser screenshot or visual-verification claim is made.

## Tests

```sh
npm test
(cd demo && npm ci --ignore-scripts && npm test)
# Requires a fresh, deliberately disposable PostgreSQL database:
npm run test:integration
```

See [PostgreSQL test instructions](POSTGRESQL.md#run-the-real-integration-suite) and [validation report](../VALIDATION.md). Unit tests stub the database; integration tests use the real PostgreSQL driver/server.

## Optional container recipe

```sh
docker build -f demo/Dockerfile -t badhon-demo-test .
docker run --rm --network none badhon-demo-test
```

This recipe runs the database-free preview/helper tests, not the PostgreSQL integration tests. Docker was unavailable during preparation; the recipe was not run. Actual PostgreSQL integration used a temporary local PostgreSQL server with synthetic data and localhost-only listening.

## Attribution and branches

The original Badhon README credited `@exotisa202` and identified BUET CSE 216 Level 2 Term 2 coursework. Original package/tutorial attribution is preserved. The project overlaps with the other Badhon/DBMS repository in the account; clarify the canonical repository and team contributions before presenting both independently.

Original application code was on `master`, while `main` contained a placeholder. Work remains on a separate preparation branch; repository defaults and remote history have not changed. Original historical database exports, where present, are not used or altered by the conversion. No historical records or account secrets were imported into tests.

New commit metadata retains the prior tip timestamp at the owner's request. The preparation/conversion additions were made in this modernization pass, not at that historical date.
