# Contributing Guide

This guide will help you get started with Git and GitHub to contribute to open source projects.

## What is Git & GitHub?

**Git** is a version control system that tracks changes to your code files.

**GitHub** is a platform that hosts Git repositories and enables collaboration with other developers.

## Prerequisites

- A [GitHub account](https://github.com/signup) - it's free
- Git installed on your computer

## Installing Git

### Windows

1. Download the installer from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer with the default settings
3. Restart your terminal

### Linux

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install git
```

**Fedora/RHEL:**
```bash
sudo dnf install git
```

**Arch Linux:**
```bash
sudo pacman -S git
```

Verify installation:
```bash
git --version
```

## Git Configuration

Set up your name and email (this is attached to your commits):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Basic Git Commands

These are the commands you'll use most often:

### Getting Code

**Clone a repository:**
```bash
git clone https://github.com/username/repository-name.git
```

### Checking Status

**See what files have changed:**
```bash
git status
```

### Saving Changes

**Stage a file for commit:**
```bash
git add filename
```

**Stage all changed files:**
```bash
git add .
```

**Commit your changes:**
```bash
git commit -m "Add login feature"
```

### Sharing Changes

**Push commits to GitHub:**
```bash
git push
```

### Getting Updates

**Download latest changes from GitHub:**
```bash
git pull
```

## Example Workflow

Here's a typical workflow when working on a repository:

```bash
# 1. Clone the repository
git clone https://github.com/username/repository-name.git
cd repository-name

# 2. Make changes to files
# (edit files in your code editor)

# 3. Check what changed
git status

# 4. Stage your changes
git add .

# 5. Commit your changes
git commit -m "Fix button alignment issue"

# 6. Push to GitHub
git push
```

## GitHub Fork & Pull Request Workflow

This is how you contribute to someone else's project:

### Step 1: Fork the Repository

1. Go to the repository on GitHub
2. Click the **Fork** button in the top-right corner
3. This creates a copy of the repository under your account

### Step 2: Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/repository-name.git
cd repository-name
```

### Step 3: Create a Branch

Always work on a branch for your changes:

```bash
git checkout -b describe-your-feature
```

Example:
```bash
git checkout -b add-dark-mode
```

### Step 4: Make Changes

- Edit the files in your code editor
- Test your changes
- Check what changed:
```bash
git status
```

### Step 5: Commit and Push

```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "Add dark mode toggle"

# Push to your fork
git push origin describe-your-feature
```

### Step 6: Create a Pull Request

1. Go to your forked repository on GitHub
2. You'll see a banner to compare and pull request
3. Click **Compare & pull request**
4. Write a description of your changes
5. Click **Create pull request**

### Step 7: Wait for Review

The project owner will review your changes. They may:
- Merge your pull request
- Request changes (you can edit your branch and push updates)
- Comment on your code

## Branch Management

**List all branches:**
```bash
git branch
```

**Switch to a branch:**
```bash
git checkout branch-name
```

**Create and switch to a new branch:**
```bash
git checkout -b new-branch-name
```

**Delete a branch:**
```bash
git branch -d branch-name
```

## Commit Message Best Practices

Good commit messages help others understand your changes:

- Use clear, descriptive messages
- Start with a verb in present tense
  - "Fix bug" ✓
  - "Add feature" ✓
  - "Fixed bug" ✗
  - "Adding feature" ✗

Examples:
- `Fix navigation bar on mobile devices`
- `Add user authentication`
- `Update documentation for installation`
- `Remove unused CSS files`

## Viewing History

**See commit history:**
```bash
git log
```

**See history with a compact view:**
```bash
git log --oneline
```

## Checking Differences

**See what changed in a file:**
```bash
git diff filename
```

**See all staged changes:**
```bash
git diff --staged
```

## Undoing Changes

**Unstage a file:**
```bash
git reset filename
```

**Discard local changes to a file:**
```bash
git checkout -- filename
```

**Undo the last commit (but keep changes):**
```bash
git reset --soft HEAD~1
```

## Resources

- [GitHub Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [GitHub Guides](https://guides.github.com/)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [OpenCode Discord](https://opencode.ai/discord)
