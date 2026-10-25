# Public platform architecture

Published public artifacts → validation → static website.

The application opens only its own public/data directory. There is no runtime backend, database, broker connection, trading control or publication-generation endpoint. Source-only exports begin in an empty staging directory and use explicit filename allowlists. No private version history is included.

Future daily publication must copy only newly emitted public artifacts, validate their manifest/privacy, build the static website and deploy separately. Trading remains independent of website and deployment availability.

The approved deployment uses only this sanitized GitHub repository, with Vercel root directory website. It requires no trading secrets. Public repository contributions never enter the private trading engine automatically. Internet publication remains separate from fund operation.
