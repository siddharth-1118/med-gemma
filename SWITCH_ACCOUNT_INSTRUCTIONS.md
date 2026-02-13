# How to Switch GitHub Accounts on This Computer

Follow these steps in **Git Bash** (or your terminal) inside the `c:\med gemm` folder.

## 1. Set the New User for This Project
Run these commands to tell Git who you are for **this specific project**.
*(Replace with your new username and email)*

```bash
git config user.name "NewUsername"
git config user.email "new_email@example.com"
```

## 2. Remove Old Credentials
This command removes the saved login for GitHub, so your computer asks you to sign in again.

```bash
cmdkey /delete:git:https://github.com
```

## 3. Verify
Check that the changes were applied:

```bash
git config user.name
git config user.email
```

## 4. Push to Trigger Login (Only when ready!)
The next time you try to push code, a browser window or login prompt will appear.
**Log in with your NEW account there.**

```bash
git push origin main
```
