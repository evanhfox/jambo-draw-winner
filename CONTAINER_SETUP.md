# Container Registry Setup

## GitHub Container Registry (GHCR) Permissions

The container workflows are currently disabled due to GitHub Container Registry permission issues. To enable container publishing, you need to configure the following:

### 1. Enable GitHub Container Registry

1. Go to your repository settings: `https://github.com/evanhfox/contest-draw/settings`
2. Navigate to **Actions** → **General**
3. Under **Workflow permissions**, ensure:
   - ✅ **Read and write permissions** is selected
   - ✅ **Allow GitHub Actions to create and approve pull requests** is checked

### 2. Configure Package Permissions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, set:
   - **Read and write permissions**
   - **Allow GitHub Actions to create and approve pull requests**

### 3. Enable Container Registry Publishing

1. Go to **Settings** → **Packages**
2. Ensure **GitHub Container Registry** is enabled
3. Check that the repository has write access to `ghcr.io`

### 4. Alternative: Use Docker Hub

If GHCR continues to have issues, you can switch to Docker Hub:

1. Create a Docker Hub account
2. Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets to your repository
3. Update the workflows to use Docker Hub instead of GHCR

### 5. Re-enable Container Workflows

Once permissions are configured:

1. Uncomment the `on:` section in `.github/workflows/container.yml`
2. Uncomment the `on:` section in `.github/workflows/ci.yml`
3. Restore the container build steps in the CI workflow

## Current Status

- ✅ **Tests**: All 126 tests passing
- ✅ **Build**: Application builds successfully
- ✅ **Security**: Trivy filesystem scanning works
- ⚠️ **Containers**: Temporarily disabled due to registry permissions
- ✅ **Deployment**: GitHub Pages deployment works

## Manual Container Build

You can still build containers locally:

```bash
# Build the container
docker build -t contest-draw .

# Run locally
docker run -p 3000:80 contest-draw

# Or use docker-compose
docker-compose up
```

## Next Steps

1. Configure GitHub Container Registry permissions
2. Re-enable container workflows
3. Test container publishing
4. Update documentation with container registry URLs
