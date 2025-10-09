# CI/CD Quick Reference 🚀

## Pipeline Overview
```
Code Push/PR → Quality Assurance → Security Assessment → Build (App + Container) → Deploy
```

## Phase Details

| Phase | Duration | Dependencies | Purpose |
|-------|----------|--------------|---------|
| **Quality Assurance** | ~2 min | None | Run tests + coverage |
| **Security Assessment** | ~1 min | Quality Assurance | Scan for vulnerabilities |
| **Application Build** | ~1 min | Quality + Security | Build production app |
| **Container Build** | ~2 min | Quality + Security | Build Docker image |
| **Production Deployment** | ~1 min | All previous | Deploy to Pages |

## Triggers
- **Push to main:** Full pipeline + deployment
- **Pull Request:** All phases except deployment  
- **Weekly:** Security scan only (Monday 2 AM UTC)

## Status Checks
- ✅ **Green:** Phase completed successfully
- 🟡 **Yellow:** Phase running
- ❌ **Red:** Phase failed (pipeline stops)

## Quick Commands
```bash
# Run tests locally
npm run test:coverage

# Check security
npm audit

# Build locally
npm run build

# View workflow runs
# Go to GitHub → Actions tab
```

## Troubleshooting
- **Tests failing:** Check test output, fix code
- **Build failing:** Check dependencies, fix build issues
- **Security issues:** Review Trivy reports, update dependencies
- **Deployment failing:** Check Pages settings, verify artifacts

## Key Files
- **Workflow:** `.github/workflows/main.yml`
- **Documentation:** `docs/CI_CD_PIPELINE.md`
- **Docker:** `Dockerfile`
- **Package:** `package.json`
