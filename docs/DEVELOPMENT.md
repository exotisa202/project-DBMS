# Badhon: blood-donation database coursework

An academic Express/EJS interface for donor records, blood-bank inventory, blood requests, and Oracle-backed forms. This repository preserves the original implementation and adds a separately runnable **synthetic, read-only UI demo**, not a production blood-donation service.

## Run the safe demo

Requires Node.js 22 or newer and npm. No Oracle database, account, or native Oracle client is needed.

```sh
cd demo  # from the prepared repository checkout
npm ci
npm test
npm start
```

Open http://127.0.0.1:3000. Set `PORT=3001 npm start` if the port is occupied. Stop with Ctrl+C. The demo binds only to localhost.

### Interview walkthrough

1. Open the demo landing page and explain that all displayed records are fictional.
2. Show the donor directory and filter by A+ or O+; AB- demonstrates an empty result.
3. Show sample blood-bank inventory and blood requests.
4. Explain the original Express routes, EJS views, and Oracle query flow.
5. Discuss the limitations below rather than claiming completed authentication or production readiness.

The demo reuses the existing EJS listing templates. It never loads legacy route modules or connects to Oracle. It has no login, writes, or persistence; non-demo forms are deliberately disabled. CSS fonts/icons may depend on external CDNs. HTTP tests verify rendering and behavior, not visual screenshots.

## Repository layout

- `app.js`, `routes/`, `util/`: original Oracle-backed application, with environment-based connection configuration and localhost binding.
- `views/`, `public/`: original templates, styles, and images.
- `demo/`: isolated preview and automated HTTP smoke tests.

**Branch note:** the original application was on `master`; `main` contained only a placeholder README. This work branch is based on `master`. Repository defaults were not changed.

## Original Oracle application (not validated end-to-end)

The root `package.json` uses `oracledb` 5.x, which requires compatible Oracle Client libraries, in addition to a running Oracle database and Node version supported by that driver. The safe demo uses its own dependency lockfile and does not install this legacy driver.

For local integration work, use a disposable database with a `BADHON` schema because route SQL explicitly references that schema. Set `DB_USER`, `DB_PASSWORD`, and `DB_CONNECT_STRING` in your shell; `DB_CONNECT_STRING` is an Oracle Easy Connect string such as `localhost:1521/service_name`. No `.env` loader is included. Never commit credentials. Then install the root dependencies with `npm ci` and use `npm run start-server`.

The legacy database paths are **not demo-ready** without additional work. Do not use real donor information or expose this server publicly.

## Known limitations / next work

- Login and registration now return HTTP 501: the historical implementation did not authenticate and stored plaintext passwords. Secure authentication is not implemented.
- Database routes now use request-local inputs, awaited writes, parameter binding, connection cleanup, and centralized error handling. These changes are unit/syntax checked, not Oracle integration verified.
- Authorization, input validation, secure password storage, and integration tests need implementation before deployment.
- Database date handling and schema compatibility need testing against a disposable Oracle instance.
- The legacy dependency tree has not been upgraded or certified secure.
- Historical data exports, where present, may contain contact details or plaintext account records. Do not load, distribute, or use them in a portfolio demo. Review privacy and permissions with the owner; this change does not rewrite history or remove original data.

## Attribution and validation

The original Badhon README credited `@exotisa202` and identified this as BUET CSE 216 Level 2 Term 2 coursework. Existing source history and package attribution are preserved, including tutorial-derived metadata. Verify individual/team contributions and permission to publish coursework before using this as an individual portfolio claim. This repository substantially overlaps with the other Badhon/DBMS repository in the same account; it should not be presented as an independent second project without clarification.

The synthetic preview is tested independently of Oracle using Node's test runner. Passing its tests does **not** validate the original database routes, authentication, or Oracle deployment.

## Reproducible checks

```sh
# Synthetic legacy route tests; no Oracle calls are made:
npm ci --ignore-scripts
npm test
# Standalone synthetic UI and helper tests:
cd demo && npm ci --ignore-scripts && npm test
# Optional container test from repository root:
docker build -f demo/Dockerfile -t badhon-demo-test .
docker run --rm --network none badhon-demo-test
```

Docker is not installed in the preparation environment; the container recipe has not been executed. A bubblewrap network-isolation attempt was denied by the host. Tests ran as separate Node processes in the cloud workspace, using localhost ephemeral ports and synthetic records; this is not a claim of Docker-level isolation. Oracle integration is still blocked by the missing server/client. The legacy route suite substitutes a fake database and validates request handling only.

Modernization note: this preparation pass adds reproducibility and safety scaffolding without rewriting the original project history. New commit metadata retains the repository's previous tip timestamp at the owner's request; it is not evidence that these additions existed at that historical date.
