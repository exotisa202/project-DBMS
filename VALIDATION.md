# Preparation validation

- Runtime: Node.js 24.22.1, npm 11.9.0.
- `npm ci --ignore-scripts` at repository root completed; historical dependency deprecation warnings remain.
- Root `npm test`: **19 passed**, using an explicitly stubbed database. Exercises nine GET routes, four parameterized write routes, invalid input, simulated database failure, search binding, disabled incomplete authentication, and a safe connectivity helper that queries only Oracle DUAL.
- `cd demo && npm ci --ignore-scripts && npm test`: **13 passed**. Exercises synthetic page rendering/search, health, empty result, rejected writes, 404, connection cleanup/error, concurrent bind isolation, and required-string validation.
- `npm audit --omit=dev` in `demo/`: **0 reported vulnerabilities** at preparation time after updating Express within major version 4. This is not a security certification; the historical root dependency tree was not certified.
- Removed inactive login literals and password-reading/logging from `util/oracleCon.js`; it now performs only a non-sensitive DUAL connectivity query and propagates errors without logging account data. The added tests use a fake database, not real Oracle.
- JavaScript syntax checks passed for the edited source files.
- The first route test run caught a root-path calculation bug under the Node test runner; `util/path.js` was fixed and the suite rerun successfully.

## Not validated

No Oracle instance/client was available. Stubbed route tests do not establish schema compatibility, database persistence, transaction behavior under Oracle, or correct date conversion. Login and registration intentionally return HTTP 501 rather than pretending to authenticate or writing plaintext passwords.

No Docker/Podman was available. Bubblewrap network isolation was attempted but denied by host permissions. Tests ran in separate Node processes with localhost ephemeral ports in the cloud workspace. Docker recipes are supplied but were not run. Chromium screenshot capture was attempted, including an escalated retry, but failed at process-singleton socket creation with `Operation not permitted`. No screenshots, browser visual verification, or real donor-data workflows are claimed.
