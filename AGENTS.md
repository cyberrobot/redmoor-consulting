Execution Rules

- Never spend more than 60 seconds planning.
- If implementation is unclear, state assumptions and continue.
- Make the smallest change that satisfies the task.
- Avoid exploring unrelated files.
- Do not refactor unless explicitly requested.
- Stop after completing the requested scope.
- If a command runs longer than expected, explain why before retrying.

GitHub Authentication and Pull Requests

GitHub authentication checks run inside a restricted execution environment may not be able to
read credentials stored in the host keychain. A failed sandboxed `gh auth status` does not
necessarily mean the user is logged out.

When creating a new branch, always fetch the latest remote state first and create the branch from
the up-to-date `origin/main`, not from a potentially stale local `main` or the current branch. Use
`git switch --no-track -c <branch-name> origin/main` so the new feature branch does not inherit
`origin/main` as its upstream. Never configure a feature branch to track the remote default branch.
On its first push, publish it with `git push --set-upstream origin <branch-name>` and verify that the
local branch now tracks the same-named remote feature branch. This avoids a plain push being rejected
by Git's `simple` push mode and prevents accidental pushes to `main`.

Before asking the user to authenticate again:

1. Re-run `gh auth status` outside the restricted environment with the required approval.
2. Confirm repository access with `gh repo view --json nameWithOwner,defaultBranchRef` in the same
   environment.
3. Ask the user to run `gh auth login` only if the host-level authentication check also fails.

When the user requests commit, push, and pull-request creation:

1. Inspect `git status -sb` and the diff before staging.
2. Stage only files that belong to the requested change. Do not include unrelated or untracked
   files without confirmation.
3. Commit with a concise description of the complete change.
4. Push the current feature branch to a same-named remote branch with upstream tracking. If its
   upstream is currently the default branch, correct it with
   `git push --set-upstream origin <branch-name>`; never resolve the mismatch by pushing the feature
   commit to the default branch.
5. Create a draft pull request against the repository's default branch unless the user explicitly
   requests a ready-for-review pull request or a different base branch.
6. Use a Markdown body with real newlines that describes the change, its impact, and the validation
   commands that actually passed.
7. Verify and report the branch, commit, base branch, PR URL, draft status, and any files deliberately
   left uncommitted.
