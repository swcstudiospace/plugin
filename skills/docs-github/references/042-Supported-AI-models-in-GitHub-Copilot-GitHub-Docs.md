# Supported AI models in GitHub Copilot - GitHub Docs

Source: https://docs.github.com/en/copilot/reference/ai-models/supported-models

# Supported AI models in GitHub Copilot

Learn about the supported AI models in GitHub Copilot.

GitHub Copilot supports multiple AI models, each with different strengths. Some prioritize speed and cost-efficiency, while others are optimized for accuracy, reasoning, or multimodal inputs. The right model depends on your task. For a side-by-side comparison to help you choose, see [AI model comparison](/en/copilot/reference/ai-models/model-comparison).

The models available to you depend on your Copilot plan and where you're using Copilot, such as GitHub.com or an IDE.

Note

Model availability is subject to change. Some models may be replaced or updated over time.

For all of the default AI models, input prompts and output completions run through GitHub Copilot's content filters for harmful, offensive, or off-topic content, and for public code matching when enabled.

## [Supported AI models in Copilot](#supported-ai-models-in-copilot)

This table lists the AI models available in Copilot, along with their release status.

## [Supported AI models in Auto model selection](#supported-ai-models-in-auto-model-selection)

This table lists the supported AI models for Auto model selection. Available models may be limited by model policies. See [About Copilot auto model selection](/en/copilot/concepts/models/auto-model-selection).

## [Models with extended capabilities](#models-with-extended-capabilities)

The latest Copilot models support the following extended capabilities.

- **1 million token context window**: Allows the model to process significantly more content in a single session. This is useful when working across large codebases, long documents, or complex multi-file projects. When you select a supported model, you can choose between the default context size or the extended (1 million token) context.
- **Configurable reasoning levels**: Controls the depth of the model's reasoning process before it generates a response. When you select a supported model, you can choose which reasoning level you want to use. Higher reasoning levels can improve the quality of responses to complex problems.

Choosing a larger context window or higher reasoning will impact AI credits consumption; more tokens will be consumed, so more credits will be used. For this reason, we recommend that you use the regular context window and regular reasoning by default, selecting the larger context window and higher reasoning for more complex tasks only.

Note

- These extended capabilities are available in Visual Studio Code and Copilot CLI only.
- Some models have extended capability pricing see [Models and pricing for GitHub Copilot](/en/copilot/reference/copilot-billing/models-and-pricing#pricing-tables)

## [Model retirement history](#model-retirement-history)

The following table lists AI models that are retired or scheduled for retirement from Copilot, along with their retirement dates and suggested alternatives.

## [Supported AI models per client](#supported-ai-models-per-client)

The following table shows which models are available in each client.

Note

In Visual Studio Code you can add more models than those that are available by default with your Copilot subscription. See [Changing the AI model for GitHub Copilot Chat](/en/copilot/how-tos/use-ai-models/change-the-chat-model?tool=vscode#adding-more-models).

## [Minimum IDE versions for recent models](#minimum-ide-versions-for-recent-models)

Some Copilot models require minimum versions of supported IDEs or Copilot extensions or plugins. The table below lists the minimum versions known from changelog entries or provided release guidance. This information is tentative and subject to change as model support rolls out. For best results, keep your IDE and Copilot extension or plugin updated to the latest available version.

Note

- For GPT-5.3-Codex in Visual Studio Code, `v1.108` and later provide improved prompting and response quality.
- "No minimum listed" means the reviewed changelog or release guidance did not specify a minimum version, not that all older versions are supported.
- Even when a model appears in the model picker on older supported versions, prompting and model behavior may work best with the latest IDE and Copilot extension or plugin versions.

## [Supported AI models per Copilot plan](#supported-ai-models-per-copilot-plan)

The following table shows which AI models are available in each Copilot plan. For more information about the plans, see [Plans for GitHub Copilot](/en/copilot/get-started/plans).

Note

Copilot Student and Copilot Free users have access to models through auto model selection only.

Note

- If you're an organization or enterprise owner, you can enable or restrict access to specific models for your members. See [Configuring access to AI models in GitHub Copilot](/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models#setup-for-organization-and-enterprise-plans).

## [Fallback and long-term support (LTS) models](#fallback-and-long-term-support-lts-models)

For more information about fallback and LTS models, see [Base and long-term support (LTS) models](/en/copilot/concepts/models/fallback-and-lts-models).

## [Evaluation models](#evaluation-models)

GitHub Copilot offers access to evaluation models.

Important

- Testing revealed evaluation models may perform worse than other models on security-related, or other categories of prompts.
- Users should always carefully review and validate code, including code security, using a range of models and with a thorough human review before incorporating suggestions into production.

Evaluation models may appear in the product with codenames rather than official model or provider names. These models come from or are fine-tuned by one or more of the following providers: Microsoft, OpenAI, Anthropic, and Google. Data handling for each provider is limited to GitHub's existing agreement with that provider, and evaluation models undergo GitHub and Microsoft testing and verification before release.

Evaluation models may be added, updated, or removed without notice. Availability and rate limits may differ from generally available models.

Access to evaluation models in auto model selection for users Copilot plans for individuals is governed by a policy. To disable evaluation models:

1. In the upper-right corner of any page on GitHub, click your profile picture, then click  **Settings**.
2. At the top of the page, click  **AI controls**.
3. For the **Evaluation models in Copilot auto model selection** setting, select **Disabled** from the dropdown.

## [Utility models](#utility-models)

Utility models power background features across surfaces, and cannot be disabled or selected in the model picker. See [Utility models](/en/copilot/concepts/models/utility-models).

The following models are currently used as utility models:

- GPT-4o mini
- GPT-4o
- GPT-4.1
- GPT-5.4 nano

## [Next steps](#next-steps)

- To get up and running with Copilot, see [Quickstart for GitHub Copilot](/en/copilot/get-started/quickstart).
- To configure which models are available to you, see [Configuring access to AI models in GitHub Copilot](/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models).
- To learn more about Responsible Use and Responsible AI, see [Copilot Trust Center](https://copilot.github.trust.page/) and [Responsible use of GitHub Copilot features](/en/copilot/responsible-use).

1. GPT-5.4 nano is currently only available in the Codex Visual Studio Code extension (Copilot Pro+ only) and is not available in Copilot Chat. [↩](#user-content-fnref-gpt54nano) [↩2](#user-content-fnref-gpt54nano-2) [↩3](#user-content-fnref-gpt54nano-3)
2. When Claude Fable 5 is used, Anthropic retains data, including prompts and outputs, to operate safety classifiers that detect harmful use. Other Claude models in GitHub Copilot remain covered by GitHub's existing data retention agreements, as documented at [Hosting of models for GitHub Copilot](/en/copilot/reference/ai-models/model-hosting#anthropic-models). Enterprise and business users need to enable the Claude Fable 5 model to make it available for your organization. You can read more about Anthropic's data handling practices for this model under section F of their [Service Specific Terms](https://www.anthropic.com/legal/service-specific-terms). To enable Claude Fable 5, see [Configuring access to AI models in GitHub Copilot](/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models). [↩](#user-content-fnref-claude-fable-5) [↩2](#user-content-fnref-claude-fable-5-2)
3. MAI-Code-1-Flash is a continuously improving model. Performance and behavior may evolve over time as new checkpoints are released. [↩](#user-content-fnref-mai-code-1-flash)
