# Quant Fund V2

**PAPER TRADING / RESEARCH ONLY**

An open quantitative investment research project documenting the prospective performance of a systematic multi-strategy paper portfolio.

## Current public record

Forward inception: 2026-10-22, explicitly LATE_OBSERVATION. There are 2 observations in this dataset. Current NAV and returns are unavailable because authoritative valuations are absent. No artificial performance history is constructed.

Frozen strategies: S001, S031, S051, S076, S111, S122, S128. Their roles and hypotheses are in data/strategies/. S122 retains its documented validation concern. Frozen rules do not establish prospective profitability.

## Methodology

Market Data → Regime Assessment → Frozen Strategies → Eligibility → Capital Allocation → Portfolio Risk → Netting/Crossing → Executable Instruments → Paper Execution → Broker Reconciliation → Performance Accounting → Publication. Historical research and prospective paper evidence remain distinct. This repository contains only the published forward paper series, never a backtest splice.

## Repository

- data/: published JSON, CSV, dated observations, strategies, methodology, schema and manifest.
- docs/: methodology, performance, transparency and architecture notes.
- website/: self-contained static Next.js website source and a validated public-data copy.
- manifest.json: repository file checksums. The data/manifest.json independently binds the emitted dataset.

## Reproducibility

Publication hashes fingerprint individual observations. The public manifest binds emitted files. The website validates schema and checksums before building; it neither calculates competing performance statistics nor connects to production systems.

To build: use Node.js 22+, enter website/, run npm ci, npm test and npm run build. The out/ directory is a portable static website. External publication requires the final rights and security gates. No private version history is included.

## Disclosure

Quant Fund V2 is an independent quantitative investment research project documenting the prospective performance of a rules-based paper portfolio. The portfolio uses simulated capital and does not represent client assets. Nothing published constitutes investment advice, an offer, solicitation or recommendation to buy or sell securities. Paper trading results may differ materially from live trading results. Past performance is not indicative of future results.

## Licensing

- Software: Apache License 2.0.
- Research/methodology/documentation: CC BY-NC-SA 4.0.
- Public performance/observation dataset: CC BY-NC 4.0.
- Third-party material retains its respective rights.
- Quant Fund V2 branding/trademarks are not licensed except as necessary for attribution.

See LICENSE.md and NOTICE for precise scopes and attribution. Commercial licensing of original research/data may be separately available from the rights holder. Legal exceptions, including fair dealing, remain unaffected.

## Contributions

Issues and website contributions do not authorize or enter the private production trading system. This repository is not the production trading engine.
