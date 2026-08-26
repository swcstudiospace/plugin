# Training the Learning System

Source: https://www.greptile.com/docs/code-review/training-the-learning-system

Greptile learns from your team’s feedback to provide increasingly relevant suggestions. The primary training methods are emoji reactions and explanatory comments.

Learning is continuous. You’ll see noticeable improvement in the first few weeks of consistent feedback, and it keeps getting better over time.

## [​](#using-reactions-/) Using Reactions (👍/👎)

Reactions are the fastest way to train Greptile. Every reaction teaches it what matters to your team.

| Your Reaction | What Greptile Learns |
| --- | --- |
| 👍 | “This is useful - make more comments like this” |
| 👎 | “This isn’t helpful - stop making these comments” |
| No reaction | Neutral signal, lower priority over time |

Only 👍 and 👎 train the system. Other emojis (❤️, 🚀, etc.) are treated as neutral.

**For 👎 reactions**, add a quick comment explaining why:

```
@greptileai We don't enforce this in test files
```

This helps Greptile understand the context, not just that you disagreed.

## [​](#explaining-preferences) Explaining Preferences

While reactions teach **what** you like, comments teach **why**.
**Be specific:**

```
❌ "We don't do this"
✅ "We avoid wildcard imports because they hide dependencies"
```

**Keep it short:**

```
❌ [Long paragraph about company history]
✅ "Webhooks must be synchronous - provider requires immediate response"
```

## [​](#tracking-progress) Tracking Progress

The [Analytics dashboard](/docs/analytics) shows how training is going:

| Metric | What it tells you |
| --- | --- |
| **Addressed rate** | Whether Greptile’s suggestions are being implemented |
| **Upvote/Downvote ratio** | How consistently your team is reacting to comments |
| **Critical bugs caught** | Types of issues Greptile is flagging |

Low upvote counts? Remind the team to 👍/👎 comments. High addressed rates mean Greptile is learning what matters.

## [​](#accelerating-learning) Accelerating Learning

Instead of waiting for organic learning, you can:

1. **Upload style guides** - Add your existing docs as [custom context](/docs/code-review/custom-standards)
2. **Create explicit rules** - Define standards in the dashboard, [`.greptile/` config](/docs/code-review/greptile-config), or `greptile.json`
3. **Use cross-repo context** - Share related repository context with [repo clusters](/docs/code-review/cross-repo-context)

## [​](#what’s-next) What’s next?

- [Control nitpickiness →](/docs/code-review/controlling-nitpickiness)
- [Add custom standards →](/docs/code-review/custom-standards)
- [Configure with .greptile/ →](/docs/code-review/greptile-config)
- [greptile.json reference →](/docs/code-review/greptile-json-reference)

⌘I
