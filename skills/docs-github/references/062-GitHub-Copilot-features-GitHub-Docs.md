# GitHub Copilot features - GitHub Docs

Source: https://docs.github.com/en/copilot/get-started/features

# GitHub Copilot features

GitHub Copilot offers a suite of features for users and administrators.

## [Assistive features](#assistive-features)

These tools are used synchronously, providing advice or suggestions as people work on a task.

### [Copilot Chat](#copilot-chat)

A chat interface that lets you ask coding-related questions. GitHub Copilot Chat is available on the GitHub website, in GitHub Mobile, in supported IDEs, and in Windows Terminal. Users can also use skills with Copilot Chat. See [Asking GitHub Copilot questions in GitHub](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-github) and [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide).

### [Inline suggestions](#inline-suggestions)

Autocomplete-style suggestions from Copilot in supported IDEs. See [Getting code suggestions in your IDE with GitHub Copilot](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions).

If you use VS Code, Xcode, or Eclipse, you can also use next edit suggestions, which will predict the location of the next edit you are likely to make and suggest a completion for it.

### [Copilot pull request summaries](#copilot-pull-request-summaries)

AI-generated summaries of the changes that were made in a pull request, which files they impact, and what a reviewer should focus on when they conduct their review. See [Creating a pull request summary with GitHub Copilot](/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/create-a-pr-summary).

### [Copilot in GitHub Desktop](#copilot-in-github-desktop)

Automatically generate commit messages and descriptions with Copilot in GitHub Desktop based on the changes you make to your project.

## [Agentic features](#agentic-features)

These features can work autonomously without direct human supervision. However, they typically need human approval to perform sensitive actions, such as running commands in a developer's terminal or merging a pull request.

### [Copilot CLI](#copilot-cli)

A command line interface that lets you use Copilot in your terminal. Use the CLI to add features or fix bugs, then create a pull request. Start Copilot working on a task in your terminal, then continue working in the same session on GitHub.com, or on your mobile. See [About GitHub Copilot CLI](/en/copilot/concepts/agents/copilot-cli/about-copilot-cli).

### [GitHub Copilot app](#github-copilot-app)

A desktop application for agent-driven development. From the app, you can run multiple agent sessions in parallel across your repositories, manage issues and pull requests, and set up automations to run tasks on a schedule. See [About the GitHub Copilot app](/en/copilot/concepts/agents/github-copilot-app).

### [Copilot cloud agent](#copilot-cloud-agent)

An autonomous AI agent that can research a repository, create an implementation plan, and make code changes on a branch. You can review the diff, iterate, and create a pull request when you're ready. You can also assign a GitHub issue to Copilot or ask it to open a pull request directly to complete a task. See [GitHub Copilot cloud agent](/en/copilot/how-tos/use-copilot-agents/cloud-agent).

### [Third-party coding agents (public preview)](#third-party-coding-agents-public-preview)

You can use third-party coding agents alongside Copilot cloud agent. Third-party agents are subject to the same security protections, mitigations, and limitations as Copilot cloud agent. See [About third-party coding agents](/en/copilot/concepts/agents/about-third-party-coding-agents).

### [Copilot code review](#copilot-code-review)

AI-generated code review suggestions to help you write better code. See [Using GitHub Copilot code review](/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review).

Several tools in Copilot code review are in public preview and subject to change. See [About GitHub Copilot code review](/en/copilot/concepts/agents/code-review).

### [Agent mode in IDEs](#agent-mode-in-ides)

Allow Copilot to work autonomously in the IDE. Copilot will determine which files to make changes to, offer code changes and terminal commands for the user's approval, and iterate to remediate issues until the original task is complete.

### [GitHub Spark (public preview)](#github-spark-public-preview)

Build and deploy full-stack applications using natural-language prompts that seamlessly integrate with the GitHub platform for advanced development. See [Building and deploying AI-powered apps with GitHub Spark](/en/copilot/tutorials/spark/build-apps-with-spark).

## [Features for customization](#features-for-customization)

These features can be used to add context to Copilot and improve its performance. For a comparison of when to use each feature, see [Copilot customization cheat sheet](/en/copilot/reference/customization-cheat-sheet).

### [Copilot Spaces](#copilot-spaces)

Organize and centralize relevant content—like code, docs, specs, and more—into Spaces that ground Copilot’s responses in the right context for a specific task. See [About GitHub Copilot Spaces](/en/copilot/concepts/context/spaces).

### [Custom instructions](#custom-instructions)

Enhance responses by providing contextual details on your preferences, tools, and requirements. See [About customizing GitHub Copilot responses](/en/copilot/concepts/prompting/response-customization).

### [Copilot Memory (public preview)](#copilot-memory-public-preview)

Copilot can deduce and store useful information about a repository, which Copilot cloud agent and Copilot code review can use to improve the quality of their output when working in that repository. For more information, see [About GitHub Copilot Memory](/en/copilot/concepts/agents/copilot-memory).

### [Prompt files](#prompt-files)

Build and share reusable prompt instructions with additional context. A prompt file is a Markdown file, stored in your workspace, that mimics the existing format of writing prompts. See [About customizing GitHub Copilot responses](/en/copilot/concepts/prompting/response-customization#about-prompt-files).

### [MCP servers](#mcp-servers)

You can configure Model Context Protocol (MCP) servers for many Copilot features, giving Copilot access to external tools or data sources. See [About Model Context Protocol (MCP)](/en/copilot/concepts/context/mcp).

### [Agent skills](#agent-skills)

Create folders of instructions, scripts, and resources that Copilot can load when relevant to improve its performance in specialized tasks. See [About agent skills](/en/copilot/concepts/agents/about-agent-skills).

### [Custom agents](#custom-agents)

Create specialized versions of Copilot cloud agent with access to specific tools, instructions, and MCP servers. See [About custom agents](/en/copilot/concepts/agents/cloud-agent/about-custom-agents).

## [Features for administrators](#features-for-administrators)

The following features are available to organization and enterprise owners with a Copilot Business or Copilot Enterprise plan.

### [Policy management](#policy-management)

Manage policies for Copilot in your organization or enterprise. See [Managing policies and features for GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies) and [Managing policies and features for GitHub Copilot in your enterprise](/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies).

### [Access management](#access-management)

Enterprise owners can specify which organizations in the enterprise can use Copilot, and organization owners can specify which organization members can use Copilot. See [Managing access to GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access) and [Managing access to Copilot in your enterprise](/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access).

### [Usage data](#usage-data)

Review Copilot usage data within your organization or enterprise to inform how to manage access and drive adoption of Copilot. See [Reviewing user activity data for GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/review-activity/review-user-activity-data) and [Viewing Copilot license usage in your enterprise](/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/view-license-usage).

### [Audit logs](#audit-logs)

Review audit logs for Copilot in your enterprise to understand what actions have been taken and by which users. See [Reviewing audit logs for GitHub Copilot](/en/copilot/how-tos/administer-copilot/manage-for-enterprise/review-audit-logs).

### [File exclusions](#file-exclusions)

Configure Copilot to ignore certain files. This can be useful if you have files that you don't want to be available to Copilot. See [Excluding content from GitHub Copilot](/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot).

## [Next steps](#next-steps)

- To learn more about the plans available for GitHub Copilot, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).
- To start using Copilot, see [Setting up GitHub Copilot](/en/copilot/how-tos/set-up).
