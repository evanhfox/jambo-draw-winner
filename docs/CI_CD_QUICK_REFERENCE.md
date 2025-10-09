# CI/CD Quick Reference 🚀

## Pipeline Overview
```
Code Push/PR → Code Tests → App Build → App Security → Container Build & Scan → Deploy
```

## Phase Details

| Phase | Duration | Dependencies | Purpose |
|-------|----------|--------------|---------|
| **Code Tests** | ~2 min | None | Run tests + coverage |
| **Application Build** | ~1 min | Code Tests | Build production app |
| **Application Security** | ~1 min | App Build | Scan built app for vulnerabilities |
| **Container Build & Scan** | ~3 min | App Build | Build Docker image + scan it |
| **Production Deployment** | ~1 min | All previous | Deploy artifacts |

## Triggers
- **Push to main:** Full pipeline + deployment
- **Pull Request:** All phases except deployment  
- **Weekly:** Security scan only (Monday 2 AM UTC)

## Security Gates
- **Critical/High vulnerabilities with fixes:** Pipeline fails
- **Critical/High without fixes:** Pipeline continues, logged
- **Medium/Low:** Logged only

## Status Checks
- ✅ **Green:** Phase completed successfully
- 🟡 **Yellow:** Phase running
- ❌ **Red:** Phase failed (pipeline stops)

## Quick Commands
```bash
# Run tests locally
bun run test:coverage

# Check security
bun audit

# Build locally
bun run build

# Test Docker build
docker build -t jambo-draw-winner:latest .

# View workflow runs
# Go to GitHub → Actions tab
```

## Troubleshooting
- **Tests failing:** Check test output, fix code
- **Build failing:** Check dependencies, fix build issues
- **Security scan failing:** Update dependencies, fix vulnerabilities
- **Container scan failing:** Check Docker build, verify image exists
- **Deployment failing:** Check artifacts, verify all phases passed

## Key Files
- **Workflow:** `.github/workflows/main.yml`
- **CodeQL Config:** `.github/codeql.yml`
- **Documentation:** `docs/CI_CD_PIPELINE.md`
- **Docker:** `Dockerfile`
- **Package:** `package.json`

## Job Names
- `code-tests` - Unit tests and coverage
- `application-build` - Build React app
- `application-security-scan` - Scan built app
- `container-build-and-scan` - Build Docker + scan it
- `production-deployment` - Deploy artifacts