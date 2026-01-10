# OpenCode Setup Guide

OpenCode is an open-source AI coding agent that helps you write code directly in your terminal.

## Prerequisites

- **Terminal**: PowerShell/CMD (Windows) or any terminal emulator (Linux)
- **Node.js package manager**: npm or [Bun](https://bun.sh) (recommended - much faster)

### Installing Bun (Recommended)

**Windows:**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

After installing Bun, restart your terminal and verify:
```bash
bun --version
```

## Installation

### Option 1: Using Bun (Recommended - Fastest)

```bash
bun install -g opencode-ai
```

### Option 2: Using npm

**Windows/Linux:**
```bash
npm install -g opencode-ai
```

Verify installation:
```bash
opencode --version
```

## Configuration

OpenCode Zen is the easiest way to get started - it provides curated, tested models optimized for coding.

### Setting Up OpenCode Zen

1. Run OpenCode:
```bash
opencode
```

2. Connect to OpenCode Zen:
```
/connect
```

3. Select `opencode` as the provider

4. Visit `https://opencode.ai/auth` in your browser

5. Sign in, add billing details, and copy your API key

6. Paste the API key in the terminal

### Optional: Switch to GLM

If you prefer to use GLM models:

1. Get your GLM API key from [Zhipu AI](https://open.bigmodel.cn/)

2. Configure the provider:
```
/connect
```

3. Select your GLM provider and paste the API key

## Getting Started

### Basic Usage

**Start OpenCode:**
```bash
opencode
```

**Run a single command:**
```bash
opencode run "Explain how closures work in JavaScript"
```

**Start in a specific project:**
```bash
cd /path/to/your/project
opencode
```

### Common Commands in OpenCode

- `/help` - Show available commands
- `/connect` - Configure API provider
- `/clear` - Clear the chat history
- `/exit` - Exit OpenCode

### Useful Flags

- `opencode --continue` or `-c` - Continue the last session
- `opencode --model provider/model` or `-m` - Use a specific model

## Example Workflow

1. Navigate to your project directory:
```bash
cd my-project
```

2. Start OpenCode:
```bash
opencode
```

3. Give it a task:
```
Help me add a dark mode toggle to this React app
```

4. OpenCode will read your code, understand the project structure, and help you implement the feature.

## Resources

- [Documentation](https://opencode.ai/docs)
- [GitHub](https://github.com/anomalyco/opencode)
- [Discord](https://opencode.ai/discord)
