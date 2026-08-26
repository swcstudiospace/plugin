# Fix with your Agent

Source: https://www.greptile.com/docs/integrations/fix-with-your-agent

Every Greptile review comment includes a **Fix with your Agent** button. Click it, and the issue gets sent straight to your coding agent with full context: the file, line numbers, the comment, and the suggested fix. Your agent opens, applies the fix, and you review the diff. No copy-pasting, no switching between tabs.

Currently supports **Claude Code**, **OpenAI Codex**, **Conductor**, **Cursor**, and **Devin**.

## [​](#enable-org-wide) Enable org-wide

Org admins can go to **Settings → Code Review → Default Coding Agents** to turn on Fix with your Agent for the org. The badge shows up on every PR review. Users who click it without having set up their own agent get walked through setup.

![Default Coding Agents settings: prompt to Fix with AI and org-wide agent defaults](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/default-coding-agents.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=9ed967105b5b55bd87ceefedb9ee4c30)

## [​](#setup) Setup

1

Install the Greptile Bridge

Click your profile icon in the upper-right corner of the page and select **Settings**, then go to **Review Settings**. Under the **Fix with your Agent** section, you’ll see a prompt to link your profile and to install the bridge app. The bridge is a small CLI that sits on your machine and routes fix requests from GitHub to your local agent.

![Profile dropdown menu showing Settings option](https://mintcdn.com/greptile/Q2FUE0mxC5y8-IPI/images/personal-settings-menu.png?fit=max&auto=format&n=Q2FUE0mxC5y8-IPI&q=85&s=0c5db490f6e0ef51bf499796567a9627)

```
npm install -g greptile
```

Once installed, the dashboard shows a green checkmark with **Greptile bridge app connected**.

![Review Settings page showing Fix with your Agent section with bridge install instructions](https://mintcdn.com/greptile/NhiYzohHwN4UIy-y/images/fix-in-x-settings-full.png?fit=max&auto=format&n=NhiYzohHwN4UIy-y&q=85&s=1619a65a7b17e8990369e55a0b27556e)

2

Choose your coding agents

In the same section, click the **Choose your coding agents** dropdown and select the agents you want to use. You can pick from **Claude Code**, **Codex**, **Conductor**, **Cursor**, and **Devin**.

![Agent selection dropdown showing Claude Code, Codex, Conductor, Cursor, and Devin options](https://mintcdn.com/greptile/NhiYzohHwN4UIy-y/images/fix-in-x-select-ide.png?fit=max&auto=format&n=NhiYzohHwN4UIy-y&q=85&s=2cd0062f32f76375540099eecbe8aa23)

The button label on PR comments updates to reflect your choice. The preview on the right shows what the badge will look like on your review comments.

![Fix with your Agent section after connecting with agent selected](https://mintcdn.com/greptile/NhiYzohHwN4UIy-y/images/fix-in-x-connected.png?fit=max&auto=format&n=NhiYzohHwN4UIy-y&q=85&s=eeb520b29a997c1ad2bfdcaff06efaac)

## [​](#using-fix-with-your-agent) Using Fix with your Agent

Once setup is done, the flow looks like this:

1

Greptile reviews your PR

When you open or update a PR, Greptile posts its review. Each inline comment gets a **Fix with your Agent** button, and the review summary has a **Fix All** button at the bottom that sends every issue at once.

![Greptile PR summary with Fix All button](https://mintcdn.com/greptile/NbRtsLvWVCnO7zAK/images/fix-in-x-pr-summary.png?fit=max&auto=format&n=NbRtsLvWVCnO7zAK&q=85&s=8b2cfc23233015db04acc8a3ab2e0b31)

2

Click the button

Your browser asks permission to open **Greptile Fix**. Click **Open “Greptile Fix”** to continue. You can select **Always open** to skip this prompt going forward.

![Browser dialog asking to open Greptile Fix](https://mintcdn.com/greptile/NbRtsLvWVCnO7zAK/images/fix-in-x-open-dialog.png?fit=max&auto=format&n=NbRtsLvWVCnO7zAK&q=85&s=9894b69dacb0852e913a129fd4b16426)

3

Point it to your local repo

Greptile Fix asks you to select the local directory where your repo lives. This tells it where to open your agent.

4

Your agent fixes the code

Your coding agent fires up with a detailed prompt that includes every flagged issue: file paths, line numbers, the review comment, and suggested code changes. The agent works through them one at a time.

![Claude Code receiving a detailed fix prompt from Greptile](https://mintcdn.com/greptile/NbRtsLvWVCnO7zAK/images/fix-in-x-agent-prompt.png?fit=max&auto=format&n=NbRtsLvWVCnO7zAK&q=85&s=257d765bb3d0d472e496c7ada89585ee)

Review the changes your agent proposes, then commit when you’re happy with them.

5

Comments resolve automatically

When you push a commit that touches the flagged files, Greptile marks the corresponding review comments as addressed.

## [​](#troubleshooting) Troubleshooting

Button doesn't appear on review comments

Make sure your GitHub account is linked in **Settings → User → Linked Accounts**, you’ve selected at least one coding agent, and the Greptile Bridge is installed (`npm list -g greptile`).

Browser dialog doesn't appear after clicking Fix

This usually means the bridge isn’t installed or local network access isn’t enabled. Reinstall with `npm install -g greptile` and check that local network permissions are granted in your dashboard settings.

Agent applies the wrong fix

The agent uses the review comment and suggested code as guidance, but it may interpret things differently depending on context. Always review the diff before committing.

⌘I
