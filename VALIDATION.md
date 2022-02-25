# Validation after PostgreSQL conversion

## Verified

Runtime: Node.js 24.22.1, npm 11.9.0, `pg` 8.23.1. Real database: PostgreSQL 17.12 from official Debian packages, run temporarily with a small bounded configuration and localhost-only listening. No Oracle Client, mock SQL engine, paid service, or historical donor export was used.

| Suite | Result | Scope |
| --- | --- | --- |
| Root `npm test` | **19 passed** | HTTP route handling with a fake database, binding, validation, failures, disabled authentication, safe connectivity helper |
| `cd demo && npm test` | **13 passed** | Synthetic read-only UI, search/empty results, errors, concurrent parameter isolation, and pool delegation |
| `npm run test:integration` | **9 passed** | Real PostgreSQL + Express HTTP workflows listed below |

### Real PostgreSQL coverage

1. Create donor, verify persisted data, render listing, filter exact blood group, update and read back date.
2. Create/list inventory, including three-character AB blood groups.
3. Create/list a blood request and verify persisted row count.
4. Reject duplicate donor IDs, invalid calendar dates, unsupported blood groups, and negative inventory.
5. Treat injection-shaped search text as a bound value; verify table contents remain intact.
6. Preserve distinct values across concurrent donor writes.
7. Keep login and registration explicitly unavailable (501).
8. Return 404 when updating a nonexistent donor.
9. Apply fictional seeds twice without duplicate rows or account tables.

Each repository was tested against its own fresh disposable database. The integration suite refuses pre-existing `badhon` schemas and non-test database names, and does not drop data. The first attempt placed server startup and tests in separate command lifetimes, causing connection refusal; running the temporary server and tests together resolved that environmental issue.

## Setup/startup smoke check

Both repositories also passed a clean `npm ci --ignore-scripts`, the actual `npm run db:setup` command, two successive `npm run db:seed` commands, and startup of `app.js` against a separate real PostgreSQL database. An HTTP request to `/donorlist` rendered the persisted synthetic seed, with database row counts confirming that repeated seeding did not duplicate records. The temporary server was then stopped.

## Conversion scope

Oracle binds/result conventions/date expressions were converted to PostgreSQL; `oracledb` was removed from runtime dependencies. New SQL defines only donor, blood-bank, and request tables needed by the implemented routes. Original historical exports remain unchanged, unused, and unimported. Authentication tables and unrelated legacy schema objects were deliberately not migrated.

No account records or secrets are logged by the connectivity helper. Request/database errors use generic messages rather than printing record-bearing server diagnostics. Date-only PostgreSQL values remain strings rather than timezone-shifted JavaScript dates.

## Unverified / not claimed

- No production deployment, authentication/authorization, full security certification, migration of historical records, or healthcare suitability.
- No browser visual verification or screenshots. Chromium screenshot capture failed with host socket restrictions, and the separate browser could not reach localhost.
- No Docker execution: Docker/Podman are unavailable. Bubblewrap namespace setup was denied. Tests used separate processes and disposable PostgreSQL databases in the cloud workspace, not container-level isolation.
- Existing historical root dependency deprecation warnings remain. The earlier read-only demo dependency audit reported zero known findings at that preparation step; that is not a security audit of the full app.

See [PostgreSQL setup](docs/POSTGRESQL.md) for repeatable commands and the explicit fresh-database safeguards.
