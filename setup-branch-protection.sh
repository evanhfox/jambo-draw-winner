#!/bin/bash

# GitHub Branch Protection Setup Script
# Run this after: gh auth login

REPO="evanhfox/jambo-draw-winner"
BRANCH="main"

echo "Setting up branch protection for $REPO:$BRANCH..."

gh api repos/$REPO/branches/$BRANCH/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["code-tests","application-build","application-security-scan","container-build-and-scan"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null

echo "Branch protection rules applied successfully!"
echo "✅ Tests must pass before merging"
echo "✅ Security scans must pass before merging"
echo "✅ PR reviews required before merging"
