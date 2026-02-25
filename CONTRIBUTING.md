# Contributing to Oliweb

First off, thanks for taking the time to contribute! 🎉

Oliweb is a personal project, but it's open source and I'm happy to accept contributions from anyone interested in improving the site, fixing bugs, or suggesting new features.

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please create an issue in the GitHub repository. Describe the problem, how to reproduce it, and what the expected behavior is.

### Suggesting Enhancements
Suggestions for new features or design improvements are always welcome. Create an issue to start a discussion about your idea.

### Pull Requests
1. **Fork the repository** to your own GitHub account.
2. **Clone the fork** to your local machine.
3. **Create a new branch** for your changes: `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-bug-name`.
4. **Make your changes**. Ensure your code follow the project's style and structure.
5. **Commit your changes**: `git commit -m "Add some feature"`.
6. **Push to your fork**: `git push origin feature/your-feature-name`.
7. **Open a Pull Request** against the main repository.

## Development Setup

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/martinezharo/oliweb.git
    cd oliweb
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Database Setup (Supabase)**:
    - Create a new project in [Supabase](https://supabase.com/).
    - Go to the **SQL Editor** in your Supabase dashboard.
    - Copy the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it to create the necessary tables and policies.
    - Add some initial data to the `projects` and `posts` tables to see them on the site.

4.  **Environment Variables**:
    - Copy `.env.example` (if available) to `.env` or create it.
    - Add your `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.

5.  **Start development server**:
    ```bash
    npm run dev
    ```

6.  **Open the browser**: Go to `http://localhost:4321`.

## Code of Conduct
Please be respectful and constructive in your communications. Let's keep this a welcoming project for everyone!

---

Thank you for your support! 🚀
