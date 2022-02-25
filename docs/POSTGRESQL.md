# PostgreSQL setup and conversion notes

The supported database application now uses PostgreSQL and `pg`, not Oracle. No Oracle Client is required. Use a **new local database with fictional records only**. This is an academic/demo application without authentication, not a production donation service.

## Prerequisites

- Node.js 22+ and npm.
- PostgreSQL 17 (the tested major version); a local account allowed to create a database and its schema.
- The existing listing templates and static assets included in this checkout.

## Start a database-backed demo

With PostgreSQL running locally and `createdb` configured for your local account:

```sh
createdb badhon_demo
# Replace username/host/port as appropriate for your existing local installation.
export DATABASE_URL='postgresql://YOUR_LOCAL_ROLE@127.0.0.1:5432/badhon_demo'
npm ci --ignore-scripts
npm run db:setup
npm run db:seed
npm start
```

If your server requires a password, supply it privately using your normal local PostgreSQL configuration or environment. Do not paste a real credential into a committed file. The application reads `DATABASE_URL` directly and does not load `.env` files automatically. URLs containing special characters in credentials require proper URL encoding. Do not disable TLS verification for a remote server.

Open http://127.0.0.1:3000/home. The root page points to the unfinished login page; **login/registration intentionally return 501**. Navigate directly to `/home` for the local database demo. The server binds only to localhost. `PORT` changes the HTTP port.

### What to try

- `/donor`: add a **fictional** donor with a positive numeric ID, a valid date of birth, blood group, last donation date, and sample contact/location text.
- `/donorlist`: see persisted donors.
- `/search` via the interface: filter by blood group.
- `/updatedonor`: update the last-donation date for an existing ID; absent IDs return 404.
- `/bloodbank` and `/showbloodbank`: insert and list inventory.
- `/request` and `/showreq`: insert and list fictional requests.

Duplicate keys return 409; invalid date/numeric/check-constraint inputs return 400. Unexpected database failures return a generic 500 response. The server does not echo raw database errors, connection URLs, or donor records into logs.

## Database structure

`database/schema.sql` creates the `badhon` schema and only the three tables used by the implemented workflows:

| Table | Key | Main fields |
| --- | --- | --- |
| `donor` | `donor_id` | name, birth date, blood group, last-donation date, sample contact/location |
| `blood_bank` | `(blood_bank_id, blood_group)` | bank name, blood group, nonnegative amount |
| `request` | generated `request_id` | requester, location, hospital, sample contact, blood group |

All eight ABO/Rh labels are supported, including `AB+` and `AB-`. Date columns use PostgreSQL `date`; the client keeps their values as date-only strings to avoid timezone conversion. Primary keys and checks enforce basic identity, blood-group, and inventory constraints.

`npm run db:setup` creates missing objects, without DROP statements. It is **not a general upgrade migration** for an arbitrary existing schema. `npm run db:seed` also adds two clearly synthetic fixtures, using conflict handling so repeated seeds do not duplicate them. It never imports historical exports, creates account rows, or overwrites existing fixture IDs.

## Run the real integration suite

Use a fresh disposable database for **each run**:

```sh
createdb badhon_test_run1
export DATABASE_URL='postgresql://YOUR_LOCAL_ROLE@127.0.0.1:5432/badhon_test_run1'
npm run test:integration
```

The test refuses database names outside `badhon_test_<suffix>` and refuses a database that already contains a `badhon` schema. It creates the schema and synthetic records, exercises the actual Express routes over HTTP against PostgreSQL, and leaves the test database intact for inspection. It does not drop data. For another run create a new disposable database name.

The database-free checks remain available:

```sh
npm test
(cd demo && npm ci --ignore-scripts && npm test)
```

## What changed from Oracle

- Replaced the `oracledb` dependency with a pinned `pg` driver and a bounded, lazily created connection pool.
- Converted Oracle `:1` binds to native PostgreSQL `$1` parameters; no string interpolation of form values into SQL.
- Converted `TO_DATE` expressions to typed PostgreSQL date parameters.
- Updated result mappings to PostgreSQL lowercase column names and `rowCount`.
- Replaced the diagnostic DUAL query with `SELECT 1 AS ok`; `oracleCon.js` remains only as a compatibility alias to the PostgreSQL health helper.
- Wrote a fresh PostgreSQL schema and fictional fixture set from the implemented route requirements, rather than translating/re-publishing a historical data dump.

Original Oracle exports, if present, are preserved unchanged for provenance, not consumed by any application/setup/test command. Review their privacy before distributing them. This conversion does not claim to migrate historical records, unused tables, triggers, or Oracle-specific procedures.

## Remaining limits

Authentication/authorization, complete business-rule validation, CSRF/rate-limiting protections, production TLS/secrets handling, backups, and deployment hardening remain future work. Do not expose the service publicly or use real donor/patient data. Tests establish local workflow behavior, not healthcare suitability or production security.
