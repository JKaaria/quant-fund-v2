# Quant Fund V2 public platform

**PAPER TRADING / RESEARCH ONLY**

A static research website consuming only the emitted Publication Layer V1 dataset.
No production packages, broker connection, runtime database or public API are needed.
All financial measurements are presented from the public record; the website does
not calculate portfolio performance. Missing values remain unavailable.

## Local development

Requires Node.js 22 or newer and npm. Dependencies are pinned in the lockfile.

```sh
npm ci
npm run validate
npm test
npm run dev
```

For a production static build and local preview:

```sh
npm run build
npm run preview
```

The preview serves the generated `out/` directory on loopback port 3000 only.
Open the Local URL printed by the preview command. Unknown routes return 404.
No trading system needs to be running. Framework telemetry is disabled by the scripts.

## Public input

The only data opened by the application is its own `public/data/` directory.
The build validates the published JSON Schema, manifest, checksums, exact seven
strategy IDs, CSV/observation agreement and correction references. Public copies
are replaced through a separate one-way transport step; the website never runs
an exporter or asks the private system for data.

## Validation and repository preparation

```sh
npm run build-public-repo
npm run check-export
```

The local repository candidate is written to `exports/quant-fund-v2/`. It is
constructed from an explicit source allowlist in an empty staging directory.
It contains public data, documentation and website source, with no version
history, build cache, installed packages or private research material.
The repository is not initialized or uploaded. Export manifests contain SHA-256
checksums and no generation timestamp, making repeated exports byte-identical.

## Architecture

Retained published artifacts → schema/checksum validation → static pages.

The public record and website are downstream consumers only. A deployment or
website failure cannot change a trading decision or roll back an observation.
There are no trading controls, runtime request handlers or server actions.
Published hashes are deterministic fingerprints, not cryptographic signatures.

## Licensing

- Software: Apache License 2.0.
- Research/methodology/documentation: CC BY-NC-SA 4.0.
- Public performance/observation dataset: CC BY-NC 4.0.
- Third-party material retains its respective rights.
- Quant Fund V2 branding/trademarks are not licensed except as necessary for attribution.

See `licensing/LICENSE.md` and `licensing/NOTICE` for precise scopes and attribution.
Commercial licensing of original research/data may be separately arranged with the
rights holder. Fair dealing and other legal exceptions remain unaffected.

## GitHub Pages deployment

The approved hosting target is GitHub Pages, using only the sanitized public
repository. `.github/workflows/pages.yml` installs locked public dependencies,
validates data, runs tests, exports the static site, checks every route/link/asset,
uploads only `website/out`, and deploys through GitHub's standard Pages action.
It runs on approved main-branch commits and manual dispatch, not pull requests.
Build permissions are contents/read and pages/read; deployment uses pages/write
and id-token/write. No private repository, trading credentials or backend exists.
Actions are pinned to official immutable revisions; checkout retains no credential.

GitHub's Pages configuration supplies `PUBLIC_SITE_ORIGIN` and `PUBLIC_BASE_PATH`
at build time. Internal links, data downloads, icons and framework assets use that
mount path. An empty base path supports a future custom domain after separate
authorization; no domain is configured or purchased by this preparation.
`PUBLIC_REPOSITORY_URL` identifies the verified public source repository.
These values are public metadata, not secrets. Static robots.txt allows indexing;
sitemap.xml enumerates every generated route using the configured public URL.
No analytics or paid hosting is required. The site needs no running process on
the fund machine. A failed Pages build/deployment cannot affect local publication
or fund operation.

For a project-path local build, set the confirmed public origin and mount path
in the build environment, run `npm run build` and `npm run check:static`.
`npm run preview` serves the same mount path on local loopback only.
Default builds without these public values use the root path and do not invent
an Internet origin. Financial values remain solely those in the published data.

Website contributions and issues do not authorize changes to the private trading
system. Daily outward pushes are separate, disabled until implemented and
separately validated; Pages automatically rebuilds after a permitted public commit.
The Internet never pulls from private production. External publication failures
must be retried independently. Protected private files require explicit approval
before any change; this workflow modifies none.
