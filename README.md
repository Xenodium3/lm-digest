# lm-digest

Public GitHub Pages site for LM Digest.

## Retargeting

Use the browser-only builder linked from **How It Works > Retargeting**:

```text
retarget.html
```

The builder generates one non-secret JSON research profile. Use it with the
private Paper Express starter repo. If GitHub shows 404, ask the LM Digest
maintainer for access:

```text
https://github.com/Xenodium3/paper-express
```

Recommended flow:

1. Generate a JSON profile with `retarget.html`.
2. Clone Paper Express as a private operational repo.
3. Save the profile under `config/domains/`.
4. Configure GitHub Actions secrets/variables and Cloudflare Worker secrets/variables.
5. Add the deployed Worker URL to the profile and public site config.
6. Run validation and fixture tests before real sends.

The builder includes a deployment checklist for:

- GitHub Actions secrets: `ANTHROPIC_API_KEY`, SMTP settings, `FROM_EMAIL`, `ADMIN_EMAIL`
- GitHub Actions variables: `RESEARCH_DOMAIN_PROFILE`, `SITE_URL`, optional model/search tuning
- Cloudflare Worker secrets: `GITHUB_TOKEN`, `ADMIN_TOKEN`
- Cloudflare Worker variables: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`, `ALLOWED_ORIGIN`, `DEFAULT_CATEGORY`

Do not put API keys, SMTP passwords, GitHub tokens, admin tokens, subscribers,
ratings, recommendations, or digest history in the profile or public site.
