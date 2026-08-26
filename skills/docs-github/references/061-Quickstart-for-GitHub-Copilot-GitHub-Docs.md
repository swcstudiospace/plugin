# Quickstart for GitHub Copilot - GitHub Docs

Source: https://docs.github.com/en/copilot/get-started/quickstart

# Quickstart for GitHub Copilot

Quickly learn how to use GitHub Copilot.

## Tool navigation

## [Introduction](#introduction)

You can use Copilot to get answers to coding-related questions, such as how best to code something, how to fix a bug, or how someone else's code works. For full details of what Copilot can do, see [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot).

Instructions for using Copilot differ depending on where you are using it. This version of the quickstart is for using Copilot on the GitHub website. Click the tabs above for instructions on using Copilot in other environments.

## [Sign up for GitHub Copilot](#sign-up-for-github-copilot)

[Get started for free](https://github.com/copilot?ref_product=copilot&ref_type=engagement&ref_style=button&ref_plan=free)

To use Copilot, you’ll need a personal GitHub account with access to a Copilot plan. You can:

- Start with Copilot Free to explore limited features without subscribing to a plan.
- Upgrade to Copilot Pro, Copilot Pro+, or Copilot Max to unlock more features, models, and request limits.

  Important

  **Starting April 22, 2026**, new self-serve sign-ups for Copilot Business for organizations on GitHub Free and GitHub Team plans are temporarily paused.

For more information about the different plans for GitHub Copilot, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).

## [Asking your first question](#asking-your-first-question)

1. On GitHub, navigate to a repository and open a file.
2. Click the Copilot icon () at the top right of the file view.

   ![Screenshot of the Copilot button, highlighted with a dark orange outline, at the top of the file view.](/assets/cb-2977/images/help/copilot/copilot-button-for-file.png)
3. Type a question in the "Ask Copilot" box at the bottom of the chat panel and press `Enter`.

   For example, you could enter:

   - `Explain this file.`
   - `How could I improve this code?`
   - `How can I test this code?`

   Copilot responds to your request in the panel.
4. You can continue the conversation by asking a follow-up question. For example, you could type "tell me more" to get Copilot to expand on its last comment.

## [Other questions you can ask](#other-questions-you-can-ask)

There are many more things you can do with GitHub Copilot Chat in GitHub. For example:

- Ask a general question about software development
- Ask exploratory questions about a repository
- Find out about the changes in a pull request
- Ask a question about a specific issue or commit

For more information, see [Asking GitHub Copilot questions in GitHub](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-github).

## [Next steps](#next-steps)

- **Find out more about GitHub Copilot Chat** - See [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide).
- **Get Copilot inline suggestions in an IDE** - See [Getting code suggestions in your IDE with GitHub Copilot](/en/enterprise-cloud@latest/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions).
- **Learn how to write effective prompts** - See [Prompt engineering for GitHub Copilot Chat](/en/copilot/concepts/prompting/prompt-engineering).
- **Use Copilot on your mobile device** - See [Asking GitHub Copilot questions in GitHub Mobile](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile).
- **Use Copilot on the command line** - See [Using the GitHub CLI Copilot extension](/en/copilot/how-tos/use-copilot-for-common-tasks/use-copilot-in-the-cli).

GitHub Copilot provides coding suggestions as you type in your editor. You can also ask Copilot coding-related questions, such as how best to code something, how to fix a bug, or how someone else's code works. For full details of what Copilot can do, see [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot).

Instructions for using Copilot differ depending on where you are using it. This version of the quickstart is for Windows Terminal. Click the tabs above for instructions on using Copilot in other environments.

## [Sign up for GitHub Copilot](#sign-up-for-github-copilot-1)

[Get started for free](https://github.com/copilot?ref_product=copilot&ref_type=engagement&ref_style=button&ref_plan=free)

To use Copilot, you’ll need a personal GitHub account with access to a Copilot plan. You can:

- Start with Copilot Free to explore limited features without subscribing to a plan.
- Upgrade to Copilot Pro, Copilot Pro+, or Copilot Max to unlock more features, models, and request limits.

  Important

  **Starting April 22, 2026**, new self-serve sign-ups for Copilot Business for organizations on GitHub Free and GitHub Team plans are temporarily paused.

For more information about the different plans for GitHub Copilot, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).

## [Prerequisites](#prerequisites)

- **Subscription to Copilot**. To use GitHub Copilot in Windows Terminal, you must have an active GitHub Copilot subscription. See [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot#get-access).
- **Windows Terminal Canary**. Terminal Chat is only available in [Windows Terminal Canary](https://github.com/microsoft/terminal?tab=readme-ov-file#installing-windows-terminal-canary).

## [Use Copilot in Terminal Chat](#use-copilot-in-terminal-chat)

After you've installed Windows Terminal Canary, you can use Copilot in [Terminal Chat](https://learn.microsoft.com/windows/terminal/terminal-chat) to ask command line-related questions.

1. Open **Settings** from the dropdown menu.

   ![Screenshot of the dropdown menu in the Windows Terminal with the Settings item highlighted.](/assets/cb-29558/images/help/copilot/windows-terminal-dropdown.png)
2. Go to the **Terminal Chat (Experimental)** setting.

   ![Screenshot of the Settings menu in the Windows Terminal with the Terminal Chat (Experimental) item highlighted.](/assets/cb-49400/images/help/copilot/windows-terminal-settings.png)
3. Under **Service Providers**, select **GitHub Copilot** and **Authenticate via GitHub** to sign in.

## [Chat with GitHub Copilot](#chat-with-github-copilot)

Note

If you have access to GitHub Copilot via your organization, you won't be able to use GitHub Copilot in Windows Terminal if your organization owner has disabled GitHub Copilot CLI. See [Managing policies and features for GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

1. Open **Terminal Chat (Experimental)** in the dropdown menu.
2. In the Terminal Chat chat window, type `how do i list all markdown files in my directory` then press `Enter`.

   Copilot's answer is displayed below your question.
3. Click on an answer to insert it to the command line.

## [Next steps](#next-steps-1)

- **Find out more about Copilot inline suggestions** - See [Getting code suggestions in your IDE with GitHub Copilot](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions).
- **Find out more about GitHub Copilot Chat** - See [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide).
- **Learn how to write effective prompts** - See [Prompt engineering for GitHub Copilot Chat](/en/copilot/concepts/prompting/prompt-engineering).
- **Use Copilot on your mobile device** - See [Asking GitHub Copilot questions in GitHub Mobile](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile).
- **Use Copilot on the command line** - See [About GitHub Copilot CLI](/en/copilot/concepts/agents/copilot-cli/about-copilot-cli).
- **Configure Copilot in your editor** - You can enable or disable GitHub Copilot from within your editor, and create your own preferred keyboard shortcuts for Copilot. See [Configuring GitHub Copilot in your environment](/en/copilot/how-tos/configure-personal-settings/configure-in-ide).

GitHub Copilot provides coding suggestions as you type in your editor. You can also ask Copilot coding-related questions, such as how best to code something, how to fix a bug, or how someone else's code works. For full details of what Copilot can do, see [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot).

Instructions for using Copilot differ depending on where you are using it. This version of the quickstart is for Visual Studio Code. Click the tabs above for instructions on using Copilot in other environments.

## [Sign up for GitHub Copilot](#sign-up-for-github-copilot-2)

[Get started for free](https://github.com/copilot?ref_product=copilot&ref_type=engagement&ref_style=button&ref_plan=free)

To use Copilot, you’ll need a personal GitHub account with access to a Copilot plan. You can:

- Start with Copilot Free to explore limited features without subscribing to a plan.
- Upgrade to Copilot Pro, Copilot Pro+, or Copilot Max to unlock more features, models, and request limits.

  Important

  **Starting April 22, 2026**, new self-serve sign-ups for Copilot Business for organizations on GitHub Free and GitHub Team plans are temporarily paused.

For more information about the different plans for GitHub Copilot, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).

## [Prerequisites](#prerequisites-1)

- **Copilot subscription** - To use GitHub Copilot in VS Code, you must have an active GitHub Copilot subscription. See [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot#get-access).
- **Latest version of Visual Studio Code**. See the [Visual Studio Code download page](https://code.visualstudio.com/Download?ref_product=copilot&ref_type=engagement&ref_style=text).
- **Sign in to GitHub in Visual Studio Code**. If you experience authentication issues, see [Troubleshooting common issues with GitHub Copilot](/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-common-issues#authentication-problems-in-visual-studio-code).

## [Chat with GitHub Copilot](#chat-with-github-copilot-1)

After you've installed the GitHub Copilot Chat extension, you can ask Copilot coding-related questions.

Note

If you have access to GitHub Copilot via your organization, you won't be able to use GitHub Copilot Chat if your organization owner has disabled chat. See [Managing policies and features for GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

1. Create a new folder for your project and open it in VS Code.
2. Open the Chat view by pressing `Control`+`Command`+`i` (Mac) / `Ctrl`+`Alt`+`i` (Windows/Linux) or by selecting the chat icon in the VS Code title bar.
3. At the bottom of the chat view, in the chat input field, type: `Create a complete task manager web application with the ability to add, delete, and mark tasks as completed. Include modern CSS styling and make it responsive. Use semantic HTML and ensure it's accessible. Separate markup, styles, and scripts into their own files.`
4. Press `Enter`. Watch as the agent generates the necessary files and code to implement your request. You should see it update the `index.html` file, create a `styles.css` file for styling, and a `script.js` file for functionality.
5. Review the generated files and select Keep to accept all the changes.

## [Get your first inline suggestion](#get-your-first-inline-suggestion)

The following example uses JavaScript, however other languages will work similarly. GitHub Copilot provides suggestions for numerous languages and a wide variety of frameworks, but works especially well for Python, JavaScript, TypeScript, Ruby, Go, C# and C++. GitHub Copilot can also assist in query generation for databases, generating suggestions for APIs and frameworks, and can help with infrastructure as code development.

1. Open Visual Studio Code.
2. In Visual Studio Code, create a new JavaScript (*\*.js*) file.
3. In the JavaScript file, type the following function header.

   ```
   function calculateDaysBetweenDates(begin, end) {
   ```

   GitHub Copilot will automatically suggest an entire function body in grayed text. The exact suggestion may vary.
4. To accept the suggestion, press `Tab`.

## [Next steps](#next-steps-2)

- **Find out more about Copilot inline suggestions** - See [Getting code suggestions in your IDE with GitHub Copilot](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions).
- **Find out more about GitHub Copilot Chat** - See [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide).
- **Learn how to write effective prompts** - See [Prompt engineering for GitHub Copilot Chat](/en/copilot/concepts/prompting/prompt-engineering).
- **Use Copilot like a pro** - Learn how to write effective prompts for GitHub Copilot. For more information, see [Best practices for using GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/prompt-crafting) in the Visual Studio Code documentation.
- **Get familiar with next edit suggestions** - See [Navigating and accepting next edit suggestions](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions#navigating-and-accepting-next-edit-suggestions-1).
- **Use Copilot on your mobile device** - See [Asking GitHub Copilot questions in GitHub Mobile](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile).
- **Use Copilot on the command line** - See [About GitHub Copilot CLI](/en/copilot/concepts/agents/copilot-cli/about-copilot-cli).
- **Configure Copilot in your editor** - You can enable or disable GitHub Copilot from within your editor, and create your own preferred keyboard shortcuts for Copilot. See [Configuring GitHub Copilot in your environment](/en/copilot/how-tos/configure-personal-settings/configure-in-ide).

GitHub Copilot provides coding suggestions as you type in your editor. You can also ask Copilot coding-related questions, such as how best to code something, how to fix a bug, or how someone else's code works. For full details of what Copilot can do, see [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot).

Instructions for using Copilot differ depending on where you are using it. This version of the quickstart is for Visual Studio. Click the tabs above for instructions on using Copilot in other environments.

## [Sign up for GitHub Copilot](#sign-up-for-github-copilot-3)

[Get started for free](https://github.com/copilot?ref_product=copilot&ref_type=engagement&ref_style=button&ref_plan=free)

To use Copilot, you’ll need a personal GitHub account with access to a Copilot plan. You can:

- Start with Copilot Free to explore limited features without subscribing to a plan.
- Upgrade to Copilot Pro, Copilot Pro+, or Copilot Max to unlock more features, models, and request limits.

  Important

  **Starting April 22, 2026**, new self-serve sign-ups for Copilot Business for organizations on GitHub Free and GitHub Team plans are temporarily paused.

For more information about the different plans for GitHub Copilot, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).

## [Prerequisites](#prerequisites-2)

- **Subscription to Copilot**. To use GitHub Copilot in Visual Studio, you must have an active GitHub Copilot subscription. See [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot#get-access).
- **Compatible version of Visual Studio**. To use GitHub Copilot in Visual Studio, you must have version 2022 17.8 or later of Visual Studio for Windows installed. For more information, see [Install Visual Studio](https://learn.microsoft.com/en-us/visualstudio/install/install-visual-studio?ref_product=copilot&ref_type=engagement&ref_style=text) in the Microsoft documentation.
- **GitHub Copilot extension for Visual Studio**. For instructions on how to install the Copilot extension, see [Install GitHub Copilot in Visual Studio](https://learn.microsoft.com/visualstudio/ide/visual-studio-github-copilot-install-and-states?ref_product=copilot&ref_type=engagement&ref_style=text) in the Microsoft documentation.
- **Add your GitHub account to Visual Studio**. See [Add your GitHub accounts to your Visual Studio keychain](https://learn.microsoft.com/en-us/visualstudio/ide/work-with-github-accounts?ref_product=copilot&ref_type=engagement&ref_style=text) in the Microsoft documentation.

## [Chat with GitHub Copilot](#chat-with-github-copilot-2)

After you've installed the GitHub Copilot extension, you can ask Copilot coding-related questions.

Note

If you have access to GitHub Copilot via your organization, you won't be able to use GitHub Copilot Chat if your organization owner has disabled chat. See [Managing policies and features for GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

1. Open an existing code file.
2. In the Visual Studio menu bar, click **View**, then click **GitHub Copilot Chat**.
3. In the Copilot Chat window, type `what does this file do` then press `Enter`.

   Copilot's answer is displayed below your question.
4. Select a line of code in the editor.
5. In the Copilot Chat window, type `explain this line` then press `Enter`.

## [Get your first inline suggestion](#get-your-first-inline-suggestion-1)

The following example uses JavaScript, however other languages will work similarly. GitHub Copilot provides suggestions for numerous languages and a wide variety of frameworks, but works especially well for Python, JavaScript, TypeScript, Ruby, Go, C# and C++. GitHub Copilot can also assist in query generation for databases, generating suggestions for APIs and frameworks, and can help with infrastructure as code development.

1. Open Visual Studio.
2. In Visual Studio, create a new JavaScript (*\*.js*) file.
3. In the JavaScript file, type the following function header.

   ```
   function calculateDaysBetweenDates(begin, end) {
   ```

   GitHub Copilot will automatically suggest an entire function body in grayed text. The exact suggestion may vary.
4. To accept the suggestion, press `Tab`.

## [Next steps](#next-steps-3)

- **Find out more about Copilot inline suggestions** - See [Getting code suggestions in your IDE with GitHub Copilot](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions).
- **Find out more about GitHub Copilot Chat** - See [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide).
- **Learn how to write effective prompts** - See [Prompt engineering for GitHub Copilot Chat](/en/copilot/concepts/prompting/prompt-engineering).
- **Prompt like a pro** - Watch [Visual Studio Prompt Engineering with GitHub Copilot](https://www.youtube.com/watch?v=9hZsOeIINg8&list=PLReL099Y5nRckZDdcQ21UigO9pKa14yxC) on YouTube.
- **Use Copilot on your mobile device** - See [Asking GitHub Copilot questions in GitHub Mobile](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile).
- **Use Copilot on the command line** - See [About GitHub Copilot CLI](/en/copilot/concepts/agents/copilot-cli/about-copilot-cli).
- **Configure Copilot in your editor** - You can enable or disable GitHub Copilot from within your editor, and create your own preferred keyboard shortcuts for Copilot. See [Configuring GitHub Copilot in your environment](/en/copilot/how-tos/configure-personal-settings/configure-in-ide).

GitHub Copilot provides coding suggestions as you type in your editor. You can also ask Copilot coding-related questions, such as how best to code something, how to fix a bug, or how someone else's code works. For full details of what Copilot can do, see [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot).

Instructions for using Copilot differ depending on where you are using it. This version of the quickstart is for JetBrains IDEs. Click the tabs above for instructions on using Copilot in other environments.

## [Sign up for GitHub Copilot](#sign-up-for-github-copilot-4)

[Get started for free](https://github.com/copilot?ref_product=copilot&ref_type=engagement&ref_style=button&ref_plan=free)

To use Copilot, you’ll need a personal GitHub account with access to a Copilot plan. You can:

- Start with Copilot Free to explore limited features without subscribing to a plan.
- Upgrade to Copilot Pro, Copilot Pro+, or Copilot Max to unlock more features, models, and request limits.

  Important

  **Starting April 22, 2026**, new self-serve sign-ups for Copilot Business for organizations on GitHub Free and GitHub Team plans are temporarily paused.

For more information about the different plans for GitHub Copilot, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).

## [Prerequisites](#prerequisites-3)

- **Subscription to Copilot**. To use GitHub Copilot in a JetBrains IDE, you must have an active GitHub Copilot subscription. See [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot#get-access).
- **A compatible JetBrains IDE**. Copilot is supported in a large number of JetBrains IDEs. For a full list, see [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide?tool=jetbrains).
- **Latest version of the GitHub Copilot extension**. See the [GitHub Copilot plugin](https://plugins.jetbrains.com/plugin/17718-github-copilot?ref_product=copilot&ref_type=engagement&ref_style=text) in the JetBrains Marketplace. For installation instructions, see [Installing the GitHub Copilot extension in your environment](/en/copilot/how-tos/set-up/install-copilot-extension?tool=jetbrains).
- **Sign in to GitHub in your JetBrains IDE**. For authentication instructions, see [Installing the GitHub Copilot extension in your environment](/en/copilot/how-tos/set-up/install-copilot-extension?tool=jetbrains#installing-the-github-copilot-plugin-in-your-jetbrains-ide).

## [Chat with GitHub Copilot](#chat-with-github-copilot-3)

After you've installed the GitHub Copilot plugin, you can ask Copilot coding-related questions.

Note

If you have access to GitHub Copilot via your organization, you won't be able to use GitHub Copilot Chat if your organization owner has disabled chat. See [Managing policies and features for GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

1. Open an existing code file.
2. Open the Copilot Chat window by clicking the **Copilot Chat** icon at the right side of the JetBrains IDE window.

   ![Screenshot of the Copilot Chat icon in the Activity Bar.](/assets/cb-37277/images/help/copilot/jetbrains-copilot-chat-icon.png)
3. In the Copilot Chat window, type `what does this file do` then press `Enter`.

   Copilot's answer is displayed below your question.
4. Select a line of code in the editor.
5. In the Copilot Chat window, type `explain this line` then press `Enter`.

## [Get your first inline suggestion](#get-your-first-inline-suggestion-2)

The following example uses JavaScript, however other languages will work similarly. GitHub Copilot provides suggestions for numerous languages and a wide variety of frameworks, but works especially well for Python, JavaScript, TypeScript, Ruby, Go, C# and C++. GitHub Copilot can also assist in query generation for databases, generating suggestions for APIs and frameworks, and can help with infrastructure as code development.

1. In your JetBrains editor, create a new JavaScript (*\*.js*) file.
2. In the JavaScript file, type the following function header.

   ```
   function calculateDaysBetweenDates(begin, end) {
   ```

   GitHub Copilot will automatically suggest an entire function body in grayed text. The exact suggestion may vary.
3. To accept the suggestion, press `Tab`.

## [Next steps](#next-steps-4)

- **Find out more about Copilot inline suggestions** - See [Getting code suggestions in your IDE with GitHub Copilot](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions).
- **Find out more about GitHub Copilot Chat** - See [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide).
- **Learn how to write effective prompts** - See [Prompt engineering for GitHub Copilot Chat](/en/copilot/concepts/prompting/prompt-engineering).
- **Use Copilot on your mobile device** - See [Asking GitHub Copilot questions in GitHub Mobile](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile).
- **Use Copilot on the command line** - See [About GitHub Copilot CLI](/en/copilot/concepts/agents/copilot-cli/about-copilot-cli).
- **Configure Copilot in your editor** - You can enable or disable GitHub Copilot from within your editor, and create your own preferred keyboard shortcuts for Copilot. See [Configuring GitHub Copilot in your environment](/en/copilot/how-tos/configure-personal-settings/configure-in-ide).

GitHub Copilot provides coding suggestions as you type in your editor. You can also ask Copilot coding-related questions, such as how best to code something, how to fix a bug, or how someone else's code works. For full details of what Copilot can do, see [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot).

Instructions for using Copilot differ depending on where you are using it. This version of the quickstart is for XCode in MacOS. Click the tabs above for instructions on using Copilot in other environments.

## [Sign up for GitHub Copilot](#sign-up-for-github-copilot-5)

[Get started for free](https://github.com/copilot?ref_product=copilot&ref_type=engagement&ref_style=button&ref_plan=free)

To use Copilot, you’ll need a personal GitHub account with access to a Copilot plan. You can:

- Start with Copilot Free to explore limited features without subscribing to a plan.
- Upgrade to Copilot Pro, Copilot Pro+, or Copilot Max to unlock more features, models, and request limits.

  Important

  **Starting April 22, 2026**, new self-serve sign-ups for Copilot Business for organizations on GitHub Free and GitHub Team plans are temporarily paused.

For more information about the different plans for GitHub Copilot, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).

## [Prerequisites](#prerequisites-4)

- **Subscription to Copilot**. To use GitHub Copilot in Xcode, you must have an active GitHub Copilot subscription. See [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot#get-access).
- **Latest version of the GitHub Copilot extension**. For installation instructions, see [Installing the GitHub Copilot extension in your environment](/en/copilot/how-tos/set-up/install-copilot-extension?tool=xcode).
- **Sign in to GitHub in Xcode**. If you experience authentication issues, see [Troubleshooting common issues with GitHub Copilot](/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-common-issues).

## [Chat with GitHub Copilot](#chat-with-github-copilot-4)

After you've installed the GitHub Copilot plugin, you can ask Copilot coding-related questions.

Note

If you have access to GitHub Copilot via your organization, you won't be able to use GitHub Copilot Chat if your organization owner has disabled chat. See [Managing policies and features for GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

1. Open an existing code file.
2. Click **Editor** in the menu bar, then click **GitHub Copilot** then **Open Chat**.

   Copilot Chat opens in a new window.
3. In the Copilot Chat window, select the file to indicate that you want to chat about this file.

   ![Screenshot of a file selected in the Chat window. The file is highlighted with a dark orange outline.](/assets/cb-20434/images/help/copilot/xcode-chat-about-file.png)
4. Type `what does this file do` then press `Enter`.

   Copilot's answer is displayed below your question.
5. Select a line of code in the editor.
6. In the Copilot Chat window, type `explain this line` then press `Enter`.

## [Get your first inline suggestion](#get-your-first-inline-suggestion-3)

The following example uses Swift, however other languages will work similarly.

1. Create a new file called `CalculateDays.swift`.
2. Type the following code in the new file:

   ```
   import Foundation

   func calculateDaysBetweenDates(_ start: Date, _ end: Date)
   ```

   GitHub Copilot adds a suggestion of code that continues this function. Suggestions are displayed in grayed text.
3. To accept the suggestion, press `Tab`.
4. Copilot will continue to make suggestions, each of which you can accept by pressing `Tab`.

## [Next steps](#next-steps-5)

- **Find out more about Copilot inline suggestions** - See [Getting code suggestions in your IDE with GitHub Copilot](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions).
- **Find out more about GitHub Copilot Chat** - See [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide).
- **Learn how to write effective prompts** - See [Prompt engineering for GitHub Copilot Chat](/en/copilot/concepts/prompting/prompt-engineering).
- **Get familiar with next edit suggestions** - See [Navigating and accepting next edit suggestions](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions?tool=xcode#navigating-and-accepting-next-edit-suggestions-2).
- **Use Copilot on your mobile device** - See [Asking GitHub Copilot questions in GitHub Mobile](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile).
- **Use Copilot on the command line** - See [About GitHub Copilot CLI](/en/copilot/concepts/agents/copilot-cli/about-copilot-cli).
- **Configure Copilot in your editor** - You can enable or disable GitHub Copilot from within your editor, and create your own preferred keyboard shortcuts for Copilot. See [Configuring GitHub Copilot in your environment](/en/copilot/how-tos/configure-personal-settings/configure-in-ide).

GitHub Copilot provides coding suggestions as you type in your editor. You can also ask Copilot coding-related questions, such as how best to code something, how to fix a bug, or how someone else's code works. For full details of what Copilot can do, see [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot).

Instructions for using Copilot differ depending on where you are using it. This version of the quickstart is for Eclipse. Click the tabs above for instructions on using Copilot in other environments.

## [Sign up for GitHub Copilot](#sign-up-for-github-copilot-6)

[Get started for free](https://github.com/copilot?ref_product=copilot&ref_type=engagement&ref_style=button&ref_plan=free)

To use Copilot, you’ll need a personal GitHub account with access to a Copilot plan. You can:

- Start with Copilot Free to explore limited features without subscribing to a plan.
- Upgrade to Copilot Pro, Copilot Pro+, or Copilot Max to unlock more features, models, and request limits.

  Important

  **Starting April 22, 2026**, new self-serve sign-ups for Copilot Business for organizations on GitHub Free and GitHub Team plans are temporarily paused.

For more information about the different plans for GitHub Copilot, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).

## [Prerequisites](#prerequisites-5)

- **Subscription to Copilot**. To use GitHub Copilot in Eclipse, you must have an active GitHub Copilot subscription. See [What is GitHub Copilot?](/en/copilot/get-started/what-is-github-copilot#get-access).
- **Latest version of the GitHub Copilot extension**. For installation instructions, see [Installing the GitHub Copilot extension in your environment](/en/copilot/how-tos/set-up/install-copilot-extension?tool=eclipse).
- **Sign in to GitHub in Eclipse**. If you experience authentication issues, see [Troubleshooting common issues with GitHub Copilot](/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-common-issues).

## [Chat with GitHub Copilot](#chat-with-github-copilot-5)

After you've installed the GitHub Copilot plugin, you can ask Copilot coding-related questions.

Note

If you have access to GitHub Copilot via your organization, you won't be able to use GitHub Copilot Chat if your organization owner has disabled chat. See [Managing policies and features for GitHub Copilot in your organization](/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

1. Open an existing code file.
2. In the menu bar of Eclipse, click **Copilot**, then click  **Open Chat**.
3. In the Copilot Chat window, type `what does this file do` then press `Enter`.

   Copilot's answer is displayed below your question.
4. Select a line of code in the editor.
5. In the Copilot Chat window, type `explain this line` then press `Enter`.

## [Get your first inline suggestion](#get-your-first-inline-suggestion-4)

The following example uses Java, however other languages will work similarly.

1. Create a new Java class called `CalculateDaysBetween`.
2. Within the class add the following comment:

   ```
   // Take 2 dates and return the number of days between them
   ```

   GitHub Copilot adds a suggestion of code to use for this class. Suggestions are displayed in grayed text.
3. To accept the suggestion, press `Tab`.

## [Next steps](#next-steps-6)

- **Find out more about Copilot inline suggestions** - See [Getting code suggestions in your IDE with GitHub Copilot](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions).
- **Find out more about GitHub Copilot Chat** - See [Asking GitHub Copilot questions in your IDE](/en/copilot/how-tos/chat-with-copilot/chat-in-ide).
- **Learn how to write effective prompts** - See [Prompt engineering for GitHub Copilot Chat](/en/copilot/concepts/prompting/prompt-engineering).
- **Get familiar with next edit suggestions** - See [Navigating and accepting next edit suggestions](/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions?tool=eclipse#navigating-and-accepting-next-edit-suggestions-3).
- **Use Copilot on your mobile device** - See [Asking GitHub Copilot questions in GitHub Mobile](/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile).
- **Use Copilot on the command line** - See [About GitHub Copilot CLI](/en/copilot/concepts/agents/copilot-cli/about-copilot-cli).
- **Configure Copilot in your editor** - You can enable or disable GitHub Copilot from within your editor, and create your own preferred keyboard shortcuts for Copilot. See [Configuring GitHub Copilot in your environment](/en/copilot/how-tos/configure-personal-settings/configure-in-ide).
