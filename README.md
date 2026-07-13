# lm-digest

Public GitHub Pages site for LM Digest.

## Retargeting

Public, non-secret site settings live in:

```text
config/site-config.js
```

Edit that file when adapting the digest to another research area:

- `backendUrl`
- `brand`
- `domain`
- `topics`
- `defaultTopicIds`
- `categoryOrder`
- `categoryAliases`

Keep those values aligned with the backend profile in
`lm-digest-backend/config/domains/*.cjs`.

Do not put API keys, SMTP passwords, GitHub tokens, or admin tokens in this
repository. Those belong in GitHub Actions secrets and Cloudflare Worker
secrets.
