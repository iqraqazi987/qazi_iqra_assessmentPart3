# GitHub workflow (feature branch and squash merge)

Run these commands from the project folder. Replace `YOUR-REMOTE-URL` with the repository URL you create on GitHub.

```bash
git init
git add .
git commit -m "chore: add Alberta trails starter"
git branch -M main
git remote add origin YOUR-REMOTE-URL
git push -u origin main

git switch -c feature/alberta-trails-integration
git add index.html style.css script.js README.md decision_log.md GIT_WORKFLOW.md
git commit -m "feat: add responsive trail map and live weather"
git push -u origin feature/alberta-trails-integration
```

On GitHub:
1. Open a pull request from `feature/alberta-trails-integration` into `main`.
2. Review the changed files and confirm there are no merge conflicts.
3. Select **Squash and merge**.
4. Confirm the merge, then sync your local `main`:

```bash
git switch main
git pull origin main
git branch -d feature/alberta-trails-integration
git push origin --delete feature/alberta-trails-integration
```
