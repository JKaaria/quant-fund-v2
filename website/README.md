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

## Deployment

Deploy only the sanitized public GitHub repository to Vercel, with root directory
`website`. No production trading credentials are required. Indexing is allowed.
`robots.txt` and `sitemap.xml` are static outputs. The sitemap uses the confirmed
`PUBLIC_SITE_ORIGIN` or Vercel's `VERCEL_PROJECT_PRODUCTION_URL` at build time;
local builds without an assigned address emit no invented URLs.
`PUBLIC_REPOSITORY_URL` may name the confirmed public GitHub repository.
These are public metadata, not credentials. No analytics are enabled.

Website contributions and issues do not authorize changes to the private trading
system. External publication must run separately and cannot block fund operation.
No internet publisher or scheduling change is enabled by this source preparation.
