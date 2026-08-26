# Cloning a repository - GitHub Docs

Source: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository

# Cloning a repository

When you create a repository on GitHub, it exists as a remote repository. You can clone your repository to create a local copy on your computer and sync between the two locations.

## Platform navigation

## Tool navigation

## [About cloning a repository](#about-cloning-a-repository)

You can clone a repository from GitHub.com to your local computer, or to a codespace, to make it easier to fix merge conflicts, add or remove files, and push larger commits. When you clone a repository, you copy the repository from GitHub.com to your local machine, or to a remote virtual machine when you create a codespace. For more information about cloning to a codespace, see [Creating a codespace for a repository](/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository).

You can clone a repository from GitHub.com to your local computer to make it easier to fix merge conflicts, add or remove files, and push larger commits. When you clone a repository, you copy the repository from GitHub.com to your local machine.

You can clone a repository from GitHub.com to your local computer to make it easier to fix merge conflicts, add or remove files, and push larger commits. When you clone a repository, you copy the repository from GitHub.com to your local machine.

Cloning a repository pulls down a full copy of all the repository data that GitHub.com has at that point in time, including all versions of every file and folder for the project. You can push your changes to the remote repository on GitHub.com, or pull other people's changes from GitHub.com. For more information, see [Using Git](/en/get-started/using-git).

You can clone your existing repository or clone another person's existing repository to contribute to a project.

## [Cloning a repository](#cloning-a-repository)

1. On GitHub, navigate to the main page of the repository.
2. Above the list of files, click  **Code**.

   ![Screenshot of the list of files on the landing page of a repository. The "Code" button is highlighted with a dark orange outline.](/assets/cb-13128/images/help/repository/code-button.png)
3. Copy the URL for the repository.

   - To clone the repository using HTTPS, under "HTTPS", click .
   - To clone the repository using an SSH key, including a certificate issued by your organization's SSH certificate authority, click **SSH**, then click .
   - To clone a repository using GitHub CLI, click **GitHub CLI**, then click .

     ![Screenshot of the "Code" dropdown menu. To the right of the HTTPS URL for the repository, a copy icon is outlined in dark orange.](/assets/cb-60499/images/help/repository/https-url-clone-cli.png)
4. Open TerminalTerminalGit Bash.
5. Change the current working directory to the location where you want the cloned directory.
6. Type `git clone`, and then paste the URL you copied earlier.

   ```
   git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
   ```
7. Press **Enter** to create your local clone.

   ```
   $ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
   > Cloning into `Spoon-Knife`...
   > remote: Counting objects: 10, done.
   > remote: Compressing objects: 100% (8/8), done.
   > remove: Total 10 (delta 1), reused 10 (delta 1)
   > Unpacking objects: 100% (10/10), done.
   ```

Note

To learn more about GitHub CLI, see [About GitHub CLI](/en/github-cli/github-cli/about-github-cli).

To clone a repository locally, use the `repo clone` subcommand. Replace the `repository` parameter with the repository name. For example, `octo-org/octo-repo`, `monalisa/octo-repo`, or `octo-repo`. If the `OWNER/` portion of the `OWNER/REPO` repository argument is omitted, it defaults to the name of the authenticating user.

```
gh repo clone REPOSITORY
```

You can also use the GitHub URL to clone a repository.

```
gh repo clone https://github.com/PATH-TO/REPOSITORY
```

1. On GitHub, navigate to the main page of the repository.
2. Above the list of files, click  **Code**.

   ![Screenshot of the list of files on the landing page of a repository. The "Code" button is highlighted with a dark orange outline.](/assets/cb-13128/images/help/repository/code-button.png)
3. To clone and open the repository with GitHub Desktop, click  **Open with GitHub Desktop**.

   ![Screenshot of the "Code" dropdown for a repository. A button, labeled "Open with GitHub Desktop" is outlined in dark orange.](/assets/cb-44807/images/help/repository/open-with-desktop.png)
4. Follow the prompts in GitHub Desktop to complete the clone.

For more information, see [Cloning a repository from GitHub to GitHub Desktop](/en/desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop).

## [Cloning an empty repository](#cloning-an-empty-repository)

An empty repository contains no files. It's often made if you don't initialize the repository with a README when creating it.

1. On GitHub, navigate to the main page of the repository.
2. To clone your repository using the command line using HTTPS, under "Quick setup", click . To clone the repository using an SSH key, including a certificate issued by your organization's SSH certificate authority, click **SSH**, then click .

   ![Screenshot of the quick setup notes for an empty repository. To the right of the HTTPS URL for the repository, a copy icon is outlined in orange.](/assets/cb-38644/images/help/repository/empty-https-url-clone-button.png)

   Alternatively, to clone your repository in Desktop, click  **Set up in Desktop** and follow the prompts to complete the clone.

   ![Screenshot of the quick setup notes for an empty repository. The "Set up in Desktop" button is outlined in dark orange.](/assets/cb-39003/images/help/repository/empty-desktop-clone-button.png)
3. Open TerminalTerminalGit Bash.
4. Change the current working directory to the location where you want the cloned directory.
5. Type `git clone`, and then paste the URL you copied earlier.

   ```
   git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
   ```
6. Press **Enter** to create your local clone.

   ```
   $ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
   > Cloning into `Spoon-Knife`...
   > remote: Counting objects: 10, done.
   > remote: Compressing objects: 100% (8/8), done.
   > remove: Total 10 (delta 1), reused 10 (delta 1)
   > Unpacking objects: 100% (10/10), done.
   ```

## [Troubleshooting cloning errors](#troubleshooting-cloning-errors)

When cloning a repository it's possible that you might encounter some errors.

If you're unable to clone a repository, check that:

- You can connect using HTTPS. For more information, see [Troubleshooting cloning errors](/en/repositories/creating-and-managing-repositories/troubleshooting-cloning-errors).
- You have permission to access the repository you want to clone. For more information, see [Troubleshooting cloning errors](/en/repositories/creating-and-managing-repositories/troubleshooting-cloning-errors#check-your-permissions).
- The default branch you want to clone still exists. For more information, see [Troubleshooting cloning errors](/en/repositories/creating-and-managing-repositories/troubleshooting-cloning-errors#error-remote-head-refers-to-nonexistent-ref-unable-to-checkout).

## [Further reading](#further-reading)

- [Troubleshooting connectivity problems](/en/get-started/using-github/troubleshooting-connectivity-problems)
