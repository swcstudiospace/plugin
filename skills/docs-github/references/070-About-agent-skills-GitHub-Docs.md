# About agent skills - GitHub Docs

Source: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills

# About agent skills

Skills allow Copilot to perform specialized tasks.

## Who can use this feature?

Copilot cloud agent is available for all paid Copilot plans.

The agent is available in all repositories stored on GitHub, except repositories owned by managed user accounts and where it has been explicitly disabled.

GitHub Copilot CLI is available with all Copilot plans. If you receive Copilot from an organization, the Copilot CLI policy must be enabled in the organization's settings.
[Sign up for Copilot](https://github.com/features/copilot/plans?ref_product=copilot&ref_type=purchase&ref_style=button)

Note

Agent skills work with Copilot cloud agent, Copilot code review, the GitHub Copilot CLI, the GitHub Copilot app, and agent mode in Visual Studio Code and JetBrains IDEs.

## [About agent skills](#about-agent-skills)

Agent skills are folders of instructions, scripts, and resources that Copilot can load when relevant to improve its performance in specialized tasks. The Agent Skills specification is an [open standard](https://github.com/agentskills/agentskills), used by a range of different AI systems.

You can create your own skills to teach Copilot to perform tasks in a specific, repeatable way—or use skills shared online, for example in the [`anthropics/skills`](https://github.com/anthropics/skills) repository or GitHub's community-created [`github/awesome-copilot`](https://github.com/github/awesome-copilot) collection.

You can also use `gh skill` in GitHub CLI to discover and install skills from GitHub repositories. For more information, see [Adding agent skills for GitHub Copilot](/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills#managing-skills-with-github-cli).

Copilot supports:

- Project skills, stored in your repository (`.github/skills`, `.claude/skills`, or `.agents/skills`)
- Personal skills, stored in your home directory and shared across projects (`~/.copilot/skills` or `~/.agents/skills`)

## [Next steps](#next-steps)

To create or add agent skills, see:

- [Adding agent skills for GitHub Copilot](/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills)
- [Adding agent skills for GitHub Copilot CLI](/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)
- [Customizing the GitHub Copilot app](/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app)
- [Copilot customization cheat sheet](/en/copilot/reference/customization-cheat-sheet)
