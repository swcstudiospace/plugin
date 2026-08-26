# Troubleshooting Common Issues

Source: https://www.greptile.com/docs/troubleshooting/common-issues

## [​](#github-setup-issues) GitHub setup issues

### [​](#github-organization-not-listed-on-greptile) GitHub organization not listed on Greptile

#### [​](#symptoms) Symptoms

- Your GitHub organization does not appear in Greptile’s web app

#### [​](#common-causes-&-solutions) Common causes & solutions

**1. Greptile Apps is not installed on the GitHub organization**
Install Greptile Apps on the GitHub organization first. In GitHub, grant access to all repositories or to the specific repositories you want Greptile to review.
After installing the app, return to Greptile and link the GitHub organization.
**2. GitHub and Greptile are linked to the wrong session or SSO identity**
If Greptile Apps is already installed on the GitHub organization, reconnect the GitHub provider:

1

Disconnect GitHub in Greptile

In Greptile, go to **Code Providers** and disconnect the GitHub connection for the affected organization.

2

Uninstall Greptile Apps in GitHub

In GitHub, open the organization’s installed GitHub Apps and uninstall **Greptile Apps**.

3

Sign in with company SSO

Log out, then log back in using your company’s SSO account.

4

Reinstall Greptile Apps

Install Greptile Apps on the GitHub organization again. Grant access to the repositories Greptile should review.

5

Link the organization in Greptile

Return to Greptile. The GitHub organization should appear in **Add GitHub organizations**. Select it and click **Link**.

Disconnecting and uninstalling the GitHub App temporarily stops Greptile from receiving events for that organization. Reinstall the app before opening new PRs you expect Greptile to review.

## [​](#configuration-issues) Configuration Issues

### [​](#greptile-json-not-taking-effect) greptile.json Not Taking Effect

#### [​](#symptoms-2) Symptoms

- Changes to greptile.json don’t appear in reviews
- Dashboard settings still being used despite repository configuration
- Rules and instructions seem to be ignored

#### [​](#common-causes-&-solutions-2) Common Causes & Solutions

**1. File Location Issues**

```
# ✅ Correct - greptile.json in repository root
your-repo/
├── greptile.json
├── src/
└── package.json

# ❌ Wrong - greptile.json in subdirectory
your-repo/
├── src/
│   └── greptile.json  # This won't be found
└── package.json
```

**2. JSON Syntax Errors**

```
// ❌ Invalid JSON - trailing comma
{
  "strictness": 2,
  "commentTypes": ["logic", "syntax"],  // Remove this comma
}

// ✅ Valid JSON
{
  "strictness": 2,
  "commentTypes": ["logic", "syntax"]
}
```

**3. Branch Configuration**

- Greptile reads `greptile.json` from the **source branch** of the PR
- If you add greptile.json in a PR, it only takes effect for that PR
- Merge the greptile.json to your main branch for it to apply to future PRs

**4. Configuration Validation**
Use the dashboard to validate your configuration:

1. Go to [app.greptile.com/review](https://app.greptile.com/review)
2. Select your repository
3. Check if your greptile.json is detected and parsed correctly

#### [​](#debugging-steps) Debugging Steps

1. **Verify file location** - Ensure greptile.json is in repository root
2. **Validate JSON syntax** - Use a JSON validator to check for errors
3. **Check branch** - Confirm the file exists in the branch being reviewed
4. **Test on new PR** - Create a test PR to verify configuration works

### [​](#custom-context-“never-used”) Custom Context “Never Used”

#### [​](#symptoms-3) Symptoms

- External context sources (Jira, Linear) not being referenced in reviews
- Pattern repositories not providing relevant context
- Custom instructions being ignored

#### [​](#common-causes-&-solutions-3) Common Causes & Solutions

**1. Integration Not Connected**

- **Check connections** - Verify your Jira/Linear connections in [Memory → Integrations](https://app.greptile.com/-/custom-context/integrations)
- **Permissions** - Ensure Greptile has access to the specific documents/projects
- **Authentication** - Refresh expired tokens or credentials

**2. Content Not Indexed**

- **Wait for indexing** - New integrations need time to index content
- **Check status** - Look for indexing status in the dashboard
- **Trigger re-index** - Contact support if indexing seems stuck

**3. Pattern Repository Issues**

```
// ❌ Repository doesn't exist or isn't accessible
{
  "patternRepositories": ["nonexistent/repo"]
}

// ✅ Verify repository exists and is accessible
{
  "patternRepositories": ["your-org/shared-utils"]
}
```

**4. Content Relevance**

- External content must be **relevant** to the code changes
- Greptile filters out unrelated context automatically
- Try more specific references in PR descriptions

#### [​](#debugging-steps-2) Debugging Steps

1. **Test integrations** - Verify connections work in dashboard
2. **Check content** - Ensure linked documents exist and are accessible
3. **Review relevance** - Make sure external content relates to code changes
4. **Monitor indexing** - Allow time for new content to be indexed

## [​](#review-issues) Review Issues

### [​](#greptile-not-running-for-new-prs) Greptile Not Running for New PRs

#### [​](#symptoms-4) Symptoms

- New PRs don’t get automatic reviews
- No comments or summaries appear
- Webhook deliveries failing

#### [​](#common-causes-&-solutions-4) Common Causes & Solutions

**1. Repository Not Enabled**

- **Check dashboard** - Ensure repository is enabled for reviews
- **Verify permissions** - Confirm GitHub/GitLab access hasn’t been revoked
- **Re-enable if needed** - Toggle repository off and on in dashboard

**2. Filter Configuration Issues**

```
// ❌ Too restrictive filters
{
  "includeAuthors": ["specific-user"],  // Only reviews from this user
  "labels": ["review-needed"]           // Only PRs with this label
}

// ✅ More inclusive configuration
{
  "excludeAuthors": ["dependabot[bot]"],
  "disabledLabels": ["skip-review"]
}
```

**3. Draft PR Settings**

- **Draft PRs** are not reviewed automatically by default
- Mark PR as “Ready for review” or comment `@greptileai` to trigger

**4. Webhook Issues**

```
# Check webhook deliveries in GitHub/GitLab settings
Repository Settings → Webhooks → Recent Deliveries
```

For **GitLab**, follow the step-by-step webhook checklist in [GitHub and GitLab Integration → Troubleshooting: Automatic Reviews Not Triggering](/docs/integrations/github-gitlab-integration#troubleshooting-automatic-reviews-not-triggering) to verify the webhook URL and trigger events, test delivery, and inspect a failing event.

#### [​](#debugging-steps-3) Debugging Steps

1. **Verify repository status** - Check if enabled in dashboard
2. **Test manual trigger** - Comment `@greptileai` on a PR
3. **Check webhook logs** - Look for failed webhook deliveries
4. **Review filters** - Ensure PR matches your trigger conditions

### [​](#reviews-taking-too-long) Reviews Taking Too Long

#### [​](#symptoms-5) Symptoms

- Reviews never complete or take hours
- “Pending” status that doesn’t update
- Timeouts or partial reviews

#### [​](#common-causes-&-solutions-5) Common Causes & Solutions

**1. Large PR Size**

- **Break down PRs** - Split large changes into smaller, focused PRs
- **Ignore unnecessary files** - Use `ignorePatterns` to exclude generated files

```
{
  "ignorePatterns": "dist/**\nnode_modules/**\n*.generated.*\nbuild/**"
}
```

**2. External Context Delays**

- **Disable temporarily** - Remove external integrations to test speed
- **Check integration status** - Ensure your external context connections are responsive

#### [​](#debugging-steps-4) Debugging Steps

1. **Check PR size** - Consider breaking down large PRs
2. **Monitor progress** - Use statusEndpoint to track review progress
3. **Test smaller PRs** - Verify speed with minimal changes
4. **Review configuration** - Simplify rules and integrations if needed

## [​](#integration-problems) Integration Problems

### [​](#integration-connection-issues) Integration Connection Issues

#### [​](#symptoms-6) Symptoms

- Authentication failures
- “Connection expired” messages
- External context not loading

#### [​](#common-solutions) Common Solutions

1. **Refresh tokens** - Re-authenticate integrations in dashboard
2. **Check permissions** - Ensure access to specific projects/workspaces
3. **Network connectivity** - Verify Greptile can reach your instances
4. **Instance configuration** - For self-hosted instances, check firewall rules

### [​](#pattern-repository-access) Pattern Repository Access

#### [​](#symptoms-7) Symptoms

- Pattern repositories not found
- Access denied errors
- Context from related repos not appearing

#### [​](#common-solutions-2) Common Solutions

```
// ✅ Correct repository references
{
  "patternRepositories": [
    "your-github-org/shared-library",
    "your-gitlab-group/common-utils"
  ]
}

// ❌ Common mistakes
{
  "patternRepositories": [
    "shared-library",                    // Missing org/group
    "your-org/repo-that-doesnt-exist",   // Repository doesn't exist
    "private-org/private-repo"           // No access permissions
  ]
}
```

**Debugging Steps:**

1. **Verify repository exists** - Check that referenced repos are accessible
2. **Test permissions** - Ensure your GitHub/GitLab token can access the repo
3. **Check naming** - Use full `org/repo` format
4. **Monitor indexing** - Allow time for pattern repos to be indexed

## [​](#performance-optimization) Performance Optimization

### [​](#reducing-review-time) Reducing Review Time

#### [​](#configuration-optimizations) Configuration Optimizations

```
{
  "strictness": 3, // Focus on critical issues only
  "commentTypes": ["logic"], // Reduce comment types for speed
  "ignorePatterns": "tests/**\ndocs/**\nvendor/**\ngenerated/**" // Skip less critical directories
}
```

#### [​](#process-improvements) Process Improvements

1. **Smaller PRs** - Break large changes into focused PRs
2. **Clear descriptions** - Help Greptile understand context quickly
3. **Consistent patterns** - Established patterns are analyzed faster
4. **Regular maintenance** - Keep configuration up to date

### [​](#managing-review-volume) Managing Review Volume

#### [​](#noise-reduction) Noise Reduction

```
{
  "strictness": 2, // Balance thoroughness and noise
  "excludeAuthors": ["bot", "automation"], // Skip automated PRs
  "disabledLabels": ["trivial", "docs-only"], // Skip low-risk PRs
  "ignoreKeywords": "typo\nformatting\nspacing" // Skip minor fixes
}
```

## [​](#getting-help) Getting Help

### [​](#when-to-contact-support) When to Contact Support

- **Persistent authentication issues**
- **Repositories that won’t index**
- **Consistent performance problems**
- **Enterprise integration needs**

### [​](#information-to-provide) Information to Provide

1. **Repository details** - Organization and repository name
2. **Configuration** - Your greptile.json and dashboard settings
3. **Error messages** - Exact error text and screenshots
4. **Timeline** - When the issue started occurring
5. **Examples** - Specific PRs or reviews that demonstrate the problem

### [​](#contact-information) Contact Information

- **Support email**: [hello@greptile.com](mailto:hello@greptile.com)
- **Include**: Account details, repository information, and specific examples
- **Response time**: Typically within 24 hours for standard issues

For urgent issues affecting production workflows, mark your email as “URGENT”
in the subject line.

⌘I
