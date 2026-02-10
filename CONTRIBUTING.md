# Contributing to MedGemma

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/siddharth-1118/med-gemma.git
    cd med-gemma
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    - Copy `.env.example` to `.env`:
      - **Windows (Command Prompt)**: `copy .env.example .env`
      - **Windows (PowerShell)**: `Copy-Item .env.example .env`
      - **Mac/Linux**: `cp .env.example .env`
    - Open `.env` and fill in your actual API keys/tokens (ask the team lead for these).

## Making Changes

1.  **Create a new branch** for your feature or fix (Best Practice):
    ```bash
    git checkout -b feature/your-feature-name
    ```
    *Example: `git checkout -b feature/add-login-page`*

2.  **Make your changes** in the code.

3.  **Stage and commit** your changes:
    ```bash
    git add .
    git commit -m "Description of what you changed"
    ```

## Pushing Your Code

1.  **Pull the latest changes** from the main branch to avoid conflicts:
    ```bash
    git pull --rebase origin main
    ```

2.  **Push your branch** to GitHub:
    ```bash
    git push origin feature/your-feature-name
    ```
    *If you are working directly on main (not recommended), use `git push origin main`.*

3.  **Create a Pull Request (PR)** on GitHub to merge your changes into `main`.
